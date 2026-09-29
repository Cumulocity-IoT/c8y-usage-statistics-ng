package com.cumulocity.metrics.aggregator.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import org.junit.jupiter.api.Test;

class MicroservicesCalculationTest {

	private static Date day(String iso) {
		return Date.from(LocalDate.parse(iso).atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

	@Test
	void periodIncludesBothEnds() {
		assertEquals(30, MicroservicesMetricsAggregationService.getDaysInPeriod(day("2026-09-01"), day("2026-09-30")));
		assertEquals(29, MicroservicesMetricsAggregationService.getDaysInPeriod(day("2028-02-01"), day("2028-02-29")));
	}

	@Test
	void ccusRoundDownWithinATenthOtherwiseUp() {
		assertEquals(4.0, MicroservicesMetricsAggregationService.calcCCUs(4.1, 0.7));
		assertEquals(5.0, MicroservicesMetricsAggregationService.calcCCUs(4.129, 0.7));
		assertEquals(3.0, MicroservicesMetricsAggregationService.calcCCUs(0.2, 2.5));
	}

	@Test
	void dayFormattingIsIsoDate() {
		assertEquals("2026-09-01", DateUtils.formatDay(day("2026-09-01")));
	}
}
