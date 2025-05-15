import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe registrar un usuario', () => {
    const fakeUser = { email: 'test@test.com', password: '123456' };
    const mockResponse = { message: 'Usuario registrado' };

    service.register(fakeUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['REGISTER_URL']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(fakeUser);
    req.flush(mockResponse);
  });

  it('debe loguear y guardar el token en localStorage', () => {
    const mockToken = 'fake-token';
    const response = { access_token: mockToken };

    service.login('correo@test.com', '123456').subscribe();

    const req = httpMock.expectOne(service['LOGIN_URL']);
    expect(req.request.method).toBe('POST');
    req.flush(response);

    expect(localStorage.getItem('authToken')).toBe(mockToken);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debe solicitar reset de contraseña', () => {
    const email = 'usuario@test.com';
    const mockResponse = { message: 'Email enviado' };

    service.requestPasswordReset(email).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['REQUEST_PASSWORD_URL']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(mockResponse);
  });

  it('debe resetear la contraseña', () => {
    const token = 'abc123';
    const newPassword = 'nueva123';
    const mockResponse = { message: 'Contraseña actualizada' };

    service.resetPassword(token, newPassword).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service['RESET_PASSWORD_URL']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token, newPassword });
    req.flush(mockResponse);
  });

  it('debe obtener usuarios con token en headers', () => {
    localStorage.setItem('authToken', 'abc');
    const mockUsers = [{ id: 1, email: 'test@upeu.edu.pe' }];

    service.getUsuarios().subscribe(users => {
      expect(users.length).toBe(1);
    });

    const req = httpMock.expectOne(service['API_BASE_usuario']);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush(mockUsers);
  });

  it('debe obtener usuario por ID', () => {
    const userId = 1;
    localStorage.setItem('authToken', 'abc');
    const mockUser = { id: 1, email: 'test@test.com' };

    service.getUsuarioById(userId).subscribe(user => {
      expect(user.id).toBe(1);
    });

    const req = httpMock.expectOne(`${service['API_BASE_usuario']}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('debe actualizar un usuario', () => {
    const userId = 1;
    localStorage.setItem('authToken', 'abc');
    const datos = { nombre: 'Nuevo Nombre' };

    service.actualizarUsuario(userId, datos).subscribe();

    const req = httpMock.expectOne(`${service['API_BASE_usuario']}/${userId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });

  it('debe eliminar un usuario', () => {
    const userId = 2;
    localStorage.setItem('authToken', 'abc');

    service.eliminarUsuario(userId).subscribe();

    const req = httpMock.expectOne(`${service['API_BASE_usuario']}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debe asignar un rol a un usuario', () => {
    const userId = 5;
    const roleId = 2;
    localStorage.setItem('authToken', 'abc');

    service.asignarRol(userId, roleId).subscribe();

    const req = httpMock.expectOne(`${service['API_BASE_usuario']}/${userId}/roles/${roleId}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('debe quitar un rol a un usuario', () => {
    const userId = 5;
    const roleId = 2;
    localStorage.setItem('authToken', 'abc');

    service.quitarRol(userId, roleId).subscribe();

    const req = httpMock.expectOne(`${service['API_BASE_usuario']}/${userId}/roles/${roleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debe crear usuario como admin', () => {
    const userData = { email: 'admin@upeu.edu.pe' };
    localStorage.setItem('authToken', 'abc');

    service.crearUsuarioComoAdmin(userData).subscribe();

    const req = httpMock.expectOne(service['API_BASE_usuario']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush({});
  });
});
