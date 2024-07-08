import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmployeeDeleteComponent } from './help-employee-delete.component';

describe('HelpEmployeeDeleteComponent', () => {
  let component: HelpEmployeeDeleteComponent;
  let fixture: ComponentFixture<HelpEmployeeDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmployeeDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmployeeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
