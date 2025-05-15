import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTiposServicioComponent } from './form-tipos-servicio.component';

describe('FormTiposServicioComponent', () => {
  let component: FormTiposServicioComponent;
  let fixture: ComponentFixture<FormTiposServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTiposServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTiposServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
