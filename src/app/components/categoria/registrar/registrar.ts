import { Component } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { Router, RouterLink } from '@angular/router';
import { Categoria } from '../../../model/categoria';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registrar',
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './registrar.html',
  styleUrl: './registrar.css'
})
export class Registrar {
  // Inicializamos el objeto categoría (el ID se genera en backend)
  categoria: Categoria = { idCategoria: 0, nombre: '' };

  isLoading: boolean = false;
  errorMsg: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  guardar() {
    if (!this.categoria.nombre.trim()) {
      this.errorMsg = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.categoriaService.registrar(this.categoria).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Categoría registrada con éxito');
        this.router.navigate(['/administracion/categoria/listar']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMsg = 'Error al registrar la categoría. Intente nuevamente.';
      }
    });
  }
}
