package com.cumulocity.metrics.aggregator.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cumulocity.metrics.aggregator.model.DeviceClassConfiguration;
import com.cumulocity.metrics.aggregator.model.DeviceStatistics;
import com.cumulocity.metrics.aggregator.model.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.service.MetricsAggregationService;

/**
 * This is an example controller. This should be removed for your real project!
 * 
 * @author APES
 *
 */
@RestController
@RequestMapping("/statistics")
public class MetricsAggregationController {

	private static final Logger log = LoggerFactory.getLogger(MetricsAggregationController.class);
	private MetricsAggregationService deviceService;

	@Autowired
	public MetricsAggregationController(MetricsAggregationService deviceService) {
		this.deviceService = deviceService;
	}

	@GetMapping(value = "/devices/{type}/{statDate}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, DeviceStatistics>> getAllDegetDeviceStatisticsOverviewviceNames(
			@PathVariable("type") String type,
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date statDate) {
		Map<String, DeviceStatistics> response = deviceService.getDeviceStatisticsOverview(type, statDate);
		return new ResponseEntity<Map<String, DeviceStatistics>>(response, HttpStatus.OK);
	}

	@GetMapping(value = "/deviceclasses", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, DeviceClassConfiguration>> getAllDeviceClassDefinitions(
			@RequestParam(value = "omitCache", required = false, defaultValue = "false") boolean omitCache) {
		Map<String, DeviceClassConfiguration> response = deviceService.getAllDeviceClassConfiguration(omitCache);
		return new ResponseEntity<Map<String, DeviceClassConfiguration>>(response, HttpStatus.OK);
	}

	@GetMapping(value = "/aggregated/{type}/{statDate}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<DeviceStatisticsAggregation> getAggregatedDevicesPerClass(@PathVariable("type") String type,
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date statDate, @RequestParam(value = "includeSubtenants", required = false, defaultValue = "false") boolean includeSubtenants) {
		DeviceStatisticsAggregation response = deviceService.getAggregatedDeviceClassStatistics(type, statDate, includeSubtenants);
		return new ResponseEntity<DeviceStatisticsAggregation>(response, HttpStatus.OK);
	}
}
