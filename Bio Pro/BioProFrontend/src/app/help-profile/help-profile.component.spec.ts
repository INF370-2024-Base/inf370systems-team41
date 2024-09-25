import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpProfileComponent } from './help-profile.component';

describe('HelpProfileComponent', () => {
  let component: HelpProfileComponent;
  let fixture: ComponentFixture<HelpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
