package com.cumulocity.metrics.aggregator.model.microservice;

import java.util.ArrayList;
import java.util.List;

public class MicroservicesCategories {
    private List<MicroservicesCategory> microservicesCategories;

   // Default constructor
    public MicroservicesCategories() {
        this.microservicesCategories = new ArrayList<>();
        
        String[] microserviceProductServices = {
            "actility",
            "administration",
            "advanced-software-mgmt",
            "apama-ctrl-1c-4g",
            "apama-ctrl-250mc-1g", 
            "apama-ctrl-2c-8g",
            "apama-ctrl-smartrulesmt",
            "apama-ctrl-starter",
            "apama-oeeapp","apama-subscription-mgr",
            "billwerk-agent-server",
            "cellid", "c8y-community-utils",
            "c8ydata","cloud-remote-access",
            "cockpit",
            "cockpitbeta",
            "connectivity-agent-server",
            "core",
            "databroker-agent-server",
            "datahub",
            "DataHub",
            "device-counter-exporter",
            "devicemanagement",
            "device-simulator",
            "device-statistics-week",
            "digital-twin-manager",
            "dtm-ms",
            "dtm",
            "feature-cep-custom-rules",
            "feature-fieldbus4",
            "feature-microservice-hosting",
            "feature-user-hierarchy",
            "impact",
            "loriot-agent",
            "management","metadata-collector",
            "OEE","onnx",
            "opcua-mgmt-service",
            "oee-bundle",
            "public-options",
            "report-agent",
            "repository-connect",
            "sigfox-agent",
            "smartrule",
            "sms-gateway",
            "sslmanagement",
            "stratos-client",
            "Streaming Analytics",
            "tenant-cleanup",
            "tenant-data-exporter",
            "tenant-recovery",
            "zementis-small",
            "mlw",
            "nyoka",
            "cep",
            "apama-ctrl-24c-16g",
            "apama-ctrl-4c-8g",
            "apama-ctrl-025c-1g",
            "apama-ctrl-mt-4c-16g",
            "device-statistics-week"
        };
        
        for (String microserviceName : microserviceProductServices) {
            MicroservicesCategory category = new MicroservicesCategory();
            category.setMicroserviceName(microserviceName);
            category.setProductCategory("Product Services");
            this.microservicesCategories.add(category);
        }
    }

    // Parameterized constructor
    public MicroservicesCategories(List<MicroservicesCategory> microservicesCategories) {
        this.microservicesCategories = microservicesCategories;
    }

    // Getter for microservicesCategories
    public List<MicroservicesCategory> getMicroservicesCategories() {
        return microservicesCategories;
    }

    // Setter for microservicesCategories
    public void setMicroservicesCategories(List<MicroservicesCategory> microservicesCategories) {
        this.microservicesCategories = microservicesCategories;
    }

    // toString method for easy printing
    @Override
    public String toString() {
        return "MicroservicesCategoryWrapper{" +
                "microservicesCategories=" + microservicesCategories +
                '}';
    }

    // Static inner class MicroservicesCategory
    public static class MicroservicesCategory {
        private String microserviceName;
        private String productCategory;

        // Default constructor
        public MicroservicesCategory() {
        }

        // Parameterized constructor
        public MicroservicesCategory(String microserviceName, String productCategory) {
            this.microserviceName = microserviceName;
            this.productCategory = productCategory;
        }

        // Getter for microserviceName
        public String getMicroserviceName() {
            return microserviceName;
        }

        // Setter for microserviceName
        public void setMicroserviceName(String microserviceName) {
            this.microserviceName = microserviceName;
        }

        // Getter for productCategory
        public String getProductCategory() {
            return productCategory;
        }

        // Setter for productCategory
        public void setProductCategory(String productCategory) {
            this.productCategory = productCategory;
        }

        // toString method for easy printing
        @Override
        public String toString() {
            return "MicroservicesCategory{" +
                    "microserviceName='" + microserviceName + '\'' +
                    ", productCategory='" + productCategory + '\'' +
                    '}';
        }
    }
}