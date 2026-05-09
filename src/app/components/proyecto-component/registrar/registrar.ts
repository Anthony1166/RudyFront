import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Proyecto } from '../../../model/proyecto';
import { Categoria } from '../../../model/categoria';
import { ProyectoService } from '../../../services/proyecto.service';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-registrar-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css']
})
export class RegistrarProyecto implements OnInit {
  proyecto: Proyecto = {
    idProyecto: 0,
    titulo: '',
    subtitulo: '', // Añadido
    descripcion: '',
    anio: new Date().getFullYear(),
    categorias: [],
    imagenes: []
  };

  todasLasCategorias: Categoria[] = [];
  categoriasSeleccionadas: { [key: number]: boolean } = {};

  isLoading: boolean = false;
  errorMsg: string = '';

  constructor(
    private proyectoService: ProyectoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.todasLasCategorias = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.errorMsg = 'No se pudieron cargar las categorías para la selección.';
      }
    });
  }

  guardar(): void {
    // Validar campos
    if (!this.proyecto.titulo.trim() || !this.proyecto.descripcion.trim()) {
      this.errorMsg = 'El título y la descripción son obligatorios.';
      return;
    }

    // Asignar las categorías seleccionadas al proyecto
    this.proyecto.categorias = this.todasLasCategorias.filter(
      cat => this.categoriasSeleccionadas[cat.idCategoria]
    );

    if (this.proyecto.categorias.length === 0) {
      this.errorMsg = 'Debes seleccionar al menos una categoría.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.proyectoService.registrar(this.proyecto).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Proyecto registrado con éxito');
        this.router.navigate(['/administracion/proyecto/listar']);
      },
      error: (err) => {
        console.error('Error al registrar proyecto', err);
        this.isLoading = false;
        this.errorMsg = 'Error al registrar el proyecto. Intente nuevamente.';
      }
    });
  }
}
