import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDentistEditComponent } from './help-dentist-edit.component';

describe('HelpDentistEditComponent', () => {
  let component: HelpDentistEditComponent;
  let fixture: ComponentFixture<HelpDentistEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDentistEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDentistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
