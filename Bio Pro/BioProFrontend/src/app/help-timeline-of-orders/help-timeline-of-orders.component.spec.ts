import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTimelineOfOrdersComponent } from './help-timeline-of-orders.component';

describe('HelpTimelineOfOrdersComponent', () => {
  let component: HelpTimelineOfOrdersComponent;
  let fixture: ComponentFixture<HelpTimelineOfOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpTimelineOfOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTimelineOfOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
