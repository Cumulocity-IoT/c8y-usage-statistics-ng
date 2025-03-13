import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { gettext, DisplayOptions, Pagination, Column, AlertService } from '@c8y/ngx-components';
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
  microserviceDataCurrentMonth: any;
  tenantAggregation: any;
  tenantAggregationCurrentMonth: any;
  feature: FeatureList;
  constructor(

    private deviceStatisticsService: DeviceStatisticsService,
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private commonService: CommonService,
    private tenantStatisticsService: TenantStatisticsService,
    private alertService: AlertService,
    
  ) { }


  pagination: Pagination = this.getPagination();
  
  totalMeas: Number= 0;
  totalDeviceCount: Number= 0;
  deviceData: any[];
  
  deviceDataCurrentMonth: any[];
  totalMeasCurrentMonth: Number= 0;
  totalDeviceCountCurrentMonth: Number= 0;


  totalCpu: any = 0;
  totalMem: any = 0;
  CCUs: any= 0;

  totalCpuCurrentMonth: any = 0;
  totalMemCurrentMonth: any = 0;
  CCUsCurrentMonth: any= 0;


  selectedDate: Date;

  titleHeader: String = "Monthly Snapshot";
  titleLastMonth: String = "Last Month";
  titleSnapshot: String = "This Month until yesterday"


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

  ngAfterViewInit() {
    if (!sessionStorage.getItem("isFirstSession")) {
      this.alertService.warning(gettext('Usage Statistics should be used for indicative purposes only. Billable metrics may be different than the data shown below.'));
      sessionStorage.setItem("isFirstSession", "no");
    }
  }


  async refreshSnapshot(){
    this.deviceStatisticsService.getDailyDeviceAggregation(true);
  }
  async getData() {
    try {
      let today:Date  = new Date();
      this.selectedDate = new Date(today.getFullYear(),today.getMonth()-1,today.getMonth());
      let df = new Intl.DateTimeFormat(
        Intl.DateTimeFormat().resolvedOptions().locale, {
        year: 'numeric',
        month: 'long'});
      this.titleLastMonth = this.titleLastMonth + " " + df.format(this.selectedDate)

     
      this.deviceData = await this.deviceStatisticsService.getMonthlyDeviceAggregation(this.selectedDate);
      this.totalMeas = this.deviceData['totalMeas'];
      this.totalDeviceCount = this.deviceData['totalDeviceCount'];
      this.deviceData = this.deviceData['totalDeviceClasses'];
      
      this.deviceDataCurrentMonth = await this.deviceStatisticsService.getDailyDeviceAggregation(false);
      this.totalMeasCurrentMonth = this.deviceDataCurrentMonth['totalMeas'];
      this.totalDeviceCountCurrentMonth = this.deviceDataCurrentMonth['totalDeviceCount'];
      this.deviceDataCurrentMonth = this.deviceDataCurrentMonth['totalDeviceClasses'];



      this.microserviceData = await this.microserviceStatisticsService.getMonthlyMicroserviceAggregation(this.selectedDate)
      this.totalMem = Number(this.microserviceData['totalUsage']['avgMemory']).toFixed(2)
      this.totalCpu = Number(this.microserviceData['totalUsage']['avgCPU']).toFixed(2)
      this.CCUs = Number(this.microserviceData['totalUsage']['ccus']).toFixed(0)

      this.microserviceDataCurrentMonth = await this.microserviceStatisticsService.getMonthlySnapshot();
      this.totalMemCurrentMonth = Number(this.microserviceDataCurrentMonth['totalUsage']['avgMemory']).toFixed(2)
      this.totalCpuCurrentMonth = Number(this.microserviceDataCurrentMonth['totalUsage']['avgCPU']).toFixed(2)
      this.CCUsCurrentMonth = Number(this.microserviceDataCurrentMonth['totalUsage']['ccus']).toFixed(0)



      var tenantAggregationData: any = await this.tenantStatisticsService.getMonthlyTenantAggregation(this.selectedDate)
      this.tenantAggregation = tenantAggregationData['totalTenantStat']
      
      var tenantAggregationDataCurrentMonth: any = await this.tenantStatisticsService.getMonthlySnapshot();
      this.tenantAggregationCurrentMonth = tenantAggregationDataCurrentMonth['totalTenantStat']
      
      


    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
  }


 
}
