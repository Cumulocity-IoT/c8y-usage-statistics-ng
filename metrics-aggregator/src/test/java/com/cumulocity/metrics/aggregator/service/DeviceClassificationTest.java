package com.cumulocity.metrics.aggregator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.cumulocity.metrics.aggregator.model.device.DeviceClassConfiguration;
import com.cumulocity.metrics.aggregator.model.device.DeviceClassConfiguration.DeviceClass;

class DeviceClassificationTest {

	private static int countOf(DeviceClassConfiguration config, String className) {
		return config.getDeviceClasses().stream()
				.filter(dc -> dc.getClassName().equals(className))
				.mapToInt(DeviceClass::getCount)
				.sum();
	}

	@Test
	void boundsAreLowerInclusiveUpperExclusive() {
		DeviceClassConfiguration config = new DeviceClassConfiguration();
		DeviceMetricsAggregationService.updateDeviceClass(config, 24 * 30 - 1, 30); // 23.97/day
		DeviceMetricsAggregationService.updateDeviceClass(config, 24 * 30, 30); // exactly 24/day
		DeviceMetricsAggregationService.updateDeviceClass(config, 86_400L * 30, 30); // exactly 86400/day

		assertEquals(1, countOf(config, "Class A"));
		assertEquals(1, countOf(config, "Class B"));
		assertEquals(1, countOf(config, "Class F"));
	}

	@Test
	void countsAboveIntegerRangeAreClassified() {
		DeviceClassConfiguration config = new DeviceClassConfiguration();
		DeviceMetricsAggregationService.updateDeviceClass(config, 3_000_000_000L, 31);

		assertEquals(1, countOf(config, "Class F"));
	}

	@Test
	void tenantDefinedUpperBoundsMayBeAnyNumberType() {
		// Classes read from tenant options: Jackson maps the Object-typed upper bound to Integer, Long or Double
		DeviceClassConfiguration config = new DeviceClassConfiguration(List.of(
				new DeviceClass("Low", 0, 10.5, 0),
				new DeviceClass("Mid", 10, 5_000_000_000L, 0),
				new DeviceClass("High", 100, "infinity", 0)));

		DeviceMetricsAggregationService.updateDeviceClass(config, 10, 1);
		DeviceMetricsAggregationService.updateDeviceClass(config, 200, 1);

		assertEquals(1, countOf(config, "Low"));
		assertEquals(2, countOf(config, "Mid"));
		assertEquals(1, countOf(config, "High"));
	}
}
