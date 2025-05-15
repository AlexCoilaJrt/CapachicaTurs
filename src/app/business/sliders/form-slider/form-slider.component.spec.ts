import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSliderComponent } from './form-slider.component';

describe('FormSliderComponent', () => {
  let component: FormSliderComponent;
  let fixture: ComponentFixture<FormSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
