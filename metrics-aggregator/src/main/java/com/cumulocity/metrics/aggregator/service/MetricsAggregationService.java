package com.cumulocity.metrics.aggregator.service;

import java.math.BigInteger;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.cumulocity.sdk.client.RestConnector;
import com.cumulocity.metrics.aggregator.model.DeviceClass;
import com.cumulocity.metrics.aggregator.model.DeviceStatistics;
import com.cumulocity.metrics.aggregator.model.DeviceStatisticsAggregation;
import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;
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
	
	private HashMap<String,ArrayList<DeviceClass>> deviceClassRepresentation = null;
	private BigInteger meaTotal = BigInteger.valueOf(0);
	
	@Autowired
    RestConnector restConnector;
	
	@Autowired
    MicroserviceSubscriptionsService subscriptionsService;

	@Autowired
	TenantOptionApi tenantOptionApi;

	
	@Autowired
	ObjectMapper objectMapper;
 
	@EventListener
    public void initialize(MicroserviceSubscriptionAddedEvent event) {
		//event.getCredentials().getTenant()
	}

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

	public HashMap<String, ArrayList<DeviceClass>> getdeviceClassConfiguration(boolean omitCache) {
		if (this.deviceClassRepresentation == null || omitCache) {
			log.info("########## Fetching deviceClassRepresentation, omitCache: " +omitCache);
			this.deviceClassRepresentation = new HashMap<String, ArrayList<DeviceClass>>();
			subscriptionsService.runForEachTenant(() -> {
				String currentTenant = subscriptionsService.getTenant();
				log.info("Get DeviceClassDefinition for Tenant: " + currentTenant);
				final OptionPK option = new OptionPK();
				option.setCategory(OPTION_CATEGORY_CONFIGURATION);
				option.setKey(OPTION_KEY);
				final OptionRepresentation optionRepresentation= tenantOptionApi.getOption(option);
				ArrayList<DeviceClass> dcd = new ArrayList<DeviceClass>();
				try {
					log.info("optionRepresentation: " + optionRepresentation.getValue());
					dcd = new ObjectMapper().readValue(
								optionRepresentation.getValue(),
								new TypeReference<ArrayList<DeviceClass>>(){});
				} catch (JsonProcessingException e) {
					log.error("Could not get Tenant Options for DeviceClassDefinition: ", e);
				}
				deviceClassRepresentation.put(currentTenant, dcd);
			});
		}
		log.info("deviceClassRepresentation" + deviceClassRepresentation.toString());
		return deviceClassRepresentation;
	}
	

	public HashMap<String, DeviceStatisticsAggregation> getAggregatedDeviceClassStatistics(String type, Date statDate){
		HashMap<String, DeviceStatistics> deviceStatisticsMap = this.getDeviceStatisticsOverview(type, statDate);
		HashMap<String, ArrayList<DeviceClass>> deviceClassesMap = this.getdeviceClassConfiguration(true);
		return getAggregatedDevicesPerClass(deviceStatisticsMap,deviceClassesMap);
	}

	private HashMap<String, DeviceStatisticsAggregation> getAggregatedDevicesPerClass(
				HashMap<String, DeviceStatistics> deviceStatisticsMap, 
				HashMap<String, ArrayList<DeviceClass>> deviceClassesMap){
					
					// Return object to gather
					HashMap<String, DeviceStatisticsAggregation> deviceStatisticsAggregationMap = new HashMap<String, DeviceStatisticsAggregation>();

					//Iterate over deviceClassConfigurations of all tenants
					Iterator dClassIt  = deviceClassesMap.entrySet().iterator();
					while (dClassIt.hasNext()) {
						Map.Entry<String, ArrayList<DeviceClass>> pair = (Entry<String, ArrayList<DeviceClass>>) dClassIt.next();
						String tenant = pair.getKey();
						DeviceStatisticsAggregation dsa = new DeviceStatisticsAggregation();
						deviceStatisticsAggregationMap.put(tenant, dsa);
						ArrayList<DeviceClass> deviceClasses = pair.getValue();
						// Iterate over DeviceClasse of current tenant
						log.info("Tenant: " + tenant);
						deviceClasses.forEach(dc -> {
							//Device Statistic of current tenant
							DeviceStatistics deviceStatistics = deviceStatisticsMap.get(tenant);
							Iterator<DeviceStatistics.Statistic> ids = deviceStatistics.getStatistics().iterator();
							while (ids.hasNext()) {
								DeviceStatistics.Statistic ds = ids.next();
								int count = ds.getCount();
								String deviceId = ds.getDeviceId();
								log.info("DeviceClass: " +dc.toString());
								// check if maxmea is INFINITY
								log.info("MaxMea:" + dc.getAvgMaxMea().getClass() + " Value: " +dc.getAvgMaxMea());
								int maxm = 0;
								Object avgMaxMea = dc.getAvgMaxMea();
								if (avgMaxMea.getClass() == String.class && avgMaxMea.equals("INFINITY")){
									maxm = Integer.MAX_VALUE;
								} else if (avgMaxMea.getClass() == Integer.class) {
									maxm = (Integer)avgMaxMea;
								} else {
									log.error("Could not extract MaxMea");
								}
								if (count >= dc.getAvgMinMea() && count < maxm && maxm > 0) {
									log.info("##### Tenant: " + tenant + " Adding Device and remove from stat: " + deviceId + " meacount: " + count + " to Device Class: " + dc.getClassName());
									dc.setCount(dc.getCount() + 1);
									this.meaTotal = meaTotal.add(BigInteger.valueOf(count));
									dsa.setTotalMeas(dsa.getTotalMeas().add(BigInteger.valueOf(count)));
									log.info("MeaTotal: " + this.meaTotal.toString());
									ids.remove();
								}
							}
							deviceStatisticsAggregationMap.get(tenant).getDeviceClasses().add(dc);
						});
					}

					return deviceStatisticsAggregationMap;
				}
}
