package com.cumulocity.metrics.aggregator.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cumulocity.metrics.aggregator.model.microservice.MicroservicesStatisticsAggregation;
import com.cumulocity.metrics.aggregator.service.MicroservicesMetricsAggregationService;

/**
 * This controller provides the inteface to request microservices statistics aggregation from all subscribed tenants of cumulocity
 * 
 * @author marco.stoffel@cumulocity.com
 *
 */
@PreAuthorize("hasRole('ROLE_TENANT_STATISTICS_READ') && hasRole('ROLE_TENANT_MANAGEMENT_READ')")
@RestController
@RequestMapping("/microservices")
public class MicroservicesAggregationController {

	private MicroservicesMetricsAggregationService microservicesMetricsAggregationServiceService;

	@Autowired
	public MicroservicesAggregationController(MicroservicesMetricsAggregationService microservicesMetricsAggregationService) {
		this.microservicesMetricsAggregationServiceService = microservicesMetricsAggregationService;
	}

	@GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<MicroservicesStatisticsAggregation> getMicroservicesStatisticsOverview(
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFrom, 
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateTo) {
		MicroservicesStatisticsAggregation response = microservicesMetricsAggregationServiceService.getMicroservicesStatisticsOverview(dateFrom,dateTo);
		return new ResponseEntity<MicroservicesStatisticsAggregation>(response, HttpStatus.OK);
	}

	@GetMapping(value = "/productServices", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<String>> getProductServices(){
		List<String> response = microservicesMetricsAggregationServiceService.getProductServices();
		return new ResponseEntity<List<String>>(response, HttpStatus.OK);
	}
}

