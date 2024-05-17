import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureEmployeeHoursComponent } from './capture-employee-hours.component';

describe('CaptureEmployeeHoursComponent', () => {
  let component: CaptureEmployeeHoursComponent;
  let fixture: ComponentFixture<CaptureEmployeeHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureEmployeeHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureEmployeeHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
