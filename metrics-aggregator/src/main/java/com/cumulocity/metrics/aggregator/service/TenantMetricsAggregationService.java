package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cumulocity.metrics.aggregator.model.microservice.TenantStatistics;
import com.cumulocity.metrics.aggregator.model.microservice.TenantStatisticsAggregation;
import com.cumulocity.microservice.api.CumulocityClientProperties;
import com.cumulocity.microservice.context.ContextService;
import com.cumulocity.microservice.context.credentials.MicroserviceCredentials;
import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.sdk.client.RestConnector;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This service will aggregate microservices metrics to display in
 * the usage statistics app
 * It will iterate over all subscribed tenants and aggregate the metrics to an
 * overview
 * 
 * @author Marco Stoffel
 *
 */
@Service
public class TenantMetricsAggregationService {

	private static final Logger log = LoggerFactory.getLogger(TenantMetricsAggregationService.class);
	private DateFormat df;

	public TenantMetricsAggregationService() {
		this.df = new SimpleDateFormat("yyyy-MM-dd");
	}

	private String currentTenant = "";

	@Autowired
	MicroserviceSubscriptionsService subscriptionsService;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	ContextService<MicroserviceCredentials> contextService;

	@Autowired
	CumulocityClientProperties clientProperties;

	@Autowired
	CommonService commonService;

	@Autowired
	RestConnector restConnector;

	@EventListener
	public void initialize(MicroserviceSubscriptionAddedEvent event) {
		log.info("Tenant Sub: " + event.toString());
	}



	@Cacheable(value = "tenantCache", key = "#dateFrom.toString() + '-' + #dateTo.toString()")
	public TenantStatisticsAggregation getTenantStatisticsOverview(Date dateFrom, Date dateTo) {

		// Aggregation object will hold all statistics
		TenantStatisticsAggregation tenantStatisticsAggregation = new TenantStatisticsAggregation();
		subscriptionsService.runForEachTenant(() -> {
			// Will hold the c8y API response
			TenantStatistics tenantStatistics = new TenantStatistics();
			HttpHeaders headers = new HttpHeaders();
			for (String currentTenant : commonService.getTenantList()) {
				headers.set("Authorization",
						contextService.getContext().toCumulocityCredentials()
								.getAuthenticationString());
	
				headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
				log.info("Get Tenant Statistics for Tenant: " + currentTenant + "  date: " + df.format(dateFrom));
	
				String serverUrl = clientProperties.getBaseURL()
						+ "/tenant/statistics/summary/?tenant="
						+ currentTenant
						+ "&dateFrom=" + df.format(dateFrom)
						+ "&dateTo=" + df.format(dateTo)
						+ "&pageSize=2000&withTotalPages=true";
	
				RestTemplate restTemplate = new RestTemplate();
				HttpEntity<TenantStatistics> entity = new HttpEntity<TenantStatistics>(headers);
				ResponseEntity<TenantStatistics> response = restTemplate.exchange(serverUrl, HttpMethod.GET,
						entity, TenantStatistics.class);
	
				tenantStatistics = response.getBody();
				tenantStatistics.setResources(null);
				tenantStatisticsAggregation.calcTotalMeas(tenantStatistics);
				tenantStatisticsAggregation.getSubTenantStat().put(currentTenant, tenantStatistics);
				tenantStatisticsAggregation.addToTotalStatistics(tenantStatistics);
				tenantStatisticsAggregation.convertStorageToHumanReadable(tenantStatisticsAggregation.getTotalTenantStat().getStorageSize());
				
			}
		});
		
		tenantStatisticsAggregation.calcTotalMeas(tenantStatisticsAggregation.getTotalTenantStat());
		return tenantStatisticsAggregation;
	}

	

}
