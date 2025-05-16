  // emprendimiento.service.ts
  import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { FiltrosBusqueda } from './busqueda-global.service';

  @Injectable({ providedIn: 'root' })
  export class EmprendimientoService {
    private apiUrl = 'https://capachica-app-back-production.up.railway.app/emprendimientos';

    constructor(private http: HttpClient) {}

    /** Construye headers con token Bearer */
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('authToken');
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.error('No se encontró el token de autenticación.');
      }
      return headers;
    }

    /** Listar con paginación y filtros opcionales */
    listarEmprendimientos(
      pagina: number = 1,
      limite: number = 10,
      filtros?: Record<string, any>
    ): Observable<any> {
      let params = new HttpParams()
        .set('page', pagina.toString())
        .set('limit', limite.toString());

      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value != null) params = params.set(key, value);
        });
      }

      return this.http.get<any>(this.apiUrl, { params });
    }
    getLugarTuristico(id: number): Observable<any> {
      return this.http.get(`https://capachica-app-back-production.up.railway.app/lugares-turisticos/${id}`);
    }
    
    

    /** Obtener un único emprendimiento por ID */
    getEmprendimiento(id: number | string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders()
      });
    }
    getEmprendimientos(): Observable<any[]> {
      return this.http.get<any[]>('https://capachica-app-back-production.up.railway.app/emprendimientos');
    }
    

    /** Crear un nuevo emprendimiento */
    guardarEmprendimiento(emprendimiento: any): Observable<any> {
      return this.http.post<any>(
        this.apiUrl,
        emprendimiento,
        { headers: this.getAuthHeaders() }
      );
    }
  

    /** Actualizar un emprendimiento existente (PATCH parcial) */
    actualizarEmprendimiento(id: number | string, data: any): Observable<any> {
      return this.http.patch<any>(
        `${this.apiUrl}/${id}`,
        data,
        { headers: this.getAuthHeaders() }
      );
    }

    /** Eliminar un emprendimiento */
    eliminarEmprendimiento(id: number | string): Observable<any> {
      return this.http.delete<any>(
        `${this.apiUrl}/${id}`,
        { headers: this.getAuthHeaders() }
      );
    }

    /** Búsqueda con filtros dinámicos */
    buscarConFiltros(filtros: Record<string, any>): Observable<any[]> {
      let params = new HttpParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value != null) params = params.set(key, value);
      });
      return this.http.get<any[]>(this.apiUrl, { params });
    }
    // Nuevo método para buscar con filtros
    buscarEmprendimientos(filtros: FiltrosBusqueda): Observable<any[]> {
      let params = new HttpParams();
      if (filtros.nombre) {
        params = params.set('nombre', filtros.nombre);
      }
      if (filtros.lugar) {
        params = params.set('lugar', filtros.lugar);
      }
      if (filtros.fechaDesde) {
        params = params.set('fechaDesde', filtros.fechaDesde);
      }
      if (filtros.fechaHasta) {
        params = params.set('fechaHasta', filtros.fechaHasta);
      }
      // Agrega otros filtros según necesites

      return this.http.get<any[]>(this.apiUrl + '/buscar', { params });
    }
  }
