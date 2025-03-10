package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cumulocity.sdk.client.RestConnector;
import com.cumulocity.sdk.client.SDKException;


import com.cumulocity.metrics.aggregator.model.device.DeviceClassConfiguration;
import com.cumulocity.metrics.aggregator.model.device.DeviceStatistics;
import com.cumulocity.metrics.aggregator.model.device.DeviceStatistics.Statistic;
import com.cumulocity.metrics.aggregator.model.device.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.device.DeviceClassConfiguration.DeviceClass;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.model.option.OptionPK;
import com.cumulocity.rest.representation.CumulocityMediaType;
import com.cumulocity.rest.representation.tenant.OptionRepresentation;
import com.cumulocity.sdk.client.option.TenantOptionApi;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;



/**
 * This is a service to aggregate device an microservices metrics to display in
 * the usage statistics app
 * It will iterate over all subscribed tenants and aggregate the metrics to an
 * overview
 * 
 * @author Marco Stoffel
 *
 */
@Configuration
@EnableScheduling
@Service
public class DeviceMetricsAggregationService {

	private static final Logger log = LoggerFactory.getLogger(DeviceMetricsAggregationService.class);

	private static final String OPTION_CATEGORY_CONFIGURATION = "configuration";
	private static final String OPTION_KEY = "device.statistics.class.details";

	private Map<String, DeviceClassConfiguration> allDeviceClassConfiguration = new HashMap<String, DeviceClassConfiguration>();
	//private Map<Date,DeviceStatisticsAggregation> deviceStatisticsAggregationCurrentMonth = new HashMap<Date,DeviceStatisticsAggregation>();


	DeviceStatisticsAggregation dailyDeviceStatisticsAggregation = new DeviceStatisticsAggregation();
	Instant dailyDeviceStatisticsAggregationLastRun=  Instant.now().minus(Period.ofDays(2));
	

	@Autowired
	RestConnector restConnector;

	@Autowired
	MicroserviceSubscriptionsService subscriptionsService;


	@Autowired
	TenantOptionApi tenantOptionApi;

	@Autowired
	ObjectMapper objectMapper;


	private List<String> tenantList;

	public List<String> getTenantList() {
		return tenantList;
	}

	public void setTenantList(List<String> tenantList) {
		this.tenantList = tenantList;
	}

	private DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

	public Map<String, DeviceStatistics> getDeviceStatisticsOverview(String type, Date statDate) {
		HashMap<String, DeviceStatistics> dsMap = new HashMap<String, DeviceStatistics>();
			for (String currentTenant : this.getTenantList()) {
				log.info("Get Statistics for Tenant: " + currentTenant);
				
				DeviceStatistics dspage = restConnector.get(
						"/tenant/statistics/device/" + currentTenant + "/" + type + "/" + df.format(statDate)
								+ "?pageSize=2000&withTotalPages=true",
						CumulocityMediaType.APPLICATION_JSON_TYPE, DeviceStatistics.class);
				dspage.setDaysInMonth(statDate,type);
				log.debug("Statistics: " + dspage.getStatistics().toString());
				dsMap.put(currentTenant, dspage);
			}
		return dsMap;
	}

	public Map<String, DeviceClassConfiguration> getAllDeviceClassConfiguration(boolean useTenantDeviceClasses) {
		log.info("# Fetching all deviceClassConfigurations, useTenantDeviceClasses: " + useTenantDeviceClasses);
		this.allDeviceClassConfiguration = new HashMap<String, DeviceClassConfiguration>();
		for (String currentTenant : this.getTenantList()) {
				if (useTenantDeviceClasses) {
					this.allDeviceClassConfiguration.put(currentTenant, getDeviceClasseConfiguration(currentTenant));
				} else {
					this.allDeviceClassConfiguration.put(currentTenant, new DeviceClassConfiguration());
				}

		}
		return allDeviceClassConfiguration;
	}

