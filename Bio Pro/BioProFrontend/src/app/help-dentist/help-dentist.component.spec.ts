import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDentistComponent } from './help-dentist.component';

describe('HelpDentistComponent', () => {
  let component: HelpDentistComponent;
  let fixture: ComponentFixture<HelpDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDentistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
