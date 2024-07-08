import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStockWriteoffComponent } from './help-stock-writeoff.component';

describe('HelpStockWriteoffComponent', () => {
  let component: HelpStockWriteoffComponent;
  let fixture: ComponentFixture<HelpStockWriteoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpStockWriteoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpStockWriteoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
