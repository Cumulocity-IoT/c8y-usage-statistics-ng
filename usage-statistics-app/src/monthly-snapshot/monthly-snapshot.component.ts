import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
  selectedDate: Date = new Date();
  microserviceData: any;
  tenantAggregation: any;
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

  

  title = "Device Aggregation";


  getPagination(): Pagination {
    return {
      pageSize: 10,
      currentPage: 1
    };
  }

  ngOnInit(): void {
        this.getData(this.selectedDate);
  }

  async getData(selectedDate) {
    try {
      this.deviceData = await this.deviceStatisticsService.getMonthlyDeviceAggregation(selectedDate)
      this.totalMeas = this.deviceData['totalMeas'];
      this.totalDeviceCount = this.deviceData['totalDeviceCount'];
      this.deviceData = this.deviceData['totalDeviceClasses'];
      this.microserviceData = await this.microserviceStatisticsService.getMonthlyMicroserviceAggregation(selectedDate)
      this.totalMem = Number(this.microserviceData['totalUsage']['avgMemory']).toFixed(2)
      this.totalCpu = Number(this.microserviceData['totalUsage']['avgCPU']).toFixed(2)
      this.CCUs = Number(this.microserviceData['totalUsage']['ccus']).toFixed(0)
      var tenantAggregationData: any = await this.tenantStatisticsService.getMonthlyTenantAggregation(selectedDate)
      this.tenantAggregation = tenantAggregationData['totalTenantStat']
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
  }


 
}
