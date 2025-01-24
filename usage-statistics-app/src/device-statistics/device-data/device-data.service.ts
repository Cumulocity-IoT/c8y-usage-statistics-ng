import { Injectable } from "@angular/core";

export const DEVICE_ID: string = 'deviceId';
export const TOTAL_MEA: string = 'totalMea';
export const AVG_MEA: string = 'avgMea';
export const CLASS: string = 'className';
export const DEVICE_TYPE: string = 'deviceType';

@Injectable({
  providedIn: "root",
})
export class DeviceDataService {}
