import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonService,FeatureList } from '../../../common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Alert, AlertService, gettext } from '@c8y/ngx-components';



@Component({
  selector: 'tenant-picker',
  templateUrl: './tenant-picker.component.html',
  styleUrls: ['./tenant-picker.component.css']
})
export class TenantPickerComponent implements OnInit {
  @Input() feature: string;
  modalRef?: BsModalRef;
  tenantList: any = []
  tenantListDict = {}
  tenantHierarchy: any = []
  sourceTenant: string
  currentlyActiveTenant: string
  searchString = ''
  allTenantIdList = []
  allCompaniesList = []
  allDomainList = []
  isLoading = true;
  private disable:boolean = false;

  constructor(
    private commonService: CommonService,
    private modalService: BsModalService,
    private alertService: AlertService
  ) {
    this.commonService.tenantChanged.subscribe((tenantId: string) => {
      this.currentlyActiveTenant = tenantId
    })
  }

  ngOnInit(): void {
    this.loadSubTenantList();
    console.log("Feature: " ,this.feature );
    if (
          this.feature === FeatureList.DeviceAggregation || 
          this.feature === FeatureList.MicroserviceAggregation  ||
          this.feature === FeatureList.TenantAggregation
        ) {
          this.disable = true;
        }
  }

  async loadSubTenantList() {
    try {
      this.sourceTenant = await this.commonService.getSourceTenant()
      console.log('sourceTenant: ' + this.sourceTenant)
      this.currentlyActiveTenant = await this.commonService.getCurrentlyActiveTenant();
      this.tenantList = await this.commonService.getAllSubtenants(this.sourceTenant);
      let aggregationActive = await this.commonService.isMetricsAggregatorAvailable();
      if (  !sessionStorage.getItem("isFirstSession") 
            && this.tenantList.length > 1 
            && !(typeof aggregationActive === "boolean") ){
        const alert: Alert = {
          text: gettext("Child tenants detected.\nDeploy the 'metrics-aggregator' microservice to view aggregated data"),
          type: 'warning'
        }
        this.alertService.add(alert)
      }
      this.tenantHierarchy = this.getTenantHierarchyAndBuildDictionary();
      this.allTenantIdList = Object.keys(this.tenantListDict)
      this.allCompaniesList = [... new Set(this.tenantList.map(elem => elem.company).filter(elem => elem))]
      this.allDomainList = [... new Set(this.tenantList.map(elem => elem.domain).filter(elem => elem))]
    }
    catch (error) {
      const alert: Alert = {
        text: gettext('Unable to get the  subtenants of the current tenant. Does your user have role Tenant Management READ attached?'),
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
    finally {
      this.isLoading = false;
    }
  }

  selectedTenant(tenantId) {
    this.currentlyActiveTenant = tenantId
    this.commonService.setCurrentlyActiveTenant(tenantId)
    this.modalRef?.hide()
  }

  getTenantHierarchyAndBuildDictionary() {
    const hierarchy = {}
    this.tenantList.forEach(elem => {
      elem['hideItem'] = false;
      this.tenantListDict[elem.id] = elem;
      if (!elem.parent) {
        elem.parent = "EOF"
      }
      if (hierarchy[elem.parent]) {
        hierarchy[elem.parent].push(elem)
      }
      else {
        hierarchy[elem.parent] = [elem]
      }
    })
    return hierarchy;
  }

  searchTenant() {
    const selectedChildTenantIds = [... new Set([
      ...this.allTenantIdList.filter(elem => elem.includes(this.searchString)),
      ...this.allCompaniesList.filter(elem => elem.toLowerCase().includes(this.searchString.toLowerCase())),
      ...this.allDomainList.filter(elem => elem.toLowerCase().includes(this.searchString.toLowerCase()))
    ])]
    const selectedParentTenantIds = selectedChildTenantIds.map(elem => {
      if (this.tenantListDict[elem]) {
        return this.tenantListDict[elem].parent
      }
    }).filter(elem => elem !== undefined)
    const allChosenTenants = [...selectedChildTenantIds, ...selectedParentTenantIds]
    this.tenantHierarchy[this.sourceTenant].forEach(tenant => {
      tenant['hideItem'] = !(allChosenTenants.includes(tenant.id) || allChosenTenants.includes(tenant.company) || allChosenTenants.includes(tenant.domain));
      if (this.tenantHierarchy[tenant.id]) {
        this.tenantHierarchy[tenant.id].forEach(subTenant => {
          subTenant['hideItem'] = !(allChosenTenants.includes(subTenant.id) || allChosenTenants.includes(subTenant.company) || allChosenTenants.includes(tenant.domain));
          if (!subTenant['hideItem']) {
            const parent = this.tenantHierarchy[this.sourceTenant].find(elem => elem.id === subTenant.parent)
            parent['hideItem'] = false
          }
        })
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.loadSubTenantList()
  }

  getCompany(tenantId: string) {
    return this.tenantListDict[tenantId]?.company
  }
  getDomain(tenantId: string) {
    return this.tenantListDict[tenantId]?.domain
  }
  getSubtenantCount(tenantId: string) {
    return this.tenantHierarchy[tenantId]?.length ?? 0
  }
  isActiveTenant(tenant){
    return tenant?.status === "ACTIVE"
  }
  getTenant(tenantId){
    return this.tenantList.find(elem => elem.id === tenantId)
  }

}