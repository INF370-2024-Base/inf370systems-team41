import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDentistComponent } from './add-dentist.component';

describe('AddDentistComponent', () => {
  let component: AddDentistComponent;
  let fixture: ComponentFixture<AddDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDentistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
