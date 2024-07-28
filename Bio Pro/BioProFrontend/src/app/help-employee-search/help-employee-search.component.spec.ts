import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmployeeSearchComponent } from './help-employee-search.component';

describe('HelpEmployeeSearchComponent', () => {
  let component: HelpEmployeeSearchComponent;
  let fixture: ComponentFixture<HelpEmployeeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmployeeSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmployeeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
