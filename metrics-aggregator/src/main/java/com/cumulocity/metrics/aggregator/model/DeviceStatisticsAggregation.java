package com.cumulocity.metrics.aggregator.model;

import java.util.ArrayList;
import java.util.List;
import java.math.BigInteger;


public class DeviceStatisticsAggregation {
    
    private BigInteger totalMeas;
    private List<DeviceClass> deviceClasses;
    private List<String> errors;

    public DeviceStatisticsAggregation(){
        this.totalMeas = BigInteger.valueOf(0);
        this.deviceClasses = new ArrayList<DeviceClass>();
        this.errors = new ArrayList<String>();
    }
    public List<DeviceClass> getDeviceClasses() {
        return deviceClasses;
    }
    
    public void setDeviceClasses(List<DeviceClass> deviceClasses) {
        this.deviceClasses = deviceClasses;
    }
    
    public BigInteger getTotalMeas() {
        return totalMeas;
    }

    public void setTotalMeas(BigInteger totalMeas) {
        this.totalMeas = totalMeas;
    }

}
