import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {ProcesoProducto} from '../../../../model/prod/proceso-producto';
import {ProcesoProductoService} from '../../../../services/prod/proceso-producto.service';
import {UploadService} from '../../../../services/upload-service';
import {ToastService} from '../../../../services/toast.service';

@Component({
  selector: 'app-listar-proceso-prod',
  imports: [CommonModule, FormsModule, RouterLink, DragDropModule],
  templateUrl: './listar-proceso-prod.html',
  styleUrl: './listar-proceso-prod.css'
})
export class ListarProcesoProd {

  productoId!: number;
  procesos: ProcesoProducto[] = [];

  procesoForm: ProcesoProducto = { titulo: '', descripcion: '', urlImagen: '' };
  modoEdicion = false;
  idEditando: number | null = null;

  // Estados de carga
  cargando = true;
  subiendoImagen = false;
  guardando = false;
  guardandoOrden = false;

  private route = inject(ActivatedRoute);
  private procesoService = inject(ProcesoProductoService);
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.cargando = true;
    this.procesoService.listarPorProducto(this.productoId).subscribe({
      next: (data) => {
        this.procesos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando procesos', err);
        this.cargando = false;
      }
    });
  }

  // --- GESTIÓN DE LA IMAGEN DEL PASO ---
  alSeleccionarArchivo(event: any): void {
    const archivo: File = event.target.files[0];
    if (!archivo) return;

    this.subiendoImagen = true;
    this.uploadService.subirImagen(archivo).subscribe({
      next: (res) => {
        // Borrar la imagen anterior de S3 si estaba reemplazando una (Opcional, pero buena práctica)
        if (this.procesoForm.urlImagen) {
          this.uploadService.borrarImagen(this.procesoForm.urlImagen).subscribe();
        }

        this.procesoForm.urlImagen = res.url;
        this.subiendoImagen = false;
      },
      error: () => {
        this.toast.error('Error al subir la imagen.');
        this.subiendoImagen = false;
      }
    });
  }

  quitarImagenForm(): void {
    if (this.procesoForm.urlImagen) {
      this.uploadService.borrarImagen(this.procesoForm.urlImagen).subscribe();
      this.procesoForm.urlImagen = '';
    }
  }

  // --- GESTIÓN DEL FORMULARIO ---
  guardarProceso(): void {
    if (!this.procesoForm.descripcion || this.procesoForm.descripcion.trim() === '') return;

    this.guardando = true;

    if (this.modoEdicion && this.idEditando) {
      this.procesoService.actualizarProceso(this.idEditando, this.procesoForm).subscribe({
        next: () => {
          this.cargarProcesos();
          this.resetearFormulario();
          this.guardando = false;
        },
        error: (err) => {
          this.toast.error(err?.error?.mensaje ?? 'Hubo un error al actualizar el paso.');
          this.guardando = false;
        }
      });
    } else {
      this.procesoService.agregarProceso(this.productoId, this.procesoForm).subscribe({
        next: (nuevo) => {
          this.procesos.push(nuevo);
          this.resetearFormulario();
          this.guardando = false;
        },
        error: (err) => {
          this.toast.error(err?.error?.mensaje ?? 'Hubo un error al guardar el paso.');
          this.guardando = false;
        }
      });
    }
  }

  editarProceso(proceso: ProcesoProducto): void {
    this.modoEdicion = true;
    this.idEditando = proceso.id!;
    this.procesoForm = { ...proceso };
  }

  // Solo limpia el form sin tocar R2 — se usa después de guardar exitosamente
  private resetearFormulario(): void {
    this.modoEdicion = false;
    this.idEditando = null;
    this.procesoForm = { titulo: '', descripcion: '', urlImagen: '', orden: 0 };
  }

  // Limpia R2 si había imagen no guardada, luego resetea el form — se usa al cancelar manualmente
  cancelarEdicion(): void {
    if (this.procesoForm.urlImagen) {
      const procesoOriginal = this.modoEdicion
        ? this.procesos.find(p => p.id === this.idEditando)
        : null;
      if (!procesoOriginal || procesoOriginal.urlImagen !== this.procesoForm.urlImagen) {
        this.uploadService.borrarImagen(this.procesoForm.urlImagen).subscribe();
      }
    }
    this.resetearFormulario();
  }

  // --- ELIMINAR Y REORDENAR ---
  eliminarProceso(proceso: ProcesoProducto): void {
    if (confirm(`¿Eliminar el paso: "${proceso.titulo || 'Sin título'}"?`)) {
      this.procesoService.eliminarProceso(proceso.id!).subscribe({
        next: () => {
          this.procesos = this.procesos.filter(p => p.id !== proceso.id);
          if (proceso.urlImagen) {
            this.uploadService.borrarImagen(proceso.urlImagen).subscribe();
          }
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  onDrop(event: CdkDragDrop<ProcesoProducto[]>): void {
    moveItemInArray(this.procesos, event.previousIndex, event.currentIndex);
    const idsOrdenados = this.procesos.map(p => p.id!);

    this.guardandoOrden = true;
    this.procesoService.reordenarLote(idsOrdenados).subscribe({
      next: () => this.guardandoOrden = false,
      error: (err) => {
        console.error('Error al reordenar', err);
        this.guardandoOrden = false;
        this.cargarProcesos(); // Revertir en caso de error
      }
    });
  }
}
