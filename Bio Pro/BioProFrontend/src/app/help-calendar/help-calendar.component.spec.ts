import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCalendarComponent } from './help-calendar.component';

describe('HelpCalendarComponent', () => {
  let component: HelpCalendarComponent;
  let fixture: ComponentFixture<HelpCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
