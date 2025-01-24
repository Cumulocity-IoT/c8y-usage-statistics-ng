import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AlertService, GainsightService, gettext } from "@c8y/ngx-components";
import { Configuration } from "./device-configuration.model";
import { DeviceConfigurationService } from "./device-configuration.service";

@Component({
  selector: "app-device-configuration-details",
  templateUrl: "./device-configuration-details.component.html",
  styleUrls: ['./device-configuration-details.component.css']
})
export class DeviceConfigurationComponentDetails implements OnInit {
  configData: Configuration[];
  errors = [];
  isLoading = true;
  isSaveEnabled = false;
  configControls: AbstractControl;

  configurationListForm = this.fb.group({
    className: new FormControl("", [Validators.required]),
    avgMinMea: new FormControl("", [Validators.required, Validators.min(0)]),
    avgMaxMea: new FormControl("", [Validators.min(0)]),
    monthlyThreshold: new FormControl(""),
  });
 
  configurationForm: any = this.fb.group({
    configurations: this.fb.array([]),
  });

  constructor(
    private deviceConfigService: DeviceConfigurationService,
    private fb: FormBuilder,
    private router: Router,
    private alert: AlertService,
    private gainsightService: GainsightService
  ) {}

  ngOnInit(): void {
    this.getConfigurationOptions();
  }

  /**
   * gets the saved configuration values from deviceStatisticsConfigurationStore
   * if not present in the store, then fetch it using the service
   */
  async getConfigurationOptions() {
    this.configData =
      this.deviceConfigService.deviceStatisticsConfigurationStore ||
      (await this.deviceConfigService.getConfigurationOptions());

    this.configurationForm = this.fb.group({
      configurations: this.fb.array(
        this.configData.map((config) => this.createConfiguration(config))
      ),
    });
  }

  /**
   * determines if current avg max mea value is a valid value
   * below are some invalid scenarios:
   * current avg max mea value < 0 -> invalid
   * current avg max mea value >= next row's avg max mea value -> invalid
   * current avg min mea value >= current avg max mea value -> invalid
   */
   isValidValue() {
    let nextMax = '';
    for (let j = 0; j < this.configControls.value.length-1; j++) {
      const valueControlMin = this.configControls["controls"][j].value.avgMinMea;
      const valueControlMax = this.configControls["controls"][j].value.avgMaxMea;
      const currentMaxValue = this.configControls?.['controls'][j].get('avgMaxMea').value;
      this.configurationForm?.controls?.configurations?.['controls'][j+1].get('avgMinMea').setValue(currentMaxValue);
      nextMax = this.configControls["controls"][j+1].value.avgMaxMea;
      if ( valueControlMax < 0) {
        this.configControls?.['controls'][j].get('avgMaxMea').setErrors({ 'customMin': true });
        this.errors.push({ customMin: true });
      } else if (currentMaxValue >= nextMax) {
        this.configControls?.['controls'][j].get('avgMaxMea').setErrors({'greaterMax': true});
        this.errors.push({ greaterMax: true });
      } else if (valueControlMin >= valueControlMax) {
        this.configControls?.['controls'][j].get('avgMaxMea').setErrors({'greaterMin': true});
        this.errors.push({ greaterMin: true });
      } else {
        this.configControls?.['controls'][j].get('avgMaxMea').setErrors(null);
      }
    }
  }

  duplicateClassnameValidate(className : string, index: number) {
    for (let j = 0; j < this.configControls.value.length-1; j++) {
      const currentClassname = this.configControls?.['controls'][j].get('className').value;
      if (className === currentClassname && index !== j) {
        this.configControls?.['controls'][index].get('className').setErrors({'invalidClassname': true});
        return;
      } else {
        this.configControls?.['controls'][index].get('className').setErrors(null);
        this.configControls?.['controls'][j].get('className').setErrors(null);
      }
    }
  }

