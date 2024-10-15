package com.cumulocity.metrics.aggregator.service;

import java.math.BigInteger;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.cumulocity.sdk.client.RestConnector;
import com.cumulocity.sdk.client.SDKException;
import com.cumulocity.metrics.aggregator.model.DeviceClassConfiguration;
import com.cumulocity.metrics.aggregator.model.DeviceStatistics;
import com.cumulocity.metrics.aggregator.model.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.DeviceClassConfiguration.DeviceClass;
import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.model.option.OptionPK;
import com.cumulocity.rest.representation.CumulocityMediaType;
import com.cumulocity.rest.representation.tenant.OptionRepresentation;
import com.cumulocity.rest.representation.tenant.TenantRepresentation;
import com.cumulocity.sdk.client.option.TenantOptionApi;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javassist.expr.Instanceof;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * This is a service to aggregate device an microservices metrics to display in
 * the usage statistics app
 * It will iterate over all subscribed tenants and aggregate the metrics to an
 * overview
 * 
 * @author Marco Stoffel
 *
 */
@Service
public class MetricsAggregationService {

	private static final Logger log = LoggerFactory.getLogger(MetricsAggregationService.class);

	private static final String OPTION_CATEGORY_CONFIGURATION = "configuration";
	private static final String OPTION_KEY = "device.statistics.class.details";

	private Map<String, DeviceClassConfiguration> allDeviceClassConfiguration = new HashMap<String, DeviceClassConfiguration>();

