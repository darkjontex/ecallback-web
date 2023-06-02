import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E400Component } from './e400.component';

describe('E400Component', () => {
  let component: E400Component;
  let fixture: ComponentFixture<E400Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ E400Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E400Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
