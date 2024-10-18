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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cumulocity.metrics.aggregator.model.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.service.DeviceMetricsAggregationService;

/**
 * This is an example controller. This should be removed for your real project!
 * 
 * @author APES
 *
 */
@RestController
@RequestMapping("/devices")
public class DeviceAggregationController {

	private static final Logger log = LoggerFactory.getLogger(DeviceAggregationController.class);
	private DeviceMetricsAggregationService deviceService;
	
	@Autowired
	public DeviceAggregationController(DeviceMetricsAggregationService deviceService) {
		this.deviceService = deviceService;

	}

	@GetMapping(value = "/{type}/{statDate}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<DeviceStatisticsAggregation> getAggregatedDevicesPerClass(@PathVariable("type") String type,
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date statDate, @RequestParam(value = "includeSubtenants", required = false, defaultValue = "false") boolean includeSubtenants) {
		DeviceStatisticsAggregation response = deviceService.getAggregatedDeviceClassStatistics(type, statDate, includeSubtenants);
		return new ResponseEntity<DeviceStatisticsAggregation>(response, HttpStatus.OK);
	}
}
