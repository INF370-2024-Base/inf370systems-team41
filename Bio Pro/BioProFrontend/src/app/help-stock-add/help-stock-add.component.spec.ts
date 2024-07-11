import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStockAddComponent } from './help-stock-add.component';

describe('HelpStockAddComponent', () => {
  let component: HelpStockAddComponent;
  let fixture: ComponentFixture<HelpStockAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpStockAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpStockAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
