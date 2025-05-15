import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TiposServicioService {
  private readonly API = 'https://capachica-app-back-production.up.railway.app/tipos-servicio';

  constructor(private http: HttpClient) { }

  // Crear un nuevo tipo de servicio (POST /tipos-servicio)
  crearTipoServicio(data: any): Observable<any> {
    return this.http.post(this.API, data, this.getAuthOptions()).pipe(
      catchError(err => {
        console.error('Error al crear tipo de servicio:', err);
        return throwError(() => new Error('Error al crear tipo de servicio'));
      })
    );
  }

  // Listar todos los tipos de servicio (GET /tipos-servicio)
  listarTiposServicio(): Observable<any[]> {
    return this.http.get<any[]>(this.API, this.getAuthOptions()).pipe(
      catchError(err => {
        console.error('Error al listar tipos de servicio:', err);
        return throwError(() => new Error('Error al listar tipos de servicio'));
      })
    );
  }

  // Obtener un tipo de servicio por ID (GET /tipos-servicio/{id})
  obtenerTipoServicio(id: number | string): Observable<any> {
    return this.http.get(`${this.API}/${id}`, this.getAuthOptions()).pipe(
      catchError(err => {
        console.error('Error al obtener tipo de servicio:', err);
        return throwError(() => new Error('Error al obtener tipo de servicio'));
      })
    );
  }

  // Eliminar un tipo de servicio (DELETE /tipos-servicio/{id})
  eliminarTipoServicio(id: number | string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, this.getAuthOptions()).pipe(
      catchError(err => {
        console.error('Error al eliminar tipo de servicio:', err);
        return throwError(() => new Error('Error al eliminar tipo de servicio'));
      })
    );
  }

  /**
   * Búsqueda de tipos de servicio con filtros dinámicos
   */
  buscarConFiltros(filtros: { nombre?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    const options = { ...this.getAuthOptions(), params };
    return this.http.get<any[]>(this.API, options).pipe(
      catchError(err => {
        console.error('Error al buscar tipos de servicio:', err);
        return throwError(() => new Error('Error al buscar tipos de servicio'));
      })
    );
  }

  // Opciones de cabecera con token
  private getAuthOptions() {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return { headers };
  }
}