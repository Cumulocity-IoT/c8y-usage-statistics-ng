package com.cumulocity.metrics.aggregator.model.microservice;

import java.util.Map;
import java.lang.reflect.Field;
import java.util.HashMap;

public class TenantStatisticsAggregation {

    private Map<String, TenantStatistics> subTenantStat;
    private TenantStatistics totalTenantStat;

    public TenantStatisticsAggregation() {
        this.subTenantStat = new HashMap<String, TenantStatistics>();
        this.totalTenantStat = new TenantStatistics();
    }

    public TenantStatistics getTotalTenantStat() {
        return totalTenantStat;
    }

    public void setTotalTenantStat(TenantStatistics totalUsage) {
        this.totalTenantStat = totalUsage;
    }

    public Map<String, TenantStatistics> getSubTenantStat() {
        return subTenantStat;
    }

    public void setSubTenantStat(Map<String, TenantStatistics> subTenantStat) {
        this.subTenantStat = subTenantStat;
    }

    public void addToTotalStatistics(TenantStatistics tenantStatistics) {
        this.totalTenantStat.setAlarmsCreatedCount(
                this.totalTenantStat.getAlarmsCreatedCount() + tenantStatistics.getAlarmsCreatedCount());
        this.totalTenantStat.setAlarmsUpdatedCount(
                this.totalTenantStat.getAlarmsUpdatedCount() + tenantStatistics.getAlarmsUpdatedCount());
        this.totalTenantStat.setDeviceCount(this.totalTenantStat.getDeviceCount() + tenantStatistics.getDeviceCount());
        this.totalTenantStat.setDeviceEndpointCount(
                this.totalTenantStat.getDeviceEndpointCount() + tenantStatistics.getDeviceEndpointCount());
        this.totalTenantStat.setDeviceRequestCount(
                this.totalTenantStat.getDeviceRequestCount() + tenantStatistics.getDeviceRequestCount());
        this.totalTenantStat.setDeviceWithChildrenCount(
                this.totalTenantStat.getDeviceWithChildrenCount() + tenantStatistics.getDeviceWithChildrenCount());
        this.totalTenantStat.setEventsCreatedCount(
                this.totalTenantStat.getEventsCreatedCount() + tenantStatistics.getEventsCreatedCount());
        this.totalTenantStat.setEventsUpdatedCount(
                this.totalTenantStat.getEventsUpdatedCount() + tenantStatistics.getEventsUpdatedCount());
        this.totalTenantStat.setInventoriesCreatedCount(
                this.totalTenantStat.getInventoriesCreatedCount() + tenantStatistics.getInventoriesCreatedCount());
        this.totalTenantStat.setInventoriesUpdatedCount(
                this.totalTenantStat.getInventoriesUpdatedCount() + tenantStatistics.getInventoriesUpdatedCount());
        this.totalTenantStat.setMeasurementsCreatedCount(
                this.totalTenantStat.getMeasurementsCreatedCount() + tenantStatistics.getMeasurementsCreatedCount());
        this.totalTenantStat
                .setRequestCount(this.totalTenantStat.getRequestCount() + tenantStatistics.getRequestCount());
        this.totalTenantStat.setStorageSize(this.totalTenantStat.getStorageSize() + tenantStatistics.getStorageSize());
        this.totalTenantStat
                .setTotalResourceCreateAndUpdateCount(this.totalTenantStat.getTotalResourceCreateAndUpdateCount()
                        + tenantStatistics.getTotalResourceCreateAndUpdateCount());
    }

}
