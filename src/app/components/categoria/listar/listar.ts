import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../model/categoria';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar',
  imports: [
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: './listar.html',
  styleUrl: './listar.css'
})
export class Listar implements OnInit {
  categorias: Categoria[] = [];
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.isLoading = true;
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.errorMsg = 'No se pudieron cargar las categorías.';
        this.isLoading = false;
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminar(id).subscribe({
        next: () => {
          // Recargar la lista o filtrar el elemento eliminado
          this.categorias = this.categorias.filter(c => c.idCategoria !== id);
          alert('Categoría eliminada con éxito');
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }
}
