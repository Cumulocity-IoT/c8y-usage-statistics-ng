import { Injectable } from "@angular/core";
import { FetchClient, IFetchOptions, IFetchResponse, IResult } from "@c8y/client";


@Injectable({
  providedIn: "root",
})
export class DeviceConfigurationService {


  defaultConfig;


  constructor() {
    this.defaultConfig = [
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
  }

}
