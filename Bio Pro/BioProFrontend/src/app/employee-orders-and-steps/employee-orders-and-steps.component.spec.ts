import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOrdersAndStepsComponent } from './employee-orders-and-steps.component';

describe('EmployeeOrdersAndStepsComponent', () => {
  let component: EmployeeOrdersAndStepsComponent;
  let fixture: ComponentFixture<EmployeeOrdersAndStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeOrdersAndStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOrdersAndStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
