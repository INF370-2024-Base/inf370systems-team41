import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStockCaptureComponent } from './help-stock-capture.component';

describe('HelpStockCaptureComponent', () => {
  let component: HelpStockCaptureComponent;
  let fixture: ComponentFixture<HelpStockCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpStockCaptureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpStockCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
