import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LugaresService } from '../../core/services/lugar.service';
import { ResenaService } from '../../core/services/resenas.service';

@Component({
  selector: 'app-prinlugares',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './prinlugares.component.html',
  styleUrls: ['./prinlugares.component.css']
})
export class PrinlugaresComponent implements OnInit {
  lugaresOriginal: any[] = [];
  lugaresFiltrados: any[] = [];
  isLoading = false;

  constructor(
    private lugaresService: LugaresService,
    private resenaService: ResenaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLugares();
  }

  private cargarLugares(): void {
    this.isLoading = true;
    this.lugaresService.listarLugares().subscribe({
      next: (data: any[]) => {
        this.lugaresOriginal = data;
        this.lugaresFiltrados = data;
        this.isLoading = false;

        // Enriquecer cada lugar con su calificación y reseñas
        data.forEach(lugar => {
          this.resenaService.obtenerPromedioDeCalificacion(lugar.id)
            .subscribe((prom: any) => lugar.promedioCalificacion = prom.promedioCalificacion);

          this.resenaService.obtenerReseñas()
            .subscribe((resenas: any[]) => {
              lugar.reseñas = resenas.filter((r: any) => r.lugarId === lugar.id);
            });
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  aplicarFiltrosLocal(filtros: { nombre: string; lugar: string; fecha: string }): void {
    const { nombre, lugar, fecha } = filtros;

    this.lugaresFiltrados = this.lugaresOriginal.filter(lug => {
      const nombreOk = nombre
        ? lug.nombre?.toLowerCase().includes(nombre.toLowerCase())
        : true;

      const lugarOk = lugar
        ? (lug.nombre?.toLowerCase().includes(lugar.toLowerCase()) ||
           lug.direccion?.toLowerCase().includes(lugar.toLowerCase()))
        : true;

      // Si no existe lug.fecha, lo ignoramos
      const fechaOk = fecha
        ? (lug.fecha ? new Date(lug.fecha).toISOString().split('T')[0] === fecha : false)
        : true;

      return nombreOk && lugarOk && fechaOk;
    });
  }

  verDetallesLugar(id: number): void {
    this.router.navigate([`lugardetalle/${id}`]);
  }
}
