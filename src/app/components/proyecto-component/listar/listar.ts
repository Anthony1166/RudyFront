import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../../model/proyecto';
import { Categoria } from '../../../model/categoria';
import { ProyectoService } from '../../../services/proyecto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { GestionarProcesosComponent } from '../gestionar-procesos/gestionar-procesos.component'; // Importar el nuevo componente

@Component({
  selector: 'app-listar-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, GestionarProcesosComponent], // Añadir el nuevo componente
  templateUrl: './listar.html',
  styleUrls: ['./listar.css']
})
export class ListarProyectos implements OnInit {
  proyectos: Proyecto[] = [];
  isLoading: boolean = true;
  errorMsg: string = '';

  // Propiedades para los filtros
  todasLasCategorias: Categoria[] = [];
  aniosDisponibles: number[] = [];
  selectedCategoriaId: string = '';
  selectedAnio: string = '';

  // Propiedades para el modal
  isModalVisible: boolean = false;
  proyectoSeleccionado: Proyecto | null = null;

  constructor(
    private proyectoService: ProyectoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.proyectoService.listar().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.calcularAniosDisponibles();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'No se pudieron cargar los proyectos.';
        this.isLoading = false;
      }
    });
    this.categoriaService.listar().subscribe({ next: (data) => { this.todasLasCategorias = data; } });
  }

  aplicarFiltros(): void {
    this.isLoading = true;
    const service = this.selectedCategoriaId ? this.proyectoService.filtrarPorCategoria(Number(this.selectedCategoriaId))
                  : this.selectedAnio ? this.proyectoService.filtrarPorAnio(Number(this.selectedAnio))
                  : this.proyectoService.listar();
    service.subscribe({
      next: (data) => { this.proyectos = data; this.isLoading = false; },
      error: (err) => { this.errorMsg = 'Error al filtrar los proyectos.'; this.isLoading = false; }
    });
  }

  limpiarFiltros(): void {
    this.selectedCategoriaId = '';
    this.selectedAnio = '';
    this.aplicarFiltros();
  }

  onCategoriaChange(): void { this.selectedAnio = ''; this.aplicarFiltros(); }
  onAnioChange(): void { this.selectedCategoriaId = ''; this.aplicarFiltros(); }

  private calcularAniosDisponibles(): void {
    const anios = this.proyectos.map(p => p.anio);
    this.aniosDisponibles = [...new Set(anios)].sort((a, b) => b - a);
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro?')) {
      this.proyectoService.eliminar(id).subscribe(() => {
        this.proyectos = this.proyectos.filter(p => p.idProyecto !== id);
        this.calcularAniosDisponibles();
      });
    }
  }

  // --- MÉTODOS PARA EL MODAL ---
  abrirModalProcesos(proyecto: Proyecto): void {
    this.proyectoSeleccionado = proyecto;
    this.isModalVisible = true;
  }

  cerrarModalProcesos(): void {
    this.isModalVisible = false;
    this.proyectoSeleccionado = null;
  }

  getCategoriaNombres(categorias: any[]): string {
    if (!categorias || categorias.length === 0) return 'Sin categoría';
    return categorias.map(c => c.nombre).join(', ');
  }
}
