import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockTypeComponent } from './add-stock-type.component';

describe('AddStockTypeComponent', () => {
  let component: AddStockTypeComponent;
  let fixture: ComponentFixture<AddStockTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
