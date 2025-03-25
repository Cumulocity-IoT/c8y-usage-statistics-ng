package com.cumulocity.metrics.aggregator.service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cumulocity.metrics.aggregator.model.microservice.Tenants;
import com.cumulocity.metrics.aggregator.model.microservice.Tenants.Tenant;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.rest.representation.CumulocityMediaType;
import com.cumulocity.sdk.client.RestConnector;

@EnableAsync
@EnableScheduling
@Service
public class StartupUtils {
   
    private static final Logger log = LoggerFactory.getLogger(StartupUtils.class);
    
    private String currentTenant = "";
    
    // Enum for blacklist entry types
    private enum BlacklistType {
        EXACT,
        REGEX
    }
    
    // Enum for blacklist field types
    private enum BlacklistField {
        TENANT_ID("tenantId"), 
        DOMAIN("domain");
        
        private final String fieldName;
        
        BlacklistField(String fieldName) {
            this.fieldName = fieldName;
        }
        
        public String getFieldName() {
            return fieldName;
        }
    }
    
    // Inner class to represent blacklist entries
    private static class BlacklistEntry {
        private final BlacklistType type;
        private final String value;
        private final BlacklistField field;
        private final Pattern pattern;
        
        public BlacklistEntry(BlacklistType type, String value, BlacklistField field) {
            this.type = type;
            this.value = value;
            this.field = field;
            
            // Only compile pattern for regex type
            this.pattern = (type == BlacklistType.REGEX) ? Pattern.compile(value) : null;
        }
        
        /**
         * Check if this blacklist entry matches the given value
         * @param fieldToCheck Field to check against
         * @param valueToCheck The value to check against this rule
         * @return true if there's a match, false otherwise
         */
        public boolean matches(BlacklistField fieldToCheck, String valueToCheck) {
            // Only check if the fields match
            if (field != fieldToCheck) {
                return false;
            }
            
            // No value to check against
            if (valueToCheck == null) {
                return false;
            }
            
            // Check according to type
            switch (type) {
                case EXACT:
                    return value.equals(valueToCheck);
                case REGEX:
                    return pattern.matcher(valueToCheck).matches();
                default:
                    return false;
            }
        }
        
        @Override
        public String toString() {
            return "BlacklistEntry{type=" + type + 
                   ", value='" + value + 
                   "', field=" + field + "}";
        }
    }
    
    // Initialize the blacklist with entries from the JSON structure
    private final List<BlacklistEntry> blacklist = initializeBlacklist();
    
    private List<BlacklistEntry> initializeBlacklist() {
        List<BlacklistEntry> list = new ArrayList<>();
        
        // Add all entries from the JSON structure
        list.add(new BlacklistEntry(BlacklistType.EXACT, "monitoring-tenant", BlacklistField.TENANT_ID));
        list.add(new BlacklistEntry(BlacklistType.EXACT, "e2e-monitoring", BlacklistField.TENANT_ID));
        list.add(new BlacklistEntry(BlacklistType.EXACT, "datahub-monitoring", BlacklistField.TENANT_ID));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "pvt.*", BlacklistField.TENANT_ID));
        list.add(new BlacklistEntry(BlacklistType.EXACT, "statuspage-monitoring", BlacklistField.TENANT_ID));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "pvt.*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "c8y-pvt\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "monitoring-tenant\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "monitoringtest\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "c8ymon\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "c8ymonitor\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "c8ytest\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "cumulocity\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "statuspage-monitoring\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.REGEX, "mstoffel\\..*", BlacklistField.DOMAIN));
        list.add(new BlacklistEntry(BlacklistType.EXACT, "t1299412144", BlacklistField.TENANT_ID));
        
        log.info("Initialized blacklist with {} entries", list.size());
        return list;
    }
    
    /**
     * Check if a tenant should be excluded based on blacklist rules
     * @param tenantId The tenant ID to check
     * @param domain The domain to check
     * @return true if tenant should be excluded, false otherwise
     */
    private boolean isBlacklisted(String tenantId, String domain) {
        // The current tenant should never be blacklisted
        if (tenantId != null && tenantId.equals(currentTenant)) {
            return false;
        }
        
        for (BlacklistEntry entry : blacklist) {
            // Check against tenantId
            if (entry.field == BlacklistField.TENANT_ID && entry.matches(BlacklistField.TENANT_ID, tenantId)) {
                    log.info("Tenant '{}' is blacklisted by rule: {}", tenantId, entry);
                return true;
            }
            
            // Check against domain
            if (entry.field == BlacklistField.DOMAIN && entry.matches(BlacklistField.DOMAIN, domain)) {
                    log.debug("Domain '{}' is blacklisted by rule: {}", domain, entry);
                return true;
            }
        }
        
        return false;
    }

    public String getCurrentTenant() {
        return currentTenant;
    }

    public void setCurrentTenant(String currentTenant) {
        this.currentTenant = currentTenant;
    }

    @Autowired
    DeviceMetricsAggregationService deviceMetricsAggregationService;

    @Autowired
    MicroservicesMetricsAggregationService microservicesMetricsAggregationService;

    @Autowired
    TenantMetricsAggregationService tenantMetricsAggregationService;

    @Autowired
    MicroserviceSubscriptionsService subscriptionsService;
    
    @Autowired
    RestConnector restConnector;

    @Scheduled(cron = "0 45 */1 * * ?")
    @Async
    public void getTenants() {
        while (this.currentTenant.equals("")) {
            log.info("getTenants currentTenant not set waiting .... ");
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        log.info("getTenants for: " + this.currentTenant);
        this.subscriptionsService.runForTenant(this.currentTenant, () -> {
            Tenants tenants = restConnector.get(
                "/tenant/tenants?pageSize=2000&withTotalElements=true&withApps=false",
                CumulocityMediaType.APPLICATION_JSON_TYPE, Tenants.class);
            
            ArrayList<String> tenantIds = new ArrayList<>();
            int blacklistedCount = 0;
            
            // Always add current tenant first (never blacklisted)
            tenantIds.add(currentTenant);
            
            for (Tenant tenant : tenants.getTenants()) {
               
                
                // Skip current tenant as we've already added it
                if (tenant.getId().equals(currentTenant)) {
                    continue;
                }
                
                // Get domain from tenant (modify this based on your Tenant class structure)
                
                
                // Check if tenant is blacklisted
                if (!isBlacklisted(tenant.getId(), tenant.getDomain())) {
                    tenantIds.add(tenant.getId());
                } else {
                    blacklistedCount++;
                }
            }
            
            log.info("Found {} tenants ({} excluded due to blacklist)", 
                     tenantIds.size(), blacklistedCount);
            
            this.tenantMetricsAggregationService.setTenantList(tenantIds);
            this.deviceMetricsAggregationService.setTenantList(tenantIds);
            this.microservicesMetricsAggregationService.setTenantList(tenantIds);
        });
    }
    
    
}