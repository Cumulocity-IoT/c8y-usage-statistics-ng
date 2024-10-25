package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cumulocity.metrics.aggregator.model.microservice.MicroservicesStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.microservice.TenantStatistics;
import com.cumulocity.metrics.aggregator.model.microservice.TenantStatistics.Resources;
import com.cumulocity.metrics.aggregator.model.microservice.TenantStatistics.UsedBy;
import com.cumulocity.microservice.api.CumulocityClientProperties;
import com.cumulocity.microservice.context.ContextService;
import com.cumulocity.microservice.context.credentials.MicroserviceCredentials;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.fasterxml.jackson.databind.ObjectMapper;




/**
 * This  service will aggregate  microservices metrics to display in
 * the usage statistics app
 * It will iterate over all subscribed tenants and aggregate the metrics to an
 * overview
 * 
 * @author Marco Stoffel
 *
 */
@Service
public class MicroservicesMetricsAggregationService {

	private static final Logger log = LoggerFactory.getLogger(MicroservicesMetricsAggregationService.class);
	private DateFormat df;

	// Product Services to exclude from statistics since they will not be billed.
	private List<String> productServices = Stream.of(
  "actility",
            "administration",
            "advanced-software-mgmt",
            "apama-ctrl-1c-4g",
            "apama-ctrl-250mc-1g", 
            "apama-ctrl-2c-8g",
            "apama-ctrl-smartrulesmt",
            "apama-ctrl-starter",
            "apama-oeeapp","apama-subscription-mgr",
            "billwerk-agent-server",
            "cellid", "c8y-community-utils",
            "c8ydata","cloud-remote-access",
            "cockpit",
            "cockpitbeta",
            "connectivity-agent-server",
            "core",
            "databroker-agent-server",
            "datahub",
            "DataHub",
            "device-counter-exporter",
            "devicemanagement",
            "device-simulator",
            "device-statistics-week",
            "digital-twin-manager",
            "dtm-ms",
            "dtm",
            "feature-cep-custom-rules",
            "feature-fieldbus4",
            "feature-microservice-hosting",
            "feature-user-hierarchy",
            "impact",
            "loriot-agent",
            "management","metadata-collector",
            "OEE","onnx",
            "opcua-mgmt-service",
            "oee-bundle",
            "public-options",
            "report-agent",
            "repository-connect",
            "sigfox-agent",
            "smartrule",
            "sms-gateway",
            "sslmanagement",
            "stratos-client",
            "Streaming Analytics",
            "tenant-cleanup",
            "tenant-data-exporter",
            "tenant-recovery",
            "zementis-small",
            "mlw",
            "nyoka",
            "cep",
            "apama-ctrl-24c-16g",
            "apama-ctrl-4c-8g",
            "apama-ctrl-025c-1g",
            "apama-ctrl-mt-4c-16g",
            "device-statistics-week").collect(Collectors.toList());

	public MicroservicesMetricsAggregationService(){
		this.df= new SimpleDateFormat("yyyy-MM-dd");
	}


	@Autowired
	MicroserviceSubscriptionsService subscriptionsService;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	ContextService<MicroserviceCredentials> contextService;

	@Autowired
	CumulocityClientProperties clientProperties;

	// @EventListener
	// public void initialize(MicroserviceSubscriptionAddedEvent event) {
		
	// 	String currentTenant = event.getCredentials().getTenant();
	// 	subscriptionsService.runForTenant(currentTenant, () -> {
	// 		this.subscribedTenantCount++;
	// 		this.allDeviceClassConfiguration.put(currentTenant, getDeviceClasseConfiguration(currentTenant));
	// 		log.info("Tenant: " + currentTenant + " subscribed. subscribedTenantCount: " + subscribedTenantCount
	// 				+ " Fetching DeviceClassConfiguration.");
	// 	});
	// }


