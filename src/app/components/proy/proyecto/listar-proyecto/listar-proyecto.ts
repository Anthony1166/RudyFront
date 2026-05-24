import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder,
  CdkDropList, moveItemInArray
} from '@angular/cdk/drag-drop';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { CategoriaProyecto } from '../../../../model/proy/categoria-proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';
import { CategoriaProyectoService } from '../../../../services/proy/categoria-proyecto.service';
import { RegistrarProyecto } from '../registrar-proyecto/registrar-proyecto';

@Component({
  selector: 'app-listar-proyecto',
  imports: [
    CommonModule, FormsModule, RouterLink,
    CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder,
    RegistrarProyecto
  ],
  templateUrl: './listar-proyecto.html',
  styleUrl: './listar-proyecto.css'
})
export class ListarProyecto implements OnInit {
  proyectos: ProyectoAdmin[] = [];
  todosLosProyectos: ProyectoAdmin[] = [];
  cargando = true;
  guardandoOrden = false;
  mostrarModalRegistro = false;

  categorias: CategoriaProyecto[] = [];
  aniosDisponibles: number[] = [];
  idCategoriaSeleccionada: number | 'todas' = 'todas';
  anioSeleccionado: number | 'todos' = 'todos';

  dropdownCategoriaAbierto = false;
  dropdownAnioAbierto = false;

  private proyectoService = inject(ProyectoAdminService);
  private categoriaService = inject(CategoriaProyectoService);
  private destroyRef = inject(DestroyRef);

  get nombreCategoriaSeleccionada(): string {
    if (this.idCategoriaSeleccionada === 'todas') return 'Todas las categorías';
    return this.categorias.find(c => c.idCategoria === this.idCategoriaSeleccionada)?.nombre ?? 'Todas las categorías';
  }

  get labelAnio(): string {
    return this.anioSeleccionado === 'todos' ? 'Todos los años' : String(this.anioSeleccionado);
  }

  ngOnInit(): void {
    this.cargarProyectos();
    this.categoriaService.listarTodas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.categorias = data);
  }

  cargarProyectos(): void {
    this.cargando = true;
    this.proyectoService.listarTodosAdmin().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.proyectos = data;
        this.todosLosProyectos = data;
        this.calcularAnios();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  private calcularAnios(): void {
    const set = new Set(this.todosLosProyectos.map(p => p.anio));
    this.aniosDisponibles = Array.from(set).sort((a, b) => b - a);
  }

  seleccionarCategoria(id: number | 'todas', event: Event): void {
    event.stopPropagation();
    this.idCategoriaSeleccionada = id;
    this.dropdownCategoriaAbierto = false;
    this.aplicarFiltros();
  }

  seleccionarAnio(anio: number | 'todos', event: Event): void {
    event.stopPropagation();
    this.anioSeleccionado = anio;
    this.dropdownAnioAbierto = false;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    const tieneCategoria = this.idCategoriaSeleccionada !== 'todas';
    const tieneAnio = this.anioSeleccionado !== 'todos';

    if (!tieneCategoria && !tieneAnio) {
      this.cargarProyectos();
      return;
    }

    this.cargando = true;

    if (tieneCategoria && !tieneAnio) {
      this.proyectoService.listarPorCategoriaAdmin(Number(this.idCategoriaSeleccionada)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => { this.proyectos = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else if (!tieneCategoria && tieneAnio) {
      this.proyectoService.listarPorAnio(Number(this.anioSeleccionado)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => { this.proyectos = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else {
      this.proyectoService.listarPorCategoriaAdmin(Number(this.idCategoriaSeleccionada)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => {
          this.proyectos = data.filter(p => p.anio === Number(this.anioSeleccionado));
          this.cargando = false;
        },
        error: () => this.cargando = false
      });
    }
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase().trim();
    this.proyectos = query
      ? this.todosLosProyectos.filter(p =>
          p.titulo.toLowerCase().includes(query) ||
          (p.descripcion ?? '').toLowerCase().includes(query))
      : [...this.todosLosProyectos];
  }

  obtenerPortada(proyecto: ProyectoAdmin): string | null {
    if (!proyecto.imagenes || proyecto.imagenes.length === 0) return null;
    const portada = proyecto.imagenes.find(img => img.esPortada);
    return portada ? portada.urlImagen : proyecto.imagenes[0].urlImagen;
  }

  onDrop(event: CdkDragDrop<ProyectoAdmin[]>): void {
    moveItemInArray(this.proyectos, event.previousIndex, event.currentIndex);
    this.guardandoOrden = true;
    this.proyectoService.reordenarLote(this.proyectos.map(p => p.idProyecto!)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.guardandoOrden = false,
      error: () => { this.guardandoOrden = false; this.cargarProyectos(); }
    });
  }

  abrirModal(): void { this.mostrarModalRegistro = true; }

  cerrarModal(recargar: boolean): void {
    this.mostrarModalRegistro = false;
    if (recargar) this.cargarProyectos();
  }

  toggleVisibilidad(proyecto: ProyectoAdmin): void {
    if (!proyecto.idProyecto) return;
    if (confirm(`¿Estás segura de ${!proyecto.activo ? 'MOSTRAR' : 'OCULTAR'} el proyecto "${proyecto.titulo}"?`)) {
      this.proyectoService.apagarProyecto(proyecto.idProyecto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => proyecto.activo = !proyecto.activo,
        error: (err) => console.error('Error', err)
      });
    }
  }

  eliminarDefinitivo(proyecto: ProyectoAdmin): void {
    if (!proyecto.idProyecto) return;
    if (confirm(`⚠️ ALERTA CRÍTICA: ¿Estás segura de ELIMINAR POR SIEMPRE el proyecto "${proyecto.titulo}"?\nEsto también borrará sus fotos y procesos.`)) {
      this.proyectoService.eliminarFisico(proyecto.idProyecto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.proyectos = this.proyectos.filter(p => p.idProyecto !== proyecto.idProyecto),
        error: (err) => console.error('Error', err)
      });
    }
  }

  trackByFn(index: number, proyecto: ProyectoAdmin): number {
    return proyecto.idProyecto!;
  }
}
