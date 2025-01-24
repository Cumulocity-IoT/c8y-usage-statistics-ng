import { Type } from '@angular/core';
import { Column, ColumnDataType, gettext } from '@c8y/ngx-components';
import { DeviceIdCellRendererComponent } from './device-id.cell-renderer.component';
import { DEVICE_ID } from './device-data.service';

export class DeviceIdGridColumn implements Column {
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
    this.name = DEVICE_ID;
    this.path = DEVICE_ID;
    this.header = gettext('Device ID');
    this.cellRendererComponent = DeviceIdCellRendererComponent;

    this.filterable = true;
    this.sortable = true;
  }
}
