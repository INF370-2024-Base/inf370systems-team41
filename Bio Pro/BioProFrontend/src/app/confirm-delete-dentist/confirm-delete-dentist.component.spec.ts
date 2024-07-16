import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDentistComponent } from './confirm-delete-dentist.component';

describe('ConfirmDeleteDentistComponent', () => {
  let component: ConfirmDeleteDentistComponent;
  let fixture: ComponentFixture<ConfirmDeleteDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteDentistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
