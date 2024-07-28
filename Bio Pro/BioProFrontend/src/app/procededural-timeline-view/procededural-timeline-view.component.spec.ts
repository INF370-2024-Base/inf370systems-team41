import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcededuralTimelineViewComponent } from './procededural-timeline-view.component';

describe('ProcededuralTimelineViewComponent', () => {
  let component: ProcededuralTimelineViewComponent;
  let fixture: ComponentFixture<ProcededuralTimelineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcededuralTimelineViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcededuralTimelineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
