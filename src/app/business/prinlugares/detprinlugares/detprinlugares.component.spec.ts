/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetprinlugaresComponent } from './detprinlugares.component';

describe('DetprinlugaresComponent', () => {
  let component: DetprinlugaresComponent;
  let fixture: ComponentFixture<DetprinlugaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetprinlugaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetprinlugaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
