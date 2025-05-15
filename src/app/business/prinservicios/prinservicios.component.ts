import { Component, OnInit } from '@angular/core';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from '../../core/services/servicios.service';
import { ResenaService } from '../../core/services/resenas.service';
import { CommonModule } from '@angular/common';
import { BusquedaGlobalService } from '../../core/services/busqueda-global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prinservicios',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './prinservicios.component.html',
  styleUrl: './prinservicios.component.css'
})
export class PrinserviciosComponent implements OnInit {
  isLoading: boolean = false;
  servicios: any[] = [];
  tipoServicioId: string = "";

  // VARIABLES PARA FILTRADO
  filtroNombre: string = '';
  filtroLugar: string = '';
  filtroFecha: string = '';

  constructor(
    private servicioService: ServiciosService,
    private resenaService: ResenaService,
    private router: Router,
    private route: ActivatedRoute,
    private busquedaService: BusquedaGlobalService
  ) {}

  ngOnInit(): void {
    // Leer filtros desde query params para inicializar inputs
    this.route.queryParams.subscribe(params => {
      this.filtroNombre = params['nombre'] || '';
      this.filtroLugar = params['lugar'] || '';
      this.filtroFecha = params['fechaDesde'] || '';

      const filtros = {
        nombre: this.filtroNombre,
        lugar: this.filtroLugar,
        fechaDesde: this.filtroFecha,
        tipo: 'servicios'
      };

      if (filtros.nombre || filtros.lugar || filtros.fechaDesde) {
        this.buscarConFiltros(filtros);
      } else {
        const resultadosGuardados = this.busquedaService.getResultados();
        if (resultadosGuardados && resultadosGuardados.length > 0) {
          this.servicios = resultadosGuardados;
          this.enriquecerServiciosConReseñas(this.servicios);
        } else {
          this.obtenerServiciosConReseñas();
        }
      }
    });
  }

  obtenerServiciosConReseñas(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.tipoServicioId = id ? String(id) : '';
    this.isLoading = true;

    this.servicioService.listarServiciosPorTipo(this.tipoServicioId).subscribe({
      next: (res: any[]) => {
        this.servicios = res;
        this.enriquecerServiciosConReseñas(this.servicios);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.isLoading = false;
      }
    });
  }

  enriquecerServiciosConReseñas(servicios: any[]): void {
    servicios.forEach(servicio => {
      this.resenaService.obtenerPromedioDeCalificacion(servicio.id).subscribe((promedio: any) => {
        servicio.promedioCalificacion = promedio.promedioCalificacion;
        servicio.totalResenas = promedio.totalResenas;
      });

      this.resenaService.obtenerReseñas().subscribe((reseñas: any[]) => {
        servicio.reseñas = reseñas.filter(resena => resena.servicioId === servicio.id);
      });
    });
  }

  buscarConFiltros(filtros: any): void {
    this.isLoading = true;
    this.busquedaService.buscarConFiltros(filtros).subscribe({
      next: (data: any[]) => {
        this.servicios = data;
        this.enriquecerServiciosConReseñas(this.servicios);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en búsqueda de servicios:', error);
        this.isLoading = false;
      }
    });
  }

  // MÉTODO PARA FILTRAR LOCALMENTE
  aplicarFiltrosLocal(filtros: { nombre: string; lugar: string; fecha: string }) {
    // Actualizar variables de filtro con el evento recibido
    this.filtroNombre = filtros.nombre || '';
    this.filtroLugar = filtros.lugar || '';
    this.filtroFecha = filtros.fecha || '';
  
    // Filtrar localmente
    this.servicios = this.servicios.filter(servicio => {
      const coincideNombre = this.filtroNombre
        ? servicio.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase())
        : true;
      const coincideLugar = this.filtroLugar
        ? servicio.direccion?.toLowerCase().includes(this.filtroLugar.toLowerCase())
        : true;
      const coincideFecha = this.filtroFecha
        ? servicio.fechaDisponible === this.filtroFecha
        : true;
      return coincideNombre && coincideLugar && coincideFecha;
    });
  }
  

  verDetallesServicios(id: number): void {
    this.router.navigate([`/serviciosdetalle/${id}`]);
  }
}
