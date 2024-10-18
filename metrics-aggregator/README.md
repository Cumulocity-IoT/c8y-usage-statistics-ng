This microservice should serve as a backend for the Usage Statistics Webapp of Cumulocity IoT.
It performes an aggregation of device statistics to device classes of all subscribed tenants. The following endpoint lets you request the statistics:

https://<deployed tenant>.cumulocity.com/service/metrics-aggregator/statistics/aggregated/{type monthly|daily}/{date e.g. 2024-12-01}?includeSubtenants=true

Given the date it will gather either a daily (type) or monthly statistics. Given includeSubtenants=true it will also output the subtenant device class statistics. The output will consist of an array of device classes which are requested form the tenant options of each tenant. Is not device class definition found in the tenant options a default device class configuration is used.

Example payload for includeSubtenants=true

```json
{
  "tenantAggregation" : {
    "t493319102" : {
      "meas" : 4,
      "devicesCount" : 121,
      "deviceClasses" : [ {
        "className" : "Class A",
        "avgMinMea" : 0,
        "avgMaxMea" : 24,
        "monthlyThreshold" : 200,
        "count" : 119
      }, {
        "className" : "Class B",
        "avgMinMea" : 24,
        "avgMaxMea" : 144,
        "monthlyThreshold" : 200,
        "count" : 0
      }, {
        "className" : "Class C",
        "avgMinMea" : 144,
        "avgMaxMea" : 1440,
        "monthlyThreshold" : 50,
        "count" : 1
      }, {
        "className" : "Class D",
        "avgMinMea" : 1440,
        "avgMaxMea" : 8640,
        "monthlyThreshold" : 50,
        "count" : 0
      }, {
        "className" : "Class E",
        "avgMinMea" : 8640,
        "avgMaxMea" : 86400,
        "monthlyThreshold" : 50,
        "count" : 1
      }, {
        "className" : "Class F",
        "avgMinMea" : 86400,
        "avgMaxMea" : "INFINITY",
        "monthlyThreshold" : 50,
        "count" : 0
      } ],
      "errors" : [ ]
    },,
    "t15264971" : {
      "meas" : 488,
      "devicesCount" : 50,
      "deviceClasses" : [ {
        "className" : "Class A",
        "avgMinMea" : 0,
        "avgMaxMea" : 24,
        "monthlyThreshold" : 0,
        "count" : 26
      }, {
        "className" : "Class B",
        "avgMinMea" : 24,
        "avgMaxMea" : 144,
        "monthlyThreshold" : 0,
        "count" : 18
      }, {
        "className" : "Class C",
        "avgMinMea" : 144,
        "avgMaxMea" : 1440,
        "monthlyThreshold" : 0,
        "count" : 3
      }, {
        "className" : "Class D",
        "avgMinMea" : 1440,
        "avgMaxMea" : 8640,
        "monthlyThreshold" : 0,
        "count" : 2
      }, {
        "className" : "Class E",
        "avgMinMea" : 8640,
        "avgMaxMea" : 86400,
        "monthlyThreshold" : 0,
        "count" : 1
      }, {
        "className" : "Class F",
        "avgMinMea" : 86400,
        "avgMaxMea" : "INFINITY",
        "monthlyThreshold" : 0,
        "count" : 0
      } ],
      "errors" : [ ]
    }},
  "totalMeas" : 175171577,
  "totalDevicesCount" : 277,
  "totalDeviceClasses" : {
    "deviceClasses" : [ {
      "className" : "Class A",
      "avgMinMea" : 0,
      "avgMaxMea" : 24,
      "monthlyThreshold" : 200,
      "count" : 172
    }, {
      "className" : "Class B",
      "avgMinMea" : 24,
      "avgMaxMea" : 144,
      "monthlyThreshold" : 200,
      "count" : 26
    }, {
      "className" : "Class C",
      "avgMinMea" : 144,
      "avgMaxMea" : 1440,
      "monthlyThreshold" : 50,
      "count" : 30
    }, {
      "className" : "Class D",
      "avgMinMea" : 1440,
      "avgMaxMea" : 8640,
      "monthlyThreshold" : 50,
      "count" : 35
    }, {
      "className" : "Class E",
      "avgMinMea" : 8640,
      "avgMaxMea" : 86400,
      "monthlyThreshold" : 50,
      "count" : 12
    }, {
      "className" : "Class F",
      "avgMinMea" : 86400,
      "avgMaxMea" : "INFINITY",
      "monthlyThreshold" : 50,
      "count" : 2
    } ]
  }
}
```