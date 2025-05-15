import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE_login         = 'https://capachica-app-back-production.up.railway.app/auth';
  private readonly API_BASE_usuario       = 'https://capachica-app-back-production.up.railway.app/users';
  
  private readonly LOGIN_URL              = `${this.API_BASE_login}/login`;
  private readonly REGISTER_URL           = `${this.API_BASE_usuario}/register`;
  private readonly REQUEST_PASSWORD_URL   = `${this.API_BASE_usuario}/request-password-reset`;
  private readonly RESET_PASSWORD_URL     = `${this.API_BASE_usuario}/reset-password`;
  private readonly RESET_PASSWORD_ADMIN_URL = `${this.API_BASE_usuario}/reset-password`;

  private readonly tokenKey               = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword(token: string, newPassword: string): Observable<any> {
    const resetData = { token, newPassword };  // Preparar los datos para el POST
    return this.http.post<any>(this.RESET_PASSWORD_URL, resetData, { withCredentials: true }).pipe(
      tap(() => console.log('Contraseña reseteada correctamente'))
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    const resetData = { email };  // Preparar los datos para el POST
    return this.http.post<any>(this.REQUEST_PASSWORD_URL, resetData, { withCredentials: true }).pipe(
      tap(() => console.log('Se ha solicitado el reseteo de la contraseña'))
    );
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.REGISTER_URL}`, userData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => console.log('Respuesta del servidor:', response))
    );
  }
  
  
  

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(this.LOGIN_URL, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.access_token) {
            console.log('Access Token:', response.access_token);
            this.setToken(response.access_token);
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getUsuarios(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.API_BASE_usuario}`, { headers });
  }

  getUsuarioById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.API_BASE_usuario}/${id}`, { headers }).pipe(
      tap((usuario) => {
        console.log('Usuario obtenido desde la API:', usuario);
      })
    );
  }

  actualizarUsuario(id: number, datos: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.patch(`${this.API_BASE_usuario}/${id}`, datos, { headers });
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.API_BASE_usuario}/${id}`, { headers });
  }

  asignarRol(userId: number, roleId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.API_BASE_usuario}/${userId}/roles/${roleId}`, {}, { headers });
  }

  quitarRol(userId: number, roleId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.API_BASE_usuario}/${userId}/roles/${roleId}`, { headers });
  }

  crearUsuarioComoAdmin(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.API_BASE_usuario}`, data, { headers });
  }
  logout(): void {
    // Eliminar el token de localStorage
    localStorage.removeItem(this.tokenKey);
  
    // Redirigir al usuario al login (o a cualquier otra página)
    this.router.navigate(['/']); // Ajusta la ruta de acuerdo a tu flujo de navegación
  }
  
}
