export const mockTenantStatsSummaryResponse = {
    "aggregateStorageSize": 19700228,
    "deviceEndpointCount": 56746,
    "aggregateDeviceWithChildrenCount": 3,
    "deviceWithChildrenCount": 56746,
    "inventoriesUpdatedCount": 8727,
    "aggregateRequestCount": 1602264,
    "eventsUpdatedCount": 36,
    "aggregateDeviceRequestCount": 268,
    "aggregateDeviceEndpointCount": 3,
    "day": "2023-11-21T00:00:00.000Z",
    "requestCount": 2254863,
    "deviceCount": 56746,
    "deviceRequestCount": 761,
    "resources": {
        "memory": 82868,
        "cpu": 79012,
        "usedBy": [
            {
                "memory": 14750,
                "name": "usagestats-delivery",
                "cpu": 27470,
                "cause": "Subscribed"
            },
            {
                "memory": 13005,
                "name": "billing-aggregation",
                "cpu": 8467,
                "cause": "Subscribed"
            },
            {
                "memory": 20615,
                "name": "billing-reporter",
                "cpu": 20615,
                "cause": "Subscribed"
            },
            {
                "memory": 34498,
                "name": "billing-aggregation",
                "cpu": 22460,
                "cause": "Subscribed"
            }
        ]
    },
    "storageLimitPerDevice": 0,
    "eventsCreatedCount": 213688,
    "subscribedApplications": [
        "lwm2m-agent",
        "report-agent",
        "digital-twin-manager",
        "administration",
        "feature-microservice-hosting",
        "device-simulator",
        "feature-cep-custom-rules",
        "dtm",
        "cep",
        "statistics-288965a1",
        "devicemanagement",
        "usagestats-delivery",
        "advanced-software-mgmt",
        "billing-aggregation",
        "billing-reporter",
        "sms-gateway",
        "smartrule",
        "cockpit"
    ],
    "alarmsCreatedCount": 32,
    "alarmsUpdatedCount": 0,
    "inventoriesCreatedCount": 6,
    "aggregateDeviceCount": 3,
    "storageSize": 18308439969,
    "measurementsCreatedCount": 325535,
    "self": "https://billing.latest.stage.c8y.io/tenant/statistics/summary",
    "totalResourceCreateAndUpdateCount": 548024
}

