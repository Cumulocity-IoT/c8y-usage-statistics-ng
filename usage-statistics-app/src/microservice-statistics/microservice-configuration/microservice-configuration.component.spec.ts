import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { MicroserviceConfigurationComponent } from './microservice-configuration.component';
import { MicroserviceConfigurationService } from './microservice-configuration.service';


fdescribe('Test MicroserviceConfigurationComponent', () => {
  let component: MicroserviceConfigurationComponent;
  let fixture: ComponentFixture<MicroserviceConfigurationComponent>;
  let microserviceConfigurationService: MicroserviceConfigurationService;

  const microserviceConfigurationServiceMock = {
    setDefaultMicroserviceCategories: jest.fn(),
    setOptions: jest.fn()
}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule.forRoot(), BrowserAnimationsModule],
      declarations: [MicroserviceConfigurationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MicroserviceConfigurationService, useValue: microserviceConfigurationServiceMock },
    ]
    });
    fixture = TestBed.createComponent(MicroserviceConfigurationComponent);
    component = fixture.componentInstance;
    microserviceConfigurationService = TestBed.inject(MicroserviceConfigurationService);
  });

  test('should be defined', () => {
    expect(fixture).toBeDefined();
  });

  test('should load expected component', () => {
    expect(fixture).toMatchSnapshot();
  });

});