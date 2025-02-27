import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { gettext, DisplayOptions, Pagination, Column } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { DeviceStatisticsService, CLASS_COLORS, } from '../device-statistics/device-statistics.service';  
import { CommonService, FeatureList } from '../common.service';    
import { MicroserviceStatisticsService } from '../microservice-statistics/microservice-statistics.service';
import { TenantStatisticsService } from '../tenant-statistics/tenant-statistics.service';


@Component({
  selector: 'monthly-snapshot',
  templateUrl: './monthly-snapshot.component.html',
  styleUrls: ['./monthly-snapshot.component.css']
})
export class MonthlySnapshotComponent implements OnInit {
 
  
  displayOptions: DisplayOptions = {
    bordered: false,
    striped: true,
    filter: true,
    gridHeader: true,
    hover: true
  };
  isLoading = true;
  microserviceData: any;
  tenantAggregation: any;
  feature: FeatureList;
  constructor(

    private deviceStatisticsService: DeviceStatisticsService,
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private commonService: CommonService,
    private tenantStatisticsService: TenantStatisticsService,
    
  ) { }


  pagination: Pagination = this.getPagination();
  totalMeas: Number= 0;
  totalDeviceCount: Number= 0;
  deviceData: any[];
  totalCpu: any = 0;
  totalMem: any = 0;
  CCUs: any= 0;
  selectedDate: Date;
  titlePrefix: String = "Monthly Snapshot";
  title: String = "";

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

  




  getPagination(): Pagination {
    return {
      pageSize: 10,
      currentPage: 1
    };
  }

  ngOnInit(): void {
        this.feature = FeatureList.MonthlySnapshot;
        this.getData();
  }


  async getData() {
    try {
      let today:Date  = new Date();
      this.selectedDate = new Date(today.getFullYear(),today.getMonth()-1,today.getMonth());
      this.deviceData = await this.deviceStatisticsService.getMonthlyDeviceAggregation(this.selectedDate);
      this.totalMeas = this.deviceData['totalMeas'];
      this.totalDeviceCount = this.deviceData['totalDeviceCount'];
      this.deviceData = this.deviceData['totalDeviceClasses'];
      this.microserviceData = await this.microserviceStatisticsService.getMonthlyMicroserviceAggregation(this.selectedDate)
      this.totalMem = Number(this.microserviceData['totalUsage']['avgMemory']).toFixed(2)
      this.totalCpu = Number(this.microserviceData['totalUsage']['avgCPU']).toFixed(2)
      this.CCUs = Number(this.microserviceData['totalUsage']['ccus']).toFixed(0)
      var tenantAggregationData: any = await this.tenantStatisticsService.getMonthlyTenantAggregation(this.selectedDate)
      this.tenantAggregation = tenantAggregationData['totalTenantStat']
      this.title = this.titlePrefix + " " + new Intl.DateTimeFormat(
        Intl.DateTimeFormat().resolvedOptions().locale, {
        year: 'numeric',
        month: 'long'
      }).format(this.selectedDate)
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
  }


 
}
