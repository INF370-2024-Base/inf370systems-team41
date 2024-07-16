import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockTypeComponent } from './edit-stock-type.component';

describe('EditStockTypeComponent', () => {
  let component: EditStockTypeComponent;
  let fixture: ComponentFixture<EditStockTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
