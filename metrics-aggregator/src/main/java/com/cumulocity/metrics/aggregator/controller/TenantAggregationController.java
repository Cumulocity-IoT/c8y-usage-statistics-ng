package com.cumulocity.metrics.aggregator.controller;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cumulocity.metrics.aggregator.model.microservice.TenantStatisticsAggregation;
import com.cumulocity.metrics.aggregator.service.TenantMetricsAggregationService;

/**
 * This controller provides the inteface to request microservices statistics
 * aggregation from all subscribed tenants of cumulocity
 * 
 * @author marco.stoffel@cumulocity.com
 *
 */
@RestController
@RequestMapping("/tenants")
public class TenantAggregationController {

	private TenantMetricsAggregationService tenatMetricsAggregationService;

	@Autowired
	public TenantAggregationController(TenantMetricsAggregationService tenatMetricsAggregationService) {
		this.tenatMetricsAggregationService = tenatMetricsAggregationService;
	}

	@GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TenantStatisticsAggregation> getMicroservicesStatisticsOverview(
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFrom,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateTo) {
		TenantStatisticsAggregation response = tenatMetricsAggregationService.getTenantStatisticsOverview(dateFrom,
				dateTo);
		return new ResponseEntity<TenantStatisticsAggregation>(response, HttpStatus.OK);
	}
}
