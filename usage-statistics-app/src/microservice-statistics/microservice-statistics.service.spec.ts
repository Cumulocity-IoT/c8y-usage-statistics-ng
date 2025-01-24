import { FetchClient } from '@c8y/client';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonService } from './../common.service';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { RouterTestingModule } from '@angular/router/testing';
import { MonthPickerService } from '../utitities/statistics-action-bar/month-picker/month-picker.service';

import { MicroserviceStatisticsService } from './microservice-statistics.service';
import { MicroserviceConfigurationService } from './microservice-configuration/microservice-configuration.service';




describe('DeviceStatistics service', () => {
    let service: MicroserviceStatisticsService;
    let commonService: CommonService;
    let monthPicker: MonthPickerService;
    let microserviceConfigurationService: MicroserviceConfigurationService;

    const CommonServiceMock = {
        getCurrentTenantSummary: jest.fn().mockImplementation(() => Promise.resolve(mockCurrentTenantSummary))
    }

    const MonthPickerServiceMock = {
        handleResponse: jest.fn()
    }

    const MicroserviceConfigurationServiceMock = {
        getCategories: jest.fn()
            .mockImplementationOnce(() => Promise.resolve(mockProductCategories))
            .mockImplementationOnce(() => Promise.resolve(mockMicroserviceCategories))
    }
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
            providers: [MicroserviceStatisticsService,
                { provide: CommonService, useValue: CommonServiceMock },
                { provide: MonthPickerService, useValue: MonthPickerServiceMock },
                { provide: MicroserviceConfigurationService, useValue: MicroserviceConfigurationServiceMock },
            ]
        })
        service = TestBed.inject(MicroserviceStatisticsService);
        commonService = TestBed.inject(CommonService);
        monthPicker = TestBed.inject(MonthPickerService);
        microserviceConfigurationService = TestBed.inject(MicroserviceConfigurationService);
    });
    test('should initialize', () => {
        expect(service).toBeTruthy();
    })

    describe('should call getMonthlyMicroserviceProdCategoryMap', () => {
        test('should generate the microservice &product category map needed for microservice statistics field', async () => {
            const response = await service.getMonthlyMicroserviceProdCategoryMap(selectedDate);
            expect(response).toEqual(mockResponse);
        })
    })
});

const today = new Date("01 Jan 2023");
const selectedDate = new Date(today.setMonth(today.getMonth() - 1));

const mockProductCategories = [
    {
        "productCategory": "Product Services",
        "isPreconfigured": true,
        "isDefault": false,
        "categoryType": "PreConfigured",
        "isEditable": false,
        "cpuThreshold": 0,
        "memoryThreshold": 0
    },
    {
        "productCategory": "Streaming Analytics",
        "isPreconfigured": true,
        "isDefault": false,
        "categoryType": "PreConfigured",
        "isEditable": false,
        "cpuThreshold": 0,
        "memoryThreshold": 0
    },
    {
        "productCategory": "Machine Learning",
        "isPreconfigured": true,
        "isDefault": false,
        "categoryType": "PreConfigured",
        "isEditable": false,
        "cpuThreshold": 0,
        "memoryThreshold": 0
    },
    {
        "productCategory": "Custom Microservices",
        "isPreconfigured": true,
        "isDefault": true,
        "categoryType": "Default",
        "isEditable": false,
        "cpuThreshold": 0,
        "memoryThreshold": 0
    }
]
const mockMicroserviceCategories = [
    {
        "microserviceName": "actility",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "administration",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "Apama EPL Apps",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "Apama Analytics Builder",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "apama-ctrl-starter",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "billwerk-agent-server",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "cep",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "cloud-remote-access",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "cockpit",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "connectivity-agent-server",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "datahub",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "device-simulator",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "devicemanagement",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "feature-branding",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "feature-broker",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "feature-fieldbus4",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "feature-microservice-hosting",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "feature-user-hierarchy",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "lwm2m-agent",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "opcua-mgmt-service",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "report-agent",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "smartrule",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "sms-gateway",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "sslmanagement",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "apama",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "cellid",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "datahub-webapp",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "loriot-agent",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "remote-access-agent-echo",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "retention",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "sigfox-agent",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "smartgroup",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "sslmonitor-agent-server",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "tenant-configuration",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "tenant-sla-monitoring-agent-server",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "oee-bundle",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "apama-oeeapp",
        "productCategory": "Product Services"
    },
    {
        "microserviceName": "zementis",
        "productCategory": "Machine Learning"
    },
    {
        "microserviceName": "mlw",
        "productCategory": "Machine Learning"
    },
    {
        "microserviceName": "nyoka",
        "productCategory": "Machine Learning"
    },
    {
        "microserviceName": "test",
        "productCategory": "Custom Microservices"
    }
]

