import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDailyHourComponent } from './confirm-delete-daily-hour.component';

describe('ConfirmDeleteDailyHourComponent', () => {
  let component: ConfirmDeleteDailyHourComponent;
  let fixture: ComponentFixture<ConfirmDeleteDailyHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteDailyHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteDailyHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
