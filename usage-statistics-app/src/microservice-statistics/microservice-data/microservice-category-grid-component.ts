import { Type } from '@angular/core';
import { Column, ColumnDataType, gettext } from '@c8y/ngx-components';
import { MicroserviceCategoryCellRendererComponent } from './microservice-category.cell-renderer.component';
import { CATEGORY, NAME } from './microservice-data.service';

export class MicroserviceCategoryGridColumn implements Column {
  name: string;
  path?: string;
  header?: string;
  dataType?: ColumnDataType;

  visible?: boolean;
  positionFixed?: boolean;
  gridTrackSize?: string;

  cellRendererComponent?: Type<any>;

  sortable?: boolean;

  filterable?: boolean;

  constructor() {
    this.name = CATEGORY;
    this.path = NAME; // we need the context to be name inorder to map the name against product category.
    this.header = gettext('Category');
    this.cellRendererComponent = MicroserviceCategoryCellRendererComponent;

    this.filterable = true;
    this.sortable = true;
  }
}