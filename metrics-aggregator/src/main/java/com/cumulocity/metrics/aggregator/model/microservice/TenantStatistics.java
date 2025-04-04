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
    private int deviceEndpointCount;
    private int deviceWithChildrenCount;
    private int inventoriesUpdatedCount;
    private int eventsUpdatedCount;

    @JsonIgnore
    private ZonedDateTime day;
    private int requestCount;
    private int deviceCount;
    private int deviceRequestCount;

    // @JsonIgnore
    private Resources resources;

    @JsonIgnore
    private int storageLimitPerDevice;
    private int eventsCreatedCount;

    @JsonIgnore
    private List<String> subscribedApplications;
    private int alarmsCreatedCount;
    private int alarmsUpdatedCount;
    private int inventoriesCreatedCount;
    private long storageSize;
    private String storageHumanReadable;
    private int meas;
    
    public int getMeas() {
        return meas;
    }

    public void setMeas(int meas) {
        this.meas = meas;
    }

    public String getStorageHumanReadable() {
        return storageHumanReadable;
    }

    public void setStorageHumanReadable(String storageHumanReadable) {
        this.storageHumanReadable = storageHumanReadable;
    }

    private int measurementsCreatedCount;

    @JsonIgnore
    private String self;
    private int totalResourceCreateAndUpdateCount;

    // Getter und Setter
    public int getDeviceEndpointCount() {
        return deviceEndpointCount;
    }

    public void setDeviceEndpointCount(int deviceEndpointCount) {
        this.deviceEndpointCount = deviceEndpointCount;
    }

    public int getDeviceWithChildrenCount() {
        return deviceWithChildrenCount;
    }

    public void setDeviceWithChildrenCount(int deviceWithChildrenCount) {
        this.deviceWithChildrenCount = deviceWithChildrenCount;
    }

    public int getInventoriesUpdatedCount() {
        return inventoriesUpdatedCount;
    }

    public void setInventoriesUpdatedCount(int inventoriesUpdatedCount) {
        this.inventoriesUpdatedCount = inventoriesUpdatedCount;
    }

    public int getEventsUpdatedCount() {
        return eventsUpdatedCount;
    }

    public void setEventsUpdatedCount(int eventsUpdatedCount) {
        this.eventsUpdatedCount = eventsUpdatedCount;
    }

    public ZonedDateTime getDay() {
        return day;
    }

    public void setDay(ZonedDateTime day) {
        this.day = day;
    }

    public int getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(int requestCount) {
        this.requestCount = requestCount;
    }

    public int getDeviceCount() {
        return deviceCount;
    }

    public void setDeviceCount(int deviceCount) {
        this.deviceCount = deviceCount;
    }

    public int getDeviceRequestCount() {
        return deviceRequestCount;
    }

    public void setDeviceRequestCount(int deviceRequestCount) {
        this.deviceRequestCount = deviceRequestCount;
    }

    public Resources getResources() {
        return resources;
    }

    public void setResources(Resources resources) {
        this.resources = resources;
    }

    public int getStorageLimitPerDevice() {
        return storageLimitPerDevice;
    }

    public void setStorageLimitPerDevice(int storageLimitPerDevice) {
        this.storageLimitPerDevice = storageLimitPerDevice;
    }

    public int getEventsCreatedCount() {
        return eventsCreatedCount;
    }

    public void setEventsCreatedCount(int eventsCreatedCount) {
        this.eventsCreatedCount = eventsCreatedCount;
    }

    public List<String> getSubscribedApplications() {
        return subscribedApplications;
    }

    public void setSubscribedApplications(List<String> subscribedApplications) {
        this.subscribedApplications = subscribedApplications;
    }

    public int getAlarmsCreatedCount() {
        return alarmsCreatedCount;
    }

    public void setAlarmsCreatedCount(int alarmsCreatedCount) {
        this.alarmsCreatedCount = alarmsCreatedCount;
    }

    public int getAlarmsUpdatedCount() {
        return alarmsUpdatedCount;
    }

    public void setAlarmsUpdatedCount(int alarmsUpdatedCount) {
        this.alarmsUpdatedCount = alarmsUpdatedCount;
    }

    public int getInventoriesCreatedCount() {
        return inventoriesCreatedCount;
    }

    public void setInventoriesCreatedCount(int inventoriesCreatedCount) {
        this.inventoriesCreatedCount = inventoriesCreatedCount;
    }

    public long getStorageSize() {
        return storageSize;
    }

    public void setStorageSize(long storageSize) {
        this.storageSize = storageSize;
    }

    public int getMeasurementsCreatedCount() {
        return measurementsCreatedCount;
    }

    public void setMeasurementsCreatedCount(int measurementsCreatedCount) {
        this.measurementsCreatedCount = measurementsCreatedCount;
    }

    public String getSelf() {
        return self;
    }

    public void setSelf(String self) {
        this.self = self;
    }

    public int getTotalResourceCreateAndUpdateCount() {
        return totalResourceCreateAndUpdateCount;
    }

    public void setTotalResourceCreateAndUpdateCount(int totalResourceCreateAndUpdateCount) {
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