package com.cumulocity.metrics.aggregator.controller;

import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cumulocity.metrics.aggregator.model.MicroservicesStatisticsAggregation;
import com.cumulocity.metrics.aggregator.service.MicroservicesMetricsAggregationService;

/**
 * This is an example controller. This should be removed for your real project!
 * 
 * @author Marco Stoffel
 *
 */
@RestController
@RequestMapping("/microservices")
public class MicroservicesAggregationController {

	private static final Logger log = LoggerFactory.getLogger(MicroservicesAggregationController.class);
	private MicroservicesMetricsAggregationService microservicesMetricsAggregationServiceService;

	@Autowired
	public MicroservicesAggregationController(MicroservicesMetricsAggregationService microservicesMetricsAggregationService) {
		this.microservicesMetricsAggregationServiceService = microservicesMetricsAggregationService;
	}


	// https://sag-dach.eu-latest.cumulocity.com/service/metrics-aggregator/statistics/microservices?dateFrom=2024-08-01&dateTo=024-09-01
	@GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<MicroservicesStatisticsAggregation> getMicroservicesStatisticsOverview(
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFrom, 
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateTo) {
		MicroservicesStatisticsAggregation response = microservicesMetricsAggregationServiceService.getMicroservicesStatisticsOverview(dateFrom,dateTo);
		return new ResponseEntity<MicroservicesStatisticsAggregation>(response, HttpStatus.OK);
	}
}

