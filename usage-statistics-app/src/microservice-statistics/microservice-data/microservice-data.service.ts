import { Injectable } from "@angular/core";
import { FetchClient, IFetchOptions } from "@c8y/client";
import { gettext } from "@c8y/ngx-components";

export const MEMORY: string = 'memory';
export const NAME: string = 'name';
export const CPU: string = 'cpu';
export const CAUSE: string = 'cause';
export const CATEGORY: string = 'category'
export const COLUMN_FIELDS = {
  MICROSERVICE: gettext('Microservice'),
  MEMORY_TOTAL: gettext('Memory (MiB)'),
  MEMORY_AVG: gettext('Daily Avg Memory (GiB)'),
  CPU_TOTAL: gettext('CPU (mCPU)'),
  CPU_AVG: gettext('Daily Avg CPU (CPUs)'),
  CAUSE: gettext('Source')
}

@Injectable({
  providedIn: "root",
})
export class MicroserviceDataService {}