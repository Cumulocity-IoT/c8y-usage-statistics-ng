import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Column, DisplayOptions, gettext, Pagination } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { DeviceStatisticsService } from '../device-statistics.service';
import { DeviceIdGridColumn } from './device-id-grid-component';
import { TOTAL_MEA, AVG_MEA, CLASS } from './device-data.service';
import { DeviceTypeGridColumn } from './device-type-grid-component';
import { CommonService, FeatureList } from '../../src/../common.service';

@Component({
  selector: 'device-data',
  templateUrl: './device-data.component.html',
  styleUrls: ['./device-data.component.css']
})
export class DeviceDataComponent implements OnInit, OnDestroy {
  feature = FeatureList.DeviceStatistics
  monthChangedSubscription: Subscription;
  tenantChangedSubscription: Subscription;
  deviceData: any[];
  loadMoreItemsLabel: string = gettext('Load more device details');
  loadingItemsLabel: string = gettext('Loading device details...');
  displayOptions: DisplayOptions = {
    bordered: false,
    striped: true,
    filter: true,
    gridHeader: true,
    hover: true
  };

  columns: Column[] = this.getColumns();
  pagination: Pagination = this.getPagination();

  constructor(
    private commonService: CommonService,
    private monthPickerService: MonthPickerService,
    private deviceStatisticsService: DeviceStatisticsService,
    private element: ElementRef
  ) {
  }

  ngOnInit(): void {    
    this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe((selectedDate: Date) => {
      this.getDeviceData(selectedDate)
    })
    this.tenantChangedSubscription = this.commonService.tenantChanged.subscribe((tenantId: string) =>{
      this.getDeviceData()
    })
    this.getDeviceData();
  }

  ngAfterViewInit() {
    const btns = this.element.nativeElement.querySelectorAll('c8y-data-grid .btnbar-btn');
    btns.forEach((btn: HTMLElement) => {
      if (btn.querySelector('i[c8yIcon=refresh]')) btn.style.display = 'none';
    });
  }

  getColumns(): Column[] {
    return [
      new DeviceIdGridColumn(),
      new DeviceTypeGridColumn(),
      {
        name: TOTAL_MEA,
        header: gettext('Total MEAs'),
        path: TOTAL_MEA,
        filterable: true,
        sortable: true
      },
      {
        name: AVG_MEA,
        header: gettext('Average MEAs/day'),
        path: AVG_MEA,
        filterable: true,
        sortable: true
      },
      {
        name: CLASS,
        header: gettext('Class'),
        path: CLASS,
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

  async getDeviceData(selectedDate = this.monthPickerService.selectedDate) {
    const data = await this.deviceStatisticsService.getFormattedDeviceData(selectedDate);
    this.deviceData = data.deviceData;
  }
 
  ngOnDestroy(): void {
    if(this.monthChangedSubscription){
      this.monthChangedSubscription.unsubscribe();
    }
    if(this.tenantChangedSubscription){
      this.tenantChangedSubscription.unsubscribe();
    }
  }
}
