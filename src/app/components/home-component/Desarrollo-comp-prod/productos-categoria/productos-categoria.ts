import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {FooterP1} from '../../footer-p1/footer-p1';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Producto} from '../../../../model/prod/producto';
import {ProductoService} from '../../../../services/prod/producto.service';
import {NavbarProd} from '../navbar-prod/navbar-prod';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-productos-categoria',
  imports: [CommonModule, RouterLink, FooterP1, NavbarProd],
  templateUrl: './productos-categoria.html',
  styleUrl: './productos-categoria.css'
})
export class ProductosCategoria implements OnInit, OnDestroy {

  categoriaSlug: string = '';
  nombreCategoria: string = 'Cargando...';
  productos: Producto[] = [];

  productosOriginales: Producto[] = [];
  cargando = true;
  menuFiltroAbierto: boolean = false;
  filtroSeleccionado: string = 'Relevancia';

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.categoriaSlug = params.get('slug') || '';
      this.cargarProductos();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.nombreCategoria = this.categoriaSlug.replace(/-/g, ' ').toUpperCase();

    this.productoService.listarPorCategoria(this.categoriaSlug).subscribe({
      next: (data) => {
        this.productos = data;
        // Creamos una copia exacta (sin referencias cruzadas)
        this.productosOriginales = [...data];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar los productos de la categoría:', err);
        this.cargando = false;
      }
    });
  }
  toggleMenuFiltro(): void {
    this.menuFiltroAbierto = !this.menuFiltroAbierto;
  }
  cambiarOrden(criterio: string, textoLabel: string): void {
    this.filtroSeleccionado = textoLabel; // Actualizamos el texto visible
    this.menuFiltroAbierto = false;       // Cerramos el menú

    switch (criterio) {
      case 'az':
        this.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'za':
        this.productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'recientes':
        this.productos.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case 'precio-menor':
        this.productos.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'precio-mayor':
        this.productos.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      default:
        this.productos = [...this.productosOriginales];
        break;
    }
  }

  obtenerImagenPortada(producto: any): string | null {
    if (producto.urlImagen) return producto.urlImagen;
    if (producto.imagenes && producto.imagenes.length > 0) {
      const portada = producto.imagenes.find((img: any) => img.esPortada === true || img.portada === true);
      const imagenFinal = portada ? portada : producto.imagenes[0];
      return imagenFinal.url || imagenFinal.urlImagen || imagenFinal.ruta || null;
    }
    return null;
  }
}
