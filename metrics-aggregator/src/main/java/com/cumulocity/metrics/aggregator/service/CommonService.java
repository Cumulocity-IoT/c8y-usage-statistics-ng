package com.cumulocity.metrics.aggregator.service;
import java.util.ArrayList;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.cumulocity.microservice.subscription.model.MicroserviceSubscriptionAddedEvent;
import com.cumulocity.microservice.subscription.service.MicroserviceSubscriptionsService;
import com.cumulocity.rest.representation.CumulocityMediaType;
import com.cumulocity.sdk.client.RestConnector;

import jakarta.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;






/**
 * This is a service to fetch subtenants etc
 * 
 * @author Marco Stoffel
 *
 */
@Service
public class CommonService {

    @Autowired
    RestConnector restConnector;
    

    @Autowired
	MicroserviceSubscriptionsService subscriptionsService;

    private static final Logger log = LoggerFactory.getLogger(CommonService.class);

    private String currentTenant = ""; 
    private ArrayList<String> tenantList;

    public String getCurrentTenant() {
        return currentTenant;
    }

    public ArrayList<String> getTenantList() {
        return tenantList;
    }

    @EventListener
	public void initialize(MicroserviceSubscriptionAddedEvent event) {
		log.info("Tenant Sub: " + event.toString());
        this.currentTenant = event.getCredentials().getTenant();
		log.info("CurrentTenant: " + this.currentTenant);
        this.tenantList = subscriptionsService.callForTenant(this.currentTenant, this::getSubTenants).get();
        this.tenantList.add(currentTenant);
        log.info(tenantList.toString());
	}

    private Optional<ArrayList<String>> getSubTenants(){
        Response tenants = restConnector.get(
                "/tenant/tenants?pageSize=2000&withTotalPages=true",
                CumulocityMediaType.APPLICATION_JSON_TYPE);
            String tenantJSON = tenants.readEntity(String.class);
            //log.info("Tenants: " + tenantJSON);
            JSONObject tenantJsonObject = new JSONObject(tenantJSON);
            JSONArray tenantArray = tenantJsonObject.getJSONArray("tenants");
            int l = tenantArray.length();
            ArrayList<String> tenantList = new ArrayList<String>();
            for (int i = 0; i < l; ++i) {
                tenantList.add(  tenantArray.getJSONObject(i).getString("id"));
            }
            return Optional.of(tenantList);
    }

}
