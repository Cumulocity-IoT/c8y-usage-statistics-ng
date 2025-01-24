import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { Subject } from 'rxjs';
import { MonthPickerComponent } from './month-picker.component';
import { MonthPickerService } from './month-picker.service';

describe('Test MonthPickerComponent', () => {
  let component: MonthPickerComponent;
  let fixture: ComponentFixture<MonthPickerComponent>;
  let monthPickerService: MonthPickerService;

  const monthPickerServiceMock = {
    selectedDate: new Date("2023-01-01"),
    daysInMonth: 31,
    dateChanged: new Subject()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot()],
      declarations: [MonthPickerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MonthPickerService, useValue: monthPickerServiceMock },
    ]
    });
    fixture = TestBed.createComponent(MonthPickerComponent);
    component = fixture.componentInstance;
    monthPickerService = TestBed.inject(MonthPickerService);
  });

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

  test('should define selectedDate and maxDate' , () => {
    fixture.detectChanges();
    expect(component.selectedDate).toBeDefined();
    expect(component.maxDate).toBeDefined();
  })

});