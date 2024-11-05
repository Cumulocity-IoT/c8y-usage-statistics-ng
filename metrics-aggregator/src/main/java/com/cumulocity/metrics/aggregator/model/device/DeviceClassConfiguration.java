package com.cumulocity.metrics.aggregator.model.device;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonValue;

/*
 * This class is used to represent the device Class definition inside each tenant
 * but also to be a part DeviceStatisticAggregation
 */

public class DeviceClassConfiguration {
    @JsonValue
    private List<DeviceClass> deviceClasses;

    public DeviceClassConfiguration(List<DeviceClass> deviceClasses) {
        this.deviceClasses = deviceClasses;
    }

    public DeviceClassConfiguration() {
        List<DeviceClass> devcList = new ArrayList<DeviceClass>();
        devcList.add(new DeviceClass("Class A", 0, 24, 200));
        devcList.add(new DeviceClass("Class B", 24, 144, 200));
        devcList.add(new DeviceClass("Class C", 144, 1440, 50));
        devcList.add(new DeviceClass("Class D", 1440, 8640, 50));
        devcList.add(new DeviceClass("Class E", 8640, 86400, 50));
        devcList.add(new DeviceClass("Class F", 86400, "INFINITY", 50));
        this.deviceClasses = devcList;
    }

    public List<DeviceClass> getDeviceClasses() {
        return deviceClasses;
    }

    public void setDeviceClasses(List<DeviceClass> deviceClasses) {
        this.deviceClasses = deviceClasses;
    }

    public static class DeviceClass {
        private String className;
        private int avgMinMea;
        private Object avgMaxMea; // Using Object to accommodate both int and String ("INFINITY")
        private int monthlyThreshold;
        private int count;

        // Default constructor
        public DeviceClass() {
        }

        // Constructor with all fields
        public DeviceClass(String className, int avgMinMea, Object avgMaxMea, int monthlyThreshold) {
            this.className = className;
            this.avgMinMea = avgMinMea;
            this.avgMaxMea = avgMaxMea;
            this.monthlyThreshold = monthlyThreshold;
            this.count = 0;

        }

        // Getters and Setters
        public String getClassName() {
            return className;
        }

        public void setClassName(String className) {
            this.className = className;
        }

        public int getAvgMinMea() {
            return avgMinMea;
        }

        public void setAvgMinMea(int avgMinMea) {
            this.avgMinMea = avgMinMea;
        }

        public Object getAvgMaxMea() {
            return avgMaxMea;
        }

        public void setAvgMaxMea(Object avgMaxMea) {
            this.avgMaxMea = avgMaxMea;
        }

        public int getMonthlyThreshold() {
            return monthlyThreshold;
        }

        public void setMonthlyThreshold(int monthlyThreshold) {
            this.monthlyThreshold = monthlyThreshold;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public void incrementCount() {
            this.count++;
        }

        // toString method
        @Override
        public String toString() {
            return "DeviceClass{" +
                    "className='" + className + '\'' +
                    ", avgMinMea=" + avgMinMea +
                    ", avgMaxMea=" + avgMaxMea +
                    ", monthlyThreshold=" + monthlyThreshold +
                    ", count=" + count +
                    '}';
        }

        @Override
        public int hashCode() {
            return Objects.hash(className, avgMinMea, avgMaxMea, monthlyThreshold);
        }
    }
}