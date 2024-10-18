package com.cumulocity.metrics.aggregator.model;

import java.util.Map;
import java.util.HashMap;

public class MicroservicesStatisticsAggregation {
    
    public MicroservicesStatisticsAggregation(){
        this.resourcesMap = new HashMap<String, TenantStatistics.Resources>();
    }

    private Map<String, TenantStatistics.Resources> resourcesMap;

    public Map<String, TenantStatistics.Resources> getResourcesMap() {
        return resourcesMap;
    }

    public void setResourcesMap(Map<String, TenantStatistics.Resources> resourcesMap) {
        this.resourcesMap = resourcesMap;
    }
}
