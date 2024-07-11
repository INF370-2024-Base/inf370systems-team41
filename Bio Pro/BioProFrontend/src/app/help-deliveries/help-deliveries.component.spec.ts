import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeliveriesComponent } from './help-deliveries.component';

describe('HelpDeliveriesComponent', () => {
  let component: HelpDeliveriesComponent;
  let fixture: ComponentFixture<HelpDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeliveriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
