import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Proyecto } from '../../../model/proyecto';
import { ProcesoDiseno } from '../../../model/proceso-diseno';
import { ProcesoDisenoService } from '../../../services/proceso-diseno.service';

@Component({
  selector: 'app-gestionar-procesos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-procesos.component.html',
  styleUrls: ['./gestionar-procesos.component.css']
})
export class GestionarProcesosComponent implements OnInit, OnChanges {
  @Input() proyecto: Proyecto | null = null;
  @Output() cerrar = new EventEmitter<void>();

  procesos: ProcesoDiseno[] = [];
  isLoading: boolean = false;
  errorMsg: string = '';

  // Propiedades para el formulario
  editMode: boolean = false;
  procesoActual: Partial<ProcesoDiseno> = {};
  selectedFile: File | null = null;

  constructor(private procesoDisenoService: ProcesoDisenoService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Cada vez que el proyecto de entrada cambia, cargamos sus procesos
    if (changes['proyecto'] && this.proyecto) {
      this.cargarProcesos();
      this.resetForm();
    }
  }

  cargarProcesos(): void {
    if (!this.proyecto) return;
    this.isLoading = true;
    this.procesoDisenoService.getProcesosByProyectoId(this.proyecto.idProyecto).subscribe({
      next: (data) => {
        this.procesos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'No se pudieron cargar los procesos de diseño.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.selectedFile = element.files ? element.files[0] : null;
  }

  guardarProceso(form: NgForm): void {
    if (form.invalid || !this.proyecto) return;

    const { titulo_fase, descripcion, orden } = this.procesoActual;

    if (this.editMode && this.procesoActual.id) {
      // Lógica de Actualización
      this.procesoDisenoService.updateProceso(this.procesoActual.id, titulo_fase!, descripcion!, orden!, this.selectedFile || undefined)
        .subscribe(() => this.finalizarGuardado());
    } else {
      // Lógica de Creación
      this.procesoDisenoService.createProceso(this.proyecto.idProyecto, titulo_fase!, descripcion!, orden!, this.selectedFile || undefined)
        .subscribe(() => this.finalizarGuardado());
    }
  }

  finalizarGuardado(): void {
    this.cargarProcesos(); // Recargar la lista
    this.resetForm();
  }

  editarProceso(proceso: ProcesoDiseno): void {
    this.editMode = true;
    this.procesoActual = { ...proceso }; // Copiar el proceso para edición
    this.selectedFile = null;
  }

  eliminarProceso(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta fase del proceso?')) {
      this.procesoDisenoService.deleteProceso(id).subscribe(() => this.cargarProcesos());
    }
  }

  resetForm(form?: NgForm): void {
    this.editMode = false;
    this.procesoActual = {};
    this.selectedFile = null;
    form?.resetForm();
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
