import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IFetchResponse } from "@c8y/client";
import { AlertService, gettext } from "@c8y/ngx-components";
import { ConfigOptions, Configuration } from "./device-configuration.model";
import { DeviceConfigurationService } from "./device-configuration.service";

@Component({
  selector: "app-device-configuration-list",
  templateUrl: "./device-configuration-list.component.html",
})
export class DeviceConfigurationComponentList {
  data: Configuration[];
  configData: ConfigOptions;
  isLoading = false;

  constructor(
    private deviceConfigService: DeviceConfigurationService,
    private alert: AlertService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getConfigurationOptions();
  }

  /**
   * gets the saved device configuration options.
   * if no saved configuration present, then default configuration is loaded
   */
  async getConfigurationOptions() {
    this.data = await this.deviceConfigService.getConfigurationOptions();    
  }

  /**
   * this function helps to modify the existing device configuration option
   * @param options
   * @returns promise
   */
  async updateConfigurationOptions(options: Configuration[]) {
    try {
      const res = await this.deviceConfigService.setOptions(options);
      if (res && res.status !== 200) {
        const data = res.json ? await res.json() : undefined;
        this.alert.addServerFailure({ data, res });

        return Promise.reject(gettext('Setting device configuration option failed!'));
      } else {
        return Promise.resolve();
      }
    } catch (ex) {
      this.alert.addServerFailure(ex);

      return Promise.reject();
    }
  }

  /**
   * this function resets the configuration to default values
   */
  setDefaultConfiguration() {
    const defaultConfigValue = this.deviceConfigService.defaultConfig;
    this.updateConfigurationOptions(defaultConfigValue);
    this.getConfigurationOptions();
  }

  /**
   * this redirects to configuration details page
   */
  onEdit() {
    this.router.navigateByUrl(`device-statistics/device-configuration-details`);
  }
}
