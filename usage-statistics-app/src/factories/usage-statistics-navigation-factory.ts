import { Injectable } from '@angular/core';
import { FetchClient, IFetchOptions } from '@c8y/client';
import { Alert, AlertService, gettext, NavigatorNode, NavigatorNodeFactory, Route } from '@c8y/ngx-components';
import { DeviceConfigurationComponentDetails } from '../device-statistics/device-configuration/device-configuration-details.component';
import { DeviceConfigurationComponentList } from '../device-statistics/device-configuration/device-configuration-list.component';
import { DeviceDataComponent } from '../device-statistics/device-data/device-data.component';
import { DeviceOverviewComponent } from '../device-statistics/device-overview/device-overview.component';
import { DeviceAggregationComponent } from '../device-statistics/device-aggregation/device-aggregation.component';
import { MicroserviceConfigurationComponent } from '../microservice-statistics/microservice-configuration/microservice-configuration.component';
import { MicroserviceDataComponent } from '../microservice-statistics/microservice-data/microservice-data.component';
import { CategoryOverviewComponent } from '../microservice-statistics/microservice-overview/category-overview/category-overview.component';
import { ServicesOverviewComponent } from '../microservice-statistics/microservice-overview/services-overview/services-overview.component';
import { TenantDataComponent } from '../tenant-statistics/tenant-data/tenant-data.component';
import { Router } from '@angular/router';
import { MicroserviceAggregationComponent } from '../microservice-statistics/microservice-aggregation/microservice-aggregation.component';
import { TenantAggregationComponent } from '../tenant-statistics/tenant-aggregation/tenant-aggregation.component';

const navs: NavigatorNode[] = [];
const APPROVED_ROLES = [
  'ROLE_OPTION_MANAGEMENT_ADMIN',
  'ROLE_OPTION_MANAGEMENT_CREATE',
  'ROLE_OPTION_MANAGEMENT_UPDATE'
]

export const ROUTES: Route[] = [
  { path: '', pathMatch: 'prefix', redirectTo: 'device-statistics/overview' },
  { path: 'device-statistics', pathMatch: 'prefix', redirectTo: 'device-statistics/overview' },
  { path: 'device-statistics/overview', component: DeviceOverviewComponent },
  { path: 'device-statistics/device-data', component: DeviceDataComponent },
  { path: 'device-statistics/aggregation', component: DeviceAggregationComponent },
  { path: 'microservice-statistics', pathMatch: 'prefix', redirectTo: 'microservice-statistics/overview/category-overview' },
  { path: 'microservice-statistics/overview', pathMatch: 'prefix', redirectTo: 'microservice-statistics/overview/category-overview' },
  { path: 'microservice-statistics/overview/category-overview', component: CategoryOverviewComponent },
  { path: 'microservice-statistics/overview/services-overview', component: ServicesOverviewComponent },
  { path: 'microservice-statistics/microservice-data', component: MicroserviceDataComponent },
  { path: 'microservice-statistics/microservice-aggregation', component: MicroserviceAggregationComponent },
  { path: 'tenant-statistics', pathMatch: 'prefix', redirectTo: 'tenant-statistics/tenant-data' },
  { path: 'tenant-statistics/tenant-data', component: TenantDataComponent },
  { path: 'tenant-statistics/tenant-aggregation', component: TenantAggregationComponent },
  { path: 'device-statistics/device-configuration-list', pathMatch: 'prefix', redirectTo: 'device-statistics/overview' },
  { path: 'device-statistics/device-configuration-details', pathMatch: 'prefix', redirectTo: 'device-statistics/overview' },
  { path: 'microservice-statistics/microservice-configuration', pathMatch: 'prefix', redirectTo: 'microservice-statistics/overview/category-overview' },
]

const ADMIN_ROUTES = [
  { path: 'device-statistics/device-configuration-list', component: DeviceConfigurationComponentList },
  { path: 'device-statistics/device-configuration-details', component: DeviceConfigurationComponentDetails },
  { path: 'microservice-statistics/microservice-configuration', component: MicroserviceConfigurationComponent },
]

