package com.cumulocity.metrics.aggregator.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;






/**
 * This is a service to fetch subtenants etc
 * 
 * @author Marco Stoffel
 *
 */

@Service
public class BootstrapService {

    @Autowired
    DeviceMetricsAggregationService deviceMetricsAggregationService;
 
    @Autowired
    StartupUtils utils;

    private static final Logger log = LoggerFactory.getLogger(BootstrapService.class);

    @EventListener
	public void initialize(MicroserviceSubscriptionAddedEvent event) {
		log.info("Tenant Sub: " + event.toString());
        utils.setCurrentTenant(event.getCredentials().getTenant());
        utils.getTenants();
        deviceMetricsAggregationService.createDailyDeviceStatistics();
	}

}
