/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetemprendimientoComponent } from './detemprendimiento.component';

describe('DetemprendimientoComponent', () => {
  let component: DetemprendimientoComponent;
  let fixture: ComponentFixture<DetemprendimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetemprendimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetemprendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
