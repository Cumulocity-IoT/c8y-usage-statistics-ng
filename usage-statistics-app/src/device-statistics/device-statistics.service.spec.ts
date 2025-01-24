import { FetchClient, IFetchResponse } from '@c8y/client';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonService } from './../common.service';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { RouterTestingModule } from '@angular/router/testing';
import { DeviceStatisticsService } from './device-statistics.service';
import { MonthPickerService } from '../utitities/statistics-action-bar/month-picker/month-picker.service';
import { DeviceConfigurationService } from './device-configuration/device-configuration.service';

describe('DeviceStatistics service', () => {
  let service: DeviceStatisticsService;
  let commonService: CommonService;
  let fetchClient: FetchClient;
  let monthPickerService: MonthPickerService;
  let deviceConfiguration: DeviceConfigurationService;

  const commonServiceMock = {
    isSameTenant: jest.fn().mockImplementation(() => Promise.resolve(false)),
    getCurrentlyActiveTenant: jest.fn().mockImplementation(() => Promise.resolve('testing'))
  }
  const fetchClientMock = {
    fetch: jest.fn()
  }
  const MonthPickerServiceMock = {
    daysInMonth: 31
  }
  const DeviceConfigurationServiceMock = {
    previousConfiguration: undefined,
    getConfigurationOptions: jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeviceConfiguration))
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [DeviceStatisticsService,
        { provide: CommonService, useValue: commonServiceMock },
        { provide: FetchClient, useValue: fetchClientMock },
        { provide: MonthPickerService, useValue: MonthPickerServiceMock },
        { provide: DeviceConfigurationService, useValue: DeviceConfigurationServiceMock }
      ]
    })
    service = TestBed.inject(DeviceStatisticsService);
    commonService = TestBed.inject(CommonService);
    fetchClient = TestBed.inject(FetchClient);
    monthPickerService = TestBed.inject(MonthPickerService);
    deviceConfiguration = TestBed.inject(DeviceConfigurationService);

  });
  test('should initialize', () => {
    expect(service).toBeTruthy();
  })

  describe('should call getFormattedDeviceData', () => {
    test('should generate the data format needed for device overview, and device data page', async () => {
      fetchClient.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: jest.fn().mockResolvedValue(mockMonthlyDeviceStatistics),
          res: {} as IFetchResponse
        })
      );
      const response = await service.getFormattedDeviceData(selectedDate);
      expect(response.deviceData).toEqual(mockResponse.deviceData);
      expect(response.overview).toEqual(mockResponse.overview);
    })
    test('should throw an error if the device data is not retrieved and the API call fails', async () => {
      fetchClient.fetch = jest.fn().mockImplementation(() =>
        Promise.reject({
          json: null,
          res: {} as IFetchResponse
        })
      );
      await expect(service.getFormattedDeviceData(selectedDate))
        .rejects
        .toThrow();
    })
  })
});


