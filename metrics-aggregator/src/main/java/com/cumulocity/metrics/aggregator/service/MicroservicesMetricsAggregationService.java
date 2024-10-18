package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.function.Predicate;
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

import com.cumulocity.sdk.client.RestConnector;
import com.cumulocity.metrics.aggregator.model.MicroservicesCategories;
import com.cumulocity.metrics.aggregator.model.MicroservicesStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.TenantStatistics;
import com.cumulocity.metrics.aggregator.model.TenantStatistics.Resources;
import com.cumulocity.metrics.aggregator.model.TenantStatistics.UsedBy;

import com.cumulocity.microservice.api.CumulocityClientProperties;
import com.cumulocity.microservice.context.ContextService;
import com.cumulocity.microservice.context.credentials.MicroserviceCredentials;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
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
@Service
public class MicroservicesMetricsAggregationService {

	private static final Logger log = LoggerFactory.getLogger(MicroservicesMetricsAggregationService.class);
	private DateFormat df;
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
	RestConnector restConnector;

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
		
		MicroservicesStatisticsAggregation microservicesStatisticsAggregation = new MicroservicesStatisticsAggregation();
		subscriptionsService.runForEachTenant(() -> {
			HttpHeaders headers = new HttpHeaders();
			String currentTenant = subscriptionsService.getTenant();
			//MicroserviceCredentials subscriptionsService.getCredentials(currentTenant).toString());
			headers.set("Authorization",
					contextService.getContext().toCumulocityCredentials().getAuthenticationString());

			headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

			log.info("Get Statistics for Tenant: " + currentTenant  +  "  date: " +df.format(dateFrom));
			// https://sag-dach.eu-latest.cumulocity.com/tenant/statistics/summary?dateFrom=2024-09-01&dateTo=2024-09-30&tenant=t15058219&pageSize=2000&tenant=t1299412144
			TenantStatistics tstats = new TenantStatistics();

			String serverUrl = clientProperties.getBaseURL() 
						+ "/tenant/statistics/summary/?tenant="
						+ currentTenant 
						+ "&dateFrom="+ df.format(dateFrom) 
						+ "&dateTo=" + df.format(dateTo)
						+ "&pageSize=2000&withTotalPages=true";

				RestTemplate restTemplate = new RestTemplate();
				HttpEntity<TenantStatistics> entity = new HttpEntity<TenantStatistics>(headers);
				ResponseEntity<TenantStatistics> response = restTemplate.exchange(serverUrl, HttpMethod.GET,entity,TenantStatistics.class);
				
			tstats = response.getBody();

			log.info("MicroservicesStatistics Resources: " + tstats.getResources().toString());
			

			// List<TenantStatistics.Resources.UsedBy> usb = tstats.getResources().getUsedBy().stream()
			// 	.collect(Collectors.groupingBy(TenantStatistics.UsedBy::getName))
			// 	.entrySet().stream()
			// 	.collect(Collectors.toMap(x -> {
			// 		long sumCPU = x.getValue().stream().mapToLong(TenantStatistics.UsedBy::getCpu).sum();
			// 		long sumMEM= x.getValue().stream().mapToLong(TenantStatistics.UsedBy::getMemory).sum();
			// 		return new TenantStatistics.Resources.usedBy();
			// 	}, Map.Entry::getValue));


			
			Predicate<TenantStatistics.UsedBy> notInProductServicesPredicate = ub -> (!this.productServices.contains(ub.getName()));
			List<TenantStatistics.UsedBy> removedUsedby = tstats.getResources().getUsedBy().stream().filter(notInProductServicesPredicate).collect(Collectors.toList());
			// 	ub -> ub.getName().contains("test")).collect(Collectors.toList()
			// );
			microservicesStatisticsAggregation.getResourcesMap().put(currentTenant, tstats.getResources());
		});
		return microservicesStatisticsAggregation;
	}
	
}
