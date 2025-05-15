import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from '../../navbar/navbar.component';
import { EmprendimientoService } from '../../../core/services/emprendimiento.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detprin-emprendimiento',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './detemprendimiento.component.html',
  styleUrls: ['./detemprendimiento.component.css']
})
export class DetprinEmprendimientoComponent implements OnInit {
  mapUrl!: SafeResourceUrl;
  emprendimiento: any = {};
  isLoading = true;
  errorMessage = '';
  dateForm: FormGroup;
  nights: number | null = null;
  totalPrice: number | null = null;
  currentSlide = 0;

  constructor(
    private route: ActivatedRoute,
    private empService: EmprendimientoService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    this.dateForm.valueChanges.subscribe(values => {
      this.calculateNights(values.startDate, values.endDate);
    });
  }

  ngOnInit(): void {
    initFlowbite();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID de emprendimiento no proporcionado';
      this.isLoading = false;
      return;
    }

    this.empService.getEmprendimiento(id).subscribe({
      next: (detalle) => {
        this.emprendimiento = detalle;
        this.isLoading = false;
        // Llamamos a la función para construir la URL del mapa después de recibir los detalles
        if (this.emprendimiento.latitud && this.emprendimiento.longitud) {
          this.buildMapUrl(this.emprendimiento.latitud, this.emprendimiento.longitud);
        }
      },
      error: (err) => {
        console.error('Error cargando emprendimiento:', err);
        this.errorMessage = 'No se pudo cargar el emprendimiento.';
        this.isLoading = false;
      }
    });
  }

  calculateNights(startDate: string, endDate: string): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      this.nights = diff / (1000 * 3600 * 24);
    } else {
      this.nights = null;
    }
  }

  // Método para agregar al carrito
  addToCart(): void {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingItem = cart.find(item => item.id === this.emprendimiento.id);

    if (existingItem) {
      Swal.fire({
        icon: 'info',
        title: '¡Ya tienes esta reserva!',
        text: 'Este lugar ya está en tu carrito.',
        confirmButtonText: 'Aceptar'
      });
    } else {
      const cartItem: CartItem = {
        id: this.emprendimiento.id,
        nombre: this.emprendimiento.nombre,
        precio: this.emprendimiento.precioBase,
        startDate: this.dateForm.value.startDate,
        endDate: this.dateForm.value.endDate
      };

      cart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(cart));

      Swal.fire({
        icon: 'success',
        title: '¡Lugar añadido al carrito!',
        text: 'Ahora puedes continuar con la reserva.',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  resetCarousel() {
    this.currentSlide = 0;
  }

  prevSlide() {
    const len = this.emprendimiento.imagenes.length;
    this.currentSlide = (this.currentSlide - 1 + len) % len;
  }

  nextSlide() {
    const len = this.emprendimiento.imagenes.length;
    this.currentSlide = (this.currentSlide + 1) % len;
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getIterable(val: any): any[] {
    return Array.isArray(val) ? val : [];
  }

  // Método para construir la URL del mapa de Google
  private buildMapUrl(lat: number, lng: number): void {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  startDate: string;
  endDate: string;
}
