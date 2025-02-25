import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { gettext, DisplayOptions, Pagination, Column } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { DeviceStatisticsService, CLASS_COLORS, } from '../device-statistics.service';  
import { CommonService, FeatureList } from '../../common.service';    


const d3 = require('d3')

@Component({
  selector: 'device-aggregation',
  templateUrl: './device-aggregation.component.html',
  styleUrls: ['./device-aggregation.component.css']
})
export class DeviceAggregationComponent implements OnInit, OnDestroy {
  feature = FeatureList.DeviceAggregation;
  monthChangedSubscription: Subscription;
  loadMoreItemsLabel: string = gettext('Load more microservice details');
  loadingItemsLabel: string = gettext('Loading microservice details...');
  displayOptions: DisplayOptions = {
    bordered: false,
    striped: true,
    filter: true,
    gridHeader: true,
    hover: true
  };
  isLoading = true;
  constructor(
    private monthPickerService: MonthPickerService,
    private deviceStatisticsService: DeviceStatisticsService,
    private element: ElementRef,
    private commonService: CommonService
  ) { }

  pagination: Pagination = this.getPagination();
  totalMeas: Number= 0;
  totalDeviceCount: Number= 0;
  columns: Column[] = [
    {
      name: "className",
      header: "Device Class",
      path: "className",
      filterable: true,
    },
    {
      name: "count",
      header: "Total",
      path: "count",
      filterable: true,
    },
  ];

  deviceData: any[];
  

  title = "Device Aggregation";


  getPagination(): Pagination {
    return {
      pageSize: 10,
      currentPage: 1
    };
  }

  ngOnInit(): void {
    this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe(
      (selectedDate: Date) => {
        this.getData(selectedDate);
        
      });
      this.getData()
  }

  async getData(selectedDate = this.monthPickerService.selectedDate) {
    try {
      this.deviceData = await this.deviceStatisticsService.getMonthlyDeviceAggregation(selectedDate)
      this.totalMeas = this.deviceData['totalMeas']
      this.totalDeviceCount = this.deviceData['totalDeviceCount']
      this.deviceData = this.deviceData['totalDeviceClasses']
      this.generateClassComparisonChart(this.deviceData);
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
  }


  private generateClassComparisonChart(chartData) {
    const deviceClasses=[];
    chartData.forEach(element => {
      deviceClasses.push(element["className"])
    });


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

    const xScale = d3.scaleBand().domain(deviceClasses).range([0, svgWidth])
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

    progressContainer
      .append('text')
      .attr('x', d => xScale(d.className) + xScale.bandwidth() / 2)
      .attr('transform', d => `translate(0, ${svgHeight - 3 * MARGIN.TOP - this.yScaleCalc(d, yScale)})`)
      .style('text-anchor', 'middle')
      .text(d => {
        const count = this.yScaleCalc(d)

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
    return func ? func(d.count) : d.count
  }


  ngOnDestroy(): void {
    if (this.monthChangedSubscription) {
      this.monthChangedSubscription.unsubscribe()
    }
  }
}
