import { FetchClient, IFetchResponse, TenantService } from '@c8y/client';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonService } from './common.service';
import { TestBed } from '@angular/core/testing';
import { AlertService, CoreModule } from '@c8y/ngx-components';
import { RouterTestingModule } from '@angular/router/testing';
import { mockSubTenantListResponse, mockTenantStatsSummaryResponse } from './mock-data';

const mockCurrentTenant = {
    data: {
        name: 'test'
    },
}

describe('Common service test', () => {
    let service: CommonService;
    let tenantService: TenantService;
    let client: FetchClient;
    let alertService: AlertService;

    const tenantServiceMock = {
        current: jest.fn().mockImplementation(
            () => Promise.resolve(mockCurrentTenant)
        )
    }

    const fetchClientMock = {
        fetch: jest.fn()
    }

    const alertServiceMock = {
        add: jest.fn()
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
            providers: [CommonService, 
                { provide: TenantService, useValue: tenantServiceMock },
                { provide: FetchClient, useValue: fetchClientMock },
                { provide: AlertService, useValue: alertServiceMock },
            ]
        })
        service = TestBed.inject(CommonService);
        tenantService = TestBed.inject(TenantService);
        client = TestBed.inject(FetchClient);
        alertService = TestBed.inject(AlertService);

    })
    test('should initialize', () => {
        expect(service).toBeTruthy();
    })

    describe('common service tests', () => {
        test('should retrieve correct tenant name', async () => {
            expect(await service.getSourceTenant()).toEqual('test');
        });
        test('should get the tenant summary data', async () => {
            const today = new Date("01 Jan 2023");
            const selectedDate = new Date(today.setMonth(today.getMonth() - 1));
            const mockResponse = mockTenantStatsSummaryResponse;
            client.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    json: jest.fn().mockResolvedValue(mockResponse),
                    res: {} as IFetchResponse
                })
            );
            const responseAllTenants = await service.getAllTenantSummary(selectedDate);
            expect(responseAllTenants).toEqual(mockResponse);

            const responseCurrentTenants = await service.getCurrentTenantSummary(selectedDate); 
            expect(responseCurrentTenants).toEqual(mockResponse);
        })
        test('should get the list of all subtenants', async () => {
            const mockResponse = mockSubTenantListResponse
            client.fetch = jest.fn()
            .mockImplementation(() =>
                Promise.resolve({
                    json: jest.fn().mockResolvedValue(mockResponse),
                    res: {} as IFetchResponse
                })
            )
            
            const response = await service.getAllSubtenants("t174959360");
            expect(response).toEqual(mockResponse.tenants)
            
        })
        test('should set and retrieve the currently active tenant', async () => {
            const mockTenantId = "billing";
            service.setCurrentlyActiveTenant(mockTenantId)
            
            const response = await service.getCurrentlyActiveTenant()
            expect(response).toEqual(mockTenantId);
        })
    })
});

