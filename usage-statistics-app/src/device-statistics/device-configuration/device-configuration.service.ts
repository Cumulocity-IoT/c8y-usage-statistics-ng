import { Injectable } from "@angular/core";
import { FetchClient, IFetchOptions, IFetchResponse, IResult } from "@c8y/client";
import { Configuration } from "./device-configuration.model";

@Injectable({
  providedIn: "root",
})
export class DeviceConfigurationService {
  private readonly microserviceUrl: string = "/tenant/options";
  private readonly header: any = { "Content-Type": "application/json" };

  defaultConfig: Configuration[];
  deviceStatisticsConfigurationStore: Configuration[];
  previousConfiguration: Configuration[];

  constructor(private client: FetchClient) {
    this.defaultConfig = [
      {
        className: "Class A",
        avgMinMea: 0,
        avgMaxMea: 24,
        monthlyThreshold: null,
      },
      {
        className: "Class B",
        avgMinMea: 24,
        avgMaxMea: 144,
        monthlyThreshold: null,
      },
      {
        className: "Class C",
        avgMinMea: 144,
        avgMaxMea: 1440,
        monthlyThreshold: null,
      },
      {
        className: "Class D",
        avgMinMea: 1440,
        avgMaxMea: 8640,
        monthlyThreshold: null,
      },
      {
        className: "Class E",
        avgMinMea: 8640,
        avgMaxMea: 86400,
        monthlyThreshold: null,
      },
      {
        className: "Class F",
        avgMinMea: 86400,
        avgMaxMea: "INFINITY",
        monthlyThreshold: null,
      },
    ];
    this.deviceStatisticsConfigurationStore = this.defaultConfig;
  }

  async getConfigurationOptions() {
    //const response = await this.getOptions();
    // this.previousConfiguration = this.deviceStatisticsConfigurationStore;
    // this.deviceStatisticsConfigurationStore = JSON.parse(response.data.value);
    return this.deviceStatisticsConfigurationStore;
  }

  async getOptions(): Promise<IResult<any>> {
    const options: IFetchOptions = {
      method: "GET",
      headers: this.header,
    };
    const option = {
      category: "configuration",
      key: "device.statistics.class.details",
    };

    const url = `${this.microserviceUrl}/${option.category}/${option.key}`;

    const res = await this.client.fetch(url, options);
    let data = await res.json();
    if (res.status !== 200) {
      await this.setOptions(this.defaultConfig);
      data.value = JSON.stringify(this.defaultConfig);
     }

    return { res, data };
  }

  async setOptions(configValues: Configuration[]): Promise<IFetchResponse> {
    const configData = {
      category: "configuration",
      key: "device.statistics.class.details",
      value: JSON.stringify(configValues),
    };
    const options: IFetchOptions = {
      method: "POST",
      headers: this.header,
      body: JSON.stringify(configData),
    };
    return await this.client.fetch(`${this.microserviceUrl}`, options);
  }
}
