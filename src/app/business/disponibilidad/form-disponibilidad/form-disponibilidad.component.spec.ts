import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDisponibilidadComponent } from './form-disponibilidad.component';

describe('FormDisponibilidadComponent', () => {
  let component: FormDisponibilidadComponent;
  let fixture: ComponentFixture<FormDisponibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDisponibilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDisponibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
