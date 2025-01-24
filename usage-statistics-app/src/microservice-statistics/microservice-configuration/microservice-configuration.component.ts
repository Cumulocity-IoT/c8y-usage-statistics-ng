import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Alert, AlertService, ModalService, gettext } from '@c8y/ngx-components';
import { Api, CategoryType, MicroserviceCategory, MicroserviceConfigurationService, ProductCategory, PropertyName } from './microservice-configuration.service';
import $ from 'jquery'

@Component({
  selector: 'microservice-configuration',
  templateUrl: './microservice-configuration.component.html',
  styleUrls: ['./microservice-configuration.component.css']
})
export class MicroserviceConfigurationComponent implements OnInit {
  form: FormGroup;
  productCategoryNames: string[]
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private microserviceConfigurationService: MicroserviceConfigurationService,
    private alertService: AlertService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadDataInitializeForm()
    this.getInputFieldSize();
  }

  private getUniqueMicroserviceCategories(microserviceCategories: MicroserviceCategory[]): MicroserviceCategory[] {
    return microserviceCategories.filter((elem, index, self) =>
      index === self.findIndex((o) => o[PropertyName.Microservice] === elem[PropertyName.Microservice])
    );
  }

  private async loadDataInitializeForm() {
    const productCategories = [... await this.microserviceConfigurationService.getCategories(Api.Product, true)]
    const microserviceCategories = [... await this.microserviceConfigurationService.getCategories(Api.Microservice, true)]
    this.form = this.fb.group({
      productCategoryList: this.fb.array(productCategories.map(elem => this.fb.group(elem))),
      microserviceCategoryList: this.fb.array(microserviceCategories.map(elem => this.fb.group(elem)))
    })
    this.microserviceCategoryList.controls.forEach(elem => {
      elem.get(PropertyName.Microservice).addValidators(Validators.required)
      elem.get(PropertyName.Microservice).addValidators(isUniqueMicroserviceValidator(this.microserviceCategoryList))
    })

    this.productCategoryNames = this.productCategoryList.value.map((elem: ProductCategory) => elem.productCategory)
  }

  onAddProductCategory() {
    const productCategory = this.fb.group({
      productCategory: ['', [Validators.required, isUniqueProductCategoryValidator(this.productCategoryList)]],
      isPreconfigured: false,
      isDefault: false,
      isSelected: false,
      categoryType: CategoryType.Custom,
      isEditable: true,
      cpuThreshold: 0,
      memoryThreshold: 0
    })
    this.productCategoryList.push(productCategory)
  }

  async onRemoveProductCategory(index: number) {
    const excessProdCategory: ProductCategory = this.productCategoryList.at(index).value
    this.productCategoryList.removeAt(index)
    await this.onSaveProductCategories([excessProdCategory.productCategory])
  }

  async onSaveProductCategories(excessProdCategories?: string[]) {
    try {
      if (!excessProdCategories) {
        excessProdCategories = []
        const productCategoryNames = this.productCategoryList.value.map((elem: ProductCategory) => elem.productCategory)
        const microserviceCategoryListCopy = this.getUniqueMicroserviceCategories([...this.microserviceCategoryList.value]) 
        microserviceCategoryListCopy.forEach((elem: MicroserviceCategory) => {
          if (!productCategoryNames.includes(elem.productCategory)) {
            excessProdCategories.push(elem.productCategory)
          }
        })
      }
      excessProdCategories = Array.from(new Set(excessProdCategories))
      await this.microserviceConfigurationService.setOptions(Api.Product, this.productCategoryList.value)
      const microserviceCategoryList = this.getUpdatedMicroserviceCategoryList(excessProdCategories)
      await this.microserviceConfigurationService.setOptions(Api.Microservice, microserviceCategoryList)

      await this.loadDataInitializeForm()
      const alert: Alert = {
        text: 'Product categories were updated successfully',
        type: 'success',
      }
      this.alertService.add(alert)
    }
    catch (error) {
      const alert: Alert = {
        text: 'Unable to update product categories',
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
  }

  async onCancelProductCategories() {
    try {
      const productCategories = [... await this.microserviceConfigurationService.getCategories(Api.Product, true)]
      const productCategoryList = this.form.controls['productCategoryList'] as FormArray
      productCategoryList.clear()
      productCategories.map(elem => this.fb.group(elem)).forEach(elem => {
        productCategoryList.push(elem)
      });
      this.productCategoryNames = this.productCategoryList.value.map((elem: ProductCategory) => elem.productCategory)
    }
    catch (err) {
      console.log('Error ', err)
    }
  }

  async onResetProductCategories() {
    try {
      await this.modalService.confirm('Reset product category list to default state',
        `Resetting product category list to default state will remove 
                                        all configured custom categories and all microservices not falling under any of the default categories will be 
                                        moved under the product category titled Custom Microservices`,
        'warning')

      try {
        await this.microserviceConfigurationService.setDefaultProductCategories()
        const microserviceCategoryList = this.getUpdatedMicroserviceCategoryList()
        await this.microserviceConfigurationService.setOptions(Api.Microservice, microserviceCategoryList)
        await this.loadDataInitializeForm()

        const alert: Alert = {
          text: 'Product categories were reset to default successfully',
          type: 'success',
        }
        this.alertService.add(alert)
      }
      catch (error) {
        const alert: Alert = {
          text: 'Unable to reset product categories',
          type: 'danger',
          detailedData: error.message
        }
        this.alertService.add(alert)
      }
    }
    catch (error) {
      // No action
    }
  }

  onAddMicroservice() {
    const microserviceCategory = this.fb.group({
      microserviceName: ['', [Validators.required, isUniqueMicroserviceValidator(this.microserviceCategoryList)]],
      productCategory: this.productCategoryList.value.find((elem: ProductCategory) => elem.isDefault).productCategory
    })
    this.microserviceCategoryList.push(microserviceCategory)
    setTimeout(() => {
      document.getElementsByClassName('micro')[0].scrollTo(0, document.getElementsByClassName('micro')[0].scrollHeight);
    }, 100)

  }

  onRemoveMicroservice(index: number) {
    this.microserviceCategoryList.removeAt(index)
  }

  async onCancelMicroservice() {
    try {
      const microserviceCategories = [... await this.microserviceConfigurationService.getCategories(Api.Microservice, true)]
      const microserviceCategoryList = this.form.controls['microserviceCategoryList'] as FormArray
      microserviceCategoryList.clear()
      microserviceCategories.map(elem => this.fb.group(elem)).forEach(elem => {
        microserviceCategoryList.push(elem)
      });

      this.microserviceCategoryList.controls.forEach(elem => {
        elem.get(PropertyName.Microservice).addValidators(Validators.required)
        elem.get(PropertyName.Microservice).addValidators(isUniqueMicroserviceValidator(this.microserviceCategoryList))
      })
    }
    catch (err) {
      console.log('Error ', err)
    }
  }

  async onResetMicroservice() {
    try {
      await this.modalService.confirm('Reset microservice list to default state',
        `Resetting microservice list to default state will remove 
                                        all configured custom microservice categorization and the list will revert to a default configuration`,
        'warning')

      try {
        await this.microserviceConfigurationService.setDefaultMicroserviceCategories()
        await this.onCancelMicroservice()

        const alert: Alert = {
          text: 'Microservices were reset to default successfully',
          type: 'success',
        }
        this.alertService.add(alert)
      }
      catch (error) {
        const alert: Alert = {
          text: 'Unable to reset microservices',
          type: 'danger',
          detailedData: error.message
        }
        this.alertService.add(alert)
      }
    }
    catch (error) {
      // No action
    }
  }

  async onSaveMicroservice() {
    try {
      await this.microserviceConfigurationService.setOptions(Api.Microservice, this.microserviceCategoryList.value)
      await this.loadDataInitializeForm()
      const alert: Alert = {
        text: 'Microservice list was updated successfully',
        type: 'success',
      }
      this.alertService.add(alert)
    }
    catch (error) {
      const alert: Alert = {
        text: 'Unable to update microservice list',
        type: 'danger',
        detailedData: error.message
      }
      this.alertService.add(alert)
    }
  }

  getMicroserviceCount(productCategory: string): number {
    return this.microserviceCategoryList.value.filter((elem: MicroserviceCategory) => elem.productCategory === productCategory).length
  }

  getBadgeClass(categoryType: CategoryType) {
    if (categoryType === CategoryType.PreConfigured) {
      return 'badge badge-info'
    }
    else if (categoryType === CategoryType.Default) {
      return 'badge badge-system'
    }
    else if (categoryType === CategoryType.Custom) {
      return 'badge badge-success'
    }
  }

  showDeleteOption(categoryType: CategoryType) {
    return !(categoryType === CategoryType.Custom)
  }
  showEditOption(categoryType: CategoryType) {
    return categoryType === CategoryType.Custom
  }

  getErrorMessage(errors: any) {
    if (errors.required) {
      return gettext('This field is required')
    }
    else if (errors.min) {
      return gettext(`Minimum value for this field is ${errors.min.value}`);
    }
    else if (errors.isDuplicate) {
      return gettext('A field with this name already exists')
    }
    return null
  }

  get productCategoryList() {
    return this.form?.controls['productCategoryList'] as FormArray
  }

  get microserviceCategoryList() {
    return this.form?.controls['microserviceCategoryList'] as FormArray
  }

  getInputFieldSize() {
    const windowWidth = $(window).width();
    if (windowWidth > 1700) {
      return 50
    }
    else if (windowWidth > 1600) {
      return 40
    }
    else if (windowWidth > 1500) {
      return 30
    }
    return 20
  }

  private getUpdatedMicroserviceCategoryList(excessProdCategories: string[] = null): MicroserviceCategory[] {
    const microserviceCategoryListCopy = this.getUniqueMicroserviceCategories([...this.microserviceCategoryList.value])
    if (excessProdCategories && excessProdCategories.length > 0) {
      const defaultProductCategory = this.productCategoryList.value.find((elem: ProductCategory) => elem.isDefault).productCategory
      microserviceCategoryListCopy.forEach((elem: MicroserviceCategory) => {
        if (excessProdCategories.includes(elem.productCategory)) {
          elem.productCategory = defaultProductCategory
        }
      })
    }
    return microserviceCategoryListCopy
  }

}

function isUniqueProductCategoryValidator(productCategoryList: FormArray): ValidatorFn {
  return (formField: FormGroup): ValidationErrors | null => {
    const productCategoryNames = productCategoryList.value.map((elem: ProductCategory) => elem.productCategory)
    const fieldName = formField.value;
    if (productCategoryNames.includes(fieldName)) {
      return {
        isDuplicate: true
      }
    }
  };
}
function isUniqueMicroserviceValidator(microserviceCategoryList: FormArray): ValidatorFn {
  return (formField: FormGroup): ValidationErrors | null => {
    if (microserviceCategoryList.pristine) {
      return null
    }
    const microserviceCategoryNames = microserviceCategoryList.value.map((elem: MicroserviceCategory) => elem.microserviceName)
    const fieldName = formField.value;
    if (microserviceCategoryNames.includes(fieldName)) {
      return {
        isDuplicate: true
      }
    }
  };
}
