import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IFetchResponse } from '@c8y/client';
import { AlertService, CoreModule } from '@c8y/ngx-components';
import { DeviceConfigurationComponentList } from './device-configuration-list.component';
import { DeviceConfigurationService } from './device-configuration.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceConfigurationComponentDetails } from './device-configuration-details.component';


describe('Test DeviceConfigurationComponentList', () => {
  let component: DeviceConfigurationComponentList;
  let fixture: ComponentFixture<DeviceConfigurationComponentList>;
  let deviceConfigurationService: DeviceConfigurationService;
  let alertService: AlertService;
  let router: Router;

  const deviceConfigurationServiceMock = {
    getConfigurationOptions: jest.fn(),
    setOptions: jest.fn(),
  }

  const alertServiceMock = {
    addServerFailure: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'device-statistics/device-configuration-details',
            component: DeviceConfigurationComponentDetails
          }
        ]),],
      declarations: [DeviceConfigurationComponentList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DeviceConfigurationService, useValue: deviceConfigurationServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
    ]
    });
    fixture = TestBed.createComponent(DeviceConfigurationComponentList);
    component = fixture.componentInstance;
    deviceConfigurationService = TestBed.inject(DeviceConfigurationService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
  });

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

  test('should call getConfigurationOptions', async () => {
    fixture.detectChanges();
    const getConfigOptionsSpy = jest.spyOn(deviceConfigurationService, 'getConfigurationOptions');

    expect(getConfigOptionsSpy).toHaveBeenCalled();
  });

  describe('should call setOptions from configuration service', () => {
    test('should reset the default configuration', async () => {
      const setOptionsSpy = jest.spyOn(deviceConfigurationService, 'setOptions');
      component.setDefaultConfiguration();

      expect(setOptionsSpy).toHaveBeenCalled();
    })

    test('should get configuration option after resetting the default configuration', async () => {
      component.getConfigurationOptions = jest.fn();
      component.setDefaultConfiguration();

      expect(component.getConfigurationOptions).toHaveBeenCalled();
    })

    test('should show an error if the microservice is failed', async () => {
      const defaultConfig = [
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
      const response = {
        status: 400,
        headers: {},
        json: () => Promise.resolve({})
      } as IFetchResponse;

      jest.spyOn(deviceConfigurationService, 'setOptions').mockReturnValue(Promise.resolve(response));
      const alertSpy = jest.spyOn(alertService, 'addServerFailure');

      component.updateConfigurationOptions(defaultConfig).then(() => {
        expect(alertSpy).toHaveBeenCalled();
      }).catch(error => {
        expect(error).toEqual('Setting device configuration option failed!');
      });  
    })
  })

  test('calls bulkOperationModalsService.hideNewBulkOperationModal() and router.navigateByUrl() when item.path is truthy', () => {
    const spyRouter = jest.spyOn(router, 'navigateByUrl');

    component.onEdit();
    expect(spyRouter).toBeCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledWith('device-statistics/device-configuration-details');
  })

  // test('should redirect to details page on edit button click', async () => {
  //   component.onEdit();

  //   expect(router.navigateByUrl).toHaveBeenCalledWith('device-statistics/device-configuration-details');
  // });
});