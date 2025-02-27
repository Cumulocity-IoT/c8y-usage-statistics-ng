import { Component,  Input, OnInit, SimpleChanges } from '@angular/core';
import { gettext, DisplayOptions} from '@c8y/ngx-components';
import { DeviceStatisticsService, CLASS_COLORS, } from '../device-statistics.service';  
import { CommonService} from '../../common.service';   
import { EChartsCoreOption } from 'echarts/core';
import { ECharts, EChartsOption } from 'echarts';


@Component({
  selector: 'device-class-chart',
  templateUrl: './device-class-chart.component.html',
  styleUrls: ['./device-class-chart.component.css']
})
export class DeviceClassChart implements OnInit{
  
  
  onChartInit(ec: ECharts) {
    this.echartsInstance = ec;
  }

  @Input() deviceData;
  
  chartOptions: EChartsCoreOption;
  echartsInstance: any;
  displayOptions: DisplayOptions = {
    bordered: false,
    striped: true,
    filter: true,
    gridHeader: true,
    hover: true
  };

  constructor(
    private deviceStatisticsService: DeviceStatisticsService,
    private commonService: CommonService
  ) {}

  title = "Device Classes";


  ngOnInit(): void {
    this.renderDeviceClassChart(this.deviceData);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.renderDeviceClassChart(this.deviceData);
    
  }


  private renderDeviceClassChart(chartData){

    const category=[];
    chartData.forEach((element) => category.push(element["className"]));
    
    const series=[];
    chartData.forEach((element,index) => series.push(
      {
        value: element["count"],
        itemStyle: {color: CLASS_COLORS[index]}
      }
    ));

    let chartOptions:  EChartsCoreOption= {
      xAxis: {
        type: 'category',
        data: category,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: series,
          type: 'bar',
        }
      ],
      label: {
        show: true,
        position: 'top'
      }
    };

    this.chartOptions = chartOptions;

  }
}
