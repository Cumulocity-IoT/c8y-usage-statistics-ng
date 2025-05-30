package com.cumulocity.metrics.aggregator.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.temporal.ChronoUnit;
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

	private List<String> tenantList;

	public List<String> getTenantList() {
		return tenantList;
	}

	public void setTenantList(List<String> tenantList) {
		this.tenantList = tenantList;
	}

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

	public List<String> getProductServices() {
		return productServices;
	}

	public void setProductServices(List<String> productServices) {
		this.productServices = productServices;
	}

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
			this.setDaysInMonth(dateFrom, dateTo);
			// Aggregation object will hold all statistics
			MicroservicesStatisticsAggregation microservicesStatisticsAggregation = new MicroservicesStatisticsAggregation();
	
			subscriptionsService.runForEachTenant(() -> {
				// Will hold the c8y API response for eacht tenant
				TenantStatistics tenantStatistics = new TenantStatistics();
				HttpHeaders headers = new HttpHeaders();
				for (String currentTenant : this.getTenantList()) {
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
							+ "&pageSize=2000&withTotalElements=true";
		
					RestTemplate restTemplate = new RestTemplate();
					HttpEntity<TenantStatistics> entity = new HttpEntity<TenantStatistics>(headers);
					try {
						ResponseEntity<TenantStatistics> response = restTemplate.exchange(serverUrl, HttpMethod.GET,
								entity, TenantStatistics.class);
						tenantStatistics = response.getBody();
						
					} catch (Exception e) {
						log.error(currentTenant, e);
					}
		
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
						// sum up resources on current tenant level
						tenantStatistics.getResources().setCpu(tenantStatistics.getResources().getUsedBy().stream()
								.mapToLong(ub -> ub.getCpu()  ).sum());
						tenantStatistics.getResources().setMemory(tenantStatistics.getResources().getUsedBy().stream()
								.mapToLong(ub ->  ub.getMemory() ).sum());

						// Calculate averages on current tenant level
						tenantStatistics.getResources().setAvgMemory(getMEMAverage(tenantStatistics.getResources().getMemory(), daysInMonth));
						tenantStatistics.getResources().setAvgCPU(getCPUAverage(tenantStatistics.getResources().getCpu(),daysInMonth));
						tenantStatistics.getResources().setCCUs(calcCCUs(tenantStatistics.getResources().getAvgCPU(), tenantStatistics.getResources().getAvgMemory()));
						
						// Add current tenant to aggregation
						microservicesStatisticsAggregation.getSubTenantStat().put(currentTenant,
								tenantStatistics.getResources());
					}else{
						microservicesStatisticsAggregation.getSubTenantStat().put(currentTenant,
								new TenantStatistics.Resources());
					}
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
			Map<String, TenantStatistics.UsedBy> aggForOneService = new HashMap<String, TenantStatistics.UsedBy>();
	
			// Object to hold the sum of all services
			UsedBy totalUsage = new UsedBy();
	
			// iterate over grouped entries to sum up the values for total
			Iterator<Entry<String, List<UsedBy>>> it = usedByGrouped.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<String, List<UsedBy>> oneServiceMultiUsedBy = it.next();
				Long oneServiceCpu = oneServiceMultiUsedBy.getValue().stream().mapToLong(ub -> ub.getCpu()).sum();
				Long oneServiceMem = oneServiceMultiUsedBy.getValue().stream().mapToLong(ub -> ub.getMemory()).sum();
				double avgCpu = getCPUAverage(oneServiceCpu, daysInMonth);
				double avgMem = getMEMAverage(oneServiceMem, daysInMonth);
				totalUsage.setCpu(totalUsage.getCpu() + oneServiceCpu);
				totalUsage.setMemory(totalUsage.getMemory() + oneServiceMem);
				totalUsage.setAvgCPU(totalUsage.getAvgCPU() + avgCpu);
				totalUsage.setAvgMemory(totalUsage.getAvgMemory() + avgMem);
	
				// Check if service entry exists
				if (aggForOneService.containsKey(oneServiceMultiUsedBy.getKey())) {
					// Fetch summed up values

					// CPU
					Long oneServiceTotalCpu = aggForOneService.get(oneServiceMultiUsedBy.getKey()).getCpu();
					oneServiceTotalCpu = oneServiceTotalCpu + oneServiceCpu;
					aggForOneService.get(oneServiceMultiUsedBy.getKey()).setCpu(oneServiceTotalCpu);

					// Mem
					Long oneServiceTotalMem = aggForOneService.get(oneServiceMultiUsedBy.getKey()).getMemory();
					oneServiceTotalMem = oneServiceTotalMem + oneServiceMem;
					aggForOneService.get(oneServiceMultiUsedBy.getKey()).setMemory(oneServiceTotalMem);

					// Calc Averages
					aggForOneService.get(oneServiceMultiUsedBy.getKey()).setAvgCPU(getCPUAverage(oneServiceTotalCpu, daysInMonth));
					aggForOneService.get(oneServiceMultiUsedBy.getKey()).setAvgMemory(getMEMAverage(oneServiceTotalMem, daysInMonth));
					
				} else {
					UsedBy ub = new UsedBy();
					ub.setCpu(oneServiceCpu);
					ub.setMemory(oneServiceMem);
					ub.setName(oneServiceMultiUsedBy.getKey());
					ub.setAvgCPU(avgCpu);
					ub.setAvgMemory(avgMem);
					aggForOneService.put(oneServiceMultiUsedBy.getKey(), ub);
				}
	
			}
			// Calc ccus
			double avCPU = getCPUAverage(totalUsage.getCpu(), daysInMonth);
			double avMem = getMEMAverage(totalUsage.getMemory(), daysInMonth);
			double ccus = calcCCUs(avCPU,avMem);

			// add summary and return
			microservicesStatisticsAggregation.setTotalUsage(
					new Resources(
							totalUsage.getCpu(),
							totalUsage.getMemory(),
							avCPU,
							avMem,
							ccus,
							new ArrayList<UsedBy>(aggForOneService.values())));
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

		static double calcCCUs(double avgCpu, double avgMem){
			// Calc CCUs avgCPU: 4.129032135009766 avgMem: 0.7061223685741425 greatest: 4.129032135009766 greatestFloor: 4.0  = 0,129032135 greater than 0,1 -> ceeling
			// Calc CCUs Using ceiling CCUs:5.0
			double greatest = Math.max(avgCpu, avgMem);
			double greatestFloor = Math.floor(greatest);
			
			log.info("Calc CCUs avgCPU: " + avgCpu + " avgMem: " +avgMem + " greatest: " + greatest + " greatestFloor: " + greatestFloor );
			if ( (greatest - greatestFloor) <= 0.1){
				log.info("Calc CCUs Using floor CCUs:" + greatestFloor);
				return  greatestFloor;
			}else{
				double greatestCeiling = Math.ceil(greatest);
				log.info("Calc CCUs Using ceiling CCUs:" + greatestCeiling);
				return  greatestCeiling;
			}
		}

	
		public void setDaysInMonth(Date dateFrom, Date dateTo) {
			this.daysInMonth = (int) ChronoUnit.DAYS.between(dateFrom.toInstant(),dateTo.toInstant()) +1;
    }
}
