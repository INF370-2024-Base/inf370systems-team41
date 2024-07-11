import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmployeeHourComponent } from './help-employee-hour.component';

describe('HelpEmployeeHourComponent', () => {
  let component: HelpEmployeeHourComponent;
  let fixture: ComponentFixture<HelpEmployeeHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmployeeHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmployeeHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
