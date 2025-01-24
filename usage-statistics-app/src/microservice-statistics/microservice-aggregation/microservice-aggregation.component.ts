import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { gettext, DisplayOptions, Pagination, Column } from '@c8y/ngx-components';
import { Subject, Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { MicroserviceStatisticsService } from '../microservice-statistics.service';
import {CoreModule} from "@c8y/ngx-components";
import { DeviceGridModule } from "@c8y/ngx-components/device-grid";      
import { CommonService, FeatureList } from '../../common.service';    
import { NumberRendererComponent } from './renderer/number.renderer.component';

@Component({
  selector: 'microservice-aggregation',
  templateUrl: './microservice-aggregation.component.html',
  styleUrls: ['./microservice-aggregation.component.css'],
})
export class MicroserviceAggregationComponent implements OnInit, OnDestroy {
  feature = FeatureList.MicroserviceAggregation;
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
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private commonService: CommonService
  ) { }

  pagination: Pagination = this.getPagination();
  totalCpu: any;
  totalMem: any;
  CCUs: any;
  columns: Column[] = [
    {
      name: "name",
      header: "Microservice",
      path: "name",
      filterable: true,
    },
    {

      name: "avgMemory",
      header: "Average Memory",
      path: "avgMemory",
      filterable: true,
      cellRendererComponent: NumberRendererComponent,
    },
    {
      name: "avgCPU",
      header: "Average CPU",
      path: "avgCPU",
      filterable: true,
      cellRendererComponent: NumberRendererComponent,
    }
  ];

  microserviceData: any[];
  title = "Microservice Aggregation";


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
      this.microserviceData = await this.microserviceStatisticsService.getMonthlyMicroserviceAggregation(selectedDate)
      this.totalMem = Number(this.microserviceData['totalUsage']['avgMemory']).toFixed(2)
      this.totalCpu = Number(this.microserviceData['totalUsage']['avgCPU']).toFixed(2)
      this.CCUs = Number(this.microserviceData['totalUsage']['ccus']).toFixed(0)
      this.microserviceData = this.microserviceData['totalUsage']['usedBy']
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
