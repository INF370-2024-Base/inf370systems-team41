import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDentistDeleteComponent } from './help-dentist-delete.component';

describe('HelpDentistDeleteComponent', () => {
  let component: HelpDentistDeleteComponent;
  let fixture: ComponentFixture<HelpDentistDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDentistDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDentistDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
