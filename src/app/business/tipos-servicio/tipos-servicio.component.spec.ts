import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposServicioComponent } from './tipos-servicio.component';

describe('TiposServicioComponent', () => {
  let component: TiposServicioComponent;
  let fixture: ComponentFixture<TiposServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
