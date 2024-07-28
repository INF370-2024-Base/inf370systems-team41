import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmployeesComponent } from './help-employees.component';

describe('HelpEmployeesComponent', () => {
  let component: HelpEmployeesComponent;
  let fixture: ComponentFixture<HelpEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
