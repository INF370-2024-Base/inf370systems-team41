import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStockComponent } from './help-stock.component';

describe('HelpStockComponent', () => {
  let component: HelpStockComponent;
  let fixture: ComponentFixture<HelpStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
