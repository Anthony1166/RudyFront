import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder,
  CdkDropList, DragDropModule, moveItemInArray
} from '@angular/cdk/drag-drop';
import { CategoriaProyecto } from '../../../model/proy/categoria-proyecto';
import { CategoriaProyectoService } from '../../../services/proy/categoria-proyecto.service';
import { UploadService } from '../../../services/upload-service';

@Component({
  selector: 'app-listar-categoria-proy',
  imports: [CommonModule, DragDropModule, CdkDragPlaceholder, CdkDragHandle, CdkDrag, CdkDropList, FormsModule, RouterLink],
  templateUrl: './listar-categoria-proy.html',
  styleUrl: './listar-categoria-proy.css'
})
export class ListarCategoriaProy implements OnInit {
  categorias: CategoriaProyecto[] = [];
  todasLasCategorias: CategoriaProyecto[] = [];
  cargando = true;
  guardandoOrden = false;

  mostrarModal = false;
  modoModal: 'crear' | 'editar' = 'crear';
  categoriaForm: CategoriaProyecto = { nombre: '', activo: true };
  subiendoImagen = false;
  guardandoCategoria = false;
  mensajeError = '';

  private categoriaService = inject(CategoriaProyectoService);
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
        this.todasLasCategorias = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  onSearch(event: any): void {
    const query = event.target.value?.toLowerCase().trim() || '';
    this.categorias = query
      ? this.todasLasCategorias.filter(c => c.nombre.toLowerCase().includes(query))
      : [...this.todasLasCategorias];
  }

  onDrop(event: CdkDragDrop<CategoriaProyecto[]>): void {
    moveItemInArray(this.categorias, event.previousIndex, event.currentIndex);
    this.guardandoOrden = true;
    this.categoriaService.reordenarLote(this.categorias.map(c => c.idCategoria!)).subscribe({
      next: () => this.guardandoOrden = false,
      error: () => { this.guardandoOrden = false; this.cargarCategorias(); }
    });
  }

  toggleVisibilidad(categoria: CategoriaProyecto): void {
    if (!categoria.idCategoria) return;
    if (confirm(`¿Estás segura de ${!categoria.activo ? 'MOSTRAR' : 'OCULTAR'} la categoría "${categoria.nombre}"?`)) {
      this.categoriaService.apagarCategoria(categoria.idCategoria).subscribe({
        next: () => categoria.activo = !categoria.activo,
        error: (err) => console.error('Error', err)
      });
    }
  }

  eliminarDefinitivo(categoria: CategoriaProyecto): void {
    if (!categoria.idCategoria) return;
    if (confirm(`⚠️ ALERTA CRÍTICA: ¿Estás segura de ELIMINAR POR SIEMPRE "${categoria.nombre}"?`)) {
      this.categoriaService.eliminarFisico(categoria.idCategoria).subscribe({
        next: () => this.categorias = this.categorias.filter(c => c.idCategoria !== categoria.idCategoria),
        error: (err) => console.error('Error', err)
      });
    }
  }

  abrirModalNueva(): void {
    this.modoModal = 'crear';
    this.categoriaForm = { nombre: '', activo: true };
    this.mensajeError = '';
    this.mostrarModal = true;
  }

  abrirModalEditar(categoria: CategoriaProyecto): void {
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
      next: (res) => { this.categoriaForm.urlImagen = res.url; this.subiendoImagen = false; },
      error: () => this.subiendoImagen = false
    });
  }

  guardarCategoriaModal(): void {
    if (!this.categoriaForm.nombre?.trim()) return;
    this.guardandoCategoria = true;
    this.mensajeError = '';

    const op$ = this.modoModal === 'crear'
      ? this.categoriaService.crearCategoria(this.categoriaForm)
      : this.categoriaService.actualizarCategoria(this.categoriaForm.idCategoria!, this.categoriaForm);

    op$.subscribe({
      next: () => { this.cargarCategorias(); this.cerrarModal(); this.guardandoCategoria = false; },
      error: (err) => {
        this.guardandoCategoria = false;
        this.mensajeError = err.error?.mensaje || err.error?.message ||
          (typeof err.error === 'string' ? err.error : '⚠️ Ya existe una categoría con ese nombre.');
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeError = ''; this.cdr.detectChanges(); }, 5000);
      }
    });
  }
}
