package com.cumulocity.metrics.aggregator.model;

import java.time.ZonedDateTime;
import java.util.List;

public class TenantStatistics {
    private int deviceEndpointCount;
    private int deviceWithChildrenCount;
    private int inventoriesUpdatedCount;
    private int eventsUpdatedCount;
    private ZonedDateTime day;
    private int requestCount;
    private int deviceCount;
    private int deviceRequestCount;
    private Resources resources;
    private int storageLimitPerDevice;
    private int eventsCreatedCount;
    private List<String> subscribedApplications;
    private int alarmsCreatedCount;
    private int alarmsUpdatedCount;
    private int inventoriesCreatedCount;
    private long storageSize;
    private int measurementsCreatedCount;
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

    public static class Resources {
        private long memory;
        private long cpu;
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
        // public UsedBy(long memory, String name, long cpu, String cause){
        //     this.memory = memory;
        //     this.name= name;
        //     this.cpu=cpu;
        //     this.cause = cause;
        // };
        private long memory;
        private String name;
        private long cpu;
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