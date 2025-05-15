import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormServiciosComponent } from './form-servicios.component';

describe('FormServiciosComponent', () => {
  let component: FormServiciosComponent;
  let fixture: ComponentFixture<FormServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
