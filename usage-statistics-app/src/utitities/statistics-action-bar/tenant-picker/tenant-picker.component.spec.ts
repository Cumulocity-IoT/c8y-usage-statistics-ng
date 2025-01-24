import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, CoreModule, ModalService } from '@c8y/ngx-components';
import { Subject } from 'rxjs';
import { TenantPickerComponent } from './tenant-picker.component';
import { CommonService } from '../../../common.service';
import { By } from '@angular/platform-browser';

describe('Test MonthPickerComponent', () => {
  let component: TenantPickerComponent;
  let fixture: ComponentFixture<TenantPickerComponent>;
  let commonService: CommonService;
  let modalService: ModalService;
  let alertService: AlertService;

  const monthPickerServiceMock = {
    selectedDate: new Date("2023-01-01"),
    daysInMonth: 31,
    dateChanged: new Subject()
  }

  const commonServiceMock = {
    tenantChanged:{
        subscribe: jest.fn()
    },
    getSourceTenant: jest.fn(),
    getCurrentlyActiveTenant: jest.fn(),
    getAllSubtenants: jest.fn(),
  }

  const modalServiceMock = {

  }
  
  const alertServiceMock = {
    add: jest.fn()
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot()],
      declarations: [TenantPickerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
    ]
    });
    fixture = TestBed.createComponent(TenantPickerComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    modalService = TestBed.inject(ModalService);
    alertService = TestBed.inject(AlertService);

  });

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('loadSubTenantList', () => {
    it('should create the component with isisLoading set to true by default', () => {
      expect(component.isLoading).toBe(true);
    });

    it('sets isLoading to false when all api calls are done', async () => {
      const mockSourceTenant = 'sourceTenant';
      const mockCurrentlyActiveTenant = 'currentlyActiveTenant';
      const mockTenantList = ['tenant1', 'tenant2'];
  
      jest.spyOn(commonService, 'getSourceTenant').mockResolvedValue(mockSourceTenant);
      jest.spyOn(commonService, 'getCurrentlyActiveTenant').mockResolvedValue(mockCurrentlyActiveTenant);
      jest.spyOn(commonService, 'getAllSubtenants').mockResolvedValue(mockTenantList);
  
      await component.loadSubTenantList();
  
      expect(component.isLoading).toBe(false);
    });
  
    it('should set isLoading to false when an error occurs', async () => {
      const errorMessage = 'Unable to get the  subtenants of the current tenant';

      jest.spyOn(commonService, 'getSourceTenant').mockRejectedValue(() => Promise.reject(new Error(errorMessage)));
  
      await component.loadSubTenantList();
  
      expect(component.isLoading).toBe(false);
      expect(alertService.add).toHaveBeenCalled();
    });

    it('loader on the button should be active if loading is not yet complete', () => {
      component.isLoading = true;
      component.currentlyActiveTenant = 'currentlyActiveTenant';
      fixture.detectChanges();
  
      const button = fixture.debugElement.query(By.css('button.btn.btn-primary'));

      expect(button).toBeTruthy();
      expect(button.nativeElement.classList.contains('btn-pending')).toBeTruthy();
    });
    
  
    it('loader on the button should not be active when loading is complete', () => {
      component.isLoading = false;
      component.currentlyActiveTenant = 'currentlyActiveTenant';
      fixture.detectChanges();
    
      const button = fixture.debugElement.query(By.css('.btn.btn-primary'));

      expect(button).toBeTruthy();
      expect(button.nativeElement.classList.contains('btn-pending')).toBeFalsy();
    });

  });
});