import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {ImagenProducto} from '../../../../model/prod/imagen-producto';
import {ImagenProductoService} from '../../../../services/prod/imagen-producto.service';
import {UploadService} from '../../../../services/upload-service';
import {ToastService} from '../../../../services/toast.service';
import {FormsModule} from '@angular/forms';
import {AjusteImagen, ImagenEditor} from '../../../shared/imagen-editor/imagen-editor';

@Component({
  selector: 'app-listar-imagen-prod',
  imports: [CommonModule, DragDropModule, FormsModule, ImagenEditor],
  templateUrl: './listar-imagen-prod.html',
  styleUrl: './listar-imagen-prod.css'
})
export class ListarImagenProd {
  productoId!: number;
  imagenes: ImagenProducto[] = [];

  cargando = true;
  subiendo = false;
  guardandoOrden = false;

  // 🔥 VARIABLES PARA EL MODAL
  imagenSeleccionada: ImagenProducto | null = null;
  guardandoCambiosModal = false;

  // Editor de ajustes de imagen
  mostrarEditor = false;

  private route = inject(ActivatedRoute);
  private imagenService = inject(ImagenProductoService);
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarGaleria();
  }

  cargarGaleria(): void {
    this.cargando = true;
    this.imagenService.listarPorProducto(this.productoId).subscribe({
      next: (data) => {
        this.imagenes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando galería', err);
        this.cargando = false;
      }
    });
  }

  alSeleccionarArchivo(event: any): void {
    const archivo: File = event.target.files[0];
    if (!archivo) return;

    this.subiendo = true;
    this.uploadService.subirImagen(archivo).subscribe({
      next: (respuestaS3) => {
        const nuevaImagen: ImagenProducto = {
          urlImagen: respuestaS3.url,
          textoAlternativo: 'Imagen del producto',
          esPortada: this.imagenes.length === 0
        };

        this.imagenService.agregarImagen(this.productoId, nuevaImagen).subscribe({
          next: (imgGuardada) => {
            this.imagenes.push(imgGuardada);
            this.subiendo = false;
            if(imgGuardada.esPortada) this.cargarGaleria();
          },
          error: () => {
            this.toast.error('Error al guardar la imagen.');
            this.uploadService.borrarImagen(respuestaS3.url).subscribe();
            this.subiendo = false;
          }
        });
      },
      error: () => { this.toast.error('Hubo un error al subir la foto.'); this.subiendo = false; }
    });
  }

  onDrop(event: CdkDragDrop<ImagenProducto[]>): void {
    moveItemInArray(this.imagenes, event.previousIndex, event.currentIndex);
    const idsOrdenados = this.imagenes.map(img => img.id!);

    this.guardandoOrden = true;
    this.imagenService.reordenarLote(idsOrdenados).subscribe({
      next: () => this.guardandoOrden = false,
      error: (err) => {
        console.error('Error guardando el orden', err);
        this.guardandoOrden = false;
        this.cargarGaleria();
      }
    });
  }

  abrirModal(imagen: ImagenProducto): void {
    // Clonamos la imagen para que si Sami cancela, no se altere la vista
    this.imagenSeleccionada = { ...imagen };
  }

  cerrarModal(): void {
    this.imagenSeleccionada = null;
  }

  guardarDetallesImagen(): void {
    if (!this.imagenSeleccionada || !this.imagenSeleccionada.id) return;

    this.guardandoCambiosModal = true;
    this.imagenService.actualizarImagen(this.imagenSeleccionada.id, this.imagenSeleccionada).subscribe({
      next: () => {
        this.cargarGaleria(); // Recargamos para ver los cambios (como si es portada)
        this.cerrarModal();
        this.guardandoCambiosModal = false;
      },
      error: () => {
        this.toast.error('Error al actualizar la imagen.');
        this.guardandoCambiosModal = false;
      }
    });
  }

  marcarComoPortadaDesdeModal(): void {
    if (this.imagenSeleccionada) {
      this.imagenSeleccionada.esPortada = true;
      this.guardarDetallesImagen();
    }
  }

  eliminarImagenDesdeModal(): void {
    if (!this.imagenSeleccionada || !this.imagenSeleccionada.id) return;

    // Una alerta nativa rápida como última confirmación antes de borrar
    if (confirm('¿Eliminar definitivamente esta foto?')) {
      const imgUrl = this.imagenSeleccionada.urlImagen;
      this.imagenService.eliminarImagen(this.imagenSeleccionada.id).subscribe({
        next: () => {
          this.imagenes = this.imagenes.filter(img => img.id !== this.imagenSeleccionada!.id);
          this.uploadService.borrarImagen(imgUrl).subscribe();
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
