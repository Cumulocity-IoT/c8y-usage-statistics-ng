package com.cumulocity.metrics.aggregator.model.device;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;
import java.time.YearMonth;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import org.slf4j.Logger;

public class DeviceStatistics {

    public DeviceStatistics() {
    }
 
    private int daysInMonth;

    private String self;
    private List<Statistic> statistics;

    // Getters and setters
    public int getDaysInMonth() {
        return daysInMonth;
    }

    public void setDaysInMonth(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        YearMonth yearMonthObject = YearMonth.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH ) +1 );
        this.daysInMonth = yearMonthObject.lengthOfMonth();

    }

    public String getSelf() {
        return self;
    }

    public void setSelf(String self) {
        this.self = self;
    }

    public List<Statistic> getStatistics() {
        return statistics;
    }

    public void setStatistics(List<Statistic> statistics) {
        this.statistics = statistics;
    }

    public void logAllStatistics(Logger log) {

        for (Statistic statistic : statistics) {
            log.info(statistic.toString());
        }

    }

    public static class Statistic {
        private String deviceType;
        private int count;
        private List<String> deviceParents;
        private String deviceId;

        // Getters and setters
        public String getDeviceType() {
            return deviceType;
        }

        public void setDeviceType(String deviceType) {
            this.deviceType = deviceType;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        @JsonProperty("deviceParents")
        public List<String> getDeviceParents() {
            return deviceParents;
        }

        public void setDeviceParents(List<String> deviceParents) {
            this.deviceParents = deviceParents;
        }

        public String getDeviceId() {
            return deviceId;
        }

        public void setDeviceId(String deviceId) {
            this.deviceId = deviceId;
        }
    }
}