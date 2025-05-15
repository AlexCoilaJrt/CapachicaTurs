import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinserviciosComponent } from './prinservicios.component';

describe('PrinserviciosComponent', () => {
  let component: PrinserviciosComponent;
  let fixture: ComponentFixture<PrinserviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinserviciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
