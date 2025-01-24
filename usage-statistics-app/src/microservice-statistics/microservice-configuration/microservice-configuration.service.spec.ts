import { FetchClient, IFetchOptions, IFetchResponse } from '@c8y/client';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { RouterTestingModule } from '@angular/router/testing';
import { Api, MicroserviceConfigurationService } from './microservice-configuration.service';

describe('MicroserviceConfigurationService service', () => {
    let service: MicroserviceConfigurationService;
    let fetchClient: FetchClient;
    let mockDefaultMSCategories;
    let mockDefaultPdctCategories;
    
    const fetchClientMock = {
        fetch: jest.fn()
    }

    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
            providers: [MicroserviceConfigurationService,
                { provide: FetchClient, useValue: fetchClientMock },
            ]
        })
        service = TestBed.inject(MicroserviceConfigurationService);
        fetchClient = TestBed.inject(FetchClient);

    });

    beforeEach(() => {
        mockDefaultMSCategories = [
            { microserviceName: 'actility', productCategory: 'Product Services' },
            {
                microserviceName: 'administration',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'Apama EPL Apps',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'Apama Analytics Builder',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'apama-ctrl-starter',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'billwerk-agent-server',
                productCategory: 'Product Services'
            },
            { microserviceName: 'cep', productCategory: 'Product Services' },
            {
                microserviceName: 'cloud-remote-access',
                productCategory: 'Product Services'
            },
            { microserviceName: 'cockpit', productCategory: 'Product Services' },
            {
                microserviceName: 'connectivity-agent-server',
                productCategory: 'Product Services'
            },
            { microserviceName: 'datahub', productCategory: 'Product Services' },
            {
                microserviceName: 'device-simulator',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'devicemanagement',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'feature-branding',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'feature-broker',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'feature-fieldbus4',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'feature-microservice-hosting',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'feature-user-hierarchy',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'lwm2m-agent',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'opcua-mgmt-service',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'report-agent',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'smartrule',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'sms-gateway',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'sslmanagement',
                productCategory: 'Product Services'
            },
            { microserviceName: 'apama', productCategory: 'Product Services' },
            { microserviceName: 'cellid', productCategory: 'Product Services' },
            {
                microserviceName: 'datahub-webapp',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'loriot-agent',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'remote-access-agent-echo',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'retention',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'sigfox-agent',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'smartgroup',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'sslmonitor-agent-server',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'tenant-configuration',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'tenant-sla-monitoring-agent-server',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'oee-bundle',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'apama-oeeapp',
                productCategory: 'Product Services'
            },
            {
                microserviceName: 'zementis',
                productCategory: 'Machine Learning'
            },
            {
                microserviceName: 'mlw',
                productCategory: 'Machine Learning'
            },
            {
                microserviceName: 'nyoka',
                productCategory: 'Machine Learning'
            },
            {
                microserviceName: 'onnx',
                productCategory: 'Machine Learning'
            }
        ];
        mockDefaultPdctCategories = [
            {
                "productCategory":"Product Services",
                "isPreconfigured":true,
                "isDefault":false,
                "categoryType":"PreConfigured",
                "isEditable":false
            },
            {
                "productCategory":"Streaming Analytics",
                "isPreconfigured":true,
                "isDefault":false,
                "categoryType":"PreConfigured",
                "isEditable":false
            },
            {
                "productCategory":"Machine Learning",
                "isPreconfigured":true,
                "isDefault":false,
                "categoryType":"PreConfigured",
                "isEditable":false
            },
            {
                "productCategory":"Custom Microservices",
                "isPreconfigured":true,
                "isDefault":true,
                "categoryType":"Default",
                "isEditable":false
            }
        ]
    });

    test('should initialize', () => {
        expect(service).toBeTruthy();
    });

    describe('should return the default configurations', () => {
        
        test('should return the default product categories', async () => {
            jest.spyOn(service as any, 'getOptions').mockImplementation(() => Promise.resolve(mockDefaultPdctCategories));
            let response = await service.getCategories(Api.Product, false);
            
            expect(response).toEqual(mockDefaultPdctCategories);
        });

        test('should return the default microservice categories', async () => {
            
            jest.spyOn(service as any, 'getOptions').mockImplementation(() => Promise.resolve(mockDefaultMSCategories));
            let response = await service.getCategories(Api.Microservice, false);
            
            expect(response).toEqual(mockDefaultMSCategories);
        });
    });

    describe('should verify setOptions are called correctly', () => {
        test('should set the product categories correctly', async () => {
            const configData = {
                category: "configuration",
                key: "microservice.statistics.product.categories",
                value: JSON.stringify(mockDefaultPdctCategories),
            };
            const options: IFetchOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(configData),
            };
            const response = { status: 200, headers: '' } as unknown as IFetchResponse;
            const fetchSpy = jest.spyOn(fetchClient, 'fetch').mockResolvedValue(response)

            await service.setOptions(Api.Product, mockDefaultPdctCategories);

            expect(fetchSpy).toHaveBeenCalledWith("/tenant/options", options)
        });
    });

    test('should set the microservice categories correctly', async () => {
        const configData = {
            category: "configuration",
            key: "microservice.statistics.microservice.categories",
            value: JSON.stringify(mockDefaultMSCategories),
        };
        const options: IFetchOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(configData),
        };
        const response = { status: 200, headers: '' } as unknown as IFetchResponse;
        const fetchSpy = jest.spyOn(fetchClient, 'fetch').mockResolvedValue(response)

        await service.setOptions(Api.Microservice, mockDefaultMSCategories);

        expect(fetchSpy).toHaveBeenCalledWith("/tenant/options", options)
    });
    
});