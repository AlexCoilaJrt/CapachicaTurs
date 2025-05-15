import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiciosService } from '../../../core/services/servicios.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../../core/services/supabase.service';
import { TiposServicioService } from '../../../core/services/tipos-servicios.service';

@Component({
  selector: 'app-form-servicios',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './form-servicios.component.html',
  styleUrls: ['./form-servicios.component.css']
})
export class FormServiciosComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  servicioForm!: FormGroup;
  tiposServicio: any[] = [];  // Lista de tipos de servicio
  isEdit: boolean = false;
  servicioIdEdit: number | null = null;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private tiposServicioService: TiposServicioService, // Nuevo servicio para obtener los tipos
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.servicioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioBase: [0, Validators.required],
      moneda: ['', Validators.required],
      estado: ['activo', Validators.required],
      tipoServicioId: [0, Validators.required],  // Tipo de servicio
      duracion: [''],
      capacidad: [''],
      incluye: [''],
      requisitos: ['']
    });

    // Cargar tipos de servicio
    this.tiposServicioService.listarTiposServicio().subscribe({
      next: (data) => {
        this.tiposServicio = data; // Guardamos los tipos de servicio
      },
      error: (err) => {
        console.error('Error al cargar tipos de servicio:', err);
        Swal.fire('Error', 'No se pudieron cargar los tipos de servicio.', 'error');
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.servicioIdEdit = +id;

      this.serviciosService.obtenerServicio(this.servicioIdEdit).subscribe({
        next: (servicio) => {
          this.servicioForm.patchValue({
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            precioBase: servicio.precioBase,
            moneda: servicio.moneda,
            estado: servicio.estado,
            tipoServicioId: servicio.tipoServicio?.id, // Asignamos el tipo de servicio
            duracion: servicio.detallesServicio?.duracion,
            capacidad: servicio.detallesServicio?.capacidad,
            incluye: servicio.detallesServicio?.incluye,
            requisitos: servicio.detallesServicio?.requisitos
          });
        },
        error: (err) => {
          console.error('Error al cargar servicio:', err);
          Swal.fire('Error', 'No se pudo cargar el servicio.', 'error');
        }
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async subirImagenASupabase(file: File): Promise<string> {
    Swal.fire({
      title: 'Subiendo imagen...',
      text: 'Por favor espere mientras se sube la imagen.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const supabase = this.supabaseService.getClient();
    const filePath = `servicios/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage.from('servicios').upload(filePath, file);
    if (error) {
      Swal.close();
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage.from('servicios').getPublicUrl(filePath);
    Swal.close();
    return publicUrlData?.publicUrl;
  }

  async guardarServicio() {
    if (this.servicioForm.invalid) {
      const camposInvalidos = Object.keys(this.servicioForm.controls)
        .filter(key => this.servicioForm.get(key)?.invalid)
        .map(key => key);
  
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        html: `Por favor corrige o completa los siguientes campos:<br><b>${camposInvalidos.join(', ')}</b>`
      });
      return;
    }
  
    const formValue = this.servicioForm.getRawValue();
    let imagenUrl = '';
  
    // Aseguramos que precioBase sea un número entero
    const precioBase = Number(formValue.precioBase); // O puedes usar parseInt(formValue.precioBase, 10);
  
    // Validación para asegurarnos que precioBase es un número
    if (isNaN(precioBase) || precioBase <= 0) {
      Swal.fire('Error', 'El precio base debe ser un número válido mayor que cero.', 'error');
      return;
    }
  
    // Aseguramos que tipoServicioId sea un número entero
    const tipoServicioId = Number(formValue.tipoServicioId);
  
    // Validación para asegurarnos que tipoServicioId es un número válido
    if (isNaN(tipoServicioId) || tipoServicioId <= 0) {
      Swal.fire('Error', 'El tipo de servicio debe ser un número válido mayor que cero.', 'error');
      return;
    }
  
    // Validación de "incluye" y "requisitos" para asegurar que sean cadenas y no vacías
    const incluye = typeof formValue.incluye === 'string' ? formValue.incluye.split(',') : [];
    const requisitos = typeof formValue.requisitos === 'string' ? formValue.requisitos.split(',') : [];
  
    // Mostrar mensaje de carga mientras se sube la imagen
    Swal.fire({
      title: 'Subiendo imagen...',
      text: 'Por favor espere mientras se sube la imagen y se guarda el servicio.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Inicia el "loading"
      }
    });
  
    // Subir la imagen a Supabase
    if (this.selectedFile) {
      try {
        imagenUrl = await this.subirImagenASupabase(this.selectedFile);
      } catch (error) {
        console.error('Error al subir imagen:', error);
        Swal.close(); // Cierra el mensaje de carga
        Swal.fire('Error', 'No se pudo subir la imagen de servicio.', 'error');
        return;
      }
    }
  
    const payload = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precioBase: precioBase, // Asignamos el precio como número
      moneda: formValue.moneda,
      estado: formValue.estado,
      tipoServicioId: tipoServicioId, // Asignamos el tipo de servicio como número
      detallesServicio: {
        duracion: formValue.duracion,
        capacidad: formValue.capacidad,
        incluye: incluye, // Se asigna el arreglo ya dividido
        requisitos: requisitos // Se asigna el arreglo ya dividido
      },
      imagenes: imagenUrl ? [{ url: imagenUrl }] : []
    };
  
    if (this.isEdit && this.servicioIdEdit) {
      this.serviciosService.actualizarServicio(this.servicioIdEdit, payload).subscribe({
        next: () => {
          Swal.close(); // Cierra el mensaje de carga
          Swal.fire('Actualizado', 'El servicio fue actualizado correctamente.', 'success');
          this.router.navigate(['/servicios']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.close(); // Cierra el mensaje de carga
          Swal.fire('Error', 'No se pudo actualizar el servicio.', 'error');
        }
      });
    } else {
      this.serviciosService.crearServicio(payload).subscribe({
        next: () => {
          Swal.close(); // Cierra el mensaje de carga
          Swal.fire('Registrado', 'El servicio fue registrado correctamente.', 'success');
          this.router.navigate(['/servicios']);
        },
        error: (err) => {
          console.error('Error al registrar:', err);
          Swal.close(); // Cierra el mensaje de carga
          Swal.fire('Error', 'No se pudo registrar el servicio.', 'error');
        }
      });
    }
  }
  
  
  
  

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}
