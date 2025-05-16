import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LugaresService } from '../../../core/services/lugar.service';
import { initFlowbite } from 'flowbite';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { EmprendimientoService } from '../../../core/services/emprendimiento.service';

@Component({
  selector: 'app-detprinlugares',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './detprinlugares.component.html',
  styleUrls: ['./detprinlugares.component.css']
})
export class DetprinlugaresComponent implements OnInit {
  mapUrl!: SafeResourceUrl;
  lugar: any = {};
  resenas: any[] = [];
  usuarios: any = {};
  dateForm: FormGroup;
  totalPrice: number | null = null;
  nights: number | null = null;
  currentSlide = 0;
  emprendimientos: any[] = [];
  

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private lugaresService: LugaresService,
    private fb: FormBuilder,
    private router: Router,
    private emprendimientoService: EmprendimientoService
    
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
    this.obtenerLugar();
    this.cargarEmprendimientos();

    
  }
  cargarEmprendimientos() {
    this.emprendimientoService.getEmprendimientos().subscribe((data) => {
      this.emprendimientos = data;
    });
  }

  obtenerLugar(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.lugaresService.getLugar(id).subscribe({
        next: (lugar) => {
          this.lugar = lugar;
          this.buildMapUrl(lugar.latitud, lugar.longitud);
          console.log("lugar detalle", this.lugar);
        },
        error: (err) => {
          console.error('Error al obtener detalles del lugar:', err);
        }
      });
    }
  }

  private buildMapUrl(lat: number, lng: number): void {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  calculateNights(startDate: string, endDate: string): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInTime = end.getTime() - start.getTime();
      this.nights = differenceInTime / (1000 * 3600 * 24);
    } else {
      this.nights = null;
    }
  }

  
  goToEmprendimiento(emprendimiento: any) {
    this.router.navigate(['/emprendimientos', emprendimiento.id]);
  }

  resetCarousel() {
    this.currentSlide = 0;
  }

  prevSlide() {
    const len = this.lugar.imagenes.length;
    this.currentSlide = (this.currentSlide - 1 + len) % len;
  }

  nextSlide() {
    const len = this.lugar.imagenes.length;
    this.currentSlide = (this.currentSlide + 1) % len;
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getIterable(val: any): any[] {
    return Array.isArray(val) ? val : [];
  }
}

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  startDate: string;
  endDate: string;
}
