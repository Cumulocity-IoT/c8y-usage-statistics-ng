import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule, HOOK_NAVIGATOR_NODES, PluginsModule, CommonModule, HOOK_TABS } from '@c8y/ngx-components';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Factories
import { ROUTES, UsageStatisticsNavigationFactory } from './factories/usage-statistics-navigation-factory';

// Custom Components
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DeviceOverviewComponent } from './device-statistics/device-overview/device-overview.component';
import { DeviceDataComponent } from './device-statistics/device-data/device-data.component';
import { MonthPickerComponent } from './utitities/statistics-action-bar/month-picker/month-picker.component';
import { CsvExporterComponent } from './utitities/statistics-action-bar/csv-exporter/csv-exporter.component';
import { StatisticsActionBarComponent } from './utitities/statistics-action-bar/statistics-action-bar.component'
import { DeviceIdCellRendererComponent } from './device-statistics/device-data/device-id.cell-renderer.component';
import { DeviceTypeCellRendererComponent } from './device-statistics/device-data/device-type.cell-renderer.component';
import { MicroserviceDataComponent } from './microservice-statistics/microservice-data/microservice-data.component';
import { MicroserviceAggregationComponent } from './microservice-statistics/microservice-aggregation/microservice-aggregation.component';
import { UsageStatisticsTabFactory } from './factories/usage-statistics-tabs-factory';
import { TenantDataComponent } from './tenant-statistics/tenant-data/tenant-data.component';
import { TenantAggregationComponent } from './tenant-statistics/tenant-aggregation/tenant-aggregation.component';
import { TenantPickerComponent } from './utitities/statistics-action-bar/tenant-picker/tenant-picker.component';
import { SortStringAscPipe } from './utitities/sort-string-asc/sort-string-asc.pipe';
import { DeviceAggregationComponent } from './device-statistics/device-aggregation/device-aggregation.component';
import { NumberRendererComponent} from './microservice-statistics/microservice-aggregation/renderer/number.renderer.component' 
export const hooks = [
  { provide: HOOK_NAVIGATOR_NODES, useClass: UsageStatisticsNavigationFactory, multi: true },
  { provide: HOOK_TABS, useClass: UsageStatisticsTabFactory, multi: true }
];

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forRoot(),
    TranslateModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ngRouterModule.forRoot(
      [...ROUTES],
      { enableTracing: false, useHash: true }
    ),
    CoreModule.forRoot(),
    PluginsModule
  ],
  declarations: [
    DeviceOverviewComponent,
    DeviceAggregationComponent,
    MicroserviceAggregationComponent,
    DeviceDataComponent,
    MonthPickerComponent,
    CsvExporterComponent,
    StatisticsActionBarComponent,
    DeviceIdCellRendererComponent,
    DeviceTypeCellRendererComponent,
    MicroserviceDataComponent,
    TenantDataComponent,
    TenantAggregationComponent,
    TenantPickerComponent,
    SortStringAscPipe,
    NumberRendererComponent
  ],
  providers: [...hooks],
  bootstrap: [BootstrapComponent]
})
export class AppModule { }