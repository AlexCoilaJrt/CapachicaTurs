import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetprinserviciosComponent } from './detprinservicios.component';

describe('DetprinserviciosComponent', () => {
  let component: DetprinserviciosComponent;
  let fixture: ComponentFixture<DetprinserviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetprinserviciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetprinserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
