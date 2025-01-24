import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FetchClient, IFetchOptions, IFetchResponse, IResult } from "@c8y/client";
import { Alert, AlertService } from "@c8y/ngx-components";

export enum CategoryType { Default = "Default", PreConfigured = "PreConfigured", Custom = "Custom" }
export enum Api { Product = "Product", Microservice = "Microservice"}
export enum PropertyName { Product = "productCategory", Microservice = "microserviceName" }
export interface ProductCategory {
    productCategory: string
    isPreconfigured: boolean
    isDefault: boolean
    categoryType: CategoryType
    isEditable: boolean,
    cpuThreshold: number,
    memoryThreshold: number
}

export interface MicroserviceCategory {
    [PropertyName.Microservice]: string
    [PropertyName.Product]: string
}

@Injectable({
    providedIn: 'root'
})
export class MicroserviceConfigurationService {

    constructor(private client: FetchClient, private alertService: AlertService) { }
    private readonly microserviceUrl: string = "/tenant/options";
    private readonly header: any = { "Content-Type": "application/json" };
    private readonly PRODUCT_KEY: string = "microservice.statistics.product.categories"
    private readonly MICROSERVICE_KEY: string = "microservice.statistics.microservice.categories"

   private async getOptions(key: Api): Promise<any> {
        try {
            let configKey: string;
            let defaultConfiguration: MicroserviceCategory[] | ProductCategory[]

            if (key === Api.Product) {
                configKey = this.PRODUCT_KEY
                defaultConfiguration = DEFAULT_PRODUCT_CATEGORIES
            }
            else if (key === Api.Microservice) {
                configKey = this.MICROSERVICE_KEY
                defaultConfiguration = DEFAULT_MICROSERVICE_CATEGORIES
            }

            const options: IFetchOptions = {
                method: "GET",
                headers: this.header,
            };
            const option = {
                category: "configuration",
                key: configKey,
            };

            const url = `${this.microserviceUrl}/${option.category}/${option.key}`;

            const res = await this.client.fetch(url, options);
            let data = await res.json();
            if (res.status !== 200) {
                await this.setOptions(key, defaultConfiguration);
                data.value = JSON.stringify(defaultConfiguration);
            }

            return JSON.parse(data.value)           
        }
        catch (error) {
            const alert: Alert = {
                text: 'Unable to get the configuration',
                type: 'danger',
                detailedData: error.message
            }
            this.alertService.add(alert)
        }

    }

    async setOptions(key: Api, configuration: ProductCategory[] | MicroserviceCategory[]): Promise<IFetchResponse> {
        try {
            let configKey: string;
            let formattedConfiguration
            if (key === Api.Product) {
                configKey = this.PRODUCT_KEY
                formattedConfiguration = configuration
            }
            else if (key === Api.Microservice) {
                configKey = this.MICROSERVICE_KEY
                formattedConfiguration = configuration
            }
            const configData = {
                category: "configuration",
                key: configKey,
                value: JSON.stringify(formattedConfiguration),
            };
            const options: IFetchOptions = {
                method: "POST",
                headers: this.header,
                body: JSON.stringify(configData),
            };
            return await this.client.fetch(`${this.microserviceUrl}`, options);
        }
        catch (error) {
            const alert: Alert = {
                text: 'Unable to update the configuration',
                type: 'danger',
                detailedData: error.message
            }
            this.alertService.add(alert)
        }

    }

    async getCategories(key: Api, isFormControlNeeded: boolean): Promise<any> {
        if(key === Api.Product){
            const categoryList = await this.getOptions(Api.Product)
            if (isFormControlNeeded) {
                return updateFormControlToUpdateOnBlur(categoryList, PropertyName.Product)
            }
            else{
                return categoryList
            }
            
        }
        else if(key === Api.Microservice){
            const categoryList = await this.getOptions(Api.Microservice)
            if (isFormControlNeeded) {
                return updateFormControlToUpdateOnBlur(categoryList, PropertyName.Microservice)
            }
            else{
                return categoryList
            }
        }     

        return null
    }

    async setDefaultMicroserviceCategories(): Promise<any> {
        await this.setOptions(Api.Microservice, DEFAULT_MICROSERVICE_CATEGORIES)
    }

    async setDefaultProductCategories(): Promise<any> {
        await this.setOptions(Api.Product, DEFAULT_PRODUCT_CATEGORIES)
    }

    getExcessProductCategories(productCategoryList: ProductCategory[]) {
        const productCategories = productCategoryList.map((elem: ProductCategory) => elem.productCategory)
        const defaultProductCategories = DEFAULT_PRODUCT_CATEGORIES.map(elem => elem.productCategory)
        return productCategories.filter(elem => !defaultProductCategories.includes(elem));
    }
}

function updateFormControlToUpdateOnBlur(list: any[], field: string): any[] {
    const listCopy = JSON.parse(JSON.stringify(list))
    listCopy.forEach(elem => {
        elem[field] = new FormControl(elem[field], { updateOn: 'blur' })
    })
    return listCopy
}

const DEFAULT_PRODUCT_CATEGORIES: ProductCategory[] = [
    {
        productCategory: 'Product Services',
        isPreconfigured: true,
        isDefault: false,
        categoryType: CategoryType.PreConfigured,
        isEditable: false,
        cpuThreshold: 0,
        memoryThreshold: 0
    },
    {
        productCategory: 'Streaming Analytics',
        isPreconfigured: true,
        isDefault: false,
        categoryType: CategoryType.PreConfigured,
        isEditable: false,
        cpuThreshold: 0,
        memoryThreshold: 0
    },
    {
        productCategory: 'Machine Learning',
        isPreconfigured: true,
        isDefault: false,
        categoryType: CategoryType.PreConfigured,
        isEditable: false,
        cpuThreshold: 0,
        memoryThreshold: 0
    },
    {
        productCategory: 'Custom Microservices',
        isPreconfigured: true,
        isDefault: true,
        categoryType: CategoryType.Default,
        isEditable: false,
        cpuThreshold: 0,
        memoryThreshold: 0
    }
]

const DEFAULT_MICROSERVICE_CATEGORIES: MicroserviceCategory[] = [
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
]
