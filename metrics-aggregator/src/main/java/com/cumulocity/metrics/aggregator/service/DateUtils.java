package com.cumulocity.metrics.aggregator.service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * Thread-safe replacement for the shared SimpleDateFormat instances the services used to hold.
 * SimpleDateFormat is not thread-safe, and these singletons serve concurrent requests.
 */
final class DateUtils {

	private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("yyyy-MM-dd")
			.withZone(ZoneId.systemDefault());

	private DateUtils() {
	}

	static String formatDay(Date date) {
		return DAY.format(date.toInstant());
	}
}
