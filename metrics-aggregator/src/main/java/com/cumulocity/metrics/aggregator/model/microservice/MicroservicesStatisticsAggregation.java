package com.cumulocity.metrics.aggregator.model.microservice;

import java.util.Map;
import java.util.HashMap;

public class MicroservicesStatisticsAggregation {

    private TenantStatistics.Resources totalUsage;
    private Map<String, TenantStatistics.Resources> subTenantStat;

    public MicroservicesStatisticsAggregation() {
        this.subTenantStat = new HashMap<String, TenantStatistics.Resources>();
        this.totalUsage = new TenantStatistics.Resources();
    }

    public TenantStatistics.Resources getTotalUsage() {
        return this.totalUsage;
    }

    public void setTotalUsage(TenantStatistics.Resources totalUsage) {
        this.totalUsage = totalUsage;
    }

    public Map<String, TenantStatistics.Resources> getSubTenantStat() {
        return subTenantStat;
    }

    public void setSubTenantStat(Map<String, TenantStatistics.Resources> resourcesMap) {
        this.subTenantStat = resourcesMap;
    }
}