	private int subscribedTenantCount = 0;
	private boolean includeSubtenants = false;

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
		// Optional<TenantRepresentation> deployedTenant = getCurrentTenant();
		// System.out.println("Current Tenant: " + deployedTenant.get().getDomain());
		String currentTenant = event.getCredentials().getTenant();
		subscriptionsService.runForTenant(currentTenant, () -> {
			this.subscribedTenantCount++;
			this.allDeviceClassConfiguration.put(currentTenant, getDeviceClasseConfiguration(currentTenant));
			log.info("Tenant: " + currentTenant + " subscribed. subscribedTenantCount: " + subscribedTenantCount
					+ " Fetching DeviceClassConfiguration.");
		});
	}

	// @EventListener(ApplicationReadyEvent.class)
	// public void doSomethingAfterStartup() {
	// 	Optional<TenantRepresentation> currentTenant= getCurrentTenant();
	// 	System.out.println("Current Tenant: " +currentTenant.get());
	// }

	private DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

	public Map<String, DeviceStatistics> getDeviceStatisticsOverview(String type, Date statDate) {

		HashMap<String, DeviceStatistics> dsMap = new HashMap<String, DeviceStatistics>();
		subscriptionsService.runForEachTenant(() -> {
			String currentTenant = subscriptionsService.getTenant();
			log.info("Get Statistics for Tenant: " + currentTenant);
			Response rs = restConnector.get(
					"/tenant/statistics/device/" + currentTenant + "/" + type + "/" + df.format(statDate)
							+ "?pageSize=2&withTotalPages=true",
					MediaType.APPLICATION_JSON_TYPE);
			DeviceStatistics dspage = restConnector.get(
					"/tenant/statistics/device/" + currentTenant + "/" + type + "/" + df.format(statDate)
							+ "?pageSize=2000&withTotalPages=true",
					MediaType.APPLICATION_JSON_TYPE, DeviceStatistics.class);
			dspage.setDaysInMonth(statDate);
			log.debug("Statistics: " + dspage.getStatistics().toString());
			dsMap.put(currentTenant, dspage);
		});
		return dsMap;
	}

	public Map<String, DeviceClassConfiguration> getAllDeviceClassConfiguration(boolean omitCache) {
		if (omitCache) {
			log.info("# Fetching deviceClassRepresentation, omitCache: " + omitCache);
			this.allDeviceClassConfiguration = new HashMap<String, DeviceClassConfiguration>();
			subscriptionsService.runForEachTenant(() -> {
				String currentTenant = subscriptionsService.getTenant();
				this.allDeviceClassConfiguration.put(currentTenant, getDeviceClasseConfiguration(currentTenant));
			});
		}
		return allDeviceClassConfiguration;
	}

	private DeviceClassConfiguration getDeviceClasseConfiguration(String currentTenant) {
		log.info("Get DeviceClassDefinition for Tenant: " + currentTenant);
		final OptionPK option = new OptionPK();
		option.setCategory(OPTION_CATEGORY_CONFIGURATION);
		option.setKey(OPTION_KEY);
		OptionRepresentation optionRepresentation = new OptionRepresentation();
		List<DeviceClassConfiguration.DeviceClass> dcl = new ArrayList<DeviceClassConfiguration.DeviceClass>();
		DeviceClassConfiguration dcd = new DeviceClassConfiguration();
		try {
			optionRepresentation = tenantOptionApi.getOption(option);
			dcl = new ObjectMapper().readValue(
					optionRepresentation.getValue(),
					new TypeReference<List<DeviceClassConfiguration.DeviceClass>>() {
					});
			dcd.setDeviceClasses(dcl);
		} catch (SDKException | JsonProcessingException e) {
			log.error("Could not get DeviceClassConfiguration form tenant options using default config.");
		}
		return dcd;
	}

	public DeviceStatisticsAggregation getAggregatedDeviceClassStatistics(String type, Date statDate, boolean includeSubtenants) {
		Map<String, DeviceStatistics> deviceStatisticsMap = this.getDeviceStatisticsOverview(type, statDate);
		boolean omitCache = false;
		this.includeSubtenants = includeSubtenants;
		if (deviceStatisticsMap.size() != this.allDeviceClassConfiguration.size()) {
			log.info("################## Size DeviceClasses and DeviceStatistics uneven. Fetching DeviceClassesConfig again.");
			omitCache = true;
		}
		Map<String, DeviceClassConfiguration> deviceClassesMap = this.getAllDeviceClassConfiguration(omitCache);
		return getAggregatedDevicesPerClass(deviceStatisticsMap, deviceClassesMap);
	}

	private DeviceStatisticsAggregation getAggregatedDevicesPerClass(
			Map<String, DeviceStatistics> deviceStatisticsMap,
			Map<String, DeviceClassConfiguration> deviceClassesMap) {

		// Return object to gather statistics
		DeviceStatisticsAggregation deviceStatisticsAggregation = new DeviceStatisticsAggregation();
		
		// Loop through all tenans deviceStatistics
		Iterator<Entry<String, DeviceStatistics>> dsIterator = deviceStatisticsMap.entrySet().iterator();
		while (dsIterator.hasNext()) {
			Map.Entry<String, DeviceStatistics> pair = (Entry<String, DeviceStatistics>) dsIterator
					.next();
			String tenant= pair.getKey();
			DeviceStatistics ds = pair.getValue();
			DeviceClassConfiguration dcc = deviceClassesMap.get(tenant);
			deviceStatisticsAggregation.addTotalDevicesCount(ds.getStatistics().size());
			ds.getStatistics().forEach(devs ->{
				deviceStatisticsAggregation.addTotaMeas(devs.getCount());
				if (this.includeSubtenants) {
						DeviceStatisticsAggregation.TenantAggregation ta = new DeviceStatisticsAggregation.TenantAggregation();
						deviceStatisticsAggregation.getTenantAggregation().put(tenant, ta);
						ta.addToMeas(devs.getCount());
						ta.setDeviceClasses(dcc.getDeviceClasses());
						ta.setDevicesCount(ds.getStatistics().size());
						updateDeviceClass(dcc, devs.getCount(), ds.getDaysInMonth());
					}
					updateDeviceClass(deviceStatisticsAggregation.getTotalDeviceClasses(), 
						devs.getCount(), ds.getDaysInMonth());
			});	

		}
		return deviceStatisticsAggregation;
	}

	private void updateDeviceClass(DeviceClassConfiguration dcc, int count, int daysInMonth){
		float avgMea = count / daysInMonth;
		Iterator<DeviceClass> idc = dcc.getDeviceClasses().iterator();
		while (idc.hasNext()) {
			DeviceClass dc = idc.next();
			if (
				(dc.getAvgMaxMea() instanceof String && dc.getAvgMaxMea().equals("INFINITY") && avgMea >= Float.valueOf(dc.getAvgMinMea()))
				|| 
				(dc.getAvgMaxMea() instanceof Integer && avgMea >= Float.valueOf(dc.getAvgMinMea()) && avgMea < Float.valueOf((int)dc.getAvgMaxMea()))
			){
				dc.incrementCount();
			};
		}
	}

	public Optional<TenantRepresentation> getCurrentTenant() {
		try {
			return Optional.ofNullable(restConnector.get("/tenant/currentTenant", CumulocityMediaType.APPLICATION_JSON_TYPE, TenantRepresentation.class));
		} catch (final SDKException e) {
			log.error("Tenant#getCurrentTenant operation resulted in " + e.getMessage(), e);
		}
		return Optional.empty();
	}

	
}
