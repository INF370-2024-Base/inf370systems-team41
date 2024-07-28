import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmployeeAddComponent } from './help-employee-add.component';

describe('HelpEmployeeAddComponent', () => {
  let component: HelpEmployeeAddComponent;
  let fixture: ComponentFixture<HelpEmployeeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmployeeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmployeeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
