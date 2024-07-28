import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpOrdersComponent } from './help-orders.component';

describe('HelpOrdersComponent', () => {
  let component: HelpOrdersComponent;
  let fixture: ComponentFixture<HelpOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
