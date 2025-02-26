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
  selectedDate: any;
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
      //this.generateDeviceClassChart(this.deviceData);
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
  }


  ngOnDestroy(): void {
    if (this.monthChangedSubscription) {
      this.monthChangedSubscription.unsubscribe()
    }
  }
}