  /**
   * creates formgroup with the obtained result from the store variable/get service call
   * @param config row of configuration values obtained from store variable/get service call
   * @returns formgroup
   */
  createConfiguration(config): FormGroup {
    const formgroupConfig = this.fb.group(
      {
        className: [config.className],
        avgMinMea: [config.avgMinMea],
        avgMaxMea: [config.avgMaxMea],
        monthlyThreshold: [config.monthlyThreshold],
      },
      { validators: this.formArrayValidator() }
    );

    return formgroupConfig;
  }

  /**
   * checks if threshold value is less than 0
   * also disables save button when error occurs
   * @returns error in key value pair or null
   */
  formArrayValidator(): ValidatorFn {
    const a = this.configurationForm.controls["configurations"];
    return (a: AbstractControl): ValidationErrors | null => {
      this.configControls = this.configurationForm?.controls["configurations"];

      for (let i = 0; i < this.configControls.value.length; i++) {
        const monthlyThreshold =
          this.configControls["controls"][i].value.monthlyThreshold;
        if (monthlyThreshold && monthlyThreshold < 0) {
          this.isSaveEnabled = false; // disable save button
          return { invalidThreshold: true };
        } else {
          this.isSaveButtonEnabled();
        }
      }
      // when "errors" array is not empty, disable save button
      if (this.errors.length !== 0 || !this.configurationForm.dirty) {
        this.isSaveEnabled = false;
      } else {
        this.isSaveEnabled = true;
      }
      return null;
    };
  }

  /**
   * this function determines if save button is enabled or not
   * if user enters invalid value, "errors" array will not be empty
   */
  isSaveButtonEnabled() {
    const configurationControls = this.configControls["controls"];
    this.errors = [];
    for (let i = 0; i < configurationControls.length; i++) {
      if (
        configurationControls &&
        configurationControls[i] &&
        (configurationControls[i]["controls"]?.avgMinMea.errors ||
          configurationControls[i]["controls"]?.avgMaxMea.errors)
      ) {
        this.errors.push({ invalid: true });
      }
    }
  }

  /**
   * getter function to get configuration details
   */
  get configurations() {
    return this.configurationForm.controls["configurations"] as FormArray;
  }

  /**
   * Resets the values to default ones and
   * redirects to the main list page
   */
  resetToDefault() {
    this.gainsightService.triggerEvent(
      "usageStatistics",
      { action: "reset", name: "DeviceConfigurationReset" }
    );
    const defaultConfigValue = this.deviceConfigService.defaultConfig;
    this.deviceConfigService
      .setOptions(defaultConfigValue)
      .then(() => {
        this.alert.success(gettext('Device class configuration values are reset to default values.'));
        this.onCancel()
      });
  }

  /**
   * Sorts the records according to avg min mea value.
   * In future when we provide functionality for adding
   * new rows,this will help in getting the rows in
   * sequential manner after saving.
   */
  onSubmit() {
    this.gainsightService.triggerEvent(
      "usageStatistics",
      { action: "save", name: "DeviceConfigurationSave" }
    );
    const value = this.configurations.value;
    const sortedValues = value.sort((a, b) => a.avgMinMea - b.avgMinMea);
    this.save(sortedValues);
  }

  /**
   * saves the configuration values to the service
   * @param options sorted configuration values
   * @returns status code
   */
  async save(options: Configuration[]) {
    try {
      const res = await this.deviceConfigService.setOptions(options);
      if (res && res.status !== 200) {
        const data = res.json ? await res.json() : undefined;
        this.alert.danger(gettext('Could not update device class configuration'), data);
        return Promise.reject();
      } else {
        this.alert.success(gettext('Device class configuration values are updated successfully.'));
        this.onCancel();
        return Promise.resolve();
      }
    } catch (ex) {
      this.alert.danger(gettext('Could not update device class configuration'), ex);
      return Promise.reject();
    }
  }

  /**
   * onCancel, go back to the list of configurations saved
   */
  onCancel() {
    this.router.navigateByUrl(`device-statistics/device-configuration-list`);
  }
}
