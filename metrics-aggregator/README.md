# Metrics Aggregator Microservice
This microservice serves as a backend for the Usage Statistics Webapp of Cumulocity IoT.
It performs an aggregation of all subtenants assets of an Enterprise Tenant (including itself). I covers Device Classes-, Microservices- and Tenant-Statistics The following endpoint lets you request the statistics:

# Statistics Endpoints

## Devices
https://{deployed tenant}.cumulocity.com/service/metrics-aggregator/devices/{type monthly|daily}/{date e.g. 2024-12-01}?includeSubtenants=true

Given the date it will gather either a daily (type) or monthly statistics. Given includeSubtenants=true it will also output the subtenant device class statistics. The output will consist of an array of device classes which are requested form the tenant options of each tenant. Is not device class definition found in the tenant options a default device class configuration is used.

#### Device DailyStatistics
https://{deployed tenant}.cumulocity.com/service/metrics-aggregator/devices/dailystatistics?omitCache={true | false}

Will fetch daily stats from start of the month. Will check if stats are older than 12 hours and fetch new if so.


### Microservices
https://{deployed tenant}.cumulocity.com/service/metrics-aggregator/microservices/?dateFrom=2024-12-01&dateTo=2024-12-31

### Tenant
https://{deployed tenant}.cumulocity.com/service/metrics-aggregator/tenants/?dateFrom=2024-12-01&dateTo=2024-12-31

