import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersAwaitingDentalDesignComponent } from './orders-awaiting-dental-design.component';

describe('OrdersAwaitingDentalDesignComponent', () => {
  let component: OrdersAwaitingDentalDesignComponent;
  let fixture: ComponentFixture<OrdersAwaitingDentalDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersAwaitingDentalDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersAwaitingDentalDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
