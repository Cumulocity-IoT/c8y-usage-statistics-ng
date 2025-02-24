import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { CLASS_COLORS, DeviceStatisticsService } from '../device-statistics.service';
import { gettext } from '@c8y/ngx-components';
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
