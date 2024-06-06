import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingBackendComponent } from './testing-backend.component';

describe('TestingBackendComponent', () => {
  let component: TestingBackendComponent;
  let fixture: ComponentFixture<TestingBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingBackendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
