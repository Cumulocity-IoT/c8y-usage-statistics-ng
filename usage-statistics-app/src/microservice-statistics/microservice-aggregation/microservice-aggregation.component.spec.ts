import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { MonthPickerService } from '../../utitities/statistics-action-bar/month-picker/month-picker.service';
import { MicroserviceStatisticsService } from '../microservice-statistics.service';
import { MicroserviceAggregationComponent} from'./microservice-aggregation.component';

    describe('AggregationComponent', () => {

    let fixture: ComponentFixture<MicroserviceAggregationComponent>;
    let component: MicroserviceAggregationComponent;
    let monthPickerService: MonthPickerService;
    let microserviceStatisticsService: MicroserviceStatisticsService;
    
    const monthPickerServiceMock = {
        dateChanged: {
            subscribe: jest.fn()
        },
        selectedDate: '2023-01-01'
    };
    const microserviceStatisticsServiceMock =  {
        getFormattedDeviceData: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [MicroserviceAggregationComponent],
            providers: [
                {provide: MonthPickerService, useValue: monthPickerServiceMock},
                {provide: MicroserviceStatisticsService, useValue: microserviceStatisticsServiceMock},
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(MicroserviceAggregationComponent);
        component = fixture.componentInstance;
        monthPickerService = TestBed.inject(MonthPickerService)
        microserviceStatisticsService = TestBed.inject(MicroserviceStatisticsService)
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



