package com.cumulocity.metrics.aggregator.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cumulocity.metrics.aggregator.model.DeviceClassConfiguration.DeviceClass;

import java.math.BigInteger;

public class DeviceStatisticsAggregation {

    private Map<String, TenantAggregation> tenantAggregation;

    
    
    private BigInteger totalMeas;
    private int totalDevicesCount;
    private DeviceClassConfiguration totalDeviceClasses;
    
    public DeviceClassConfiguration getTotalDeviceClasses() {
        return totalDeviceClasses;
    }
    public void setTotalDeviceClasses(DeviceClassConfiguration totalDeviceClasses) {
        this.totalDeviceClasses = totalDeviceClasses;
    }
    public Map<String, TenantAggregation> getTenantAggregation() {
        return tenantAggregation;
    }
    public void setTenantAggregation(Map<String, TenantAggregation> tenantAggregation) {
        this.tenantAggregation = tenantAggregation;
    }
    public int getTotalDevicesCount() {
        return totalDevicesCount;
    }

    public void setTotalDevicesCount(int totalDevicesCount) {
        this.totalDevicesCount = totalDevicesCount;
    }

    public void setTotalMeas(BigInteger totalMeas) {
        this.totalMeas = totalMeas;
    }

    public BigInteger getTotalMeas() {
        return this.totalMeas;
    }

    public DeviceStatisticsAggregation() {
        this.tenantAggregation = new HashMap<String, TenantAggregation>();
        this.totalMeas = BigInteger.valueOf(0);
        this.totalDevicesCount =0;
        this.totalDeviceClasses = new DeviceClassConfiguration();
    }

    public static class TenantAggregation {

        private int meas;
        private int devicesCount;
        
        private List<DeviceClassConfiguration.DeviceClass> deviceClasses;
        private List<String> errors;
        
        public TenantAggregation() {
            this.meas = 0;
            this.deviceClasses = new ArrayList<DeviceClassConfiguration.DeviceClass>();
            this.errors = new ArrayList<String>();
            this.devicesCount =0;
        }
        
        public int getDevicesCount() {
            return devicesCount;
        }

        public void setDevicesCount(int devicesCount) {
            this.devicesCount = devicesCount;
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
