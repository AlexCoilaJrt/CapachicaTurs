import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../../core/services/servicios.service';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { ResenaService } from '../../../core/services/resenas.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-detprinservicios',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './detprinservicios.component.html',
  styleUrl: './detprinservicios.component.css'
})
export class DetprinserviciosComponent implements OnInit {
  servicios: any = {};
  resenas: any[] = [];
  usuarios: any = {};
  dateForm: FormGroup;
  nights: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private serviciosService: ServiciosService,
    private resenaService: ResenaService,
    private usuarioService: AuthService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });

    // Observamos cambios en las fechas seleccionadas
    this.dateForm.valueChanges.subscribe(values => {
      this.calculateNights(values.startDate, values.endDate);
    });
  }

  ngOnInit() {
    initFlowbite();
    this.obtenerServicio();
    this.obtenerReseñasPorServicio();

  }
  obtenerServicio(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviciosService.obtenerServicio(id).subscribe({
        next: (servicio) => {
          this.servicios = servicio;
          console.log("servicios detalle", this.servicios)
        },
        error: (err) => {
          console.error('Error al obtener detalles del servicio:', err);
        }
      });
    }
  }
  obtenerReseñasPorServicio(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.resenaService.obtenerReseñasPorServicio(id).subscribe(
        (data) => {
          console.log('Reseñas obtenidas:', data);
          this.resenas = data;  // Asignamos las reseñas al array

          // Aquí, supongamos que cada reseña tiene un `usuarioId` que corresponde a un usuario
          this.resenas.forEach((resena: any) => {
            // Llamar a la API para obtener el usuario
            this.usuarioService.getUsuarioById(resena.usuarioId).subscribe(
              (usuario) => {
                this.usuarios = usuario;
                console.log('Usuario asociado a la reseña:', this.usuarios);
              },
              (error) => {
                console.error('Error al obtener el usuario:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error al obtener las reseñas:', error);
        }
      );
    }
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
}
