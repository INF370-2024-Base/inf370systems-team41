import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnyUserComponent } from './edit-any-user.component';

describe('EditAnyUserComponent', () => {
  let component: EditAnyUserComponent;
  let fixture: ComponentFixture<EditAnyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAnyUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAnyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
