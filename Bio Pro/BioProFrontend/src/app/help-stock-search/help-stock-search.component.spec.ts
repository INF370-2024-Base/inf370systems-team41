import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStockSearchComponent } from './help-stock-search.component';

describe('HelpStockSearchComponent', () => {
  let component: HelpStockSearchComponent;
  let fixture: ComponentFixture<HelpStockSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpStockSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpStockSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
