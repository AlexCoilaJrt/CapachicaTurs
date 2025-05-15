import { Component }      from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { Router, RouterModule }   from '@angular/router';
import { AuthService }    from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  nombre = '';
  apellidos = '';
  telefono = '';
  direccion = '';
  fotoPerfilUrl = '';
  fechaNacimiento = '';
  subdivisionId: number = 0;
  email = '';
  password = '';
  confirmPassword = '';
  acceptedTerms = false;
  showPassword = false;
  

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const usuario = {
      email: this.email,
      password: this.password,
      nombre: this.nombre,
      apellidos: this.apellidos,
      telefono: this.telefono,
      direccion: this.direccion,
      fechaNacimiento: this.fechaNacimiento,
      subdivisionId: this.subdivisionId,
      preferencias: {},
      usuariosRoles: []
    };
  
    this.authService.register(usuario).subscribe({
      next: res => {
        console.log('Usuario registrado:', res);
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta se ha creado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: err => {
        console.error('Error al registrar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: err?.error?.message || 'Hubo un problema al registrar tu cuenta. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  
  
  


  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }
}
