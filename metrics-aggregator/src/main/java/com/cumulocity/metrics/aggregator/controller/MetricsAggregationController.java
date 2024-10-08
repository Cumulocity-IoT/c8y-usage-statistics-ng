package com.cumulocity.metrics.aggregator.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

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

import com.cumulocity.metrics.aggregator.model.DeviceClassRepresentation;
import com.cumulocity.metrics.aggregator.model.DeviceStatistics;
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

	@GetMapping(value = "/device/overview/{type}/{statDate}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HashMap<String,DeviceStatistics>> getAllDegetDeviceStatisticsOverviewviceNames(@PathVariable("type") String type, 
                @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date statDate ) {
        HashMap<String,DeviceStatistics> response = deviceService.getDeviceStatisticsOverview(type,statDate);
		return new ResponseEntity<HashMap<String, DeviceStatistics>>(response, HttpStatus.OK);
    }

	@GetMapping(value = "/device/overview/deviceclasses", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HashMap<String,ArrayList<DeviceClassRepresentation>>> getAllDeviceClassDefinitions(@RequestParam(value= "omitCache", required = false, defaultValue = "false") boolean omitCache) {
        HashMap<String,ArrayList<DeviceClassRepresentation>> response = deviceService.getdeviceClassConfiguration(omitCache );
		return new ResponseEntity<HashMap<String, ArrayList<DeviceClassRepresentation>>>(response, HttpStatus.OK);
    }

	@GetMapping(value = "/device/overview/deviceclassesaggregate/{type}/{statDate}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HashMap<String,ArrayList<DeviceClassRepresentation>>> getAggregatedDevicesPerClass(@PathVariable("type") String type, 
                @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date statDate ) {
        HashMap<String,ArrayList<DeviceClassRepresentation>> response = deviceService.getAggregatedDeviceClassStatistics(type, statDate); 
		return new ResponseEntity<HashMap<String, ArrayList<DeviceClassRepresentation>>>(response, HttpStatus.OK);
    }
}