	public MicroservicesStatisticsAggregation getMicroservicesStatisticsOverview( Date dateFrom, Date dateTo) {
		
		// Aggregation object will hold all statistics
		MicroservicesStatisticsAggregation microservicesStatisticsAggregation = new MicroservicesStatisticsAggregation();
		
		subscriptionsService.runForEachTenant(() -> {
			// Will hold the c8y API response
			TenantStatistics tenantStatistics = new TenantStatistics();
			HttpHeaders headers = new HttpHeaders();
			String currentTenant = subscriptionsService.getTenant();
			headers.set("Authorization",
					contextService.getContext().toCumulocityCredentials().getAuthenticationString());

			headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

			log.info("Get MS Statistics for Tenant: " + currentTenant  +  "  date: " +df.format(dateFrom));

			String serverUrl = clientProperties.getBaseURL() 
						+ "/tenant/statistics/summary/?tenant="
						+ currentTenant 
						+ "&dateFrom="+ df.format(dateFrom) 
						+ "&dateTo=" + df.format(dateTo)
						+ "&pageSize=2000&withTotalPages=true";

				RestTemplate restTemplate = new RestTemplate();
				HttpEntity<TenantStatistics> entity = new HttpEntity<TenantStatistics>(headers);
				ResponseEntity<TenantStatistics> response = restTemplate.exchange(serverUrl, HttpMethod.GET,entity,TenantStatistics.class);
				
			tenantStatistics = response.getBody();

			log.info("MicroservicesStatistics Resources: " + tenantStatistics.getResources().toString());

			// Exclude Product sdervices and empty results
			tenantStatistics.getResources().setUsedBy(
				tenantStatistics.getResources().getUsedBy().stream().filter(
					usedBy -> (
						!(this.productServices.contains(usedBy.getName())) 
						&& (usedBy.getCpu() > 0 || usedBy.getMemory() > 0)
						)).collect(Collectors.toList()));

			// Sum of tenant cpu & memory
			tenantStatistics.getResources().setCpu( tenantStatistics.getResources().getUsedBy().stream().mapToLong(ub -> ub.getCpu()).sum());
			tenantStatistics.getResources().setMemory( tenantStatistics.getResources().getUsedBy().stream().mapToLong(ub -> ub.getMemory()).sum());
			microservicesStatisticsAggregation.getSubTenantStat().put(currentTenant, tenantStatistics.getResources());
		});

		// Create a flat list of all usedBy objects of all subtenants to create total
		List<TenantStatistics.UsedBy> totalUsedByList = microservicesStatisticsAggregation.getSubTenantStat().values().stream()
				.map(r -> r.getUsedBy())
				.flatMap(x -> x.stream())
				.filter(r -> r.getCpu() > 0 || r.getMemory() > 0)
				.collect(Collectors.toList());

		// Create a map by grouping by service name
		Map<String,List<TenantStatistics.UsedBy>> usedByGrouped = totalUsedByList.stream().collect(Collectors.groupingBy(TenantStatistics.UsedBy::getName));

		// Target map to gather sum results of each service by name
		Map<String,TenantStatistics.UsedBy> agg = new HashMap<String,TenantStatistics.UsedBy>();

		// Object to hold the sum of all services 
		UsedBy totalUsage = new UsedBy();
		
		// iterate over grouped entries to sum up the values
		Iterator<Entry<String, List<UsedBy>>> it = usedByGrouped.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String, List<UsedBy>> pair = it.next();
			Long cpu = pair.getValue().stream().mapToLong(ub -> ub.getCpu()).sum();
			Long mem = pair.getValue().stream().mapToLong(ub -> ub.getMemory()).sum();
			totalUsage.setCpu(totalUsage.getCpu() + cpu);
			totalUsage.setMemory(totalUsage.getMemory() + mem);
			
			// Check if entry exists
			if (agg.containsKey(pair.getKey())){
				Long allCpu = agg.get(pair.getKey()).getCpu();
				Long allMem = agg.get(pair.getKey()).getMemory();
				agg.get(pair.getKey()).setCpu(allCpu + cpu);
				agg.get(pair.getKey()).setMemory(allMem + mem);
			} else{
				UsedBy ub = new UsedBy();
				ub.setCpu(cpu);
				ub.setMemory(mem);
				ub.setName(pair.getKey());
				agg.put(pair.getKey(),ub);
			}
			
		}

		// add summary and return
		microservicesStatisticsAggregation.setTotalUsage(
			new Resources(	totalUsage.getCpu(),
							totalUsage.getMemory(),
							new ArrayList<UsedBy>(agg.values())
							));
		return microservicesStatisticsAggregation;
	}
	
}
