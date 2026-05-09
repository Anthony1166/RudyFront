import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../model/categoria';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-actualizar',
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './actualizar.html',
  styleUrl: './actualizar.css'
})
export class Actualizar implements OnInit {
  id: number = 0;
  categoria: Categoria = { idCategoria: 0, nombre: '' };

  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la URL
    this.id = this.route.snapshot.params['id'];
    this.cargarDatos();
  }

  cargarDatos() {
    this.categoriaService.buscarPorId(this.id).subscribe({
      next: (data) => {
        this.categoria = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudo cargar la categoría. Verifique que exista.';
        this.isLoading = false;
      }
    });
  }

  actualizar() {
    if (!this.categoria.nombre.trim()) {
      this.errorMsg = 'El nombre no puede estar vacío.';
      return;
    }

    this.isSaving = true;
    this.errorMsg = '';

    this.categoriaService.actualizar(this.id, this.categoria).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Categoría actualizada con éxito');
        this.router.navigate(['/administracion/categoria/listar']);
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
        this.errorMsg = 'Error al actualizar. Intente nuevamente.';
      }
    });
  }
}
