import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceDataComponent } from './device-data.component';
import { DeviceStatisticsService } from '../device-statistics.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Test DeviceDataComponent', () => {
  let component: DeviceDataComponent;
  let fixture: ComponentFixture<DeviceDataComponent>;
  let deviceStatisticsService: DeviceStatisticsService;

  const deviceStatisticsServiceMock = {
    getFormattedDeviceData: jest.fn(),
}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot(), BrowserAnimationsModule],
      declarations: [DeviceDataComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DeviceStatisticsService, useValue: deviceStatisticsServiceMock },
    ]
    });
    fixture = TestBed.createComponent(DeviceDataComponent);
    component = fixture.componentInstance;
    deviceStatisticsService = TestBed.inject(DeviceStatisticsService);
  });

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

  test('should call getFormattedDeviceData from service', async () => {
    fixture.detectChanges();
    const getFormattedDeviceDataSpy = jest.spyOn(deviceStatisticsService, 'getFormattedDeviceData');
    expect(getFormattedDeviceDataSpy).toHaveBeenCalled();
  });

  test('should give correct device data response', async() => {
    fixture.detectChanges();
    let today = new Date("01 Jan 2023");
    const selectedDate = new Date(today.setMonth(today.getMonth() - 1));
    const mockResponse = {
      'date': selectedDate,
      'deviceData': [
          {
              "totalMea": 1071056,
              "deviceId": "62948",
              "deviceType": "c8y_MQTTDevice",
              "avgMea": 34550.19,
              "className": "Class E"
          },
          {
              "totalMea": 1070958,
              "deviceId": "1118134",
              "deviceType": "c8y_MQTTDevice",
              "avgMea": 34547.03,
              "className": "Class E"
          },
          {
              "totalMea": 1070958,
              "deviceId": "1118135",
              "deviceType": "c8y_MQTTDevice",
              "avgMea": 34547.03,
              "className": "Class E"
          },
          {
          "totalMea": 1070958,
              "deviceId": "1118136",
              "deviceType": "c8y_MQTTDevice",
              "avgMea": 34547.03,
              "className": "Class E"
          },
          {
              "totalMea": 1070956,
              "deviceId": "1118138",
              "deviceType": "c8y_MQTTDevice",
              "avgMea": 34546.97,
              "className": "Class E"
          }
      ],
      'overview': {
          "Class A": {
              "threshold": null,
              "total": 0,
              "className": "Class A",
              "deviceIdStore": []
          },
          "Class B": {
              "threshold": null,
              "total": 0,
              "className": "Class B",
              "deviceIdStore": []
          },
          "Class C": {
              "threshold": null,
              "total": 0,
              "className": "Class C",
              "deviceIdStore": []
          },
          "Class D": {
              "threshold": null,
              "total": 0,
              "className": "Class D",
              "deviceIdStore": []
          },
          "Class E": {
              "threshold": null,
              "total": 3748449,
              "className": "Class E",
              "deviceIdStore": [
                  "62948",
                  "1118136",
                  "1118135",
              ]
          },
          "Class F": {
              "threshold": null,
              "total": 0,
              "className": "Class F",
              "deviceIdStore": []
          }
      }
    };
    jest.spyOn(deviceStatisticsService, 'getFormattedDeviceData').mockImplementation(()=>Promise.resolve(mockResponse))
    await component.getDeviceData(selectedDate);
    expect(component.deviceData).toEqual(mockResponse.deviceData);
  });
});