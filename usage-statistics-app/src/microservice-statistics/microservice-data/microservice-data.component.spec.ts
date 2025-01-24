import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { MicroserviceStatisticsService } from '../microservice-statistics.service';
import { MicroserviceDataComponent } from './microservice-data.component';

describe('Test MicroserviceDataComponent', () => {
  let component: MicroserviceDataComponent;
  let fixture: ComponentFixture<MicroserviceDataComponent>;
  let microserviceStatisticsService: MicroserviceStatisticsService;

  const microserviceStatisticsServiceMock = {
    getMonthlyMicroserviceProdCategoryMap: jest.fn(),
}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot(), BrowserAnimationsModule],
      declarations: [MicroserviceDataComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MicroserviceStatisticsService, useValue: microserviceStatisticsServiceMock },
    ]
    });
    fixture = TestBed.createComponent(MicroserviceDataComponent);
    component = fixture.componentInstance;
    microserviceStatisticsService = TestBed.inject(MicroserviceStatisticsService);
  });

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

  test('should call getMonthlyMicroserviceProdCategoryMap from service', async () => {
    fixture.detectChanges();
    const getMonthlyMicroserviceProdCategoryMapSpy = jest.spyOn(microserviceStatisticsService, 'getMonthlyMicroserviceProdCategoryMap');
    expect(getMonthlyMicroserviceProdCategoryMapSpy).toHaveBeenCalled();
  });

  test('should give correct device data response', async() => {
    fixture.detectChanges();
    let today = new Date("01 Jan 2023");
    const selectedDate = new Date(today.setMonth(today.getMonth() - 1));
    const mockResponse = [
        {
            memory: 31067,
            name: "databroker-agent-server",
            cause: "Subscribed",
            cpu: 28931,
            productCategory: "Custom Microservices",
            microserviceName: "databroker-agent-server"
        },
        {
            memory: 335018,
            name: "zementis-large",
            cause: "Subscribed",
            cpu: 167509,
            productCategory: "Custom Microservices",
            microserviceName: "zementis-large"
        },
        {
            memory: 15036,
            name: "datahub",
            cause: "Subscribed",
            cpu: 3500,
            productCategory: "Product Services",
            microserviceName: "datahub"
        },
        {
            memory: 111671,
            name: "nyoka",
            cause: "Subscribed",
            cpu: 55836,
            productCategory: "Machine Learning",
            microserviceName: "nyoka"
        }

    ];
    jest.spyOn(microserviceStatisticsService, 'getMonthlyMicroserviceProdCategoryMap').mockImplementation(()=>Promise.resolve(mockResponse))
    await component.getMicroserviceData(selectedDate);
    expect(component.microserviceData).toEqual(mockResponse);
  });
});