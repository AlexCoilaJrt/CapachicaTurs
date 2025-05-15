import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioComponent } from './servicios.component';

describe('ServicioComponent', () => {
  let component: ServicioComponent;
  let fixture: ComponentFixture<ServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
