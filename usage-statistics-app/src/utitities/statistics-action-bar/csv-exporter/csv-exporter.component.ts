import { Component, Input, OnInit } from '@angular/core';
import { gettext } from '@c8y/ngx-components/gettext';
import { MicroserviceStatisticsService, MonthlyMicroserviceProdCategoryMap } from '../../../microservice-statistics/microservice-statistics.service';
import { DATE_FORMAT_MONTH, FeatureList} from '../../../common.service';
import { DeviceStatisticsService } from '../../../device-statistics/device-statistics.service';
import { COLUMN_FIELDS } from '../../../microservice-statistics/microservice-data/microservice-data.service';
import { TenantStatisticsService, TenantSummaryDetailedResources } from '../../../tenant-statistics/tenant-statistics.service';

const moment = require('moment');

/** Quotes a value per RFC 4180 when it contains a separator, quote or line break. */
export function toCsvCell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}


@Component({
  standalone: false,
  selector: 'csv-exporter',
  templateUrl: './csv-exporter.component.html',
  styleUrls: ['./csv-exporter.component.css']
})
export class CsvExporterComponent implements OnInit {
  @Input() feature: string;
  private csvContent: string;
  private dataStore;
  private rows;
  private fileName;

  private disable:boolean = false;
  constructor(
    private deviceStatisticsService: DeviceStatisticsService,
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private tenantStatisticsService: TenantStatisticsService
  ) {}

  ngOnInit(): void {
     if (
      this.feature === FeatureList.DeviceAggregation || 
      this.feature === FeatureList.MicroserviceAggregation  ||
      this.feature === FeatureList.TenantAggregation
    ) {
      this.disable = true;
    }
  }

  downloadCsvData() {
    if (!this.setCSVHeadersAndData()) {
      return;
    }
    this.csvContent = this.rows.map((rowArray) => rowArray.map(toCsvCell).join(",")).join("\r\n") + "\r\n";
    // A Blob instead of an encodeURI'd data: URL, which cut the file off at the first '#'
    const url = URL.createObjectURL(new Blob([this.csvContent], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", this.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /** @returns false when there is no data loaded yet to export */
  private setCSVHeadersAndData(): boolean {
    if (this.feature === FeatureList.DeviceStatistics) {
      this.dataStore = this.deviceStatisticsService.deviceStatisticsDataStore;
      if (!this.dataStore?.deviceData) {
        return false;
      }
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
      if (!this.dataStore?.response) {
        return false;
      }
      this.rows = [[
        COLUMN_FIELDS.MICROSERVICE,
        COLUMN_FIELDS.MEMORY_TOTAL,
        COLUMN_FIELDS.MEMORY_AVG_GIB,
        COLUMN_FIELDS.MEMORY_AVG,
        COLUMN_FIELDS.CPU_TOTAL,
        COLUMN_FIELDS.CPU_AVG,        
        COLUMN_FIELDS.CAUSE       
      ]];
      this.dataStore.response.forEach((elem: MonthlyMicroserviceProdCategoryMap) => {
        this.rows.push([elem.microserviceName, elem.memory, elem.avgMemoryGiB, elem.avgMemory, elem.cpu, elem.avgCpu, elem.cause])
      });
      this.fileName = `microservice_statistics_${moment(this.dataStore.date, DATE_FORMAT_MONTH).format('MMMM-YYYY').split('-').join('_').toLowerCase()}.csv`
    }
    else if (this.feature === FeatureList.TenantStatistics) {
      this.dataStore = this.tenantStatisticsService.tenantSummaryDetailedResourcesStore.data as TenantSummaryDetailedResources;
      if (!this.dataStore) {
        return false;
      }
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
    else {
      return false;
    }
    return true;
  }
}
