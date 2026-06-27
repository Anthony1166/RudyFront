import { Component, inject, OnInit } from '@angular/core';
import { FooterP1 } from '../../footer-p1/footer-p1';
import { CategoriaProducto } from '../../../../model/prod/categoria-producto';
import { CategoriaProductoService } from '../../../../services/prod/categoria-producto.service';
import { ProductoService } from '../../../../services/prod/producto.service';
import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarProd } from '../navbar-prod/navbar-prod';
import { AjusteImagenDirective } from '../../../../directives/ajuste-imagen.directive';

@Component({
  selector: 'app-cat-comp',
  imports: [FooterP1, NgIf, NgForOf, UpperCasePipe, NavbarProd, AjusteImagenDirective],
  templateUrl: './cat-comp.html',
  styleUrl: './cat-comp.css'
})
export class CatComp implements OnInit {
  categorias: CategoriaProducto[] = [];
  cargando = true;
  // Slug de la categoría sobre la que se está resolviendo el destino (evita doble clic)
  navegandoSlug: string | null = null;

  private categoriaService = inject(CategoriaProductoService);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => {
        this.categorias = data.filter(cat => cat.activo);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar', err);
        this.cargando = false;
      }
    });
  }

  /**
   * Si la categoría tiene un solo producto, abre directamente su ficha.
   * Si tiene varios (o ninguno), abre la lista de productos de la categoría.
   */
  irACategoria(cat: CategoriaProducto): void {
    if (!cat.slug || this.navegandoSlug) return;
    const slug = cat.slug;
    this.navegandoSlug = slug;

    this.productoService.listarPorCategoria(slug).subscribe({
      next: (productos) => {
        this.navegandoSlug = null;
        if (productos.length === 1) {
          this.router.navigate(['/producto', productos[0].id]);
        } else {
          this.router.navigate(['/categoria', slug]);
        }
      },
      error: () => {
        // Ante cualquier error, caemos a la lista de la categoría
        this.navegandoSlug = null;
        this.router.navigate(['/categoria', slug]);
      }
    });
  }
}
