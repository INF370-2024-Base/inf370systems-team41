import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentistEditDialogComponent } from './dentist-edit-dialog.component';

describe('DentistEditDialogComponent', () => {
  let component: DentistEditDialogComponent;
  let fixture: ComponentFixture<DentistEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentistEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentistEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
