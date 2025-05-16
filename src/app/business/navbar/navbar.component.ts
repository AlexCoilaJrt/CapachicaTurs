import {
  Component,
  HostListener,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { PaqueteTuristicoService } from '../../core/services/paquetes-turisticos.service';
import { LugaresService } from '../../core/services/lugar.service';
import { TiposServicioService } from '../../core/services/tipos-servicios.service';
import { BusquedaGlobalService, FiltrosBusqueda } from '../../core/services/busqueda-global.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  tiposServicio: any[] = [];
  emprendimientoNombres: string[] = [];
  paqueteNombres: string[] = [];
  tiposServicios: string[] = [];
  lugarOpciones: string[] = [];
  resultados: any[] = [];

  searchSelection: string = '';
  searchSelectionLugar: string = '';
  fechaInferior: string = '';
  fechaSuperior: string = '';
  tipoBusqueda: 'emprendimientos' | 'paquetes' | 'servicios' | 'lugares' = 'emprendimientos';

  drawerOpen = false;
  public ocultarNav = false;
  @Output() onBuscar = new EventEmitter<{ nombre: string; lugar: string; fecha: string }>();

  constructor(
    private emprendimientoService: EmprendimientoService,
    private paqueteService: PaqueteTuristicoService,
    private lugarService: LugaresService,
    private tiposServicioService: TiposServicioService,
    private busquedaService: BusquedaGlobalService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:scroll') onScroll() {
    this.ocultarNav = window.scrollY > 100;
  }

  ngOnInit(): void {
    initFlowbite();
    this.determinarTipoBusqueda();
    this.loadEmprendimientoNombres();
    this.loadPaqueteNombres();
    this.loadTiposServicios();
    this.loadLugaresTuristicos();
    this.cargarTiposServicio();
  }

  private cargarTiposServicio(): void {
    this.tiposServicioService.listarTiposServicio().subscribe(
      data => this.tiposServicio = data,
      err => console.error('Error al cargar tipos de servicio:', err)
    );
  }

  private loadEmprendimientoNombres() {
    this.emprendimientoService.listarEmprendimientos()
      .subscribe(data => {
        const items = Array.isArray((data as any).emprendimientos)
          ? (data as any).emprendimientos
          : data;
        this.emprendimientoNombres = items.map((e: any) => e.nombre).filter((n: string | undefined) => !!n);
      });
  }

  private loadPaqueteNombres() {
    this.paqueteService.listarPaquetesTuristicos()
      .subscribe((data: any[]) => {
        this.paqueteNombres = data.map(p => p.nombre).filter(n => !!n);
      });
  }

  private loadTiposServicios() {
    this.tiposServicioService.listarTiposServicio()
      .subscribe((data: any[]) => {
        this.tiposServicios = data.map(s => s.nombre).filter(n => !!n);
      });
  }

  private loadLugaresTuristicos() {
    this.lugarService.listarLugares()
      .subscribe((data: any[]) => {
        this.lugarOpciones = data.map(l => l.nombre).filter(n => !!n);
      });
  }

  private determinarTipoBusqueda() {
    if (this.searchSelection) {
      if (this.emprendimientoNombres.includes(this.searchSelection)) this.tipoBusqueda = 'emprendimientos';
      else if (this.paqueteNombres.includes(this.searchSelection)) this.tipoBusqueda = 'paquetes';
      else if (this.tiposServicios.includes(this.searchSelection)) this.tipoBusqueda = 'servicios';
    } else if (this.searchSelectionLugar && !this.searchSelection) {
      this.tipoBusqueda = 'lugares';
    }
  }

  toggleFiltros() {
    this.drawerOpen = !this.drawerOpen;
  }

  limpiarFiltros() {
    this.searchSelection = '';
    this.searchSelectionLugar = '';
    this.fechaInferior = '';
    this.fechaSuperior = '';
    this.tipoBusqueda = 'emprendimientos';
    this.resultados = [];
  }

  buscar(): void {
    this.determinarTipoBusqueda();

    const filtros: FiltrosBusqueda = {
      nombre: this.searchSelection || undefined,
      lugar: this.searchSelectionLugar || undefined,
      fechaDesde: this.fechaInferior || undefined,
      fechaHasta: this.fechaSuperior || undefined,
      tipo: this.tipoBusqueda
    };

    this.busquedaService.setFiltros(filtros);
    this.onBuscar.emit({
      nombre: filtros.nombre || '',
      lugar: filtros.lugar || '',
      fecha: filtros.fechaDesde || ''
    });

    // ⚠️ Este es el único cambio agregado que evita redirigir si ya estás en /prinlugares
    if (this.router.url.startsWith('/prinlugares') && this.tipoBusqueda === 'lugares') {
      return; // No navegamos porque ya estás ahí
    }
    if (this.router.url.startsWith('/prinservicios') && this.tipoBusqueda === 'servicios') {
      return; // No navegamos porque ya estás ahí
    }

    switch (this.tipoBusqueda) {
      case 'servicios':
        this.router.navigate(['/prinservicios', filtros.nombre || '']);
        break;

      case 'emprendimientos':
        this.router.navigate(['/prinemprendimiento'], { queryParams: filtros });
        break;

      case 'paquetes':
        this.router.navigate(['/prinpaquetes'], { queryParams: filtros });
        break;

      case 'lugares':
        this.router.navigate(['/prinlugares'], { queryParams: filtros });
        break;

      default:
        this.router.navigate(['/']);
        break;
    }
  }

  private detectarTipo(f: { nombre: string; lugar: string; fecha: string }): 'servicios'|'emprendimientos'|'paquetes'|'lugares' {
    if (f.nombre && this.emprendimientoNombres.includes(f.nombre)) return 'emprendimientos';
    if (f.nombre && this.paqueteNombres.includes(f.nombre))         return 'paquetes';
    if (f.nombre && this.tiposServicios.includes(f.nombre))         return 'servicios';
    if (f.lugar && !f.nombre)                                       return 'lugares';
    return 'emprendimientos';
  }

  public refreshData(tipoId: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/prinservicios`, tipoId]);
    });
  }
}
