package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
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
import org.springframework.cache.annotation.Cacheable;
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
 * This service will aggregate microservices metrics to display in
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
			"apama-oeeapp", "apama-subscription-mgr",
			"billwerk-agent-server",
			"cellid", "c8y-community-utils",
			"c8ydata", "cloud-remote-access",
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
			"management", "metadata-collector",
			"OEE", "onnx",
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
			"metrics-aggregator",
			"device-statistics-week").collect(Collectors.toList());

	public MicroservicesMetricsAggregationService() {
		this.df = new SimpleDateFormat("yyyy-MM-dd");
	}

	@Autowired
	MicroserviceSubscriptionsService subscriptionsService;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	ContextService<MicroserviceCredentials> contextService;

	@Autowired
	CumulocityClientProperties clientProperties;
		private int daysInMonth;
	
		@Cacheable(value = "microserviceCache", key = "#dateFrom.toString() + '-' + #dateTo.toString()")
		public MicroservicesStatisticsAggregation getMicroservicesStatisticsOverview(Date dateFrom, Date dateTo) {
			this.setDaysInMonth(dateFrom);
			// Aggregation object will hold all statistics
			MicroservicesStatisticsAggregation microservicesStatisticsAggregation = new MicroservicesStatisticsAggregation();
	
			subscriptionsService.runForEachTenant(() -> {
				// Will hold the c8y API response for eacht tenant
				TenantStatistics tenantStatistics = new TenantStatistics();
				HttpHeaders headers = new HttpHeaders();
				String currentTenant = subscriptionsService.getTenant();
				headers.set("Authorization",
						contextService.getContext().toCumulocityCredentials()
								.getAuthenticationString());
	
				headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
	
				log.info("Get MS Statistics for Tenant: " + currentTenant + "  date: " + df.format(dateFrom));
	
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
	
				// Exclude Product product services and empty results
				if (tenantStatistics.getResources() != null){
					tenantStatistics.getResources().setUsedBy(
							tenantStatistics.getResources().getUsedBy().stream().filter(
									usedBy -> (!(this.productServices.contains(usedBy.getName()))
											&& (usedBy.getCpu() > 0
													|| usedBy.getMemory() > 0)))
									.collect(Collectors.toList()));
		
					// Sum of tenant cpu & memory
					// calculate averages microservice level
					tenantStatistics.getResources().getUsedBy().forEach(ub-> {
						ub.setAvgCPU(getCPUAverage(ub.getCpu(), daysInMonth));
					});
					tenantStatistics.getResources().getUsedBy().forEach(ub-> {
						ub.setAvgMemory(getMEMAverage(ub.getMemory(), daysInMonth));
					});
					// sum up resources and averages on current tenant level
					tenantStatistics.getResources().setCpu(tenantStatistics.getResources().getUsedBy().stream()
							.mapToLong(ub -> ub.getCpu()  ).sum());
					tenantStatistics.getResources().setMemory(tenantStatistics.getResources().getUsedBy().stream()
							.mapToLong(ub ->  ub.getMemory() ).sum());

					// Calculate averages on current tenant level
					tenantStatistics.getResources().setAvgMemory(getMEMAverage(tenantStatistics.getResources().getMemory(), daysInMonth));
					tenantStatistics.getResources().setAvgCPU(getCPUAverage(tenantStatistics.getResources().getCpu(),daysInMonth));
					
					// Add current tenant to aggregation
					microservicesStatisticsAggregation.getSubTenantStat().put(currentTenant,
							tenantStatistics.getResources());
				}else{
					microservicesStatisticsAggregation.getSubTenantStat().put(currentTenant,
							new TenantStatistics.Resources());
				}
			});
			
			// Create a flat list of all usedBy objects of all subtenants to create total
			List<TenantStatistics.UsedBy> totalUsedByList = microservicesStatisticsAggregation.getSubTenantStat()
					.values().stream()
					.map(r -> r.getUsedBy())
					.flatMap(x -> x.stream())
					.filter(r -> r.getCpu() > 0 || r.getMemory() > 0)
					.collect(Collectors.toList());
	
			// Create a map by grouping by service name
			Map<String, List<TenantStatistics.UsedBy>> usedByGrouped = totalUsedByList.stream()
					.collect(Collectors.groupingBy(TenantStatistics.UsedBy::getName));
	
			// Target map to gather sum results of each service by name
			Map<String, TenantStatistics.UsedBy> agg = new HashMap<String, TenantStatistics.UsedBy>();
	
			// Object to hold the sum of all services
			UsedBy totalUsage = new UsedBy();
	
			// iterate over grouped entries to sum up the values for total
			Iterator<Entry<String, List<UsedBy>>> it = usedByGrouped.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<String, List<UsedBy>> pair = it.next();
				Long cpu = pair.getValue().stream().mapToLong(ub -> ub.getCpu()).sum();
				Long mem = pair.getValue().stream().mapToLong(ub -> ub.getMemory()).sum();
				double avgCpu = getCPUAverage(cpu, daysInMonth);
				double avgMem = getMEMAverage(mem, daysInMonth);
				totalUsage.setCpu(totalUsage.getCpu() + cpu);
				totalUsage.setMemory(totalUsage.getMemory() + mem);
				totalUsage.setAvgCPU(totalUsage.getAvgCPU() + avgCpu);
				totalUsage.setAvgMemory(totalUsage.getAvgMemory() + avgMem);
	
				// Check if entry exists
				if (agg.containsKey(pair.getKey())) {
					Long allCpu = agg.get(pair.getKey()).getCpu();
					Long allMem = agg.get(pair.getKey()).getMemory();
					agg.get(pair.getKey()).setCpu(allCpu + cpu);
					agg.get(pair.getKey()).setMemory(allMem + mem);
					double allAvgCpu = agg.get(pair.getKey()).getAvgCPU();
					double allAvgMem = agg.get(pair.getKey()).getAvgMemory();
					agg.get(pair.getKey()).setAvgCPU(allAvgCpu + avgCpu);
					agg.get(pair.getKey()).setAvgMemory(allAvgMem + avgMem);
				} else {
					UsedBy ub = new UsedBy();
					ub.setCpu(cpu);
					ub.setMemory(mem);
					ub.setName(pair.getKey());
					ub.setAvgCPU(avgCpu);
					ub.setAvgMemory(avgMem);
					agg.put(pair.getKey(), ub);
				}
	
			}
	
			// add summary and return
			microservicesStatisticsAggregation.setTotalUsage(
					new Resources(totalUsage.getCpu(),
							totalUsage.getMemory(),
							totalUsage.getAvgCPU(),
							totalUsage.getAvgMemory(),
							new ArrayList<UsedBy>(agg.values())));
			return microservicesStatisticsAggregation;
		}
	
		static double getCPUAverage(long cpu, int daysInMonth){
			double newCpu = ((float)(cpu) / (float)(1000 * daysInMonth));
			log.debug("Convert CPU from: " + cpu + " to: " +newCpu);
			return newCpu;
		}
		
		
		static double getMEMAverage(long mem, int daysInMonth){

			double newMem= ((float) mem / (float)(4294.97 * daysInMonth));
			log.debug("Convert MEM from: " + mem + "to: " +newMem);
			return newMem;
		}
	
		public void setDaysInMonth(Date date) {
			Calendar calendar = new GregorianCalendar();
			calendar.setTime(date);
			YearMonth yearMonthObject = YearMonth.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH ) +1 );
			this.daysInMonth = yearMonthObject.lengthOfMonth();

    }
}
