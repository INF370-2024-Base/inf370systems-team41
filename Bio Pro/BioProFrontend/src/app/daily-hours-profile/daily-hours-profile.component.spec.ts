import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyHoursProfileComponent } from './daily-hours-profile.component';

describe('DailyHoursProfileComponent', () => {
  let component: DailyHoursProfileComponent;
  let fixture: ComponentFixture<DailyHoursProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyHoursProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyHoursProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
