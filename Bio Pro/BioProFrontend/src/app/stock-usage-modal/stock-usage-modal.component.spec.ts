import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockUsageModalComponent } from './stock-usage-modal.component';

describe('StockUsageModalComponent', () => {
  let component: StockUsageModalComponent;
  let fixture: ComponentFixture<StockUsageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockUsageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockUsageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
