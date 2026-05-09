import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Proyecto } from '../../../model/proyecto';
import { Categoria } from '../../../model/categoria';
import { ProyectoService } from '../../../services/proyecto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-actualizar-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './actualizar.html',
  styleUrls: ['./actualizar.css']
})
export class ActualizarProyecto implements OnInit {
  proyecto: Proyecto | null = null;
  todasLasCategorias: Categoria[] = [];
  categoriasSeleccionadas: { [key: number]: boolean } = {};

  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMsg: string = '';

  private idProyecto: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.idProyecto = this.route.snapshot.params['id'];
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;

    // Usamos forkJoin para cargar el proyecto y las categorías en paralelo
    forkJoin({
      proyecto: this.proyectoService.buscarPorId(this.idProyecto),
      categorias: this.categoriaService.listar()
    }).subscribe({
      next: ({ proyecto, categorias }) => {
        this.proyecto = proyecto;
        this.todasLasCategorias = categorias;

        // Pre-seleccionar los checkboxes de las categorías que ya tiene el proyecto
        const idsCategoriasDelProyecto = new Set(proyecto.categorias.map(c => c.idCategoria));
        this.todasLasCategorias.forEach(cat => {
          this.categoriasSeleccionadas[cat.idCategoria] = idsCategoriasDelProyecto.has(cat.idCategoria);
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.errorMsg = 'No se pudieron cargar los datos para la actualización.';
        this.isLoading = false;
      }
    });
  }

  actualizar(): void {
    if (!this.proyecto) return;

    if (!this.proyecto.titulo.trim() || !this.proyecto.descripcion.trim()) {
      this.errorMsg = 'El título y la descripción son obligatorios.';
      return;
    }

    // Actualizar la lista de categorías del proyecto
    this.proyecto.categorias = this.todasLasCategorias.filter(
      cat => this.categoriasSeleccionadas[cat.idCategoria]
    );

    if (this.proyecto.categorias.length === 0) {
      this.errorMsg = 'Debes seleccionar al menos una categoría.';
      return;
    }

    this.isSaving = true;
    this.errorMsg = '';

    this.proyectoService.actualizar(this.idProyecto, this.proyecto).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Proyecto actualizado con éxito');
        this.router.navigate(['/administracion/proyecto/listar']);
      },
      error: (err) => {
        console.error('Error al actualizar proyecto', err);
        this.isSaving = false;
        this.errorMsg = 'Error al actualizar el proyecto. Intente nuevamente.';
      }
    });
  }
}
