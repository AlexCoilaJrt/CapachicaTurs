import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinlugaresComponent } from './prinlugares.component';

describe('PrinlugaresComponent', () => {
  let component: PrinlugaresComponent;
  let fixture: ComponentFixture<PrinlugaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinlugaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinlugaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
