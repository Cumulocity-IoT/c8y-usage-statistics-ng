import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { gettext, DisplayOptions, Pagination, Column, CellRendererContext } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { CommonService, FeatureList } from '../../common.service';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { MicroserviceStatisticsService } from '../microservice-statistics.service';
import { COLUMN_FIELDS } from './microservice-data.service';

const moment = require('moment');



@Component({
  selector: 'app-microservice-data',
  templateUrl: './microservice-data.component.html',
  styleUrls: ['./microservice-data.component.css']
})
export class MicroserviceDataComponent implements OnInit, OnDestroy {
  feature = FeatureList.MicroserviceStatistics;
  monthChangedSubscription: Subscription;
  tenantChangedSubscription: Subscription;
  microserviceData: any[];
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

  MEMORY: string = 'memory';
  NAME: string = 'microserviceName';
  CPU: string = 'cpu';
  CAUSE: string = 'cause';
  CATEGORY: string = 'productCategory';
  AVG_CPU: string = 'avgCpu';
  AVG_MEMORY: string = 'avgMemory';

  columns: Column[] = this.getColumns();
  pagination: Pagination = this.getPagination();

  constructor(
    private monthPickerService: MonthPickerService,
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private element: ElementRef,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe((selectedDate: Date) => {
      this.getMicroserviceData(selectedDate);
    });
    this.tenantChangedSubscription = this.commonService.tenantChanged.subscribe((tenantId: string) =>{
      this.getMicroserviceData();
    })
    this.getMicroserviceData();
    this.isLoading = false;
  }

  ngAfterViewInit() {
    const btns = this.element.nativeElement.querySelectorAll('c8y-data-grid .btnbar-btn');
    btns.forEach((btn: HTMLElement) => {
      if (btn.querySelector('i[c8yIcon=refresh]')) btn.style.display = 'none';
    });
  }

  getColumns(): Column[] {
    return [
      {
        name: this.NAME,
        header: COLUMN_FIELDS.MICROSERVICE,
        path: this.NAME,
        filterable: true,
        sortable: true
      },
      {
        name: this.CATEGORY,
        header: COLUMN_FIELDS.PROD_CATEGORY,
        path: this.CATEGORY,
        filterable: true,
        sortable: true
      },
      {
        name: this.MEMORY,
        header: COLUMN_FIELDS.MEMORY_TOTAL,
        path: this.MEMORY,
        filterable: true,
        sortable: true,
        visible: false,
        headerCellRendererComponent: MemoryCpuHeaderComponent
      },
      {
        name: this.AVG_MEMORY,
        header: COLUMN_FIELDS.MEMORY_AVG,
        path: this.AVG_MEMORY,
        filterable: true,
        sortable: true,
        headerCellRendererComponent: MemoryCpuHeaderComponent
      },
      {
        name: this.CPU,
        header: COLUMN_FIELDS.CPU_TOTAL,
        path: this.CPU,
        filterable: true,
        sortable: true,
        visible: false,
        headerCellRendererComponent: MemoryCpuHeaderComponent
      },
      {
        name: this.AVG_CPU,
        header: COLUMN_FIELDS.CPU_AVG,
        path: this.AVG_CPU,
        filterable: true,
        sortable: true,
        headerCellRendererComponent: MemoryCpuHeaderComponent
      },
      {
        name: this.CAUSE,
        header: COLUMN_FIELDS.CAUSE,
        path: this.CAUSE,
        filterable: true,
        sortable: true
      }
    ];
  }

  getPagination(): Pagination {
    return {
      pageSize: 10,
      currentPage: 1
    };
  }

  async getMicroserviceData(selectedDate = this.monthPickerService.selectedDate) {
    try {
      this.microserviceData = await this.microserviceStatisticsService.getMonthlyMicroserviceProdCategoryMap(selectedDate);
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
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


@Component({
  template: `  
      {{ context?.value }}
      <button type="button" c8yicon="question-circle-o" class="btn btn-link dlt-c8y-icon-question-circle-o" style="text-decoration: none"
      title="{{ title }}">
      </button>     
  `
})
export class MemoryCpuHeaderComponent {
  title: string
  constructor(public context: CellRendererContext) {
    if (context?.value === COLUMN_FIELDS.MEMORY_AVG) {
      this.title = gettext('Average memory usage / day (GiB)');
    }
    else if (context?.value === COLUMN_FIELDS.MEMORY_TOTAL) {
      this.title = gettext('Total megabytes used in the month, calculated daily (MiB)');
    }
    else if (context?.value === COLUMN_FIELDS.CPU_AVG) {
      this.title = gettext('Average CPU usage / day (CPUs)');
    }
    else if (context?.value === COLUMN_FIELDS.CPU_TOTAL) {
      this.title = gettext('Total millicores used in the month, calculated daily (mCPU)');
    }
  }
}
