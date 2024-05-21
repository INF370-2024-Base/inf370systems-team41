import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProceduralTimeline } from './add-order-proceduraltimeline.component';

describe('AddOrderWorkflowtimelineComponent', () => {
  let component: AddProceduralTimeline;
  let fixture: ComponentFixture<AddProceduralTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProceduralTimeline ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProceduralTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