export const mockSubTenantListResponse = {
    "next": null,
    "tenants": [{
        "allowCreateTenants": false,
        "parent": "billing",
        "creationTime": "2023-07-19T11:51:46.532Z",
        "storageLimitPerDevice": 0,
        "adminName": "billing",
        "customProperties": {},
        "domain": "billingsub1.latest.stage.c8y.io",
        "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t174959360",
        "company": "SoftwareAG",
        "id": "t174959360",
        "ownedApplications": {
            "references": [
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/796453",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t174959360",
                            "tenant": {
                                "id": "t174959360"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_TENANT_STATISTICS_READ",
                            "ROLE_INVENTORY_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "contextPath": "usagestats-delivery",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "8244",
                        "name": "usagestats-delivery",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/796453",
                        "id": "796453",
                        "key": "usagestats-delivery-key"
                    }
                }
            ],
            "self": "http://billing.latest.stage.c8y.io/application/applicationsByOwner/t174959360"
        },
        "contactPhone": "+919883774542",
        "status": "ACTIVE",
        "applications": {
            "references": [
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/705695",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_TENANT_STATISTICS_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "name": "statistics-288965a1",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/705695",
                        "id": "705695",
                        "key": "statistics-288965a1",
                        "description": "Microservice that allows tenant management to get access to this tenant."
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/74964",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_CREATE"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_ADVANCED_SOFTWARE_READ",
                            "ROLE_ADVANCED_SOFTWARE_ADMIN"
                        ],
                        "contextPath": "advanced-software-mgmt",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832422",
                        "name": "advanced-software-mgmt",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/74964",
                        "id": "74964",
                        "key": "advanced-software-mgmt-key",
                        "description": ""
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/289446",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_DIGITAL_TWIN_READ",
                            "ROLE_DIGITAL_TWIN_CREATE",
                            "ROLE_DIGITAL_TWIN_ADMIN"
                        ],
                        "contextPath": "dtm",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832467",
                        "name": "dtm",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/289446",
                        "id": "289446",
                        "key": "dtm-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/7",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "noAppSwitcher": true
                        },
                        "contextPath": "feature-cep-custom-rules",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "name": "feature-cep-custom-rules",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/7",
                        "id": "7",
                        "key": "c8y-feature-cep-custom-rules"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/28",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_APPLICATION_MANAGEMENT_READ",
                            "ROLE_SMS_ADMIN",
                            "ROLE_AUDIT_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SMS_READ",
                            "ROLE_SMS_ADMIN"
                        ],
                        "contextPath": "messaging",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180831269",
                        "name": "sms-gateway",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/28",
                        "id": "28",
                        "key": "sms-gateway-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/27",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_CREATE",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_CEP_MANAGEMENT_READ",
                            "ROLE_CEP_MANAGEMENT_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SMARTRULE_READ",
                            "ROLE_SMARTRULE_ADMIN"
                        ],
                        "contextPath": "smartrule",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832183",
                        "name": "smartrule",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/27",
                        "id": "27",
                        "key": "smartrule-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/15",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_CREATE",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SIMULATOR_ADMIN"
                        ],
                        "contextPath": "device-simulator",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180831110",
                        "name": "device-simulator",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/15",
                        "id": "15",
                        "key": "device-simulator-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/23",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_EVENT_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SCHEDULE_REPORT_ADMIN"
                        ],
                        "contextPath": "reporting",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180830420",
                        "name": "report-agent",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/23",
                        "id": "23",
                        "key": "report-agent-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/257",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_DEVICE_CONTROL_READ",
                            "ROLE_DEVICE_CONTROL_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_APPLICATION_MANAGEMENT_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "contextPath": "lwm2m-agent",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "name": "lwm2m-agent",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/257",
                        "id": "257",
                        "key": "lwm2m-agent-application-key",
                        "extensions": [
                            {
                                "name": "LWM2M",
                                "description": "The LWM2M Agent allows customers to connect devices via OMA Lightweight M2M",
                                "type": "extensibleDeviceRegistration"
                            },
                            {
                                "name": "LWM2M",
                                "description": "The LWM2M Agent allows customers to connect devices via OMA Lightweight M2M",
                                "type": "extensibleBulkDeviceRegistration"
                            }
                        ]
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/601150",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/billing",
                            "tenant": {
                                "id": "billing"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Cockpit application provides you with options to manage and monitor Internet of Things (IoT) assets and data from a business perspective.",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1017.273.0",
                            "sensorPhone": true,
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss: data:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1017.273.0",
                            "sensorAppOneLink": "http://onelink.to/pca6qe",
                            "breadcrumbs": false
                        },
                        "contextPath": "cockpit",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "48074207",
                        "name": "cockpit",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/601150",
                        "id": "601150",
                        "key": "cockpit-application-key",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss: data:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "sensorPhone": true,
                        "license": "ISC",
                        "sensorAppOneLink": "http://onelink.to/pca6qe",
                        "config": {
                            "remotes": {
                                "sag-pkg-community-plugins@2.1.1": [
                                    "ExampleWidgetPluginModule"
                                ],
                                "plugin-demo@1.0.3": [
                                    "WidgetPluginModule"
                                ],
                                "saas-demo@1.0.1": [
                                    "WidgetPluginModule"
                                ],
                                "my-application@1015.0.364": [
                                    "WidgetPluginModule"
                                ],
                                "my-sandbox-app@1.0.0": [
                                    "WidgetPluginModule"
                                ],
                                "sag-ps-iot-pkg-node-red-ui@2.0.0": [
                                    "NodeRedAdminModule"
                                ]
                            }
                        },
                        "breadcrumbs": false
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/285776",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "",
                            "rightDrawer": true,
                            "icon": {
                                "class": "c8y-icon c8y-icon-enterprise"
                            },
                            "description": "",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1019.0.0",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:; script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.481.0",
                            "copy": [
                                {
                                    "from": "./packages/digital-twin/assets/sample-asset-models",
                                    "to": "assets"
                                }
                            ]
                        },
                        "contextPath": "digital-twin-manager",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180692622",
                        "name": "digital-twin-manager",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/285776",
                        "id": "285776",
                        "key": "digital-twin-manager-application-key",
                        "globalTitle": "Cumulocity",
                        "upgrade": true,
                        "keywords": [],
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "author": "",
                        "rightDrawer": true,
                        "icon": {
                            "class": "c8y-icon c8y-icon-enterprise"
                        },
                        "description": "",
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:; script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "license": "ISC",
                        "config": {
                            "remotes": {}
                        },
                        "tenant": {
                            "id": "management"
                        }
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/705669",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/billing",
                            "tenant": {
                                "id": "billing"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_TENANT_STATISTICS_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "contextPath": "statistics-0c95c7ec",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "name": "statistics-0c95c7ec",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/705669",
                        "id": "705669",
                        "key": "statistics-0c95c7ec",
                        "description": "Microservice that allows tenant billing to get access to this tenant."
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/796453",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t174959360",
                            "tenant": {
                                "id": "t174959360"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_TENANT_STATISTICS_READ",
                            "ROLE_INVENTORY_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "contextPath": "usagestats-delivery",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "8244",
                        "name": "usagestats-delivery",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/796453",
                        "id": "796453",
                        "key": "usagestats-delivery-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/4",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "noAppSwitcher": true
                        },
                        "contextPath": "feature-microservice-hosting",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "name": "feature-microservice-hosting",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/4",
                        "id": "4",
                        "key": "c8y-feature-microservice-hosting"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/3",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Administration application enables account administrators to manage their users, roles, tenants, applications and business rules and lets them configure a number of settings for their account.",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1018.497.6",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com  'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; media-src 'self' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.497.6"
                        },
                        "contextPath": "administration",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180810490",
                        "name": "administration",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/3",
                        "id": "3",
                        "key": "administration-application-key",
                        "license": "ISC",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com  'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "config": {
                            "remotes": {
                                "sag-ps-pkg-compass-widget@1.0.2": [
                                    "CompassWidgetModule"
                                ]
                            }
                        }
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t174959360/1",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Device Management application provides functionalities for managing and monitoring devices and enables you to control and troubleshoot devices remotely.",
                            "contextHelp": true,
                            "version": "1018.497.6",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.497.6",
                            "breadcrumbs": false
                        },
                        "contextPath": "devicemanagement",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180810492",
                        "name": "devicemanagement",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/1",
                        "id": "1",
                        "key": "devicemanagement-application-key",
                        "license": "ISC",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "config": {
                            "remotes": {}
                        },
                        "breadcrumbs": false
                    }
                }
            ],
            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t174959360/applications"
        }
    },
    {
        "allowCreateTenants": false,
        "parent": "billing",
        "creationTime": "2023-10-13T06:31:43.515Z",
        "storageLimitPerDevice": 0,
        "adminName": "usagetest",
        "customProperties": {},
        "domain": "usagetest.latest.stage.c8y.io",
        "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t179020819",
        "company": "usagetest",
        "id": "t179020819",
        "ownedApplications": {
            "references": [
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/810378",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t179020819",
                            "tenant": {
                                "id": "t179020819"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "package": "blueprint",
                            "keywords": [],
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity IoT",
                            "icon": {
                                "class": "c8y-icon c8y-icon-metering"
                            },
                            "description": "The Usage Statistics Application enables you to view consumption and usage information for your tenant within Cumulocity IoT. Many different types of data are present, including device statistics, microservice statistics, and tenant statistics. In addition, for select metrics, you have the ability to configure custom categories and thresholds, so that you can track your usage against pre-defined values. ",
                            "isPackage": true,
                            "tabsHorizontal": true,
                            "version": "0.1.0",
                            "license": "ISC",
                            "webSdkVersion": "1018.0.37",
                            "copy": [
                                {
                                    "from": "assets",
                                    "to": "assets"
                                }
                            ]
                        },
                        "contextPath": "sag-pkg-usage-statistics",
                        "availability": "PRIVATE",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "applicationVersions": [
                            {
                                "version": "0.1.0",
                                "tags": [
                                    "latest"
                                ],
                                "binaryId": "2201"
                            }
                        ],
                        "activeVersionId": "2201",
                        "name": "Usage Statistics",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/810378",
                        "id": "810378",
                        "key": "sag-pkg-usage-statistics-application-key",
                        "isPackage": true
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/810379",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t179020819",
                            "tenant": {
                                "id": "t179020819"
                            }
                        },
                        "manifest": {
                            "contextPath": "sag-pkg-usage-statistics",
                            "globalTitle": "Cumulocity",
                            "package": "blueprint",
                            "keywords": [],
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity IoT",
                            "icon": {
                                "class": "c8y-icon c8y-icon-metering"
                            },
                            "description": "The Usage Statistics Application enables you to view consumption and usage information for your tenant within Cumulocity IoT. Many different types of data are present, including device statistics, microservice statistics, and tenant statistics. In addition, for select metrics, you have the ability to configure custom categories and thresholds, so that you can track your usage against pre-defined values. ",
                            "isPackage": false,
                            "tabsHorizontal": true,
                            "source": "810378",
                            "version": "0.1.0",
                            "license": "ISC",
                            "webSdkVersion": "1018.0.37",
                            "name": "Usage Statistics",
                            "copy": [
                                {
                                    "from": "assets",
                                    "to": "assets"
                                }
                            ],
                            "key": "sag-pkg-usage-statistics-application-key",
                            "isSetup": true
                        },
                        "contextPath": "sag-pkg-usage-statistics-1",
                        "availability": "PRIVATE",
                        "type": "HOSTED",
                        "resourcesUrl": "",
                        "activeVersionId": "123",
                        "name": "Usage Statistics-1",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/810379",
                        "id": "810379",
                        "key": "sag-pkg-usage-statistics-application-key-1",
                        "isSetup": true
                    }
                }
            ],
            "self": "http://billing.latest.stage.c8y.io/application/applicationsByOwner/t179020819"
        },
        "contactPhone": "+49 9 876 543 210",
        "status": "ACTIVE",
        "applications": {
            "references": [
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/74964",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_CREATE"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_ADVANCED_SOFTWARE_READ",
                            "ROLE_ADVANCED_SOFTWARE_ADMIN"
                        ],
                        "contextPath": "advanced-software-mgmt",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832422",
                        "name": "advanced-software-mgmt",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/74964",
                        "id": "74964",
                        "key": "advanced-software-mgmt-key",
                        "description": ""
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/289446",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_DIGITAL_TWIN_READ",
                            "ROLE_DIGITAL_TWIN_CREATE",
                            "ROLE_DIGITAL_TWIN_ADMIN"
                        ],
                        "contextPath": "dtm",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832467",
                        "name": "dtm",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/289446",
                        "id": "289446",
                        "key": "dtm-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/7",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "noAppSwitcher": true
                        },
                        "contextPath": "feature-cep-custom-rules",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "name": "feature-cep-custom-rules",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/7",
                        "id": "7",
                        "key": "c8y-feature-cep-custom-rules"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/28",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_APPLICATION_MANAGEMENT_READ",
                            "ROLE_SMS_ADMIN",
                            "ROLE_AUDIT_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SMS_READ",
                            "ROLE_SMS_ADMIN"
                        ],
                        "contextPath": "messaging",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180831269",
                        "name": "sms-gateway",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/28",
                        "id": "28",
                        "key": "sms-gateway-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/27",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_CREATE",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_CEP_MANAGEMENT_READ",
                            "ROLE_CEP_MANAGEMENT_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SMARTRULE_READ",
                            "ROLE_SMARTRULE_ADMIN"
                        ],
                        "contextPath": "smartrule",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832183",
                        "name": "smartrule",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/27",
                        "id": "27",
                        "key": "smartrule-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/15",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_CREATE",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SIMULATOR_ADMIN"
                        ],
                        "contextPath": "device-simulator",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180831110",
                        "name": "device-simulator",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/15",
                        "id": "15",
                        "key": "device-simulator-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/23",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_EVENT_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SCHEDULE_REPORT_ADMIN"
                        ],
                        "contextPath": "reporting",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180830420",
                        "name": "report-agent",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/23",
                        "id": "23",
                        "key": "report-agent-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/257",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_DEVICE_CONTROL_READ",
                            "ROLE_DEVICE_CONTROL_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_APPLICATION_MANAGEMENT_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "contextPath": "lwm2m-agent",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "name": "lwm2m-agent",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/257",
                        "id": "257",
                        "key": "lwm2m-agent-application-key",
                        "extensions": [
                            {
                                "name": "LWM2M",
                                "description": "The LWM2M Agent allows customers to connect devices via OMA Lightweight M2M",
                                "type": "extensibleDeviceRegistration"
                            },
                            {
                                "name": "LWM2M",
                                "description": "The LWM2M Agent allows customers to connect devices via OMA Lightweight M2M",
                                "type": "extensibleBulkDeviceRegistration"
                            }
                        ]
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/601150",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/billing",
                            "tenant": {
                                "id": "billing"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Cockpit application provides you with options to manage and monitor Internet of Things (IoT) assets and data from a business perspective.",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1017.273.0",
                            "sensorPhone": true,
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss: data:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1017.273.0",
                            "sensorAppOneLink": "http://onelink.to/pca6qe",
                            "breadcrumbs": false
                        },
                        "contextPath": "cockpit",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "48074207",
                        "name": "cockpit",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/601150",
                        "id": "601150",
                        "key": "cockpit-application-key",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss: data:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "sensorPhone": true,
                        "license": "ISC",
                        "sensorAppOneLink": "http://onelink.to/pca6qe",
                        "config": {
                            "remotes": {
                                "sag-pkg-community-plugins@2.1.1": [
                                    "ExampleWidgetPluginModule"
                                ],
                                "plugin-demo@1.0.3": [
                                    "WidgetPluginModule"
                                ],
                                "saas-demo@1.0.1": [
                                    "WidgetPluginModule"
                                ],
                                "my-application@1015.0.364": [
                                    "WidgetPluginModule"
                                ],
                                "my-sandbox-app@1.0.0": [
                                    "WidgetPluginModule"
                                ],
                                "sag-ps-iot-pkg-node-red-ui@2.0.0": [
                                    "NodeRedAdminModule"
                                ]
                            }
                        },
                        "breadcrumbs": false
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/285776",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "",
                            "rightDrawer": true,
                            "icon": {
                                "class": "c8y-icon c8y-icon-enterprise"
                            },
                            "description": "",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1019.0.0",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:; script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.481.0",
                            "copy": [
                                {
                                    "from": "./packages/digital-twin/assets/sample-asset-models",
                                    "to": "assets"
                                }
                            ]
                        },
                        "contextPath": "digital-twin-manager",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180692622",
                        "name": "digital-twin-manager",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/285776",
                        "id": "285776",
                        "key": "digital-twin-manager-application-key",
                        "globalTitle": "Cumulocity",
                        "upgrade": true,
                        "keywords": [],
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "author": "",
                        "rightDrawer": true,
                        "icon": {
                            "class": "c8y-icon c8y-icon-enterprise"
                        },
                        "description": "",
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:; script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "license": "ISC",
                        "config": {
                            "remotes": {}
                        },
                        "tenant": {
                            "id": "management"
                        }
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/4",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "noAppSwitcher": true
                        },
                        "contextPath": "feature-microservice-hosting",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "name": "feature-microservice-hosting",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/4",
                        "id": "4",
                        "key": "c8y-feature-microservice-hosting"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/3",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Administration application enables account administrators to manage their users, roles, tenants, applications and business rules and lets them configure a number of settings for their account.",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1018.497.6",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com  'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; media-src 'self' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.497.6"
                        },
                        "contextPath": "administration",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180810490",
                        "name": "administration",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/3",
                        "id": "3",
                        "key": "administration-application-key",
                        "license": "ISC",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com  'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "config": {
                            "remotes": {
                                "sag-ps-pkg-compass-widget@1.0.2": [
                                    "CompassWidgetModule"
                                ]
                            }
                        }
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179020819/1",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Device Management application provides functionalities for managing and monitoring devices and enables you to control and troubleshoot devices remotely.",
                            "contextHelp": true,
                            "version": "1018.497.6",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.497.6",
                            "breadcrumbs": false
                        },
                        "contextPath": "devicemanagement",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180810492",
                        "name": "devicemanagement",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/1",
                        "id": "1",
                        "key": "devicemanagement-application-key",
                        "license": "ISC",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "config": {
                            "remotes": {}
                        },
                        "breadcrumbs": false
                    }
                }
            ],
            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t179020819/applications"
        }
    },
    {
        "allowCreateTenants": false,
        "parent": "billing",
        "creationTime": "2023-10-27T05:32:57.546Z",
        "storageLimitPerDevice": 0,
        "adminName": "subtenantcreationtest",
        "customProperties": {},
        "domain": "subtenantcreationtest.latest.stage.c8y.io",
        "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t179730294",
        "company": "subtenantcreationtest",
        "id": "t179730294",
        "ownedApplications": {
            "references": [],
            "self": "http://billing.latest.stage.c8y.io/application/applicationsByOwner/t179730294"
        },
        "contactPhone": "+49 34567890",
        "status": "ACTIVE",
        "applications": {
            "references": [
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/74964",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_CREATE"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_ADVANCED_SOFTWARE_READ",
                            "ROLE_ADVANCED_SOFTWARE_ADMIN"
                        ],
                        "contextPath": "advanced-software-mgmt",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832422",
                        "name": "advanced-software-mgmt",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/74964",
                        "id": "74964",
                        "key": "advanced-software-mgmt-key",
                        "description": ""
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/289446",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_DIGITAL_TWIN_READ",
                            "ROLE_DIGITAL_TWIN_CREATE",
                            "ROLE_DIGITAL_TWIN_ADMIN"
                        ],
                        "contextPath": "dtm",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832467",
                        "name": "dtm",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/289446",
                        "id": "289446",
                        "key": "dtm-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/7",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "noAppSwitcher": true
                        },
                        "contextPath": "feature-cep-custom-rules",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "name": "feature-cep-custom-rules",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/7",
                        "id": "7",
                        "key": "c8y-feature-cep-custom-rules"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/28",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_APPLICATION_MANAGEMENT_READ",
                            "ROLE_SMS_ADMIN",
                            "ROLE_AUDIT_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SMS_READ",
                            "ROLE_SMS_ADMIN"
                        ],
                        "contextPath": "messaging",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180831269",
                        "name": "sms-gateway",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/28",
                        "id": "28",
                        "key": "sms-gateway-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/27",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_CREATE",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_CEP_MANAGEMENT_READ",
                            "ROLE_CEP_MANAGEMENT_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SMARTRULE_READ",
                            "ROLE_SMARTRULE_ADMIN"
                        ],
                        "contextPath": "smartrule",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180832183",
                        "name": "smartrule",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/27",
                        "id": "27",
                        "key": "smartrule-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/15",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_INVENTORY_CREATE",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SIMULATOR_ADMIN"
                        ],
                        "contextPath": "device-simulator",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180831110",
                        "name": "device-simulator",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/15",
                        "id": "15",
                        "key": "device-simulator-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/23",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_EVENT_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [
                            "ROLE_SCHEDULE_REPORT_ADMIN"
                        ],
                        "contextPath": "reporting",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "activeVersionId": "180830420",
                        "name": "report-agent",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/23",
                        "id": "23",
                        "key": "report-agent-key"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/257",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "requiredRoles": [
                            "ROLE_INVENTORY_READ",
                            "ROLE_INVENTORY_ADMIN",
                            "ROLE_OPTION_MANAGEMENT_ADMIN",
                            "ROLE_OPTION_MANAGEMENT_READ",
                            "ROLE_ALARM_READ",
                            "ROLE_ALARM_ADMIN",
                            "ROLE_DEVICE_CONTROL_READ",
                            "ROLE_DEVICE_CONTROL_ADMIN",
                            "ROLE_EVENT_READ",
                            "ROLE_EVENT_ADMIN",
                            "ROLE_IDENTITY_READ",
                            "ROLE_IDENTITY_ADMIN",
                            "ROLE_MEASUREMENT_READ",
                            "ROLE_MEASUREMENT_ADMIN",
                            "ROLE_TENANT_MANAGEMENT_READ",
                            "ROLE_APPLICATION_MANAGEMENT_READ"
                        ],
                        "manifest": {
                            "requiredRoles": [],
                            "roles": [],
                            "billingMode": "RESOURCES",
                            "noAppSwitcher": true,
                            "settingsCategory": null
                        },
                        "roles": [],
                        "contextPath": "lwm2m-agent",
                        "availability": "MARKET",
                        "type": "MICROSERVICE",
                        "name": "lwm2m-agent",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/257",
                        "id": "257",
                        "key": "lwm2m-agent-application-key",
                        "extensions": [
                            {
                                "name": "LWM2M",
                                "description": "The LWM2M Agent allows customers to connect devices via OMA Lightweight M2M",
                                "type": "extensibleDeviceRegistration"
                            },
                            {
                                "name": "LWM2M",
                                "description": "The LWM2M Agent allows customers to connect devices via OMA Lightweight M2M",
                                "type": "extensibleBulkDeviceRegistration"
                            }
                        ]
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/601150",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/billing",
                            "tenant": {
                                "id": "billing"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Cockpit application provides you with options to manage and monitor Internet of Things (IoT) assets and data from a business perspective.",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1017.273.0",
                            "sensorPhone": true,
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss: data:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1017.273.0",
                            "sensorAppOneLink": "http://onelink.to/pca6qe",
                            "breadcrumbs": false
                        },
                        "contextPath": "cockpit",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "48074207",
                        "name": "cockpit",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/601150",
                        "id": "601150",
                        "key": "cockpit-application-key",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss: data:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "sensorPhone": true,
                        "license": "ISC",
                        "sensorAppOneLink": "http://onelink.to/pca6qe",
                        "config": {
                            "remotes": {
                                "sag-pkg-community-plugins@2.1.1": [
                                    "ExampleWidgetPluginModule"
                                ],
                                "plugin-demo@1.0.3": [
                                    "WidgetPluginModule"
                                ],
                                "saas-demo@1.0.1": [
                                    "WidgetPluginModule"
                                ],
                                "my-application@1015.0.364": [
                                    "WidgetPluginModule"
                                ],
                                "my-sandbox-app@1.0.0": [
                                    "WidgetPluginModule"
                                ],
                                "sag-ps-iot-pkg-node-red-ui@2.0.0": [
                                    "NodeRedAdminModule"
                                ]
                            }
                        },
                        "breadcrumbs": false
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/285776",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "",
                            "rightDrawer": true,
                            "icon": {
                                "class": "c8y-icon c8y-icon-enterprise"
                            },
                            "description": "",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1019.0.0",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:; script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.481.0",
                            "copy": [
                                {
                                    "from": "./packages/digital-twin/assets/sample-asset-models",
                                    "to": "assets"
                                }
                            ]
                        },
                        "contextPath": "digital-twin-manager",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180692622",
                        "name": "digital-twin-manager",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/285776",
                        "id": "285776",
                        "key": "digital-twin-manager-application-key",
                        "globalTitle": "Cumulocity",
                        "upgrade": true,
                        "keywords": [],
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "author": "",
                        "rightDrawer": true,
                        "icon": {
                            "class": "c8y-icon c8y-icon-enterprise"
                        },
                        "description": "",
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:; script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "license": "ISC",
                        "config": {
                            "remotes": {}
                        },
                        "tenant": {
                            "id": "management"
                        }
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/4",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "noAppSwitcher": true
                        },
                        "contextPath": "feature-microservice-hosting",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "name": "feature-microservice-hosting",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/4",
                        "id": "4",
                        "key": "c8y-feature-microservice-hosting"
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/3",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Administration application enables account administrators to manage their users, roles, tenants, applications and business rules and lets them configure a number of settings for their account.",
                            "contextHelp": true,
                            "tabsHorizontal": true,
                            "version": "1018.497.6",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com  'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; media-src 'self' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.497.6"
                        },
                        "contextPath": "administration",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180810490",
                        "name": "administration",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/3",
                        "id": "3",
                        "key": "administration-application-key",
                        "license": "ISC",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "tabsHorizontal": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com  'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "config": {
                            "remotes": {
                                "sag-ps-pkg-compass-widget@1.0.2": [
                                    "CompassWidgetModule"
                                ]
                            }
                        }
                    }
                },
                {
                    "self": "http://billing.latest.stage.c8y.io//tenant/tenants/t179730294/1",
                    "application": {
                        "owner": {
                            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/management",
                            "tenant": {
                                "id": "management"
                            }
                        },
                        "manifest": {
                            "globalTitle": "Cumulocity",
                            "keywords": [],
                            "upgrade": true,
                            "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                            "author": "Cumulocity GmbH",
                            "rightDrawer": true,
                            "description": "The Device Management application provides functionalities for managing and monitoring devices and enables you to control and troubleshoot devices remotely.",
                            "contextHelp": true,
                            "version": "1018.497.6",
                            "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.mapquestapi.com *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                            "license": "ISC",
                            "webSdkVersion": "1018.497.6",
                            "breadcrumbs": false
                        },
                        "contextPath": "devicemanagement",
                        "availability": "MARKET",
                        "type": "HOSTED",
                        "resourcesUrl": "/",
                        "activeVersionId": "180810492",
                        "name": "devicemanagement",
                        "self": "http://billing.latest.stage.c8y.io/application/applications/1",
                        "id": "1",
                        "key": "devicemanagement-application-key",
                        "license": "ISC",
                        "globalTitle": "Cumulocity",
                        "dynamicOptionsUrl": "/apps/public/public-options/options.json",
                        "keywords": [],
                        "upgrade": true,
                        "author": "",
                        "rightDrawer": true,
                        "description": "",
                        "contextHelp": true,
                        "contentSecurityPolicy": "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' open.mapquestapi.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data:; font-src * data:; frame-src *; worker-src 'self' blob:;",
                        "config": {
                            "remotes": {}
                        },
                        "breadcrumbs": false
                    }
                }
            ],
            "self": "http://billing.latest.stage.c8y.io/tenant/tenants/t179730294/applications",

        }
    }
    ]
}
