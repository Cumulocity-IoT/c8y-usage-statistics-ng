import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonService, FeatureList } from './../../common.service';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { TenantStatisticsService, TenantSummaryDetailedResources } from '../tenant-statistics.service';

@Component({
  selector: 'app-tenant-data',
  templateUrl: './tenant-data.component.html',
  styleUrls: ['./tenant-data.component.css']
})
export class TenantDataComponent implements OnInit {
  feature = FeatureList.TenantStatistics;
  monthChangedSubscription: Subscription;
  tenantChangedSubscription: Subscription;
  tenantData: TenantSummaryDetailedResources;
  showAlert = false
  constructor(
    private monthPickerService: MonthPickerService,
    private tenantStatisticsService: TenantStatisticsService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe((selectedDate: Date) => {
      this.loadData(selectedDate)
    })
    this.tenantChangedSubscription = this.commonService.tenantChanged.subscribe((tenantId: string) => {
      this.loadData();
    })
    this.loadData(this.monthPickerService.selectedDate);
  }

  private async loadData(selectedDate = this.monthPickerService.selectedDate) {
    try {
      this.tenantData = await this.tenantStatisticsService.getTenantSummaryDetailedResources(selectedDate)
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
    finally {
      this.showAlert = !this.tenantData
    }
  }

  getFilteredTenantSubscriptions(searchString){
    if(!searchString || !this.tenantData.subscribedApplications){
      return this.tenantData.subscribedApplications
    }
    else{
      return this.tenantData.subscribedApplications.filter(elem => elem.includes(searchString))
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