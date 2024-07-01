import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockUsedComponent } from './stock-used.component';

describe('StockUsedComponent', () => {
  let component: StockUsedComponent;
  let fixture: ComponentFixture<StockUsedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockUsedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
