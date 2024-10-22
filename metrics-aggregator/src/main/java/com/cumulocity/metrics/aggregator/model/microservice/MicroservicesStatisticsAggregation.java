package com.cumulocity.metrics.aggregator.model.microservice;

import java.util.Map;

import com.cumulocity.metrics.aggregator.model.microservice.TenantStatistics.UsedBy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class MicroservicesStatisticsAggregation {
    
    public MicroservicesStatisticsAggregation(){
        this.subTenantStat = new HashMap<String, TenantStatistics.Resources>();
    }
    
    private TenantStatistics.Resources totalUsage = new TenantStatistics.Resources();

    public TenantStatistics.Resources getTotalUsage() {
        return totalUsage;
    }

    public void setTotalUsage(TenantStatistics.Resources totalUsage) {
        this.totalUsage = totalUsage;
    }

    private Map<String, TenantStatistics.Resources> subTenantStat;
    

    public Map<String, TenantStatistics.Resources> getSubTenantStat() {
        return subTenantStat;
    }

    public void setSubTenantStat(Map<String, TenantStatistics.Resources> resourcesMap) {
        this.subTenantStat = resourcesMap;
    }
}