	private DeviceClassConfiguration getDeviceClasseConfiguration(String currentTenant) {
		log.info("Get DeviceClassConfiguration for Tenant: " + currentTenant);
		final OptionPK option = new OptionPK();
		option.setCategory(OPTION_CATEGORY_CONFIGURATION);
		option.setKey(OPTION_KEY);
		OptionRepresentation optionRepresentation = new OptionRepresentation();
		List<DeviceClassConfiguration.DeviceClass> dcl = new ArrayList<DeviceClassConfiguration.DeviceClass>();
		DeviceClassConfiguration deviceClassConfiguration = new DeviceClassConfiguration();
		try {
			optionRepresentation = tenantOptionApi.getOption(option);
			dcl = new ObjectMapper().readValue(
					optionRepresentation.getValue(),
					new TypeReference<List<DeviceClassConfiguration.DeviceClass>>() {
					});
			deviceClassConfiguration.setDeviceClasses(dcl);
		} catch (SDKException | JsonProcessingException e) {
			log.error("Could not get DeviceClassConfiguration form tenant options using default config.");
		}
		return deviceClassConfiguration;
	}

	@Cacheable(value = "deviceCache", key = "#statDate.toString() + '-' + #type + '-' + #includeSubtenants", condition = "#useTenantDeviceClasses == false")
	public DeviceStatisticsAggregation getAggregatedDeviceClassStatistics(String type, Date statDate,
			boolean includeSubtenants, boolean useTenantDeviceClasses) {
		// Get all Device Statistics for all Tenants

		Map<String, DeviceStatistics> deviceStatisticsMap = this.getDeviceStatisticsOverview(type, statDate);
		Map<String, DeviceClassConfiguration> deviceClassConfigurationMap = this
				.getAllDeviceClassConfiguration(useTenantDeviceClasses);
		// Get all device class configurations
		return getAggregatedDevicesPerClass(deviceStatisticsMap, deviceClassConfigurationMap, includeSubtenants, type);
	}



	private DeviceStatisticsAggregation getAggregatedDevicesPerClass(
			Map<String, DeviceStatistics> deviceStatisticsMap,
			Map<String, DeviceClassConfiguration> deviceClassesMap, boolean includeSubtenants, String type) {

		final Boolean incSubtenants = includeSubtenants;
		// Return object to gather statistics
		DeviceStatisticsAggregation deviceStatisticsAggregation = new DeviceStatisticsAggregation();

		// Loop through all tenans deviceStatistics
		Iterator<Entry<String, DeviceStatistics>> dsIterator = deviceStatisticsMap.entrySet().iterator();
		while (dsIterator.hasNext()) {
			Map.Entry<String, DeviceStatistics> pair = (Entry<String, DeviceStatistics>) dsIterator
					.next();
			String tenant = pair.getKey();
			DeviceStatistics ds = pair.getValue();
			DeviceClassConfiguration deviceClassConfigCurrentTenant = deviceClassesMap.get(tenant);
			// Write amount of devices to total
			deviceStatisticsAggregation.addTotalDevicesCount(ds.getStatistics().size());
			// Loop through all device statistics of current tenant
			DeviceStatisticsAggregation.TenantAggregation ta = new DeviceStatisticsAggregation.TenantAggregation();
			if (includeSubtenants) {
				deviceStatisticsAggregation.getTenantAggregation().put(tenant, ta);
			}
			ds.getStatistics().forEach(statOfSingleDevice -> {
				deviceStatisticsAggregation.addTotalMeas(statOfSingleDevice.getCount());
				if (incSubtenants) {
					ta.addToMeas(statOfSingleDevice.getCount());
					ta.setDeviceClasses(deviceClassConfigCurrentTenant);
					ta.setDevicesCount(ds.getStatistics().size());
					updateDeviceClass(ta.getDeviceClasses(), statOfSingleDevice.getCount(), ds.getDaysInMonth());
				}
				updateDeviceClass(deviceStatisticsAggregation.getTotalDeviceClasses(),
						statOfSingleDevice.getCount(), ds.getDaysInMonth());
			});

		}
		return deviceStatisticsAggregation;
	}

	
	private void updateDeviceClass(DeviceClassConfiguration deviceClassConfiguration, int count, int daysInMonth) {
		float avgMea = count / daysInMonth;
		Iterator<DeviceClass> idc = deviceClassConfiguration.getDeviceClasses().iterator();
		while (idc.hasNext()) {
			DeviceClass dc = idc.next();
			if ((dc.getAvgMaxMea() instanceof String && dc.getAvgMaxMea().equals("INFINITY")
					&& avgMea >= Float.valueOf(dc.getAvgMinMea()))
					||
					(dc.getAvgMaxMea() instanceof Integer && avgMea >= Float.valueOf(dc.getAvgMinMea())
							&& avgMea < Float.valueOf((int) dc.getAvgMaxMea()))) {
				dc.incrementCount();
			}
			;
		}
	}


