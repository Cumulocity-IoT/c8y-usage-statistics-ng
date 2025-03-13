import { Injectable } from "@angular/core";
import { FetchClient } from "@c8y/client";
import { CommonService } from "../common.service";
import { DeviceConfigurationService } from "./device-configuration/device-configuration.service";
import { MonthPickerService } from "../utitities/statistics-action-bar/month-picker/month-picker.service";
const moment = require('moment')
const _ = require('lodash')
export const DATE_FORMAT_DAY = 'YYYY-MM-DD';

export const CLASS_COLORS = ['#FFBE00', '#119D11', '#00A1F2', '#FF8800', '#E51A1A', '#212121'];

export interface DeviceDataModel {
  deviceId: string,
  count: number,
  deviceType?: string
}
export interface FormattedDeviceDataModel extends DeviceDataModel {
  className: string,
  avgMea: string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceStatisticsService {
  private formattedDeviceDataStore = {};
  private deviceClassDataStore = {};
  private deviceDataStore = {
    statistics: [],
    selectedDate: null
  };
  deviceStatisticsDataStore;

  constructor(
    private client: FetchClient,
    private commonService: CommonService,
    private deviceConfigurationService: DeviceConfigurationService,
    private monthPickerService: MonthPickerService
  ) { }

  async getFormattedDeviceData(selectedDate: Date) {

    const currentConfiguration = this.deviceConfigurationService.defaultConfig;
    const deviceData = await this.getDeviceData(selectedDate);
    
    
      this.formattedDeviceDataStore = {}
      this.deviceClassDataStore = {};
      currentConfiguration.forEach(config => this.deviceClassDataStore[config.className] = {
        threshold: config.monthlyThreshold || Number.POSITIVE_INFINITY,
        total: 0,
        className: config.className,
        deviceIdStore: []
      })

      deviceData.statistics.forEach(device => {
        this.populateFormattedDeviceDataStore(device)
        this.formattedDeviceDataStore[device.deviceId].avgMea =
          +((this.formattedDeviceDataStore[device.deviceId].totalMea / this.monthPickerService.daysInMonth).toFixed(2))
        const avgMea = this.formattedDeviceDataStore[device.deviceId].avgMea

        currentConfiguration.forEach((config, index) => {
          if ((avgMea >= config.avgMinMea && avgMea < config.avgMaxMea) ||
            (index === currentConfiguration.length - 1 && avgMea >= config.avgMinMea)) {
            this.formattedDeviceDataStore[device.deviceId]['className'] = config.className;
            this.deviceClassDataStore[config.className].total += device.count;
            this.deviceClassDataStore[config.className].deviceIdStore.push(device.deviceId);
          }
        })
      })

      this.deviceStatisticsDataStore = {
        deviceData: Object.values(this.formattedDeviceDataStore),
        overview: this.deviceClassDataStore,
        date: selectedDate
      }
    
    return this.deviceStatisticsDataStore
  }

  private populateFormattedDeviceDataStore(device) {
    if (this.formattedDeviceDataStore[device.deviceId]) {
      this.formattedDeviceDataStore[device.deviceId].totalMea += device.count;
    }
    else {
      this.formattedDeviceDataStore[device.deviceId] = {
        totalMea: device.count,
        deviceId: device.deviceId,
        deviceType: device.deviceType
      }
    }
  }


  private async getDeviceData(selectedDate: Date) {
    this.deviceDataStore = { statistics: [], selectedDate: null };
    let api = await this.getDeviceStatisticsUrl('monthly', moment(selectedDate).format(DATE_FORMAT_DAY));
    let statistics = undefined;
    let response = undefined;

    do {
      response = await this.getMonthlyDeviceStatistics(api, selectedDate)
      api = response.next ? response.next.substring(response.next.indexOf('/tenant')) : response.next;
      statistics = response.statistics;
      this.deviceDataStore.statistics.push(...response.statistics)
    }
    while (response.next && statistics && statistics.length)
    this.deviceDataStore.selectedDate = selectedDate;

    return this.deviceDataStore
  }

  private async getDeviceStatisticsUrl(period, duration) {
    return `tenant/statistics/device/${await this.commonService.getCurrentlyActiveTenant()}/${period}/${duration}?pageSize=2000`;
  }

  private async getMonthlyDeviceStatistics(api: string, date: Date) {
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

  public async getMonthlyDeviceAggregation(date: Date):Promise<any> {
    try {
      const options = {
        method: 'GET'
      };
      const response = await this.client.fetch(
        `/service/metrics-aggregator/devices/monthly/${moment(date).format(DATE_FORMAT_DAY)}?includeSubtenants=false`
        , options);
      return (await response).json();
    } catch (err) {
      console.log(err);
    }
  }


  public async getDailyDeviceAggregation(omitCache:boolean):Promise<any> {
    try {
      const options = {
        method: 'GET'
      };
      let url = "/service/metrics-aggregator/devices/dailystatistics";
      if (omitCache) {
        url = url + "?omitCache=true"
      }
      const response = await this.client.fetch(url, options);
      return (await response).json();
    } catch (err) {
      console.log(err);
    }
  }
}
