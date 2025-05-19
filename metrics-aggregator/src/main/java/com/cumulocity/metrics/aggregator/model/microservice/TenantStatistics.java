package com.cumulocity.metrics.aggregator.model.microservice;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TenantStatistics {
    private long deviceEndpointCount;
    private long deviceWithChildrenCount;
    private long inventoriesUpdatedCount;
    private long eventsUpdatedCount;

    @JsonIgnore
    private ZonedDateTime day;
    private long requestCount;
    private long deviceCount;
    private long deviceRequestCount;

    // @JsonIgnore
    private Resources resources;

    @JsonIgnore
    private long storageLimitPerDevice;
    private long eventsCreatedCount;

    @JsonIgnore
    private List<String> subscribedApplications;
    private long alarmsCreatedCount;
    private long alarmsUpdatedCount;
    private long inventoriesCreatedCount;
    private long storageSize;
    private String storageHumanReadable;
    private long meas;
    
    public long getMeas() {
        return meas;
    }

    public void setMeas(long meas) {
        this.meas = meas;
    }

    public String getStorageHumanReadable() {
        return storageHumanReadable;
    }

    public void setStorageHumanReadable(String storageHumanReadable) {
        this.storageHumanReadable = storageHumanReadable;
    }

    private long measurementsCreatedCount;

    @JsonIgnore
    private String self;
    private long totalResourceCreateAndUpdateCount;

    // Getter und Setter
    public long getDeviceEndpointCount() {
        return deviceEndpointCount;
    }

    public void setDeviceEndpointCount(long deviceEndpolongCount) {
        this.deviceEndpointCount = deviceEndpolongCount;
    }

    public long getDeviceWithChildrenCount() {
        return deviceWithChildrenCount;
    }

    public void setDeviceWithChildrenCount(long deviceWithChildrenCount) {
        this.deviceWithChildrenCount = deviceWithChildrenCount;
    }

    public long getInventoriesUpdatedCount() {
        return inventoriesUpdatedCount;
    }

    public void setInventoriesUpdatedCount(long inventoriesUpdatedCount) {
        this.inventoriesUpdatedCount = inventoriesUpdatedCount;
    }

    public long getEventsUpdatedCount() {
        return eventsUpdatedCount;
    }

    public void setEventsUpdatedCount(long eventsUpdatedCount) {
        this.eventsUpdatedCount = eventsUpdatedCount;
    }

    public ZonedDateTime getDay() {
        return day;
    }

    public void setDay(ZonedDateTime day) {
        this.day = day;
    }

    public long getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(long requestCount) {
        this.requestCount = requestCount;
    }

    public long getDeviceCount() {
        return deviceCount;
    }

    public void setDeviceCount(long deviceCount) {
        this.deviceCount = deviceCount;
    }

    public long getDeviceRequestCount() {
        return deviceRequestCount;
    }

    public void setDeviceRequestCount(long deviceRequestCount) {
        this.deviceRequestCount = deviceRequestCount;
    }

    public Resources getResources() {
        return resources;
    }

    public void setResources(Resources resources) {
        this.resources = resources;
    }

    public long getStorageLimitPerDevice() {
        return storageLimitPerDevice;
    }

    public void setStorageLimitPerDevice(long storageLimitPerDevice) {
        this.storageLimitPerDevice = storageLimitPerDevice;
    }

    public long getEventsCreatedCount() {
        return eventsCreatedCount;
    }

    public void setEventsCreatedCount(long eventsCreatedCount) {
        this.eventsCreatedCount = eventsCreatedCount;
    }

    public List<String> getSubscribedApplications() {
        return subscribedApplications;
    }

    public void setSubscribedApplications(List<String> subscribedApplications) {
        this.subscribedApplications = subscribedApplications;
    }

    public long getAlarmsCreatedCount() {
        return alarmsCreatedCount;
    }

    public void setAlarmsCreatedCount(long alarmsCreatedCount) {
        this.alarmsCreatedCount = alarmsCreatedCount;
    }

    public long getAlarmsUpdatedCount() {
        return alarmsUpdatedCount;
    }

    public void setAlarmsUpdatedCount(long alarmsUpdatedCount) {
        this.alarmsUpdatedCount = alarmsUpdatedCount;
    }

    public long getInventoriesCreatedCount() {
        return inventoriesCreatedCount;
    }

    public void setInventoriesCreatedCount(long inventoriesCreatedCount) {
        this.inventoriesCreatedCount = inventoriesCreatedCount;
    }

    public long getStorageSize() {
        return storageSize;
    }

    public void setStorageSize(long storageSize) {
        this.storageSize = storageSize;
    }

    public long getMeasurementsCreatedCount() {
        return measurementsCreatedCount;
    }

    public void setMeasurementsCreatedCount(long measurementsCreatedCount) {
        this.measurementsCreatedCount = measurementsCreatedCount;
    }

    public String getSelf() {
        return self;
    }

    public void setSelf(String self) {
        this.self = self;
    }

    public long getTotalResourceCreateAndUpdateCount() {
        return totalResourceCreateAndUpdateCount;
    }

    public void setTotalResourceCreateAndUpdateCount(long totalResourceCreateAndUpdateCount) {
        this.totalResourceCreateAndUpdateCount = totalResourceCreateAndUpdateCount;
    }
    @JsonPropertyOrder({ "cpu", "avgCPU", "memory","avgMemory", "CCUs", "usedBy"})
    public static class Resources {

        public Resources(long cpu, long memory, double avgCPU, double avgMemory, double CCUs, List<UsedBy> usedBy) {
            this.setCpu(cpu);
            this.setMemory(memory);
            this.setAvgCPU(avgCPU);
            this.setAvgMemory(avgMemory);
            this.setCCUs(CCUs);
            this.setUsedBy(usedBy);
        }

        public Resources() {
            this.setCpu(0);
            this.setMemory(0);
            this.setAvgCPU(0);
            this.setAvgMemory(0);
            this.setUsedBy(new ArrayList<TenantStatistics.UsedBy>());
        }

        private long cpu;
        private long memory;
        private double avgMemory;
        private double avgCPU;
        private double CCUs;

        public double getCCUs() {
            return CCUs;
        }

        public void setCCUs(double cCUs) {
            CCUs = cCUs;
        }

        public double getAvgMemory() {
            return avgMemory;
        }

        public void setAvgMemory(double avgMemory) {
            this.avgMemory = avgMemory;
        }

        public double getAvgCPU() {
            return avgCPU;
        }

        public void setAvgCPU(double avgCPU) {
            this.avgCPU = avgCPU;
        }

        private List<UsedBy> usedBy;

        public long getMemory() {
            return memory;
        }

        public void setMemory(long memory) {
            this.memory = memory;
        }

        public long getCpu() {
            return cpu;
        }

        public void setCpu(long cpu) {
            this.cpu = cpu;
        }

        public List<UsedBy> getUsedBy() {
            return usedBy;
        }

        public void setUsedBy(List<UsedBy> usedBy) {
            this.usedBy = usedBy;
        }
    }

    public static class UsedBy {

        private long memory;
        private double avgMemory;
        private double avgCPU;
        public double getAvgMemory() {
            return avgMemory;
        }

        public void setAvgMemory(double avgMemory) {
            this.avgMemory = avgMemory;
        }

        public double getAvgCPU() {
            return avgCPU;
        }

        public void setAvgCPU(double avgCPU) {
            this.avgCPU = avgCPU;
        }

        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        private String name;
        private long cpu;
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        private String cause;

        public long getMemory() {
            return memory;
        }

        public void setMemory(long memory) {
            this.memory = memory;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public long getCpu() {
            return cpu;
        }

        public void setCpu(long cpu) {
            this.cpu = cpu;
        }

        public String getCause() {
            return cause;
        }

        public void setCause(String cause) {
            this.cause = cause;
        }
    }
}