const today = new Date("30 Dec 2022");
const selectedDate = new Date(today.setMonth(today.getMonth() - 1));
const mockResponse = {
  deviceData: [
    {
      totalMea: 0,
      deviceId: '1234',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 0,
      className: 'Class A'
    },
    {
      totalMea: 1,
      deviceId: '1235',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 0.03,
      className: 'Class A'
    },
    {
      totalMea: 12,
      deviceId: '1236',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 0.39,
      className: 'Class A'
    },
    {
      totalMea: 23,
      deviceId: '1237',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 0.74,
      className: 'Class A'
    },
    {
      totalMea: 24,
      deviceId: '1238',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 0.77,
      className: 'Class A'
    },
    {
      totalMea: 89,
      deviceId: '1239',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 2.87,
      className: 'Class A'
    },
    {
      totalMea: 143,
      deviceId: '1240',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 4.61,
      className: 'Class A'
    },
    {
      totalMea: 144,
      deviceId: '1241',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 4.65,
      className: 'Class A'
    },
    {
      totalMea: 1123,
      deviceId: '1242',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 36.23,
      className: 'Class B'
    },
    {
      totalMea: 1439,
      deviceId: '1243',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 46.42,
      className: 'Class B'
    },
    {
      totalMea: 1440,
      deviceId: '1244',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 46.45,
      className: 'Class B'
    },
    {
      totalMea: 1441,
      deviceId: '1245',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 46.48,
      className: 'Class B'
    },
    {
      totalMea: 8639,
      deviceId: '1246',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 278.68,
      className: 'Class C'
    },
    {
      totalMea: 8640,
      deviceId: '1247',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 278.71,
      className: 'Class C'
    },
    {
      totalMea: 48765,
      deviceId: '1248',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 1573.06,
      className: 'Class D'
    },
    {
      totalMea: 86399,
      deviceId: '1249',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 2787.06,
      className: 'Class D'
    },
    {
      totalMea: 86400,
      deviceId: '1250',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 2787.1,
      className: 'Class D'
    },
    {
      totalMea: 86401,
      deviceId: '1251',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 2787.13,
      className: 'Class D'
    },
    {
      totalMea: 98765,
      deviceId: '1252',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 3185.97,
      className: 'Class D'
    },
    {
      totalMea: 186400,
      deviceId: '1253',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 6012.9,
      className: 'Class D'
    },
    {
      totalMea: 535528,
      deviceId: '1254',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 17275.1,
      className: 'Class E'
    },
    {
      totalMea: 535479,
      deviceId: '1255',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 17273.52,
      className: 'Class E'
    },
    {
      totalMea: 535479,
      deviceId: '1257',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 17273.52,
      className: 'Class E'
    },
    {
      totalMea: 5354478,
      deviceId: '1258',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 172725.1,
      className: 'Class F'
    },
    {
      totalMea: 535479,
      deviceId: '1118135',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 17273.52,
      className: 'Class E'
    },
    {
      totalMea: 535478,
      deviceId: '7167520',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 17273.48,
      className: 'Class E'
    },
    {
      totalMea: 5355428,
      deviceId: '13460137',
      deviceType: 'c8y_MQTTDevice',
      avgMea: 172755.74,
      className: 'Class F'
    }
  ],
  overview: {
    'Class A': {
      threshold: Infinity,
      total: 436,
      className: 'Class A',
      deviceIdStore: [
        '1234', '1235',
        '1236', '1237',
        '1238', '1239',
        '1240', '1241'
      ]
    },
    'Class B': {
      threshold: Infinity,
      total: 5443,
      className: 'Class B',
      deviceIdStore: ['1242', '1243', '1244', '1245']
    },
    'Class C': {
      threshold: Infinity,
      total: 17279,
      className: 'Class C',
      deviceIdStore: ['1246', '1247']
    },
    'Class D': {
      threshold: Infinity,
      total: 593130,
      className: 'Class D',
      deviceIdStore: ['1248', '1249', '1250', '1251', '1252', '1253']
    },
    'Class E': {
      threshold: Infinity,
      total: 2677443,
      className: 'Class E',
      deviceIdStore: ['1254', '1255', '1118135', '1257', '7167520']
    },
    'Class F': {
      threshold: Infinity,
      total: 10709906,
      className: 'Class F',
      deviceIdStore: ['13460137', '1258']
    }
  }
}

const mockDeviceConfiguration = [
  {
    "className": "Class A",
    "avgMinMea": 0,
    "avgMaxMea": 24,
    "monthlyThreshold": null
  },
  {
    "className": "Class B",
    "avgMinMea": 24,
    "avgMaxMea": 144,
    "monthlyThreshold": null
  },
  {
    "className": "Class C",
    "avgMinMea": 144,
    "avgMaxMea": 1440,
    "monthlyThreshold": null
  },
  {
    "className": "Class D",
    "avgMinMea": 1440,
    "avgMaxMea": 8640,
    "monthlyThreshold": null
  },
  {
    "className": "Class E",
    "avgMinMea": 8640,
    "avgMaxMea": 86400,
    "monthlyThreshold": null
  },
  {
    "className": "Class F",
    "avgMinMea": 86400,
    "avgMaxMea": "INFINITY",
    "monthlyThreshold": null
  }
]

const mockMonthlyDeviceStatistics = {
  "next": null,
  "self": "https://t82994.latest.stage.c8y.io/tenant/statistics/device/t82994/monthly/2023-01-01?pageSize=2000&currentPage=1",
  "statistics": [
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 0,
      "deviceId": "1234"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 1,
      "deviceId": "1235"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 12,
      "deviceId": "1236"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 23,
      "deviceId": "1237"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 24,
      "deviceId": "1238"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 89,
      "deviceId": "1239"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 143,
      "deviceId": "1240"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 144,
      "deviceId": "1241"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 1123,
      "deviceId": "1242"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 1439,
      "deviceId": "1243"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 1440,
      "deviceId": "1244"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 1441,
      "deviceId": "1245"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 8639,
      "deviceId": "1246"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 8640,
      "deviceId": "1247"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 48765,
      "deviceId": "1248"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 86399,
      "deviceId": "1249"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 86400,
      "deviceId": "1250"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 86401,
      "deviceId": "1251"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 98765,
      "deviceId": "1252"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 186400,
      "deviceId": "1253"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 535528,
      "deviceId": "1254"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 535479,
      "deviceId": "1255"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 535479,
      "deviceId": "1118135"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 535479,
      "deviceId": "1257"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 5355428,
      "deviceId": "13460137"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 5354478,
      "deviceId": "1258"
    },
    {
      "deviceType": "c8y_MQTTDevice",
      "count": 535478,
      "deviceId": "7167520"
    }
  ]
}