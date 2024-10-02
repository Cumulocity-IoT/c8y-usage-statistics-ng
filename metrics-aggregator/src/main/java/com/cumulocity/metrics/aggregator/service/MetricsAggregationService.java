package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.jni.Library;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cumulocity.sdk.client.RestConnector;
import com.cumulocity.sdk.client.SDKException;
import com.cumulocity.metrics.aggregator.controller.MetricsAggregationController;
import com.cumulocity.metrics.aggregator.model.DeviceStatistics;
import com.cumulocity.microservice.context.credentials.MicroserviceCredentials;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.model.option.OptionPK;
import com.cumulocity.rest.representation.event.EventCollectionRepresentation;
import com.cumulocity.rest.representation.inventory.ManagedObjectRepresentation;
import com.cumulocity.rest.representation.tenant.OptionRepresentation;
import com.cumulocity.sdk.client.inventory.InventoryApi;
import com.cumulocity.sdk.client.inventory.InventoryFilter;
import com.cumulocity.sdk.client.inventory.ManagedObjectCollection;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


/**
 * This is a service to aggregate device an microservices metrics to display in the usage statistics app
 * It will iterate over all subscribed tenants and aggregate the metrics to an overview
 * @author Marco Stoffel; Christof Strack
 *
 */
@Service
public class MetricsAggregationService {
	

	private static final Logger log = LoggerFactory.getLogger(MetricsAggregationService.class);
	
	@Autowired
    RestConnector restConnector;
	
	@Autowired
    MicroserviceSubscriptionsService subscriptionsService;
	private DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

	public HashMap<String, DeviceStatistics> getDeviceStatisticsOverview(String type, Date statDate) {
		log.info("type: " + type +  " statDate: " + statDate.toString());

		HashMap<String,DeviceStatistics> dsMap = new HashMap<String, DeviceStatistics>();
		subscriptionsService.runForEachTenant(() -> {
			String currentTenant = subscriptionsService.getTenant();
			log.info("Get Statistics for Tenant: " + currentTenant);
			DeviceStatistics ds = restConnector.get("/tenant/statistics/device/"+currentTenant+"/"+type+"/"+df.format(statDate)+"?pageSize=2000&withTotalPages=true", MediaType.APPLICATION_JSON_TYPE,DeviceStatistics.class );
			log.info("Statistics: " + ds.getStatistics().toString());
			dsMap.put(currentTenant, ds);
		
		});
		log.info("Statistics" + dsMap.toString());
		return dsMap;
	}
}
