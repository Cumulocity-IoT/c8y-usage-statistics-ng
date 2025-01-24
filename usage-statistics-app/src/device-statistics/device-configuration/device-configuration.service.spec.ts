import { FetchClient, IFetchOptions, IFetchResponse } from '@c8y/client';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { RouterTestingModule } from '@angular/router/testing';
import {  } from '../../common.service';
import { DeviceStatisticsService } from '../device-statistics.service';
import { DeviceConfigurationService } from './device-configuration.service';

describe('DeviceStatistics service', () => {
    let service: DeviceConfigurationService;
    let fetchClient: FetchClient;
    
    const fetchClientMock = {
        fetch: jest.fn()
    }

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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
            providers: [DeviceStatisticsService,
                { provide: FetchClient, useValue: fetchClientMock },
            ]
        })
        service = TestBed.inject(DeviceConfigurationService);
        fetchClient = TestBed.inject(FetchClient);

    });
    test('should initialize', () => {
        expect(service).toBeTruthy();
    })

    describe('should call getOptions', () => {
        test('should fetch the tenant options with correct category and key', async () => {
            const options: IFetchOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };

            const response = {
                status: 400,
                headers: {},
                json: () => Promise.resolve({})
            } as IFetchResponse;

            const responseSpy = await jest.spyOn(fetchClient, 'fetch').mockReturnValue(Promise.resolve(response));
            await service.getOptions();

            expect(responseSpy).toHaveBeenCalledWith("/tenant/options/configuration/device.statistics.class.details", options);
        })

        test('should set the configuration options to default value if getOptions fails', async () => {
            service.setOptions = jest.fn();
            await service.getOptions();
        
            expect(service.setOptions).toHaveBeenCalledWith(defaultConfig);
        });

        test('should set deviceStatisticsConfigurationStore', async() => {
            const responseMock = { status: 200, headers: '' } as unknown as IFetchResponse;
            const dataMock = {
                "self": "http://t82994.latest.stage.c8y.io/tenant/options/configuration/device.statistics.class.details",
                "category": "configuration",
                "value": "[{\"className\":\"Class A\",\"avgMinMea\":0,\"avgMaxMea\":24,\"monthlyThreshold\":null},{\"className\":\"Class B\",\"avgMinMea\":24,\"avgMaxMea\":144,\"monthlyThreshold\":null},{\"className\":\"Class C\",\"avgMinMea\":144,\"avgMaxMea\":1440,\"monthlyThreshold\":null},{\"className\":\"Class D\",\"avgMinMea\":1440,\"avgMaxMea\":8640,\"monthlyThreshold\":null},{\"className\":\"Class E\",\"avgMinMea\":8640,\"avgMaxMea\":86400,\"monthlyThreshold\":null},{\"className\":\"Class F\",\"avgMinMea\":86400,\"avgMaxMea\":\"INFINITY\",\"monthlyThreshold\":null}]",
                "key": "device.statistics.class.details"
            };
            const response = ({
                res: responseMock,
                data: dataMock
            });
    
            await jest.spyOn(service, 'getOptions').mockReturnValue(Promise.resolve(response));
            await service.getConfigurationOptions();
            expect(service.deviceStatisticsConfigurationStore).toEqual(JSON.parse(response.data.value));
        })
    })
    
});