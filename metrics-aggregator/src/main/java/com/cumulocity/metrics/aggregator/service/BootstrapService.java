package com.cumulocity.metrics.aggregator.service;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import com.cumulocity.metrics.aggregator.service.StartupUtils;

import com.cumulocity.metrics.aggregator.model.device.DeviceStatisticsAggregation;
import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.sdk.client.RestConnector;






/**
 * This is a service to fetch subtenants etc
 * 
 * @author Marco Stoffel
 *
 */
@EnableAsync
@Service
public class BootstrapService {

    @Autowired
    RestConnector restConnector;
    
    
    @Autowired
    DeviceMetricsAggregationService deviceMetricsAggregationService;
 

    @Autowired
    StartupUtils utils;

    private static final Logger log = LoggerFactory.getLogger(BootstrapService.class);

    private String currentTenant = ""; 
    private List<String> tenantList;



    public String getCurrentTenant() {
        return currentTenant;
    }

    public List<String> getTenantList() {
        return tenantList;
    }



    @EventListener
	public void initialize(MicroserviceSubscriptionAddedEvent event) {
		log.info("Tenant Sub: " + event.toString());
        String currentTenant = event.getCredentials().getTenant();

        utils.getTenants(currentTenant);
        deviceMetricsAggregationService.createDailyDeviceStatistics();
        //deviceMetricsAggregationService.createDailyDeviceStatistics();
	}

}
