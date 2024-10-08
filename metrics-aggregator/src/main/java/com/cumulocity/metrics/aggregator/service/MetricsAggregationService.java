package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cumulocity.sdk.client.RestConnector;
import com.cumulocity.metrics.aggregator.model.DeviceClassRepresentation;
import com.cumulocity.metrics.aggregator.model.DeviceStatistics;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.model.option.OptionPK;
import com.cumulocity.rest.representation.tenant.OptionRepresentation;
import com.cumulocity.sdk.client.option.TenantOptionApi;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.ws.rs.core.MediaType;


/**
 * This is a service to aggregate device an microservices metrics to display in the usage statistics app
 * It will iterate over all subscribed tenants and aggregate the metrics to an overview
 * @author Marco Stoffel; Christof Strack
 *
 */
@Service
public class MetricsAggregationService {
	

	private static final Logger log = LoggerFactory.getLogger(MetricsAggregationService.class);

	private static final String OPTION_CATEGORY_CONFIGURATION = "configuration";
	private static final String OPTION_KEY = "device.statistics.class.details";
	
	private HashMap<String,ArrayList<DeviceClassRepresentation>> deviceClassRepresentation = null;
	
	@Autowired
    RestConnector restConnector;
	
	@Autowired
    MicroserviceSubscriptionsService subscriptionsService;

	@Autowired
	TenantOptionApi tenantOptionApi;

	
	@Autowired
	ObjectMapper objectMapper;
 

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

	public HashMap<String, ArrayList<DeviceClassRepresentation>> getdeviceClassConfiguration(boolean omitCache) {
		if (this.deviceClassRepresentation == null || omitCache) {
			log.info("########## Fetching deviceClassRepresentation, omitCache: " +omitCache);
			this.deviceClassRepresentation = new HashMap<String, ArrayList<DeviceClassRepresentation>>();
			subscriptionsService.runForEachTenant(() -> {
				String currentTenant = subscriptionsService.getTenant();
				log.info("Get DeviceClassDefinition for Tenant: " + currentTenant);
				final OptionPK option = new OptionPK();
				option.setCategory(OPTION_CATEGORY_CONFIGURATION);
				option.setKey(OPTION_KEY);
				final OptionRepresentation optionRepresentation= tenantOptionApi.getOption(option);
				ArrayList<DeviceClassRepresentation> dcd = new ArrayList<DeviceClassRepresentation>();
				try {
					log.info("optionRepresentation: " + optionRepresentation.getValue());
					dcd = new ObjectMapper().readValue(
								optionRepresentation.getValue(),
								new TypeReference<ArrayList<DeviceClassRepresentation>>(){});
				} catch (JsonProcessingException e) {
					log.error("Could not get Tenant Options for DeviceClassDefinition: ", e);
				}
				deviceClassRepresentation.put(currentTenant, dcd);
			});
		}
		log.info("deviceClassRepresentation" + deviceClassRepresentation.toString());
		return deviceClassRepresentation;
	}
	

	public HashMap<String, ArrayList<DeviceClassRepresentation>> getAggregatedDeviceClassStatistics(String type, Date statDate){
		HashMap<String, DeviceStatistics> deviceStatisticsMap = this.getDeviceStatisticsOverview(type, statDate);
		HashMap<String, ArrayList<DeviceClassRepresentation>> deviceClassesMap = this.getdeviceClassConfiguration(true);
		return getAggregatedDevicesPerClass(deviceStatisticsMap,deviceClassesMap);

	}

	private HashMap<String, ArrayList<DeviceClassRepresentation>> getAggregatedDevicesPerClass(
				HashMap<String, DeviceStatistics> deviceStatisticsMap, 
				HashMap<String, ArrayList<DeviceClassRepresentation>> deviceClassesMap){

					Iterator dClassIt  = deviceClassesMap.entrySet().iterator();
					// Iterate all Tenants and get DeviceClasses 
					while (dClassIt.hasNext()) {
						Map.Entry<String, ArrayList<DeviceClassRepresentation>> pair = (Entry<String, ArrayList<DeviceClassRepresentation>>) dClassIt.next();
						String tenant = pair.getKey();
						ArrayList<DeviceClassRepresentation> deviceClasses = pair.getValue();
						// Iterate over DeviceClasse of current tenant
						log.info("Tenant: " + tenant);
						deviceClasses.forEach(dc -> {
							//Device Statistic of current tenant
							DeviceStatistics deviceStatistics = deviceStatisticsMap.get(tenant);
							deviceStatistics.getStatistics().forEach(ds -> {
								int count = ds.getCount();
								String deviceId = ds.getDeviceId();
								// Add device count to class if in device classe range
								// (avgMea >= config.avgMinMea && avgMea < config.avgMaxMea) ||
								//	(index === currentConfiguration.length - 1 && avgMea >= config.avgMinMea)
								// ) 
								log.info("DeviceClass: " +dc.toString());
								// check if maxmea is INFINITY
								log.info("MaxMea:" + dc.getAvgMaxMea().getClass() + " Value: " +dc.getAvgMaxMea());
								int maxm = 0;
								Object avgMaxMea = dc.getAvgMaxMea();
								if (avgMaxMea.getClass() == String.class && avgMaxMea.equals("INFINITY")){
								//if (avgMaxMea.getClass() == String.class ){
									log.info("Setting MaxMea to infinity");
									maxm = Integer.MAX_VALUE;
								} else if (avgMaxMea.getClass() == Integer.class) {
									log.info("Setting MaxMea to integer");
									maxm = (Integer)avgMaxMea;
								} else {
									log.error("Could not extract MaxMea");
								}
								if (count >= dc.getAvgMinMea() && count < maxm && maxm > 0) {
									log.info("##### Tenant: " + tenant + " Adding Device: " + deviceId + " count: " + count + " to Device Class: " + dc.getClassName());
									dc.setCount(dc.getCount() + 1);
								}
							});

						});
					}
					return deviceClassesMap;
				}
}
