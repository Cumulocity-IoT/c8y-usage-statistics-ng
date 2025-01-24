import { Type } from '@angular/core';
import { Column, ColumnDataType, gettext } from '@c8y/ngx-components';
import { DEVICE_TYPE } from './device-data.service';
import { DeviceTypeCellRendererComponent } from './device-type.cell-renderer.component';

export class DeviceTypeGridColumn implements Column {
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
    this.name = DEVICE_TYPE;
    this.path = DEVICE_TYPE;
    this.header = gettext('Device type');
    this.cellRendererComponent = DeviceTypeCellRendererComponent;

    this.filterable = true;
    this.sortable = true;
  }
}
