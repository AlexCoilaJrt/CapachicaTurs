import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../sidebar/navbar/navbar.component';
import { PaqueteTuristicoService } from '../../../core/services/paquetes-turisticos.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../../core/services/servicios.service';
import { EmprendimientoService } from '../../../core/services/emprendimiento.service';

@Component({
  selector: 'app-form-paquete',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent,ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './form-paquete.component.html',
  styleUrl: './form-paquete.component.css'
})
export class FormPaqueteComponent implements OnInit{
  selectedFile: File[] = [];
  previewUrl: string | null = null;
  servicios: any[] = [];
  isLoading: boolean = true;
  serviciosDisponibles: any[] = [];
  emprendimiento: any[] = [];  // Array para almacenar los emprendimientos
  paqueteForm!: FormGroup;
  isEdit: boolean = false;
  paqueteIdEdit: number | null = null;

  constructor(
    private fb: FormBuilder,
    private paqueteTuristicoService: PaqueteTuristicoService,
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private serviciosService: ServiciosService,
    private emprendimientoService: EmprendimientoService // Asegúrate de inyectar este servicio
  ) {}

  ngOnInit() {
    this.paqueteForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      estado: ['activo', Validators.required],
      imagen: [''],
      servicios: this.fb.array([]), // FormArray para los servicios
      emprendimientoId: ['', Validators.required]  // Campo para seleccionar el emprendimiento
    });

    this.cargarEmprendimientos();
    this.cargarServicios();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.paqueteIdEdit = +id;

      this.paqueteTuristicoService.obtenerPaqueteTuristico(this.paqueteIdEdit).subscribe({
        next: (paquete) => {
          this.paqueteForm.patchValue({
            nombre: paquete.nombre,
            descripcion: paquete.descripcion,
            precio: paquete.precio,
            estado: paquete.estado,
            emprendimientoId: paquete.emprendimiento.id // Asignamos el emprendimiento seleccionado
          });
          this.cargarServiciosSeleccionados(paquete.servicios);
        },
        error: (err) => {
          console.error('Error al cargar paquete:', err);
          Swal.fire('Error', 'No se pudo cargar el paquete turístico.', 'error');
        }
      });
    }
  }

  cargarEmprendimientos(): void {
    this.emprendimientoService.listarEmprendimientos().subscribe({
      next: (data) => {
        this.emprendimiento = data.emprendimientos;
        console.log(data)
      },
      error: (err) => {
        console.error('Error al cargar emprendimientos:', err);
      }
    });
  }

  cargarServicios(): void {
    this.serviciosService.listarServicios().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.serviciosDisponibles = data;  // Asignamos los servicios disponibles
        this.addServiciosToForm();
          // Agregamos los servicios al formulario
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al cargar servicios:', err);
      }
    });
  }

  addServiciosToForm(): void {
    const serviciosControl = this.paqueteForm.get('servicios') as FormArray;
    this.serviciosDisponibles.forEach(() => {
      serviciosControl.push(this.fb.control(false));  // Inicializa el valor como "false"
    });
  }

  cargarServiciosSeleccionados(serviciosSeleccionados: any[]): void {
    const serviciosControl = this.paqueteForm.get('servicios') as FormArray;
    serviciosSeleccionados.forEach(servicio => {
      const index = this.serviciosDisponibles.findIndex(s => s.id === servicio.id);
      if (index !== -1) {
        serviciosControl.at(index).setValue(true); // Marcamos como seleccionado
      }
    });
  }

onFileChange(event: any): void {
  const files = event.target.files;
  if (files.length > 0) {
    this.selectedFile = Array.from(files);  // Convertir los archivos seleccionados a un arreglo
    // Si necesitas previsualizar las imágenes (solo la primera por ejemplo):
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(files[0]);  // Mostrar solo la vista previa de la primera imagen
  }
}

// Al subir las imágenes
async subirImagenesASupabase(files: File[]): Promise<string[]> {
  Swal.fire({
    title: 'Subiendo imágenes...',
    text: 'Por favor espere mientras se suben las imágenes.',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  });

  const supabase = this.supabaseService.getClient();
  const urls: string[] = [];

  for (const file of files) {
    const filePath = `paquetes-turisticos/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('paquetes-turisticos').upload(filePath, file);

    if (error) {
      Swal.close();
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage.from('paquetes-turisticos').getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      urls.push(publicUrlData.publicUrl);
    }
  }

  Swal.close();
  return urls;
}

async guardarPaquete() {
    if (this.paqueteForm.invalid) {
        const camposInvalidos = Object.keys(this.paqueteForm.controls)
            .filter(key => this.paqueteForm.get(key)?.invalid)
            .map(key => key);

        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            html: `Por favor corrige o completa los siguientes campos:<br><b>${camposInvalidos.join(', ')}</b>`
        });
        return;
    }

    const formValue = this.paqueteForm.getRawValue();
    let imagenes: string[] = [];

    // Convertimos la ID del emprendimiento a número entero
    const emprendimientoId = parseInt(formValue.emprendimientoId, 10); // Asegura que sea un entero

    if (isNaN(emprendimientoId)) {
        Swal.fire('Error', 'La ID del emprendimiento debe ser un número válido.', 'error');
        return;
    }

    if (this.selectedFile && Array.isArray(this.selectedFile)) {
        try {
            // Subir varias imágenes
            imagenes = await this.subirImagenesASupabase(this.selectedFile);
        } catch (error) {
            console.error('Error al subir imagenes:', error);
            Swal.fire('Error', 'No se pudo subir las imágenes del paquete.', 'error');
            return;
        }
    }

    const payload = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        precio: formValue.precio,
        estado: formValue.estado,
        imagenes: imagenes,  // Arreglo con las URLs de las imágenes subidas
        servicios: this.getServiciosSeleccionados(),
        emprendimientoId: emprendimientoId  // Convertir la ID del emprendimiento a entero
    };

    if (this.isEdit && this.paqueteIdEdit) {
        this.paqueteTuristicoService.actualizarPaqueteTuristico(this.paqueteIdEdit, payload).subscribe({
            next: () => {
                Swal.fire('Actualizado', 'El paquete turístico fue actualizado correctamente.', 'success');
                this.paqueteForm.reset();
                this.router.navigate(['/paquetes']);
            },
            error: (err) => {
                console.error('Error al actualizar paquete:', err);
                Swal.fire('Error', 'No se pudo actualizar el paquete turístico.', 'error');
            }
        });
    } else {
        this.paqueteTuristicoService.crearPaqueteTuristico(payload).subscribe({
            next: () => {
                Swal.fire('Registrado', 'El paquete turístico fue registrado correctamente.', 'success');
                this.paqueteForm.reset();
                this.router.navigate(['/paquetes']);
            },
            error: (err) => {
                console.error('Error al registrar paquete:', err);
                Swal.fire('Error', 'No se pudo registrar el paquete turístico.', 'error');
            }
        });
    }
}

  getServiciosSeleccionados(): any[] {
    const serviciosControl = this.paqueteForm.get('servicios') as FormArray;
    return serviciosControl.controls
      .map((control, index) => control.value ? this.serviciosDisponibles[index].id : null)
      .filter(id => id !== null);  // Filtrar solo las IDs seleccionadas
  }

  cancelar() {
    this.router.navigate(['/paquetes']);
  }
}
