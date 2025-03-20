import { Injectable } from '@angular/core';
import { FetchClient, IFetchOptions, TenantService } from '@c8y/client';
import { TenantSummaryDetailedResources } from './tenant-statistics/tenant-statistics.service';
import { Alert, AlertService, gettext } from '@c8y/ngx-components';
import { DATE_FORMAT_DAY } from './device-statistics/device-statistics.service';
import { Subject } from 'rxjs';
import {  Router, UrlTree } from '@angular/router';

const moment = require('moment');
export const DATE_FORMAT_MONTH = 'MMMM/YYYY'
export enum FeatureList {
  DeviceStatistics = 'Device Statistics',
  MicroserviceStatistics = 'Microservice Statistics',
  TenantStatistics = 'Tenant Statistics',
  TenantAggregation = 'Tenant Aggregation',
  DeviceAggregation = 'Device Aggregation',
  MicroserviceAggregation = 'Microservice Aggregation',
  MonthlySnapshot= 'Monthly Snapshot'

}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private readonly header: any = { "Content-Type": "application/json" };
  private tenantListStore: string[];
  private currentlyActiveTenant: string;
  private sourceTenant: string;
  previouslyActiveTenant: string;
  tenantChanged = new Subject();

  constructor(
    private tenantService: TenantService,
    private client: FetchClient,
    private alertService: AlertService,
    private router: Router
  ) { }

  async getSourceTenant() {
    if (!this.sourceTenant) {
      const response = await this.tenantService.current();
      this.sourceTenant = response.data.name;
    }
    return this.sourceTenant;
  }

  async getCurrentTenantDetails(){
    try {
      const options: IFetchOptions = {
        method: "GET",
        headers: this.header,
      };
      const url = `/tenant/currentTenant`;
      const res = await this.client.fetch(url, options);
      const data = await res.json()      
      return data
    }
    catch (error) {
      const alert: Alert = {
        text: gettext('Unable to get details for this tenant'),
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
  }
  
  async getCurrentTenantSummary(selectedDate: Date): Promise<TenantSummaryDetailedResources> {
    try {
      return await this.getAllTenantSummary(selectedDate);
    }
    catch (error) {
      const alert: Alert = {
        text: gettext('Unable to get summary of the current tenant'),
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
  }

  async getAllTenantSummary(selectedDate: Date): Promise<TenantSummaryDetailedResources> {
    try {
      const options: IFetchOptions = {
        method: "GET",
        headers: this.header,
      };
      const urlFragment = "/tenant/statistics/summary";
      const url = await this.getUrl(selectedDate, urlFragment)

      const res = await this.client.fetch(url, options);
      const data = await res.json()
      return data
    }
    catch (error) {
      const alert: Alert = {
        text: gettext('Unable to get summary of all the tenants'),
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
  }

  microserviceUnavailableAlert(error) {
    const alert: Alert = {
      text: gettext('Unable to get the tenant summary'),
      type: 'danger',
      detailedData: error.message
    }
    this.alertService.add(alert)
  }

  async getAllSubtenants(tenantId: string): Promise<any> {
    if (!this.tenantListStore) {
      try {
        this.tenantListStore = [];
        let response = undefined;
        let api = "tenant/tenants?withApps=false&pageSize=2000"
        do {
          response = await this.getSubtenantsList(api)
          api = response.next ? response.next.substring(response.next.indexOf('/tenant')) : response.next;
          this.tenantListStore.push(...response.tenants)
        }
        
        while (response.next && response.tenants.length)
        if(!(this.tenantListStore.filter((elem) => elem['id'] === tenantId).length > 0)){
          const tenantDetails = await this.getCurrentTenantDetails()
          tenantDetails["status"] = "ACTIVE";
          tenantDetails["id"] = tenantId;
          tenantDetails["domain"] = tenantDetails['domainName'];
          this.tenantListStore.push(tenantDetails)
        }
        
        return this.tenantListStore
      }
      catch (error) {
        const alert: Alert = {
          text: gettext('Unable to get the subtenants list. Are there any subtenants attached?'),
          type: 'danger',
          detailedData: error.message
        }
        this.alertService.add(alert)
      }
    }
    else {
      return this.tenantListStore
    }
  }
  setCurrentlyActiveTenant(tenantId) {
    this.previouslyActiveTenant = this.currentlyActiveTenant;
    this.currentlyActiveTenant = tenantId
    this.tenantChanged.next(this.currentlyActiveTenant)
  }
  async getCurrentlyActiveTenant() {
    this.currentlyActiveTenant = this.currentlyActiveTenant ?? await this.getSourceTenant();
    return this.currentlyActiveTenant;
  }

  async isSameTenant(){
    return this.previouslyActiveTenant === await this.getCurrentlyActiveTenant()
  }

  private async getSubtenantsList(api: string) {
    try {
      const options = {
        method: 'GET'
      };
      const response = await this.client.fetch(api, options);
      return (await response).json();
    } catch (err) {
      console.log(err);
    }
  }

  private async getUrl(selectedDate: Date, urlFragment: string) {
    const { startOfMonth, endOfMonth } = this.getDatesStartAndEndMonth(selectedDate)
    return `${urlFragment}?dateFrom=${startOfMonth}&dateTo=${endOfMonth}&tenant=${await this.getCurrentlyActiveTenant()}&pageSize=2000`;
  }

  public getDatesStartAndEndMonth(selectedDate: Date) {
    const startOfMonth = moment(selectedDate).startOf('month').format(DATE_FORMAT_DAY)
    const endOfMonth = moment(selectedDate).endOf('month').format(DATE_FORMAT_DAY)
    return { startOfMonth, endOfMonth }
  }

  public  async isMetricsAggregatorAvailable(): Promise<boolean| UrlTree>{
    var api = '/service/metrics-aggregator/health'
    const r = await this.client.fetch(api, {method: 'GET'} )
    if (r.ok){
      console.log("Metrics Aggregator Microservice found. Activating aggregation. " , await r.json());
      return true;
    } else {
      let al: string = "No Metrics Aggregator Microservice found. No aggregation possible."
      // const alert: Alert = {
      //   text: gettext(al),
      //   type: 'danger'
      // }
      // this.alertService.add(alert);
      console.log(al);
      return this.router.createUrlTree(['device-statistics/overview']);
    }
  }
}
