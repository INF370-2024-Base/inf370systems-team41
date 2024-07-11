import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDentistSearchComponent } from './help-dentist-search.component';

describe('HelpDentistSearchComponent', () => {
  let component: HelpDentistSearchComponent;
  let fixture: ComponentFixture<HelpDentistSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDentistSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDentistSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
