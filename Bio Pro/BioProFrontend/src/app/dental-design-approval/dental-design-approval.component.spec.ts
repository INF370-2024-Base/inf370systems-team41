import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalDesignApprovalComponent } from './dental-design-approval.component';

describe('DentalDesignApprovalComponent', () => {
  let component: DentalDesignApprovalComponent;
  let fixture: ComponentFixture<DentalDesignApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalDesignApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalDesignApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
