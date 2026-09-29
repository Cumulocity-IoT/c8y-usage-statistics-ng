package com.cumulocity.metrics.aggregator.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.cumulocity.metrics.aggregator.model.device.DeviceClassConfiguration;
import com.cumulocity.metrics.aggregator.model.device.DeviceStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.microservice.MicroservicesStatisticsAggregation;
import com.cumulocity.metrics.aggregator.model.microservice.TenantStatistics;

/**
 * The Usage Statistics UI depends on these property names. Spring Boot 4 serializes with Jackson 3 while the
 * Cumulocity SDK still brings Jackson 2, so the contract is checked against both.
 */
class JsonContractTest {

	enum Mapper {
		JACKSON_2 {
			@Override
			String write(Object o) throws Exception {
				return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(o);
			}

			@Override
			<T> T read(String json, Class<T> type) throws Exception {
				return new com.fasterxml.jackson.databind.ObjectMapper().readValue(json, type);
			}
		},
		JACKSON_3 {
			@Override
			String write(Object o) {
				return tools.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(o);
			}

			@Override
			<T> T read(String json, Class<T> type) {
				return tools.jackson.databind.json.JsonMapper.builder().build().readValue(json, type);
			}
		};

		abstract String write(Object o) throws Exception;

		abstract <T> T read(String json, Class<T> type) throws Exception;
	}

	@ParameterizedTest
	@EnumSource(Mapper.class)
	void microserviceTotalsExposeCcusInLowerCase(Mapper mapper) throws Exception {
		MicroservicesStatisticsAggregation agg = new MicroservicesStatisticsAggregation();
		agg.setTotalUsage(new TenantStatistics.Resources(1000, 2000, 1.5, 2.5, 3.0, new ArrayList<>()));

		String json = mapper.write(agg);

		assertTrue(json.contains("\"ccus\":3.0"), json);
		assertFalse(json.contains("\"CCUs\""), json);
		assertTrue(json.contains("\"avgCPU\":1.5"), json);
		assertTrue(json.contains("\"avgMemory\":2.5"), json);
		// Real GiB = memory CCUs * 4
		assertTrue(json.contains("\"avgMemoryGiB\":10.0"), json);
	}

	@ParameterizedTest
	@EnumSource(Mapper.class)
	void usedByExposesRealMemoryAndIgnoresItOnInput(Mapper mapper) throws Exception {
		TenantStatistics.UsedBy ub = new TenantStatistics.UsedBy();
		ub.setName("svc");
		ub.setAvgMemory(1.25);
		assertTrue(mapper.write(ub).contains("\"avgMemoryGiB\":5.0"));

		TenantStatistics.UsedBy parsed = mapper.read("{\"name\":\"svc\",\"avgMemory\":1.25,\"avgMemoryGiB\":99}",
				TenantStatistics.UsedBy.class);
		assertEquals(5.0, parsed.getAvgMemoryGiB());
	}

	@ParameterizedTest
	@EnumSource(Mapper.class)
	void deviceAggregationKeepsItsShape(Mapper mapper) throws Exception {
		String json = mapper.write(new DeviceStatisticsAggregation());

		assertTrue(json.contains("\"totalMeas\":0"), json);
		assertTrue(json.contains("\"totalDeviceCount\":0"), json);
		// DeviceClassConfiguration is @JsonValue, so the classes serialize as a plain array
		// (property order inside differs: Jackson 3 sorts alphabetically)
		assertTrue(json.contains("\"totalDeviceClasses\":[{"), json);
		assertTrue(json.contains("\"className\":\"Class A\""), json);
		assertTrue(json.contains("\"avgMaxMea\":\"INFINITY\""), json);
	}

	@ParameterizedTest
	@EnumSource(Mapper.class)
	void summaryWithUnknownFieldsAndLargeCountsParses(Mapper mapper) throws Exception {
		String json = "{\"measurementsCreatedCount\":5000000000,\"futureField\":1,"
				+ "\"resources\":{\"cpu\":10,\"memory\":20,\"futureField\":true,"
				+ "\"usedBy\":[{\"name\":\"svc\",\"cpu\":10,\"memory\":20,\"cause\":\"Owner\",\"futureField\":\"x\"}]}}";

		TenantStatistics stats = mapper.read(json, TenantStatistics.class);

		assertEquals(5_000_000_000L, stats.getMeasurementsCreatedCount());
		List<TenantStatistics.UsedBy> usedBy = stats.getResources().getUsedBy();
		assertEquals(1, usedBy.size());
		assertEquals("svc", usedBy.get(0).getName());
	}

	@ParameterizedTest
	@EnumSource(Mapper.class)
	void tenantOptionDeviceClassParses(Mapper mapper) throws Exception {
		DeviceClassConfiguration.DeviceClass dc = mapper.read(
				"{\"className\":\"Class F\",\"avgMinMea\":86400,\"avgMaxMea\":\"INFINITY\"}",
				DeviceClassConfiguration.DeviceClass.class);

		assertEquals("Class F", dc.getClassName());
		assertEquals("INFINITY", dc.getAvgMaxMea());
	}
}
