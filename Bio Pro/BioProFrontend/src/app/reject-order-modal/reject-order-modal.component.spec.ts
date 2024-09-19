import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectOrderModalComponent } from './reject-order-modal.component';

describe('RejectOrderModalComponent', () => {
  let component: RejectOrderModalComponent;
  let fixture: ComponentFixture<RejectOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectOrderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
