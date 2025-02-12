import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { CLASS_COLORS, DeviceStatisticsService } from '../device-statistics.service';
import { gettext } from '@c8y/ngx-components';
import { DeviceConfigurationService } from '../device-configuration/device-configuration.service';
import { CommonService, FeatureList } from '../../common.service';

const d3 = require('d3')

@Component({
  selector: 'device-overview',
  templateUrl: './device-overview.component.html',
  styleUrls: ['./device-overview.component.css']
})
export class DeviceOverviewComponent implements OnInit, OnDestroy {
  feature = FeatureList.DeviceStatistics
  CLASS_CATEGORY = {
    TOTAL_MEA: 'total_mea',
    UNIQUE_DEVICES: 'unique_devices'
  }
  deviceData
  monthChangedSubscription: Subscription
  tenantChangedSubscription: Subscription
  classCategory: string
  showPanel = false
  isLoading = true
  detailsUnavailable = false
  resizeObserver
  totalDeviceCount = 0;
  totalMeaCount = 0;
  isAnyThresholdSet = false;

  constructor(
    private monthPickerService: MonthPickerService,
    private deviceStatisticsService: DeviceStatisticsService,
    private deviceConfigurationService: DeviceConfigurationService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    try {
      this.classCategory = this.CLASS_CATEGORY.UNIQUE_DEVICES
      this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe((selectedDate: Date) => {
        this.getDeviceDataAndGenerateCharts(selectedDate)
      })
      this.tenantChangedSubscription = this.commonService.tenantChanged.subscribe((tenantId: string) => {
        this.getDeviceDataAndGenerateCharts()
      })
      setTimeout(() => {
        this.getDeviceDataAndGenerateCharts()
        this.isLoading = false
      }, 1000)
    }
    catch (err) {
      console.log(gettext('Error in chart generation'))
      console.error(err.message)
    }
  }

  changeUnit(category) {
    this.classCategory = category;
    this.resetCounts()
    this.generateClassComparisonChart(this.deviceData.overview)
  }

  async getDeviceDataAndGenerateCharts(selectedDate = this.monthPickerService.selectedDate) {
    try {
      this.deviceData = await this.deviceStatisticsService.getFormattedDeviceData(selectedDate);
      this.isAnyThresholdSet = this.deviceConfigurationService.deviceStatisticsConfigurationStore.some(elem => elem.monthlyThreshold)
      this.generateProgressMeter(this.deviceData.overview)
      this.generateClassComparisonChart(this.deviceData.overview)
      this.showPanel = true
    }
    catch (err) {
      console.log(gettext('Error in chart generation'))
      console.error(err.message)
    }
  }

  private generateClassComparisonChart(overviewData) {
    const chartData = Object.values(overviewData)
    const chartContainer = d3.select(".class-comparison-chart-container .card .holder")
    chartContainer.selectAll("svg").remove()
    const chartContainerDimensions = chartContainer.node().getBoundingClientRect()
    const baseHeight = d3.select(".class-comparison-chart-container").node().getBoundingClientRect().height - 100;
    d3.select(".class-comparison-chart-container .card").style('min-height', baseHeight).style('margin-top', '10px')
    const baseWidth = chartContainerDimensions.width - 100;

    const MARGIN = { TOP: 10, RIGHT: 10, BOTTOM: 10, LEFT: 97.08 },
      width = baseWidth - MARGIN.LEFT - MARGIN.RIGHT,
      height = baseHeight - MARGIN.TOP - MARGIN.BOTTOM;

    const svgWidth = width + MARGIN.LEFT + MARGIN.RIGHT
    const svgHeight = height + MARGIN.TOP + MARGIN.BOTTOM
    const svg = chartContainer.append('svg')
      .attr('width', width)
      .attr('height', svgHeight)

    const chart = svg.append('g')
      .classed('bar', true)
      .attr('transform', `translate(${MARGIN.LEFT}, 50)`);

    const chartRect = chart.append('g').classed('progress', true)

    const xScale = d3.scaleBand().domain(Object.keys(overviewData)).range([0, svgWidth])
    xScale.paddingInner(0.5);
    xScale.paddingOuter(0.1);
    const xAxisGen = d3.axisBottom(xScale)
    const xAxis = chart.append('g').classed('x-axis', true).call(xAxisGen)

    const yMaxValue = d3.max(chartData.map(d => this.yScaleCalc(d))) * 1.1
    const yScale = d3.scaleLinear().domain([0, yMaxValue]).range([0, svgHeight - MARGIN.TOP - MARGIN.BOTTOM])
    const yAxisScaleGen = d3.scaleLinear().domain([0, yMaxValue]).range([svgHeight - MARGIN.TOP - MARGIN.BOTTOM, 0])
    const yAxisGen = d3.axisLeft(yAxisScaleGen).ticks(5)
    const yAxis = chart.append('g').classed('y-axis', true).call(yAxisGen)
    d3.select('.x-axis').attr('transform', `translate(0, ${svgHeight - MARGIN.BOTTOM - MARGIN.TOP})`)
    const progressContainer = chart.select('.progress')
      .selectAll('g')
      .data(chartData)
      .join('g')
      .classed('progress-container', true)

    progressContainer.append('rect')
      .attr('x', d => xScale(d.className))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => this.yScaleCalc(d, yScale))
      .attr('transform', d => `translate(0, ${svgHeight - MARGIN.BOTTOM - MARGIN.TOP - this.yScaleCalc(d, yScale)})`)
      .attr('fill', (d, i) => CLASS_COLORS[i])

