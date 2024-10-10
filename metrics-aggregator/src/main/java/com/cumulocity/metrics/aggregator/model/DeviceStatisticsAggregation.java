package com.cumulocity.metrics.aggregator.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.math.BigInteger;


public class DeviceStatisticsAggregation {

    private Map<String, TenantAggregation> tenantAggregation;

    public Map<String, TenantAggregation> getTenantAggregation() {
        return tenantAggregation;
    }

    public void setTenantAggregation(Map<String, TenantAggregation> tenantAggregation) {
        this.tenantAggregation = tenantAggregation;
    }

    private BigInteger totalMeas;

    public void setTotalMeas(BigInteger totalMeas) {
            this.totalMeas = totalMeas;
    }
    public BigInteger getTotalMeas() {
            return this.totalMeas;
    }
    public DeviceStatisticsAggregation(){
        this.tenantAggregation = new HashMap<String,TenantAggregation>();
        this.totalMeas = BigInteger.valueOf(0);
    }

    public static class TenantAggregation{

        private int meas;
        
        private List<DeviceClass> deviceClasses;
        private List<String> errors;
        
        

        public TenantAggregation(){
            this.meas = 0;
            this.deviceClasses = new ArrayList<DeviceClass>();
            this.errors = new ArrayList<String>();
        }
    
        public List<String> getErrors() {
            return errors;
        }
        public void setErrors(List<String> errors) {
            this.errors = errors;
        }
        public List<DeviceClass> getDeviceClasses() {
            return deviceClasses;
        }
        
        public void setDeviceClasses(List<DeviceClass> deviceClasses) {
            this.deviceClasses = deviceClasses;
        }
        
        public int getMeas() {
            return meas;
        }

        public void setMeas(int meas) {
            this.meas = meas;
        }

    
       
    }

   

}
