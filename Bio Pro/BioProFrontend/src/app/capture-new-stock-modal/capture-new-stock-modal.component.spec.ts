import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureNewStockModalComponent } from './capture-new-stock-modal.component';

describe('CaptureNewStockModalComponent', () => {
  let component: CaptureNewStockModalComponent;
  let fixture: ComponentFixture<CaptureNewStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureNewStockModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureNewStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
