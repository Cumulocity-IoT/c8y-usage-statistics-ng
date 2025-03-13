package com.cumulocity.metrics.aggregator.service;


import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cumulocity.metrics.aggregator.model.microservice.Tenants;
import com.cumulocity.metrics.aggregator.model.microservice.Tenants.Tenant;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.rest.representation.CumulocityMediaType;
import com.cumulocity.sdk.client.RestConnector;

@EnableAsync
@EnableScheduling
@Service
public class StartupUtils {

    private static final Logger log = LoggerFactory.getLogger(StartupUtils.class);
    
    private String currentTenant = "";
    
    public String getCurrentTenant() {
        return currentTenant;
    }


    public void setCurrentTenant(String currentTenant) {
        this.currentTenant = currentTenant;
    }

    @Autowired
    DeviceMetricsAggregationService deviceMetricsAggregationService;

    @Autowired
    MicroservicesMetricsAggregationService microservicesMetricsAggregationService;

    @Autowired
    TenantMetricsAggregationService tenantMetricsAggregationService;

    @Autowired
	MicroserviceSubscriptionsService subscriptionsService;
    
    @Autowired
    RestConnector restConnector;

    @Scheduled(cron = "0 45 */1 * * ?")
    @Async
    public void getTenants(){
        while (this.currentTenant.equals("")){
            log.info("getTenants currentTenant not set waiting .... " );
        }
		log.info("getTenants for: " + this.currentTenant);
        this.subscriptionsService.runForTenant(this.currentTenant, () -> {
            Tenants tenants = restConnector.get(
                "/tenant/tenants?pageSize=2000&withTotalElements=true&withApps=false",
                CumulocityMediaType.APPLICATION_JSON_TYPE,Tenants.class);
            ArrayList<String> tenantIds = new ArrayList<String>();
            for (Tenant tenant : tenants.getTenants()){
                tenantIds.add(tenant.getId());
            }
            tenantIds.add(currentTenant);
            log.info("Found Tenants: " +tenantIds.toString());
            this.tenantMetricsAggregationService.setTenantList(tenantIds);
            this.deviceMetricsAggregationService.setTenantList(tenantIds);
            this.microservicesMetricsAggregationService.setTenantList(tenantIds);
        });
    } 
}
