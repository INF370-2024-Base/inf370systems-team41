import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpEmploueeHourDeleteComponent } from './help-emplouee-hour-delete.component';

describe('HelpEmploueeHourDeleteComponent', () => {
  let component: HelpEmploueeHourDeleteComponent;
  let fixture: ComponentFixture<HelpEmploueeHourDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmploueeHourDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmploueeHourDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
