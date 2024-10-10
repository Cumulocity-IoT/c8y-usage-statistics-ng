package com.cumulocity.metrics.aggregator.model;

import java.util.Objects;

/*
 * This class is used to represent the device Class definition inside each tenant
 * but also to be a part DeviceStatisticAggregation
 */

public class DeviceClass {
    private String className;
    private int avgMinMea;
    private Object avgMaxMea; // Using Object to accommodate both int and String ("INFINITY")
    private int monthlyThreshold;
    private int count;



    // Default constructor
    public DeviceClass() {}

    // Constructor with all fields
    public DeviceClass(String className, int avgMinMea, Object avgMaxMea, int monthlyThreshold, int count) {
        this.className = className;
        this.avgMinMea = avgMinMea;
        this.avgMaxMea = avgMaxMea;
        this.monthlyThreshold = monthlyThreshold;
        this.count = count;
    }

    // Getters and Setters
    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public int getAvgMinMea() {
        return avgMinMea;
    }

    public void setAvgMinMea(int avgMinMea) {
        this.avgMinMea = avgMinMea;
    }

    public Object getAvgMaxMea() {
        return avgMaxMea;
    }

    public void setAvgMaxMea(Object avgMaxMea) {
        this.avgMaxMea = avgMaxMea;
    }

    public int getMonthlyThreshold() {
        return monthlyThreshold;
    }

    public void setMonthlyThreshold(int monthlyThreshold) {
        this.monthlyThreshold = monthlyThreshold;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    // toString method
    @Override
    public String toString() {
        return "DeviceClass{" +
                "className='" + className + '\'' +
                ", avgMinMea=" + avgMinMea +
                ", avgMaxMea=" + avgMaxMea +
                ", monthlyThreshold=" + monthlyThreshold +
                ", count=" + count +
                '}';
    }

    @Override
    public int hashCode() {
        return Objects.hash(className, avgMinMea, avgMaxMea, monthlyThreshold);
    }
}
