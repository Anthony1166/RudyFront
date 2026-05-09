import {Component, inject, OnInit} from '@angular/core';
import {CategoriaProducto} from '../../../../model/prod/categoria-producto';
import {Producto} from '../../../../model/prod/producto';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProductoService} from '../../../../services/prod/producto.service';
import {CategoriaProductoService} from '../../../../services/prod/categoria-producto.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ListarImagenProd} from '../../imagen/listar-imagen-prod/listar-imagen-prod';
import {ListarProcesoProd} from '../../proceso-prod/listar-proceso-prod/listar-proceso-prod';


@Component({
  selector: 'app-actualizar-producto',
  imports: [CommonModule, FormsModule, RouterLink, ListarImagenProd, ListarProcesoProd],
  templateUrl: './actualizar-producto.html',
  styleUrl: './actualizar-producto.css'
})
export class ActualizarProducto implements OnInit{

  pestaniaActiva: 'detalles' | 'galeria' | 'procesos' = 'detalles';
  producto: Producto = { nombre: '', descripcion: '', precio: 0, categorias: [] };
  idProducto!: number;

  categoriasDisponibles: CategoriaProducto[] = [];
  categoriasSeleccionadas: Set<number> = new Set();

  cargandoCategorias = true;
  cargandoDatos = true;
  guardando = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaProductoService);

  ngOnInit(): void {
    this.idProducto = Number(this.route.snapshot.paramMap.get('id'));
    // Primero cargamos las categorías, y CUANDO TERMINEN, cargamos el producto
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => {
        this.categoriasDisponibles = data;
        this.cargandoCategorias = false;
        this.cargarDatosProducto(); // Llamamos al producto aquí para que el orden sea perfecto
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.cargandoCategorias = false;
      }
    });
  }

  cargarDatosProducto(): void {
    this.productoService.obtenerPorId(this.idProducto).subscribe({
      next: (data) => {
        this.producto = data;

        // 🔥 LA MAGIA: Pre-seleccionar los pills de las categorías que ya tenía
        if (this.producto.categorias) {
          this.producto.categorias.forEach(cat => {
            if (cat.id) this.categoriasSeleccionadas.add(cat.id);
          });
        }

        this.cargandoDatos = false;
      },
      error: (err) => {
        console.error('Error cargando producto', err);
        alert('No se pudo cargar la información del producto.');
        this.router.navigate(['/administracion/producto/listar']);
      }
    });
  }

  toggleCategoria(id: number | undefined): void {
    if (!id) return;
    if (this.categoriasSeleccionadas.has(id)) {
      this.categoriasSeleccionadas.delete(id);
    } else {
      this.categoriasSeleccionadas.add(id);
    }
  }

  actualizarProducto(): void {
    if (!this.producto.nombre || !this.producto.descripcion || this.producto.precio <= 0) return;

    this.guardando = true;

    // Mapeamos el Set de vuelta a un array para enviarlo al backend
    this.producto.categorias = Array.from(this.categoriasSeleccionadas).map(id => ({ id } as CategoriaProducto));

    this.productoService.actualizarProducto(this.idProducto, this.producto).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/administracion/producto/listar']);
      },
      error: (err) => {
        console.error('Error actualizando', err);
        alert('Hubo un error al guardar los cambios.');
        this.guardando = false;
      }
    });
  }
}
