import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProcesoProyecto } from '../../../../../model/proy/proceso-proyecto';
import { ProcesoProyectoService } from '../../../../../services/proy/proceso-proyecto.service';
import { UploadService } from '../../../../../services/upload-service';

@Component({
  selector: 'app-listar-proceso-proy',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './listar-proceso-proy.html',
  styleUrl: './listar-proceso-proy.css'
})
export class ListarProcesoProy implements OnInit {
  proyectoId!: number;
  procesos: ProcesoProyecto[] = [];

  procesoForm: ProcesoProyecto = { titulo: '', descripcion: '' };
  modoEdicion = false;
  idEditando: number | null = null;

  cargando = true;
  subiendoImagen = false;
  guardando = false;
  guardandoOrden = false;

  private route = inject(ActivatedRoute);
  private procesoService = inject(ProcesoProyectoService);
  private uploadService = inject(UploadService);

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.cargando = true;
    this.procesoService.listarPorProyecto(this.proyectoId).subscribe({
      next: (data) => { this.procesos = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  alSeleccionarArchivo(event: any): void {
    const archivo: File = event.target.files[0];
    if (!archivo) return;
    this.subiendoImagen = true;
    this.uploadService.subirImagen(archivo).subscribe({
      next: (res) => {
        if (this.procesoForm.urlImagen) this.uploadService.borrarImagen(this.procesoForm.urlImagen).subscribe();
        this.procesoForm.urlImagen = res.url;
        this.subiendoImagen = false;
      },
      error: () => { alert('Error al subir la imagen.'); this.subiendoImagen = false; }
    });
  }

  quitarImagenForm(): void {
    if (this.procesoForm.urlImagen) {
      this.uploadService.borrarImagen(this.procesoForm.urlImagen).subscribe();
      this.procesoForm.urlImagen = '';
    }
  }

  guardarProceso(): void {
    if (!this.procesoForm.descripcion?.trim()) return;
    this.guardando = true;

    if (this.modoEdicion && this.idEditando) {
      this.procesoService.actualizarProceso(this.idEditando, this.procesoForm).subscribe({
        next: () => { this.cargarProcesos(); this.resetearFormulario(); this.guardando = false; },
        error: () => { alert('Error al actualizar el paso.'); this.guardando = false; }
      });
    } else {
      this.procesoService.agregarProceso(this.proyectoId, this.procesoForm).subscribe({
        next: (nuevo) => { this.procesos.push(nuevo); this.resetearFormulario(); this.guardando = false; },
        error: () => { alert('Error al guardar el paso.'); this.guardando = false; }
      });
    }
  }

  editarProceso(proceso: ProcesoProyecto): void {
    this.modoEdicion = true;
    this.idEditando = proceso.id!;
    this.procesoForm = { ...proceso };
  }

  private resetearFormulario(): void {
    this.modoEdicion = false;
    this.idEditando = null;
    this.procesoForm = { titulo: '', descripcion: '', urlImagen: '', orden: 0 };
  }

  cancelarEdicion(): void {
    if (this.procesoForm.urlImagen) {
      const original = this.modoEdicion ? this.procesos.find(p => p.id === this.idEditando) : null;
      if (!original || original.urlImagen !== this.procesoForm.urlImagen) {
        this.uploadService.borrarImagen(this.procesoForm.urlImagen).subscribe();
      }
    }
    this.resetearFormulario();
  }

  eliminarProceso(proceso: ProcesoProyecto): void {
    if (confirm(`¿Eliminar el paso: "${proceso.titulo || 'Sin título'}"?`)) {
      this.procesoService.eliminarProceso(proceso.id!).subscribe({
        next: () => {
          this.procesos = this.procesos.filter(p => p.id !== proceso.id);
          if (proceso.urlImagen) this.uploadService.borrarImagen(proceso.urlImagen).subscribe();
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  onDrop(event: CdkDragDrop<ProcesoProyecto[]>): void {
    moveItemInArray(this.procesos, event.previousIndex, event.currentIndex);
    this.guardandoOrden = true;
    this.procesoService.reordenarLote(this.procesos.map(p => p.id!)).subscribe({
      next: () => this.guardandoOrden = false,
      error: () => { this.guardandoOrden = false; this.cargarProcesos(); }
    });
  }
}
