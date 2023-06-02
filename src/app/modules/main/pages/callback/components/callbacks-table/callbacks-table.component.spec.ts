import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbacksTableComponent } from './callbacks-table.component';

describe('CallbacksTableComponent', () => {
  let component: CallbacksTableComponent;
  let fixture: ComponentFixture<CallbacksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallbacksTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallbacksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