const mockCurrentTenantSummary = {
    "deviceEndpointCount": 43493,
    "deviceWithChildrenCount": 43493,
    "inventoriesUpdatedCount": 15249,
    "eventsUpdatedCount": 54,
    "day": "2023-08-20T00:00:00.000Z",
    "requestCount": 3013316,
    "deviceCount": 43493,
    "deviceRequestCount": 943,
    "resources": {
        "memory": 304793,
        "cpu": 158876,
        "usedBy": [
            {
                "memory": 31000,
                "name": "billing-fetcher-one",
                "cpu": 31000,
                "cause": "Subscribed"
            },
            {
                "memory": 133145,
                "name": "apama-ctrl-1c-4g",
                "cpu": 31000,
                "cause": "Subscribed"
            },
            {
                "memory": 62000,
                "name": "billing-aggregation",
                "cpu": 31000,
                "cause": "Subscribed"
            },
            {
                "memory": 31001,
                "name": "billing-fetcher",
                "cpu": 31001,
                "cause": "Subscribed"
            },
            {
                "memory": 31000,
                "name": "billing-reporter",
                "cpu": 31000,
                "cause": "Subscribed"
            },
            {
                "memory": 16647,
                "name": "datahub",
                "cpu": 3875,
                "cause": "Subscribed"
            }
        ]
    },
    "storageLimitPerDevice": 0,
    "eventsCreatedCount": 276219,
    "subscribedApplications": [
        "Streaming Analytics",
        "report-agent",
        "billing-fetcher-one",
        "administration",
        "apama-ctrl-1c-4g",
        "feature-microservice-hosting",
        "device-simulator",
        "feature-cep-custom-rules",
        "datahub",
        "dtm",
        "Digital Twin Manager",
        "feature-branding",
        "devicemanagement",
        "DataHub",
        "billing-aggregation",
        "billing-fetcher",
        "billing-reporter",
        "smartrule",
        "cockpit"
    ],
    "alarmsCreatedCount": 3336,
    "alarmsUpdatedCount": 0,
    "inventoriesCreatedCount": 512,
    "storageSize": 16128979090,
    "measurementsCreatedCount": 4194746,
    "self": "https://billing.cumulocity.com/tenant/statistics/summary",
    "totalResourceCreateAndUpdateCount": 4490116
}
const mockResponse = [
    {
        name: 'billing-fetcher-one',
        cpu: 31000,
        memory: 31000,
        cause: 'Subscribed',
        productCategory: 'Custom Microservices',
        microserviceName: 'billing-fetcher-one',
        avgCpu: '1.00',
        avgMemory: '0.93'
    },
    {
        name: 'apama-ctrl-1c-4g',
        cpu: 31000,
        memory: 133145,
        cause: 'Subscribed',
        productCategory: 'Custom Microservices',
        microserviceName: 'apama-ctrl-1c-4g',
        avgCpu: '1.00',
        avgMemory: '4.00'
    },
    {
        name: 'billing-aggregation',
        cpu: 31000,
        memory: 62000,
        cause: 'Subscribed',
        productCategory: 'Custom Microservices',
        microserviceName: 'billing-aggregation',
        avgCpu: '1.00',
        avgMemory: '1.86'
    },
    {
        name: 'billing-fetcher',
        cpu: 31001,
        memory: 31001,
        cause: 'Subscribed',
        productCategory: 'Custom Microservices',
        microserviceName: 'billing-fetcher',
        avgCpu: '1.00',
        avgMemory: '0.93'
    },
    {
        name: 'billing-reporter',
        cpu: 31000,
        memory: 31000,
        cause: 'Subscribed',
        productCategory: 'Custom Microservices',
        microserviceName: 'billing-reporter',
        avgCpu: '1.00',
        avgMemory: '0.93'
    },
    {
        name: 'datahub',
        cpu: 3875,
        memory: 16647,
        cause: 'Subscribed',
        productCategory: 'Product Services',
        microserviceName: 'datahub',
        avgCpu: '0.13',
        avgMemory: '0.50'
    }
]
