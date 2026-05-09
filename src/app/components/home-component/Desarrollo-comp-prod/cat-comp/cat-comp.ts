import { Component, inject, OnInit } from '@angular/core';
import { FooterP1 } from '../../footer-p1/footer-p1';
import { CategoriaProducto } from '../../../../model/prod/categoria-producto';
import { CategoriaProductoService } from '../../../../services/prod/categoria-producto.service';
import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarProd } from '../navbar-prod/navbar-prod';

@Component({
  selector: 'app-cat-comp',
  imports: [FooterP1, NgIf, NgForOf, RouterLink, UpperCasePipe, NavbarProd],
  templateUrl: './cat-comp.html',
  styleUrl: './cat-comp.css'
})
export class CatComp implements OnInit {
  categorias: CategoriaProducto[] = [];
  cargando = true;

  private categoriaService = inject(CategoriaProductoService);

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
}
