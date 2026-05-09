import {Component, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {CategoriaProducto} from '../../../model/prod/categoria-producto';
import {CategoriaProductoService} from '../../../services/prod/categoria-producto.service';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {
  CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder,
  CdkDropList, DragDropModule, moveItemInArray
} from '@angular/cdk/drag-drop';
import {UploadService} from '../../../services/upload-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-listar-categoria-prod',
  imports: [CommonModule, DragDropModule, CdkDragPlaceholder, CdkDragHandle, CdkDrag, CdkDropList, FormsModule, RouterLink],
  templateUrl: './listar-categoria-prod.html',
  styleUrl: './listar-categoria-prod.css'
})
export class ListarCategoriaProd implements OnInit {
  categorias: CategoriaProducto[] = [];
  todasLasCategorias: CategoriaProducto[] = []; // Caché local para búsqueda sin GETs extra
  cargando = true;
  guardandoOrden = false;

  // --- VARIABLES DEL MODAL ---
  mostrarModal = false;
  modoModal: 'crear' | 'editar' = 'crear';
  categoriaForm: CategoriaProducto = { nombre: '', activo: true };
  subiendoImagen = false;
  guardandoCategoria = false;
  mensajeError: string = '';

  // --- INYECCIONES ---
  private categoriaService = inject(CategoriaProductoService);
  private uploadService = inject(UploadService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.categoriaService.listarTodas().subscribe({
      next: (data) => {
        this.categorias = data;
        this.todasLasCategorias = data; // Guardamos en caché
        this.cargando = false;
      },
      error: (err) => { console.error('Error al cargar', err); this.cargando = false; }
    });
  }

  onSearch(event: any): void {
    const query = event.target.value?.toLowerCase().trim() || '';
    if (!query) {
      this.categorias = [...this.todasLasCategorias]; // Restaurar desde caché local
      return;
    }
    this.categorias = this.todasLasCategorias.filter(cat => cat.nombre.toLowerCase().includes(query));
  }

  onDrop(event: CdkDragDrop<CategoriaProducto[]>): void {
    moveItemInArray(this.categorias, event.previousIndex, event.currentIndex);
    const idsOrdenados = this.categorias.map(cat => cat.id!);

    this.guardandoOrden = true;
    this.categoriaService.reordenarLote(idsOrdenados).subscribe({
      next: () => this.guardandoOrden = false,
      error: () => { this.guardandoOrden = false; this.cargarCategorias(); }
    });
  }

  toggleVisibilidad(categoria: CategoriaProducto): void {
    if (!categoria.id) return;
    const nuevoEstado = !categoria.activo;

    if (confirm(`¿Estás segura de ${nuevoEstado ? 'MOSTRAR' : 'OCULTAR'} la categoría "${categoria.nombre}"?`)) {
      const catActualizada = { ...categoria, activo: nuevoEstado };
      this.categoriaService.actualizarCategoria(categoria.id, catActualizada).subscribe({
        next: () => categoria.activo = nuevoEstado,
        error: (err) => console.error('Error', err)
      });
    }
  }

  eliminarDefinitivo(categoria: CategoriaProducto): void {
    if (!categoria.id) return;
    if (confirm(`⚠️ ALERTA CRÍTICA: ¿Estás segura de ELIMINAR POR SIEMPRE "${categoria.nombre}"?`)) {
      this.categoriaService.eliminarFisico(categoria.id).subscribe({
        next: () => this.categorias = this.categorias.filter(c => c.id !== categoria.id),
        error: (err) => console.error('Error', err)
      });
    }
  }

  // ==========================================
  // 🔥 MODAL: LÓGICA OPTIMIZADA
  // ==========================================

  abrirModalNueva(): void {
    this.modoModal = 'crear';
    this.categoriaForm = { nombre: '', activo: true };
    this.mensajeError = '';
    this.mostrarModal = true;
  }

  abrirModalEditar(categoria: CategoriaProducto): void {
    this.modoModal = 'editar';
    this.categoriaForm = { ...categoria };
    this.mensajeError = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  alSeleccionarArchivo(event: any): void {
    const archivo: File = event.target.files?.[0];
    if (!archivo) return;

    this.subiendoImagen = true;
    this.uploadService.subirImagen(archivo).subscribe({
      next: (respuesta) => {
        this.categoriaForm.urlImagen = respuesta.url;
        this.subiendoImagen = false;
      },
      error: () => this.subiendoImagen = false
    });
  }

  // 🔥 MAGIA DE OPTIMIZACIÓN: Un solo flujo de guardado
  guardarCategoriaModal(): void {
    if (!this.categoriaForm.nombre?.trim()) return;

    this.guardandoCategoria = true;
    this.mensajeError = '';

    // 1. Decidimos qué petición hacer (Operador ternario)
    const operacion$ = this.modoModal === 'crear'
      ? this.categoriaService.crearCategoria(this.categoriaForm)
      : this.categoriaService.actualizarCategoria(this.categoriaForm.id!, this.categoriaForm);

    // 2. Nos suscribimos una sola vez
    operacion$.subscribe({
      next: () => {
        this.cargarCategorias();
        this.cerrarModal();
        this.guardandoCategoria = false;
      },
      error: (err) => this.procesarError(err) // Delegamos el error a otro método
    });
  }

  // 🔥 MÁS MAGIA: Método privado exclusivo para manejar la caja roja
  private procesarError(err: any): void {
    console.error('Error del servidor:', err);
    this.guardandoCategoria = false;

    // Redujimos los 4 'if/else' a una sola línea limpia usando fallback (||)
    this.mensajeError = err.error?.mensaje ||
      err.error?.message ||
      (typeof err.error === 'string' ? err.error : '⚠️ Ya existe una categoría con este nombre o URL.');

    this.cdr.detectChanges(); // Forzamos actualización visual

    setTimeout(() => {
      this.mensajeError = '';
      this.cdr.detectChanges();
    }, 5000);
  }
}
