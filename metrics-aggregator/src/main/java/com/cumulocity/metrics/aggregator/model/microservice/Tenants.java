package com.cumulocity.metrics.aggregator.model.microservice;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Tenants {
    @JsonProperty("tenants")
    private List<Tenant> tenants;

    // Getters and Setters
    public List<Tenant> getTenants() {
        return tenants;
    }

    public void setTenants(List<Tenant> tenants) {
        this.tenants = tenants;
    }

    // Inner class for Tenant
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Tenant {
        @JsonProperty("id")
        private String id;
        
        @JsonProperty("domain")
        private String domain;

        public String getDomain() {
            return domain;
        }

        public void setDomain(String domain) {
            this.domain = domain;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }
    }
}