import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ImagenProyecto } from '../../../../../model/proy/imagen-proyecto';
import { ImagenProyectoService } from '../../../../../services/proy/imagen-proyecto.service';
import { UploadService } from '../../../../../services/upload-service';
import { AjusteImagen, ImagenEditor } from '../../../../shared/imagen-editor/imagen-editor';

@Component({
  selector: 'app-listar-imagen-proy',
  imports: [CommonModule, DragDropModule, FormsModule, ImagenEditor],
  templateUrl: './listar-imagen-proy.html',
  styleUrl: './listar-imagen-proy.css'
})
export class ListarImagenProy implements OnInit {
  proyectoId!: number;
  imagenes: ImagenProyecto[] = [];
  cargando = true;
  subiendo = false;
  guardandoOrden = false;

  imagenSeleccionada: ImagenProyecto | null = null;
  guardandoCambiosModal = false;

  mostrarEditor = false;

  private route = inject(ActivatedRoute);
  private imagenService = inject(ImagenProyectoService);
  private uploadService = inject(UploadService);

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarGaleria();
  }

  cargarGaleria(): void {
    this.cargando = true;
    this.imagenService.listarPorProyecto(this.proyectoId).subscribe({
      next: (data) => { this.imagenes = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  alSeleccionarArchivo(event: any): void {
    const archivo: File = event.target.files[0];
    if (!archivo) return;
    this.subiendo = true;

    this.uploadService.subirImagen(archivo).subscribe({
      next: (res) => {
        const nueva: ImagenProyecto = {
          urlImagen: res.url,
          textoAlternativo: '',
          esPortada: this.imagenes.length === 0
        };
        this.imagenService.agregarImagen(this.proyectoId, nueva).subscribe({
          next: (guardada) => {
            this.imagenes.push(guardada);
            this.subiendo = false;
            if (guardada.esPortada) this.cargarGaleria();
          },
          error: (err) => {
            console.error('Error guardando imagen', err);
            this.uploadService.borrarImagen(res.url).subscribe();
            this.subiendo = false;
          }
        });
      },
      error: () => { alert('Error al subir la foto.'); this.subiendo = false; }
    });
  }

  onDrop(event: CdkDragDrop<ImagenProyecto[]>): void {
    moveItemInArray(this.imagenes, event.previousIndex, event.currentIndex);
    this.guardandoOrden = true;
    this.imagenService.reordenarLote(this.imagenes.map(img => img.id!)).subscribe({
      next: () => this.guardandoOrden = false,
      error: () => { this.guardandoOrden = false; this.cargarGaleria(); }
    });
  }

  abrirModal(imagen: ImagenProyecto): void { this.imagenSeleccionada = { ...imagen }; }
  cerrarModal(): void { this.imagenSeleccionada = null; }

  guardarDetallesImagen(): void {
    if (!this.imagenSeleccionada?.id) return;
    this.guardandoCambiosModal = true;
    this.imagenService.actualizarImagen(this.imagenSeleccionada.id, this.imagenSeleccionada).subscribe({
      next: () => { this.cargarGaleria(); this.cerrarModal(); this.guardandoCambiosModal = false; },
      error: () => this.guardandoCambiosModal = false
    });
  }

  marcarComoPortadaDesdeModal(): void {
    if (this.imagenSeleccionada) { this.imagenSeleccionada.esPortada = true; this.guardarDetallesImagen(); }
  }

  eliminarImagenDesdeModal(): void {
    if (!this.imagenSeleccionada?.id) return;
    if (confirm('¿Eliminar definitivamente esta foto?')) {
      const url = this.imagenSeleccionada.urlImagen;
      this.imagenService.eliminarImagen(this.imagenSeleccionada.id).subscribe({
        next: () => {
          this.imagenes = this.imagenes.filter(img => img.id !== this.imagenSeleccionada!.id);
          this.uploadService.borrarImagen(url).subscribe();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  abrirEditor(): void {
    if (!this.imagenSeleccionada) return;
    this.mostrarEditor = true;
  }

  cerrarEditor(): void {
    this.mostrarEditor = false;
  }

  onGuardarAjuste(ajuste: AjusteImagen): void {
    if (!this.imagenSeleccionada) return;
    this.imagenSeleccionada.posX = ajuste.posX;
    this.imagenSeleccionada.posY = ajuste.posY;
    this.imagenSeleccionada.escala = ajuste.escala;
    this.imagenSeleccionada.rotacion = ajuste.rotacion;
    this.imagenSeleccionada.volteoH = ajuste.volteoH;
    this.imagenSeleccionada.volteoV = ajuste.volteoV;
    this.mostrarEditor = false;
    this.guardarDetallesImagen();
  }

  ajusteActual(): AjusteImagen {
    const img = this.imagenSeleccionada;
    return {
      posX: img?.posX ?? 50,
      posY: img?.posY ?? 50,
      escala: img?.escala ?? 1,
      rotacion: img?.rotacion ?? 0,
      volteoH: img?.volteoH ?? false,
      volteoV: img?.volteoV ?? false,
    };
  }
}
