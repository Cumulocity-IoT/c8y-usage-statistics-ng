package com.cumulocity.metrics.aggregator.controller;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cumulocity.metrics.aggregator.model.device.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.service.DeviceMetricsAggregationService;

/**
 * This controller provieds the interface to request device class statistics
 * from all subtenants on cumulocity!
 * 
 * @author marco.stoffel@cumulocity.com
 *
 */
@PreAuthorize("hasRole('ROLE_TENANT_STATISTICS_READ') && hasRole('ROLE_TENANT_MANAGEMENT_READ')")
@RestController
@RequestMapping("/devices")
public class DeviceAggregationController {

	private DeviceMetricsAggregationService deviceService;

	@Autowired
	public DeviceAggregationController(DeviceMetricsAggregationService deviceService) {
		this.deviceService = deviceService;
	}


	@GetMapping(value = "/{type}/{statDate}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<DeviceStatisticsAggregation> getAggregatedDevicesPerClass(
			@PathVariable("type") String type,
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date statDate,
			@RequestParam(value = "includeSubtenants", required = false, defaultValue = "false") boolean includeSubtenants,
			@RequestParam(value = "useTenantDeviceClasses", required = false, defaultValue = "false") boolean useTenantDeviceClasses) {
		DeviceStatisticsAggregation response = deviceService.getAggregatedDeviceClassStatistics(type, statDate,
				includeSubtenants, useTenantDeviceClasses);
		return new ResponseEntity<DeviceStatisticsAggregation>(response, HttpStatus.OK);
	}


	@GetMapping(value = "/dailystatistics", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<DeviceStatisticsAggregation> getDailyAggregatedDevicesPerClass(
			@RequestParam(value = "omitCache", required = false, defaultValue = "false") boolean omitCache) {
		DeviceStatisticsAggregation response = deviceService.getDailyStatistics(omitCache);
		return new ResponseEntity<DeviceStatisticsAggregation>(response, HttpStatus.OK);
	}
}
