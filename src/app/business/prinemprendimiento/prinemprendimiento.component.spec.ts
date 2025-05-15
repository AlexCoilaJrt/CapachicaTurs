/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrinemprendimientoComponent } from './prinemprendimiento.component';

describe('PrinemprendimientoComponent', () => {
  let component: PrinemprendimientoComponent;
  let fixture: ComponentFixture<PrinemprendimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinemprendimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinemprendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
