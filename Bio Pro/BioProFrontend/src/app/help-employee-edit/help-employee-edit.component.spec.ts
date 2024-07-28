import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmployeeEditComponent } from './help-employee-edit.component';

describe('HelpEmployeeEditComponent', () => {
  let component: HelpEmployeeEditComponent;
  let fixture: ComponentFixture<HelpEmployeeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmployeeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmployeeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
