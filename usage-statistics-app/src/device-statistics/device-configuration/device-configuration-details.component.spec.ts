import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, CoreModule, GainsightService } from '@c8y/ngx-components';
import { DeviceConfigurationComponentDetails } from './device-configuration-details.component';
import { DeviceConfigurationService } from './device-configuration.service';

describe('Test DeviceConfigurationComponentDetails', () => {
  let component: DeviceConfigurationComponentDetails;
  let fixture: ComponentFixture<DeviceConfigurationComponentDetails>;
  let deviceConfigurationService: DeviceConfigurationService;
  let alertService: AlertService;
  let router: Router;
  let fb: FormBuilder;
  let gainsightService: GainsightService;
  let defaultConfig;
  let configurationForm;
  let configControls;

  const deviceConfigurationServiceMock = {
    getConfigurationOptions: jest.fn(),
    setOptions: jest.fn(),
  }

  const alertServiceMock = {
    addServerFailure: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot()],
      declarations: [DeviceConfigurationComponentDetails],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DeviceConfigurationService, useValue: deviceConfigurationServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
    ]
    });
    fixture = TestBed.createComponent(DeviceConfigurationComponentDetails);
    component = fixture.componentInstance;
    deviceConfigurationService = TestBed.inject(DeviceConfigurationService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
    fb = TestBed.inject(FormBuilder),
    gainsightService = TestBed.inject(GainsightService)
  });

  beforeEach(() => {
    defaultConfig = [
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
    configurationForm = fb.group({
      configurations: fb.array(
        defaultConfig.map((config) => createConfiguration(config))
      ),
    });
  })

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('should get configuration option' , () => {
    
    test('should call get configuration option funtion on init', () => {
      fixture.detectChanges();
      
      jest.spyOn(component, 'getConfigurationOptions');
      jest.spyOn(deviceConfigurationService, 'getConfigurationOptions').mockResolvedValue(defaultConfig);

      component.ngOnInit();

      expect(component.getConfigurationOptions).toHaveBeenCalled();
    })

    test('should call getConfigurationOptions from service page if not present in deviceStatisticsConfigurationStore', () => {
      jest.spyOn(deviceConfigurationService, 'getConfigurationOptions');
      component.getConfigurationOptions();
      expect(deviceConfigurationService.getConfigurationOptions).toHaveBeenCalled();

    })
  })

  describe('should verify the validations', () => {
    beforeEach(() => {
      configControls = configurationForm.controls["configurations"];
      component.configurationForm = configurationForm;
      component.configControls = configControls;
    })

    test('should give customMin error when max mea value is negative', () => {
      component.configControls["controls"][0].value.avgMaxMea = -5 ;
      component.configurationForm.updateValueAndValidity();
      component.isValidValue();
      let avgMaxMeaError = configControls['controls'][0].get('avgMaxMea').errors;
      expect(avgMaxMeaError).toEqual({'customMin': true});
    })

    test('should give greaterMax error when max mea of one row is greater than max mea of next row', () => {
      /*setting first row max value to 500 will make it greater than second row's default max value 144, there by giving error*/
      component.configControls['controls'][0].get('avgMaxMea').value = 500;
      component.configurationForm.updateValueAndValidity();
      component.isValidValue();
      let avgMaxMeaError = configControls['controls'][0].get('avgMaxMea').errors;
      expect(avgMaxMeaError).toEqual({'greaterMax': true});
    })

    test('should give greaterMin error when min mea is greater than max mea', () => {
      component.configControls["controls"][0].value.avgMinMea = 100;
      component.configControls["controls"][0].value.avgMaxMea = 10;
      component.configurationForm.updateValueAndValidity();
      component.isValidValue();
      let avgMaxMeaError = configControls['controls'][0].get('avgMaxMea').errors;
      expect(avgMaxMeaError).toEqual({'greaterMin': true});
    })

    test('should disable save button if validation of the form fails', () => {
      component.configControls["controls"][0].value.avgMaxMea = -5 ;
      component.configurationForm.updateValueAndValidity();
      component.isValidValue();
      component.formArrayValidator();

      expect(component.errors.length).toEqual(1);
      expect(component.isSaveEnabled).toEqual(false);
    })

    test('save button should be disabled on load', () => {
      component.configurationForm.updateValueAndValidity();
      component.isValidValue();
      component.formArrayValidator();
      expect(component.errors.length).toEqual(0);
      expect(component.isSaveEnabled).toEqual(false);
    })
  })

  function createConfiguration(config): FormGroup {
    const formgroupConfig = fb.group(
      {
        className: [config.className],
        avgMinMea: [config.avgMinMea],
        avgMaxMea: [config.avgMaxMea],
        monthlyThreshold: [config.monthlyThreshold],
      }
    );
  
    return formgroupConfig;
  }
})