@Injectable()
export class UsageStatisticsNavigationFactory implements NavigatorNodeFactory {
  navs: NavigatorNode[] = [];
  private readonly header: any = { "Content-Type": "application/json" };
  public aggregation: boolean = false;
  private  childrenDevice = [];
  private  childrenMicroservice = [];
  private  childrenTenant = [];
  constructor(
    private client: FetchClient,
    private alertService: AlertService,
    private router: Router
  ) {
    this.isConfigAccessible().then(res => {
      if (res) {
        this.router.config.splice(-3, 3);
        this.router.config.unshift(...ADMIN_ROUTES);
        this.router.resetConfig(this.router.config);
      }
    })
  }
  async get() {
    if (this.navs.length === 0) {
      // Device Statistics
      const DEVICE_STATISTICS_OVERVIEW = new NavigatorNode({
        path: 'device-statistics/overview',
        priority: 70,
        label: gettext('Device Overview'),
        icon: 'combo-chart'
      })
      const DEVICE_STATISTICS_DEVICE_DATA = new NavigatorNode({
        path: 'device-statistics/device-data',
        priority: 60,
        label: gettext('Device Data'),
        icon: 'grid-view'
      })

      const DEVICE_CONFIGURATION_LIST = new NavigatorNode({
        path: 'device-statistics/device-configuration-list',
        label: gettext('Device Configuration'),
        icon: 'icon dlt-c8y-icon-cog-complex',
        priority: 60
      })

      
      this.childrenDevice = [DEVICE_STATISTICS_OVERVIEW, DEVICE_STATISTICS_DEVICE_DATA];

      const DEVICE_STATISTICS = new NavigatorNode({
        label: gettext('Device Statistics'),
        icon: 'devices',
        path: '/device-statistics',
        children: this.childrenDevice,
        priority: 80
      })

      // Microservice Statistics
      const MICROSERVICE_STATISTICS_OVERVIEW = new NavigatorNode({
        path: 'microservice-statistics/overview',
        priority: 70,
        label: gettext('Microservice Overview'),
        icon: 'combo-chart',
        routerLinkExact: false
      })
      
      const MICROSERVICE_STATISTICS_DEVICE_DATA = new NavigatorNode({
        path: 'microservice-statistics/microservice-data',
        priority: 60,
        label: gettext('Microservice Data'),
        icon: 'grid-view'
      })

      const MICROSERVICE_CONFIGURATION = new NavigatorNode({
        path: 'microservice-statistics/microservice-configuration',
        label: gettext('Microservice Configuration'),
        icon: 'icon dlt-c8y-icon-cog-complex',
        priority: 60
      })


      this.childrenMicroservice = [MICROSERVICE_STATISTICS_OVERVIEW,MICROSERVICE_STATISTICS_DEVICE_DATA]
      const MICROSERVICE_STATISTICS = new NavigatorNode({
        label: gettext('Microservice Statistics'),
        icon: 'centralized-network',
        path: '/microservice-statistics',
        children: this.childrenMicroservice,
        priority: 80
      })

      // Tenant Statistics
      const TENANT_STATISTICS_DATA = new NavigatorNode({
        path: 'tenant-statistics/tenant-data',
        priority: 60,
        label: gettext('Tenant Data'),
        icon: 'grid-view'
      })
      

      this.childrenTenant = [TENANT_STATISTICS_DATA];
      const TENANT_STATISTICS = new NavigatorNode({
        label: gettext('Tenant Statistics'),
        icon: 'contact-us',
        path: '/tenant-statistics',
        children: this.childrenTenant,
        priority: 80
      })

      if (await this.isConfigAccessible()) {
        DEVICE_STATISTICS.children.push(DEVICE_CONFIGURATION_LIST)
        MICROSERVICE_STATISTICS.children.push(MICROSERVICE_CONFIGURATION)
      }
      this.navs.push(DEVICE_STATISTICS, MICROSERVICE_STATISTICS, TENANT_STATISTICS)
      this.isMetricsAggregatorAvailable();

    }

    return this.navs;
  }

  async isMetricsAggregatorAvailable(){
    try {
      const options = {
        method: 'GET'
      };
      var api = '/service/metrics-aggregator/health'
      const response = await this.client.fetch(api, options);
      if (response.ok){
        // Tenant Aggregation
        const TENANT_STATISTICS_AGGREGATION = new NavigatorNode({
          path: 'tenant-statistics/tenant-aggregation',
          priority: 60,
          label: gettext('Tenant Aggregation'),
          icon: 'summary-list'
        });
        this.childrenTenant.splice(this.childrenDevice.length -1,0,TENANT_STATISTICS_AGGREGATION);
        // Microservice Statistics
        const MICROSERVICE_STATISTICS_AGGREGATION = new NavigatorNode({
          path: 'microservice-statistics/microservice-aggregation',
          priority: 70,
          label: gettext('Microservice Aggregation'),
          icon: 'summary-list',
          routerLinkExact: false
        });
        this.childrenMicroservice.splice(this.childrenDevice.length -1,0,MICROSERVICE_STATISTICS_AGGREGATION);
        const DEVICE_STATISTICS_AGGREGATION = new NavigatorNode({
          path: 'device-statistics/aggregation',
          priority: 70,
          label: gettext('Device Aggregation'),
          icon: 'summary-list'
        });
        //this.childrenDevice.push(DEVICE_STATISTICS_AGGREGATION);
        this.childrenDevice.splice(this.childrenDevice.length -1,0,DEVICE_STATISTICS_AGGREGATION);
        this.aggregation = true;
        console.log("Metrics Aggregator Microservice found. Activating aggregation. " , await(response.json()));

      }else {

        this.aggregation= false;
        console.log("Metrics Aggregator Microservice not found. No aggregation possible. " , await(response.json()));
      }
      } catch (err) {
      console.log("Error Metrics Aggregator Microservice not found. No aggregation possible. " , err);
      this.aggregation = false;
    }
  }

  async isConfigAccessible() {
    const roles = await this.getAllUserRoles();
    const result = roles.some((item) => APPROVED_ROLES.indexOf(item) >= 0);
    return result
  }

  async getAllUserRoles(): Promise<string[]> {
    try {
      const options: IFetchOptions = {
        method: "GET",
        headers: this.header,
      };

      const url = '/user/roles?pageSize=2000'
      const res = await this.client.fetch(url, options);
      const data = await res.json()
      if (data && data.roles && data.roles.length > 0) {
        return data.roles.map(elem => elem.id)
      }
      else {
        throw { message: gettext('User does not have any roles') }
      }
    }
    catch (error) {
      const alert: Alert = {
        text: gettext('Unable to get user roles'),
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
  }
}
