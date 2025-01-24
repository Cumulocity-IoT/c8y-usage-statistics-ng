import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { DeviceConfigurationService } from '../device-configuration/device-configuration.service';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { DeviceStatisticsService } from '../device-statistics.service';
import { DeviceAggregationComponent } from './device-aggregation.component';

describe('AggregationComponent', () => {

    let fixture: ComponentFixture<DeviceAggregationComponent>;
    let component: DeviceAggregationComponent;
    let monthPickerService: MonthPickerService;
    let deviceStatisticsService: DeviceStatisticsService;
    let deviceConfigurationService: DeviceConfigurationService;
    
    const monthPickerServiceMock = {
        dateChanged: {
            subscribe: jest.fn()
        },
        selectedDate: '2023-01-01'
    };
    const deviceStatisticsServiceMock =  {
        getFormattedDeviceData: jest.fn()
    };
    const deviceConfigurationServiceMock = {
        deviceStatisticsConfigurationStore: jest.fn()
    };
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [DeviceAggregationComponent],
            providers: [
                {provide: MonthPickerService, useValue: monthPickerServiceMock},
                {provide: DeviceStatisticsService, useValue: deviceStatisticsServiceMock},
                {provide: DeviceConfigurationService, useValue: deviceConfigurationServiceMock}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(DeviceAggregationComponent);
        component = fixture.componentInstance;
        monthPickerService = TestBed.inject(MonthPickerService)
        deviceStatisticsService = TestBed.inject(DeviceStatisticsService)
        deviceConfigurationService = TestBed.inject(DeviceConfigurationService)
        fixture.detectChanges()
    })

    afterEach(() => {
        if(fixture){
            fixture.destroy();
        }        
    })

    test('Aggregation component should be defined', () => {
        expect(fixture).toBeDefined();
        expect(component).toBeTruthy()
    });
});



