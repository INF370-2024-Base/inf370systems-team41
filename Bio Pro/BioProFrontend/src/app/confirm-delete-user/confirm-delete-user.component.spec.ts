import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteUserComponent } from './confirm-delete-user.component';

describe('ConfirmDeleteUserComponent', () => {
  let component: ConfirmDeleteUserComponent;
  let fixture: ComponentFixture<ConfirmDeleteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
