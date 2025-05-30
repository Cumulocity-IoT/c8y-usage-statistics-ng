import { Injectable } from '@angular/core';
import { gettext } from '@c8y/ngx-components';
import { TenantSummaryResources } from '../microservice-statistics/microservice-statistics.service';
import { CommonService } from '../common.service';
import { FetchClient } from "@c8y/client";

export interface TenantSummaryDetailedResources {
  deviceEndpointCount: number,
  deviceWithChildrenCount: number,
  inventoriesUpdatedCount: number,
  eventsUpdatedCount: number,
  day: string,
  requestCount: number,
  deviceCount: number,
  resources?: {
    memory: number,
    cpu: number,
    usedBy: TenantSummaryResources[] | null
  },
  deviceRequestCount: number,
  eventsCreatedCount: number,
  subscribedApplications: string[],
  alarmsCreatedCount: number,
  alarmsUpdatedCount: number,
  inventoriesCreatedCount: number,
  measurementsCreatedCount: number,
  storageSize: number,
  self: string,
  totalResourceCreateAndUpdateCount: number
}
export interface TenantAggregationResources {
  deviceEndpointCount: number,
  deviceWithChildrenCount: number,
  inventoriesUpdatedCount: number,
  eventsUpdatedCount: number,
  requestCount: number,
  deviceCount: number,
  deviceRequestCount: number,
  storageLimitPerDevice: number,
  eventsCreatedCount: number,
  alarmsCreatedCount: number,
  alarmsUpdatedCount: number,
  inventoriesCreatedCount: number,
  measurementsCreatedCount: number,
  storageSize: number,
  storageHumanReadable: string,
  totalResourceCreateAndUpdateCount: number
  meas: number
}

const moment = require('moment');
const DATE_FORMAT_DAY = 'YYYY-MM-DD';
@Injectable({
  providedIn: 'root'
})

export class TenantStatisticsService {
  readonly tenantSummaryResourcesUrl: string = "/tenant/statistics/summary";
  private readonly header: any = { "Content-Type": "application/json" };
  tenantSummaryDetailedResourcesStore = {
    data: null,
    date: new Date
  };
  constructor(
    private commonService: CommonService,
    private client: FetchClient
  ) { }


  async getTenantSummaryDetailedResources(selectedDate: Date): Promise<TenantSummaryDetailedResources> {
    const data = await this.commonService.getCurrentTenantSummary(selectedDate)
    data.resources = {
      memory: 0,
      cpu: 0,
      usedBy:  null
    }

    this.tenantSummaryDetailedResourcesStore = {
      data: data,
      date: selectedDate
    };
    return data as TenantSummaryDetailedResources;
  }

  getStorageSizeInMiB(storage: number) {
    return (storage / 1048576).toFixed(2)
  }
  
  getStorageSizeInGiB(storage: number) {
    return (storage / 1073741824).toFixed(2)
  }

  getTotalCPUs(cpus: number) {
    return (cpus / 1000).toFixed(2)
  }

  getTotalMemoryInGiB(memory: number){
    return (memory / 1073.74).toFixed(2)
  }

  getTotalMea(tenantData: TenantSummaryDetailedResources) {
    return tenantData.eventsCreatedCount +
      tenantData.eventsUpdatedCount +
      tenantData.alarmsCreatedCount +
      tenantData.alarmsUpdatedCount +
      tenantData.measurementsCreatedCount
  }

  public async getMonthlyTenantAggregation(date: Date):Promise<any> {
    
    return await this.getTenantAggregation(
      this.commonService.getDatesStartAndEndMonth(date).startOfMonth,
      this.commonService.getDatesStartAndEndMonth(date).endOfMonth);
  }

  public async getMonthlySnapshot():Promise<any>{
    let today: Date = new Date();
    let dateFrom: Date= this.commonService.getDatesStartAndEndMonth(today).startOfMonth;
    let dateTo: Date= today;
    if (today.getDate() == 1){
        dateFrom = today;
        dateFrom.setMonth(today.getMonth() -1)
        dateFrom = this.commonService.getDatesStartAndEndMonth(dateFrom).startOfMonth
        dateTo = this.commonService.getDatesStartAndEndMonth(dateFrom).endOfMonth;
    }
    return await this.getTenantAggregation(
      dateFrom,dateTo);
  }

  private async getTenantAggregation(dateFrom: Date, dateTo: Date){
    try {
      const options = {
        method: 'GET'
      };
      const response = await this.client.fetch(
        `/service/metrics-aggregator/tenants/?dateFrom=${moment(dateFrom).format(DATE_FORMAT_DAY)}&dateTo=${moment(dateTo).format(DATE_FORMAT_DAY)}`
        , options);
      return (await response).json();
    } catch (err) {
      console.log(err);
    }
  }
}
