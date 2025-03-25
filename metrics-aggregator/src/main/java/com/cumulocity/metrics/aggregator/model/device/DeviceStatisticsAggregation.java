package com.cumulocity.metrics.aggregator.model.device;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.math.BigInteger;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({ "totalMeas", "totalDeviceCount", "totalDeviceClasses", "tenantAggregation" })
public class DeviceStatisticsAggregation {

    private Map<String, TenantAggregation> tenantAggregation;

    private BigInteger totalMeas;

    private int totalDeviceCount;

    @JsonUnwrapped
    @JsonProperty("totalDeviceClasses")
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

    public int getTotalDeviceCount() {
        return totalDeviceCount;
    }

    public void addTotalDevicesCount(int addToCount) {
        this.totalDeviceCount = this.totalDeviceCount + addToCount;
    }

    public void setTotalDeviceCount(int totalDevicesCount) {
        this.totalDeviceCount = totalDevicesCount;
    }

    public void setTotalMeas(BigInteger totalMeas) {
        this.totalMeas = totalMeas;
    }

    public void addTotalMeas(int meas) {
        this.totalMeas = this.totalMeas.add(BigInteger.valueOf(meas));
    }

    public BigInteger getTotalMeas() {
        return this.totalMeas;
    }

    public DeviceStatisticsAggregation() {
        this.tenantAggregation = new HashMap<String, TenantAggregation>();
        this.totalMeas = BigInteger.valueOf(0);
        this.totalDeviceCount = 0;
        this.totalDeviceClasses = new DeviceClassConfiguration();
    }

    public static class TenantAggregation {

        private int meas;
        private int devicesCount;

        @JsonUnwrapped
        private DeviceClassConfiguration deviceClasses;
        private List<String> errors;

        public TenantAggregation() {
            this.meas = 0;
            this.deviceClasses = new DeviceClassConfiguration();
            this.errors = new ArrayList<String>();
            this.devicesCount = 0;
        }

        public int getDevicesCount() {
            return devicesCount;
        }

        public void incrementDevicesCount() {
            this.devicesCount++;
        }

        public void addToMeas(int meas) {
            this.meas = this.meas + meas;
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

        public DeviceClassConfiguration getDeviceClasses() {
            return deviceClasses;
        }

        public void setDeviceClasses(DeviceClassConfiguration deviceClasses) {
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