    this.resetCounts();
    progressContainer
      .append('text')
      .attr('x', d => xScale(d.className) + xScale.bandwidth() / 2)
      .attr('transform', d => `translate(0, ${svgHeight - 3 * MARGIN.TOP - this.yScaleCalc(d, yScale)})`)
      .style('text-anchor', 'middle')
      .text(d => {
        const count = this.yScaleCalc(d)
        if (this.classCategory === this.CLASS_CATEGORY.TOTAL_MEA) {
          this.totalMeaCount += count
        }
        else {
          this.totalDeviceCount += count
        }
        return count
      })

    progressContainer.append('title')
      .text(d => `${d.className}, ${this.yScaleCalc(d)}`)

    d3.select('.bar .x-axis')
      .selectAll('.tick text')
      .each(function () {
        const self = d3.select(this)
        const text = self.text()
        if (text.length > 16) {
          self.text(text.slice(0, 8) + '...')
        }
        self.append('title')
          .text(text)
      })
  }

  private generateProgressMeter(overviewData) {
    const chartData = Object.values(overviewData)
    const configuration = this.deviceConfigurationService.deviceStatisticsConfigurationStore;
    const chartContainer = d3.select(".progress-meter-chart-container")
    chartContainer.selectAll("div").remove()
    const chartContainerDimensions = chartContainer.node().getBoundingClientRect()
    let baseHeight = (chartContainerDimensions.width / chartData.length) + 40.45;
    let baseWidth = (chartContainerDimensions.width / chartData.length) - 10;

    if (chartContainerDimensions.width < 600) {
      baseHeight = chartContainerDimensions.width + 40.45;
      baseWidth = chartContainerDimensions.width - 10;
    }
    else {
      baseHeight = (chartContainerDimensions.width / chartData.length) + 40.45;
      baseWidth = (chartContainerDimensions.width / chartData.length) - 10;
    }

    const svgHeight = baseHeight - 10;
    const svgWidth = baseWidth - 10;
    const x = svgWidth / 2
    const y = svgHeight / 2 - 40.45;
    const arcRadius = d3.min([x, y]) - 10

    const arcDimensions = {
      innerRadius: 0.8 * arcRadius,
      outerRadius: arcRadius
    }
    const totalRange = 1.5 * Math.PI;
    const arcGenerator = d3.arc().cornerRadius(10);
    const pathData = arcGenerator({
      startAngle: 0,
      endAngle: totalRange,
      innerRadius: arcDimensions.innerRadius,
      outerRadius: arcDimensions.outerRadius,
    });


    const g = chartContainer
      .selectAll("div")
      .data(chartData)
      .join("div")
      .style('height', baseHeight + 'px')
      .style('width', baseWidth + 'px')
      .style('margin', d => chartContainerDimensions.width < 600 ? 'auto' : 'auto')
      .attr("class", "unit");

    const svgContainer = d3
      .selectAll(".unit")
      .classed("card", true)
      .append("svg")

      .attr("height", svgHeight)
      .attr("width", svgWidth)
      .attr(
        "transform",
        `translate(${baseWidth - svgWidth - 5}, ${baseHeight - svgHeight - 5})`
      )
      .append("g")
      .attr("transform", `translate(${x}, ${y} )`)
      .attr("class", "device-class");

    const progressMeter = svgContainer
      .append("g")
      .attr("class", "progress-meter")
      .style("transform", "rotate(-0135deg)");

    d3.selectAll("g.progress-meter")
      .append("path")
      .attr("d", pathData)
      .attr("fill", "#D3D3D3");

    const progressStageVisual = d3
      .scaleLinear()
      .domain([0, totalRange / 2, totalRange])
      .range(["green", "orange", "red"]);

    d3.selectAll("g.progress-meter").each(function (d, i) {
      const node = d3.select(this);
      const achievedState = d['deviceIdStore'].length / d.threshold;
      const achivedStateProgress =
        achievedState > 1 ? totalRange : achievedState * totalRange;
      const newPathData = arcGenerator({
        startAngle: 0,
        endAngle: achivedStateProgress,
        innerRadius: arcDimensions.innerRadius,
        outerRadius: arcDimensions.outerRadius,
      });
      node
        .append("path")
        .attr("d", newPathData)
        .attr("fill", function (x) {
          return progressStageVisual(achivedStateProgress);
        });

      const parentNode = d3.select(this.parentNode);
      parentNode
        .append("text")
        .html(d => isFinite(d.threshold) ? `${(achievedState * 100).toFixed(1)}%` : gettext('No threshold defined'))
        .style("font-size", d => isFinite(d.threshold) ? "24.27px" : "12.135px")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")

      const labelNode = parentNode.append('g').style('transform', `translate(0, 24.27px)`)
      labelNode
        .append("text")
        .text((d) => d['deviceIdStore'].length)
        .attr("y", svgHeight / 4 - 4)
        .style("font-size", "24.27px")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle");

      const classNode = labelNode
        .append("text")

      classNode.text((d) => d.className)
        .attr("y", svgHeight / 4 + 24.27)
        .style("font-size", "24.27px")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "hanging").each(wrap);
      classNode.append('title').text((d) => d.className)

      labelNode
        .append("text")
        .text((d) => {
          const config = configuration.find(elem => elem.className === d.className)
          return isFinite(Number(config.avgMaxMea)) ? `${config.avgMinMea} < ${config.avgMaxMea}` : `≥ ${config.avgMinMea}`;
        })
        .attr("y", svgHeight / 4 + 60.72)
        .attr('fill', 'grey')
        .style("font-size", "12.18px")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle");
    });

    function wrap() {
      const self = d3.select(this);
      let textLength = self.node().getComputedTextLength();
      let text = self.text();
      while (textLength > (svgWidth - 2) && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + '...');
        textLength = self.node().getComputedTextLength();
      }
    }

    if (!this.isAnyThresholdSet) {
      d3.select('.progress-meter-chart-container')
        .classed('remove-container', true)
      d3.select('.no-threshold-set').style('min-height', `${baseHeight}px`).style('margin-top', '10px')
      d3.select('.overvew-img').attr('height', `${baseHeight - 32}px`)
      d3.select('.attention').style('font-size', `${baseHeight / 2}px`)
    }
  }

  private yScaleCalc(d, func?) {
    if (this.classCategory === this.CLASS_CATEGORY.TOTAL_MEA) {
      return func ? func(d.total) : d.total
    }
    else {
      return func ? func(d.deviceIdStore.length) : d['deviceIdStore'].length
    }
  }

  private resetCounts(){
    this.totalDeviceCount = 0;
    this.totalMeaCount = 0;
  }

  ngOnDestroy(): void {
    if (this.monthChangedSubscription) {
      this.monthChangedSubscription.unsubscribe()
    }
    if (this.tenantChangedSubscription) {
      this.tenantChangedSubscription.unsubscribe()
    }
  }
}