	public DeviceStatisticsAggregation getDailyStatistics(boolean omitCache){
		Instant now = Instant.now();
		long hours = ChronoUnit.HOURS.between(this.dailyDeviceStatisticsAggregationLastRun, now );
		// fetch only when older than 12 hours
		if (omitCache || hours > 24 )	 {
			log.info("Getting Daily stats.");
			createDailyDeviceStatistics();
		}
		return this.dailyDeviceStatisticsAggregation;
	}


	
	public void createDailyDeviceStatistics(){

			this.dailyDeviceStatisticsAggregation = new DeviceStatisticsAggregation();
			Map<String,Integer> devicesDailyAggregation = new HashMap<String,Integer>();
			Calendar cal = Calendar.getInstance();
			
			int dayOfMonth = cal.get(Calendar.DAY_OF_MONTH);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			// cal.set(Calendar.MONTH, 1);
			// dayOfMonth = 28;
			
			// get all device meas from start of month
			for (int i = 1; i <= dayOfMonth; i++){
				cal.set(Calendar.DAY_OF_MONTH, i);
				Date statDate = cal.getTime();
				
				log.info("Get daily statistic: "+ statDate.toString());
				//this.deviceStatisticsAggregationCurrentMonth.put(statDate, getAggregatedDeviceClassStatistics("daily", statDate ,  false, false));
				Map<String, DeviceStatistics> devstat = this.getDeviceStatisticsOverview("daily", statDate);
	
				for (var entry : devstat.entrySet()) {
					List<Statistic> ls =entry.getValue().getStatistics();
					for (Statistic st : ls) {
						devicesDailyAggregation.put(
							st.getDeviceId(), 
							devicesDailyAggregation.getOrDefault(st.getDeviceId(), dayOfMonth) +st.getCount()
							);
					}
				}
			}
			
			// Get device classes
			this.dailyDeviceStatisticsAggregation.setTotalDeviceCount(devicesDailyAggregation.size());
			DeviceClassConfiguration dailyDeviceClasses = new DeviceClassConfiguration();
			for (var device : devicesDailyAggregation.entrySet()){
				this.dailyDeviceStatisticsAggregation.addTotalMeas(device.getValue());
				this.updateDeviceClass(dailyDeviceClasses, device.getValue(), dayOfMonth);
			}
			this.dailyDeviceStatisticsAggregation.setTotalDeviceClasses(dailyDeviceClasses);
			this.dailyDeviceStatisticsAggregationLastRun = Instant.now();
			//log.info("Daily Stat: " + this.deviceStatisticsAggregationCurrentMonth.toString());

    }


	@Scheduled(cron = "0 15 0 * * ?")
	public void scheduleDailyStatistics(){
		subscriptionsService.runForEachTenant(()->{
			this.createDailyDeviceStatistics();
		});
		log.info("ScheduledDailyStatistics");
	}
}
