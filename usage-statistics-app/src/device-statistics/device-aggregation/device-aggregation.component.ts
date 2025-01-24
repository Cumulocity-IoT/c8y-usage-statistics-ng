import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { gettext, DisplayOptions, Pagination, Column } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { DeviceStatisticsService } from '../device-statistics.service';  
import { CommonService, FeatureList } from '../../common.service';    

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

      name: "avgMinMea",
      header: "Min Mea",
      path: "avgMinMea",
      filterable: true,
    },
    {
      name: "avgMaxMea",
      header: "Max Mea",
      path: "avgMaxMea",
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
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
  }

  // try {
  //   this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe(
  //     async (selectedDate: Date) => {
  //       this.deviceData = await this.deviceStatisticsService.getMonthlyDeviceAggregation(selectedDate)
  //       console.log("###### Data: " + JSON.stringify(this.deviceData))
  //       this.totalMeas = this.deviceData['totalMeas']
  //       this.totalDeviceCount = this.deviceData['totalDeviceCount']
  //    this.deviceData = this.deviceData['totalDeviceClasses']
  //     })
  
  // }
  // catch (err) {
  //   console.log(gettext('Error creating table'))
  //   console.error(err.message)
  // }
  ngOnDestroy(): void {
    if (this.monthChangedSubscription) {
      this.monthChangedSubscription.unsubscribe()
    }
  }
}
