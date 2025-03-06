package com.cumulocity.metrics.aggregator.service;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.cumulocity.metrics.aggregator.model.device.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.microservice.Tenants;
import com.cumulocity.metrics.aggregator.model.microservice.Tenants.Tenant;
import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.rest.representation.CumulocityMediaType;
import com.cumulocity.sdk.client.RestConnector;






/**
 * This is a service to fetch subtenants etc
 * 
 * @author Marco Stoffel
 *
 */
@Service
public class BootstrapService {

    @Autowired
    RestConnector restConnector;
    
    @Autowired
	MicroserviceSubscriptionsService subscriptionsService;

    @Autowired
    DeviceMetricsAggregationService deviceMetricsAggregationService;

    @Autowired
    MicroservicesMetricsAggregationService microservicesMetricsAggregationService;

    @Autowired
    TenantMetricsAggregationService tenantMetricsAggregationService;

    private static final Logger log = LoggerFactory.getLogger(BootstrapService.class);

    private String currentTenant = ""; 
    private List<String> tenantList;

    private Map<Date,DeviceStatisticsAggregation> daysInMonthDeviceAggregations;

    public String getCurrentTenant() {
        return currentTenant;
    }

    public List<String> getTenantList() {
        return tenantList;
    }

    @EventListener
	public void initialize(MicroserviceSubscriptionAddedEvent event) {
		log.info("Tenant Sub: " + event.toString());
        this.currentTenant = event.getCredentials().getTenant();
		log.info("CurrentTenant: " + this.currentTenant);

        this.tenantList = subscriptionsService.callForTenant(this.currentTenant, this::getSubTenants).get();
        this.tenantList.add(currentTenant);
        deviceMetricsAggregationService.setTenantList(tenantList);
        microservicesMetricsAggregationService.setTenantList(tenantList);
        tenantMetricsAggregationService.setTenantList(tenantList);
        log.info(tenantList.toString());
        //deviceMetricsAggregationService.createDailyDeviceStatistics();
	}

   


    private Optional<List<String>> getSubTenants(){
        Tenants tenants = restConnector.get(
                "/tenant/tenants?pageSize=2000&withTotalPages=true&withApps=false",
                CumulocityMediaType.APPLICATION_JSON_TYPE,Tenants.class);
            ArrayList<String> tenantIds = new ArrayList<String>();
            for (Tenant tenant : tenants.getTenants()){
                tenantIds.add(tenant.getId());
            }
            return Optional.of(tenantIds);
    }

}
