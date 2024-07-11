import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDentistAddComponent } from './help-dentist-add.component';

describe('HelpDentistAddComponent', () => {
  let component: HelpDentistAddComponent;
  let fixture: ComponentFixture<HelpDentistAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDentistAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDentistAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
