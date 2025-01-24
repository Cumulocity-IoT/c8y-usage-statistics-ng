import { FetchClient } from '@c8y/client';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonService } from './../common.service';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { RouterTestingModule } from '@angular/router/testing';
import { MonthPickerService } from '../utitities/statistics-action-bar/month-picker/month-picker.service';

import { TenantStatisticsService } from './tenant-statistics.service';


describe('DeviceStatistics service', () => {
    let service: TenantStatisticsService;
    let commonService: CommonService;

    const commonServiceMock = {
        handleResponse: jest.fn(),
        getCurrentTenantSummary: jest.fn()
    }
    const fetchClientMock = {
        fetch: jest.fn()
    }
    const MonthPickerServiceMock = {
        handleResponse: jest.fn()
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
            providers: [TenantStatisticsService,
                { provide: CommonService, useValue: commonServiceMock },
                { provide: FetchClient, useValue: fetchClientMock },
                { provide: MonthPickerService, useValue: MonthPickerServiceMock }
            ]
        })
        service = TestBed.inject(TenantStatisticsService);
        commonService = TestBed.inject(CommonService);
    });
    test('should initialize', () => {
        expect(service).toBeTruthy();
    })

    describe('should call getTenantSummaryDetailedResources', () => {
        test('should get the tenant summary data', async () => {
            jest.spyOn(commonService, 'getCurrentTenantSummary').mockImplementation(() => Promise.resolve(mockResponse))
            const response = await service.getTenantSummaryDetailedResources(selectedDate);
            expect(response).toEqual(tenantSummaryResponse);
        })

        test('should report a message if Microservice data is not available', async () => {
            jest.spyOn(commonService, 'getCurrentTenantSummary').mockImplementation(() => Promise.resolve(null))
            const expectMessage = async function () {
                await service.getTenantSummaryDetailedResources(selectedDate)
            }
            await expect(expectMessage()).rejects.toMatchObject({ "message": "Microservice data is not available" })
        })

        test('getStorageSizeInMiB converts a value passed to its mib form', () => {
            const res = service.getStorageSizeInMiB(10000000)
            expect(res).toEqual('9.54')
        })
        test('getTotalMemoryInGiB converts a value passed to its gib form', () => {
            const res = service.getTotalMemoryInGiB(10000000)
            expect(res).toEqual('9313.24')
        })

        test('getTotalCPUs gets total cpu count in 1000s', () => {
            const res = service.getTotalCPUs(10000000)
            expect(res).toEqual('10000.00')
        })
        test('getTotalMea returns total mea accurately', () => {
            const res = service.getTotalMea(tenantSummaryResponse);
            expect(res).toBe(2631)

        })
    })
});


const today = new Date("01 Jan 2023");
const selectedDate = new Date(today.setMonth(today.getMonth() - 1));
const mockResponse = {
    "deviceEndpointCount": 55580,
    "deviceWithChildrenCount": 55580,
    "inventoriesUpdatedCount": 58,
    "eventsUpdatedCount": 1234,
    "day": "2023-08-04T00:00:00.000Z",
    "requestCount": 629381,
    "deviceCount": 55580,
    "resources": {
        "memory": 0,
        "cpu": 0,
        "usedBy": []
    },
    "deviceRequestCount": 2620,
    "eventsCreatedCount": 13,
    "subscribedApplications": [
        "cep"
    ],
    "alarmsCreatedCount": 100,
    "alarmsUpdatedCount": 50,
    "inventoriesCreatedCount": 0,
    "measurementsCreatedCount": 1234,
    "storageSize": 10495300904,
    "self": "http://billing.latest.stage.c8y.io/tenant/statistics/summary",
    "totalResourceCreateAndUpdateCount": 71
}

const tenantSummaryResponse = JSON.parse(JSON.stringify(mockResponse))
tenantSummaryResponse.resources.usedBy = null

