import { Component, Input } from '@angular/core';
import { gettext } from '@c8y/ngx-components';
import { MicroserviceStatisticsService, MonthlyMicroserviceProdCategoryMap } from '../../../microservice-statistics/microservice-statistics.service';
import { DATE_FORMAT_MONTH, FeatureList} from '../../../common.service';
import { DeviceStatisticsService } from '../../../device-statistics/device-statistics.service';
import { COLUMN_FIELDS } from '../../../microservice-statistics/microservice-data/microservice-data.service';
import { TenantStatisticsService, TenantSummaryDetailedResources } from '../../../tenant-statistics/tenant-statistics.service';

const moment = require('moment');


@Component({
  selector: 'csv-exporter',
  templateUrl: './csv-exporter.component.html',
  styleUrls: ['./csv-exporter.component.css']
})
export class CsvExporterComponent {
  @Input() feature: string;
  private csvContent: string;
  private dataStore;
  private rows;
  private fileName;

  constructor(
    private deviceStatisticsService: DeviceStatisticsService,
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private tenantStatisticsService: TenantStatisticsService
  ) { }

  downloadCsvData() {
    this.setCSVHeadersAndData();
    this.csvContent = "data:text/csv;charset=utf-8,";
    this.rows.forEach((rowArray) => {
      const row = rowArray.join(",");
      this.csvContent += row + "\r\n";
    });
    const encodedUri = encodeURI(this.csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", this.fileName);
    document.body.appendChild(link);
    link.click();
  }

  private setCSVHeadersAndData() {
    if (this.feature === FeatureList.DeviceStatistics) {
      this.dataStore = this.deviceStatisticsService.deviceStatisticsDataStore;
      this.rows = [[
        gettext('Device ID'),
        gettext('Device type'),
        gettext('Total MEAs'),
        gettext('Average MEAs/day'),
        gettext('Class')
      ]];
      this.dataStore.deviceData.forEach(elem => {
        this.rows.push([elem.deviceId, elem.deviceType, elem.totalMea, elem.avgMea, elem.className])
      });
      this.fileName = `device_statistics_${moment(this.dataStore.date, DATE_FORMAT_MONTH).format('MMMM-YYYY').split('-').join('_').toLowerCase()}.csv`
    }
    else if (this.feature === FeatureList.MicroserviceStatistics) {
      this.dataStore = this.microserviceStatisticsService.microserviceStatisticsDataStore;
      this.rows = [[
        COLUMN_FIELDS.MICROSERVICE,
        COLUMN_FIELDS.MEMORY_TOTAL,
        COLUMN_FIELDS.MEMORY_AVG,
        COLUMN_FIELDS.CPU_TOTAL,
        COLUMN_FIELDS.CPU_AVG,        
        COLUMN_FIELDS.CAUSE       
      ]];
   
      // this.dataStore.response.forEach((elem: MonthlyMicroserviceProdCategoryMap) => {
      //   this.rows.push([elem.microserviceName, elem.avgMemory, elem.cpu, elem.avgCpu, elem.cause])
      // });
      this.fileName = `microservice_statistics_${moment(this.dataStore.date, DATE_FORMAT_MONTH).format('MMMM-YYYY').split('-').join('_').toLowerCase()}.csv`
    }
    else if (this.feature === FeatureList.TenantStatistics) {
      this.dataStore = this.tenantStatisticsService.tenantSummaryDetailedResourcesStore.data as TenantSummaryDetailedResources;
      const date = this.tenantStatisticsService.tenantSummaryDetailedResourcesStore.date;
      
      this.rows = [[
        gettext('Property'),
        gettext('Value')
      ]]

      const totalMea =  this.tenantStatisticsService.getTotalMea(this.dataStore);
      const subscribedApplications = this.dataStore.subscribedApplications ? this.dataStore.subscribedApplications.join(', ') : gettext('No subscribed applications')

      this.rows.push(
        [gettext('Devices'), this.dataStore.deviceCount],
        [gettext('Device Endpoints'), this.dataStore.deviceEndpointCount],
        [gettext('Devices With Children'), this.dataStore.deviceWithChildrenCount],
        [gettext('Total Requests'), this.dataStore.requestCount],
        [gettext('Device Requests'), this.dataStore.deviceRequestCount],
        [gettext('Total Memory (GiB)'), (this.tenantStatisticsService.getTotalMemoryInGiB(this.dataStore.resources.memory))],
        [gettext('Total CPU (CPUs)'), (this.tenantStatisticsService.getTotalCPUs(this.dataStore.resources.cpu))],
        [gettext('Storage Size (MiB)'), (this.tenantStatisticsService.getStorageSizeInMiB(this.dataStore.storageSize))],
        [gettext('Total Resources Created & Updated'), this.dataStore.totalResourceCreateAndUpdateCount],
        [gettext('Inventories Created'), this.dataStore.inventoriesCreatedCount],
        [gettext('Inventories Updated'), this.dataStore.inventoriesUpdatedCount],
        [gettext('Total MEA'), totalMea],
        [gettext('Events Created'), this.dataStore.eventsCreatedCount],
        [gettext('Events Updated'), this.dataStore.eventsUpdatedCount],
        [gettext('Alarms Created'), this.dataStore.alarmsCreatedCount],
        [gettext('Alarms Updated'), this.dataStore.alarmsUpdatedCount],
        [gettext('Measurements Created'), this.dataStore.measurementsCreatedCount],
        [gettext('Subscribed Applications'), subscribedApplications],
      )
      this.fileName = `tenant_statistics_${moment(date, DATE_FORMAT_MONTH).format('MMMM-YYYY').split('-').join('_').toLowerCase()}.csv`
    }
  }
}
