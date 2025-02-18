import { Injectable } from "@angular/core";
import { DateTimePickerComponent, gettext } from "@c8y/ngx-components";

import { Api, MicroserviceCategory, MicroserviceConfigurationService, ProductCategory, PropertyName } from './microservice-configuration/microservice-configuration.service';
import { CommonService, DATE_FORMAT_MONTH } from "../common.service";
import { FetchClient } from "@c8y/client";

const moment = require('moment');
export const CLASS_COLORS = ['#024B7A', '#44A5C2', '#FFAE49', '#2B8A3E', '#58508D', '#9C1086', '#E0000E', '#E67700', '#004225', '#592720'];
export const DATE_FORMAT_DAY = 'YYYY-MM-DD';
export interface TenantSummaryResources {
    memory: number,
    name: string,
    cpu: number,
    cause: string
}

export interface MonthlyMicroserviceProdCategoryMap extends TenantSummaryResources {
    [PropertyName.Microservice]: string,
    avgCpu?: string,
    avgMemory?: string
}

@Injectable({
    providedIn: 'root'
})
export class MicroserviceStatisticsService {
    public microserviceStatisticsDataStore = {
        response: <MonthlyMicroserviceProdCategoryMap[]>[],
        date: <Date>new Date(),
        avgCPU: "",
        avgMEM: "" 
    }

    constructor(
        private microserviceConfigurationService: MicroserviceConfigurationService,
        private commonService: CommonService,
        private client: FetchClient,
    ) { }

   
    
    getProductService(): string[]{
        return ["actility",
                "administration",
                "advanced-software-mgmt",
                "apama-ctrl-1c-4g",
                "apama-ctrl-250mc-1g",
                "apama-ctrl-2c-8g",
                "apama-ctrl-smartrulesmt",
                "apama-ctrl-starter",
                "apama-oeeapp", "apama-subscription-mgr",
                "billwerk-agent-server",
                "cellid", "c8y-community-utils",
                "c8ydata", "cloud-remote-access",
                "cockpit",
                "cockpitbeta",
                "connectivity-agent-server",
                "core",
                "databroker-agent-server",
                "datahub",
                "DataHub",
                "device-counter-exporter",
                "devicemanagement",
                "device-simulator",
                "device-statistics-week",
                "digital-twin-manager",
                "dtm-ms",
                "dtm",
                "feature-cep-custom-rules",
                "feature-fieldbus4",
                "feature-microservice-hosting",
                "feature-user-hierarchy",
                "impact",
                "loriot-agent",
                "management", "metadata-collector",
                "OEE", "onnx",
                "opcua-mgmt-service",
                "oee-bundle",
                "public-options",
                "report-agent",
                "repository-connect",
                "sigfox-agent",
                "smartrule",
                "sms-gateway",
                "sslmanagement",
                "stratos-client",
                "Streaming Analytics",
                "tenant-cleanup",
                "tenant-data-exporter",
                "tenant-recovery",
                "zementis-small",
                "mlw",
                "nyoka",
                "cep",
                "apama-ctrl-24c-16g",
                "apama-ctrl-4c-8g",
                "apama-ctrl-025c-1g",
                "apama-ctrl-mt-4c-16g",
                "metrics-aggregator",
                "device-statistics-week"]
      }

    async getMonthlyMicroserviceProdCategoryMap(selectedDate: Date): Promise<MonthlyMicroserviceProdCategoryMap[]> {
        //const productCategories: ProductCategory[] = await this.microserviceConfigurationService.getCategories(Api.Product, false)        
        const defaultProductCategory = "Custom Microservice"
        //const microserviceCategories = await this.microserviceConfigurationService.getCategories(Api.Microservice, false)
        const tenantSummaryResources = await this.getTenantSummaryResources(selectedDate)
        const response: MonthlyMicroserviceProdCategoryMap[] = [];
        const numberOfDaysInMonth = moment(selectedDate, DATE_FORMAT_MONTH).daysInMonth();
        let totalCPU:number = 0;
        let totalMEM:number= 0;

        tenantSummaryResources.forEach((elem: TenantSummaryResources) => {
            const microserviceName = elem.name
            if (!this.getProductService().includes( microserviceName)){
                totalCPU = totalCPU + elem.cpu;
                totalMEM = totalMEM + elem.memory;
                response.push({
                    ...elem,
                    microserviceName: microserviceName,
                    avgCpu: (elem.cpu / (1000 * numberOfDaysInMonth)).toFixed(2),
                    avgMemory: (elem.memory / (4294.97 * numberOfDaysInMonth)).toFixed(2)
                })
            }
        })
        this.microserviceStatisticsDataStore.avgCPU = (totalCPU / (1000 * numberOfDaysInMonth)).toFixed(2);
        this.microserviceStatisticsDataStore.avgMEM = (totalMEM  / (4294.97 * numberOfDaysInMonth)).toFixed(2);

        this.microserviceStatisticsDataStore.response = response
        this.microserviceStatisticsDataStore.date = selectedDate
        return response
    }

    private getProductCategory(microserviceCategories: MicroserviceCategory[], defaultProductCategory, microserviceName: string) {
        const microserviceMapping = microserviceCategories.find((elem: MicroserviceCategory) => elem.microserviceName.trim() === microserviceName.trim())
        return microserviceMapping ? microserviceMapping.productCategory : defaultProductCategory;
    }


    private async getTenantSummaryResources(selectedDate: Date): Promise<TenantSummaryResources[]> {
        const data = await this.commonService.getCurrentTenantSummary(selectedDate)
        if (data && data.resources && data.resources.usedBy) {
            return this.getAggregatedTenantSummary(data.resources.usedBy) as TenantSummaryResources[];
        }
        else {
            throw { message: gettext('Microservice data is not available') }
        }
    }

    private getAggregatedTenantSummary(data: TenantSummaryResources[]): TenantSummaryResources[] | null {
        const map = {}
        data.forEach(elem => {
            if (map[elem.name]) {
                map[elem.name].cpu += elem.cpu
                map[elem.name].memory += elem.memory
                if (!map[elem.name].cause.includes(elem.cause)) {
                    map[elem.name].cause.push(elem.cause)
                }
            }
            else {
                map[elem.name] = {
                    name: elem.name,
                    cpu: elem.cpu,
                    memory: elem.memory,
                    cause: [elem.cause]
                }
            }
        })

        const result = Object.values(map)
        result.forEach((elem: any) => {
            elem.cause = elem.cause.join(", ")
        })
        return result as TenantSummaryResources[]
    }

    public async getMonthlyMicroserviceAggregation(date: Date):Promise<any> {

        var dateTo: Date;
        dateTo= new Date(date.getFullYear(), date.getMonth() + 1, 0);
       
        console.log("dateTo: " + dateTo)

        try {
    
          const options = {
            method: 'GET'
          };
          const response = await this.client.fetch(
            `/service/metrics-aggregator/microservices/?dateFrom=${moment(date).format(DATE_FORMAT_DAY)}&dateTo=${moment(dateTo).format(DATE_FORMAT_DAY)}`
            , options);
          return (await response).json();
        } catch (err) {
          console.log(err);
        }
      }

}