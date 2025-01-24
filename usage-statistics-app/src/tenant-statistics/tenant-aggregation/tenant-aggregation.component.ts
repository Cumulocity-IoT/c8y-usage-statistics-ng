import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonService, FeatureList } from '../../common.service';
import { Subscription } from 'rxjs';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { TenantStatisticsService, TenantAggregationResources } from '../tenant-statistics.service';

@Component({
  selector: 'tenant-aggregation',
  templateUrl: './tenant-aggregation.component.html',
  styleUrls: ['./tenant-aggregation.component.css']
})
export class TenantAggregationComponent implements OnInit {
  feature = FeatureList.TenantAggregation;
  monthChangedSubscription: Subscription;
  tenantAggregation: TenantAggregationResources;
  showAlert = false
  constructor(
    private monthPickerService: MonthPickerService,
    private tenantStatisticsService: TenantStatisticsService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
      this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe(
        (selectedDate: Date) => {
          this.getData(selectedDate);
      });
      this.getData()
    }
  

  async getData(selectedDate = this.monthPickerService.selectedDate) {
    try {
      var tenantAggregationData: any = await this.tenantStatisticsService.getMonthlyTenantAggregation(selectedDate)
      this.tenantAggregation = tenantAggregationData['totalTenantStat']
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