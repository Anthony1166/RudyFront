import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Producto} from '../../../../model/prod/producto';
import {ProductoService} from '../../../../services/prod/producto.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {RegistrarProducto} from '../registrar-producto/registrar-producto';
import {CategoriaProducto} from '../../../../model/prod/categoria-producto';
import {CategoriaProductoService} from '../../../../services/prod/categoria-producto.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-listar-producto',
  imports: [
    RouterLink,
    NgIf,
    CdkDropList,
    NgForOf,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    DecimalPipe,
    RegistrarProducto,
    FormsModule
  ],
  templateUrl: './listar-producto.html',
  styleUrl: './listar-producto.css'
})
export class ListarProducto implements OnInit{
  productos: Producto[] = [];
  todosLosProductos: Producto[] = []; // Cache local para búsqueda sin extra GETs
  cargando = true;
  guardandoOrden = false;

  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaProductoService);
  private destroyRef = inject(DestroyRef);

  filtroActual: 'todos' | 'destacados' | 'ocultos' = 'todos';
  mostrarModalRegistro = false;

  categorias: CategoriaProducto[] = [];
  idCategoriaSeleccionada: number | 'todas' = 'todas';

  dropdownAbierto = false;

  get nombreCategoriaSeleccionada(): string {
    if (this.idCategoriaSeleccionada === 'todas') return 'Todas las categorías';
    const cat = this.categorias.find(c => c.id === this.idCategoriaSeleccionada);
    return cat ? cat.nombre : 'Todas las categorías';
  }

  seleccionarCategoriaFiltro(id: number | 'todas', event: Event): void {
    event.stopPropagation(); // Evita que el clic cierre el menú inmediatamente
    this.idCategoriaSeleccionada = id;
    this.dropdownAbierto = false;
    this.alCambiarFiltro(); // Llamamos a la función que ya tenías para filtrar
  }

  ngOnInit(): void {
    this.cargarProductos(); // Carga inicial
    this.cargarCategoriasParaFiltro(); // Traemos las categorías para el select
  }

  cargarCategoriasParaFiltro(): void {
    this.categoriaService.listarTodas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.categorias = data);
  }

  alCambiarFiltro(): void {
    this.cargando = true;
    if (this.idCategoriaSeleccionada === 'todas') {
      this.cargarProductos();
    } else {
      this.productoService.listarPorCategoriaAdmin(Number(this.idCategoriaSeleccionada)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => {
          this.productos = data;
          this.cargando = false;
        },
        error: () => this.cargando = false
      });
    }
  }

  abrirModal(): void {
    this.mostrarModalRegistro = true;
  }

  // Si recargar es true, significa que guardó con éxito. Si es false, solo canceló.
  cerrarModal(recargar: boolean): void {
    this.mostrarModalRegistro = false;
    if (recargar) {
      this.cargarProductos(); // Refrescamos la grilla para que aparezca el nuevo producto
    }
  }

  filtrarProductos(tipo: 'todos' | 'destacados' | 'ocultos'): void {
    this.filtroActual = tipo;
    // Aquí puedes llamar a tu servicio o filtrar el array localmente
    // Ejemplo local:
    if (tipo === 'todos') this.cargarProductos();
    if (tipo === 'destacados') this.productos = this.productos.filter(p => p.destacado);
    if (tipo === 'ocultos') this.productos = this.productos.filter(p => !p.activo);
  }


  cargarProductos(): void {
    this.cargando = true;
    this.productoService.listarTodosAdmin().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.productos = data;
        this.todosLosProductos = data; // Guardamos copia en caché
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.cargando = false;
      }
    });
  }

  // 🔥 MAGIA: Busca la foto principal dentro de la galería del producto
  obtenerPortada(producto: Producto): string | null {
    if (!producto.imagenes || producto.imagenes.length === 0) {
      return null; // No tiene fotos
    }
    const portada = producto.imagenes.find(img => img.esPortada);
    return portada ? portada.urlImagen : producto.imagenes[0].urlImagen; // Si no hay portada, usa la primera
  }

  // --- ARRASTRAR Y SOLTAR ---
  onDrop(event: CdkDragDrop<Producto[]>): void {
    moveItemInArray(this.productos, event.previousIndex, event.currentIndex);
    const idsOrdenados = this.productos.map(p => p.id!);

    this.guardandoOrden = true;
    this.productoService.reordenarLote(idsOrdenados).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.guardandoOrden = false,
      error: (err) => {
        console.error('Error guardando el orden', err);
        this.guardandoOrden = false;
        this.cargarProductos(); // Revertimos si falla
      }
    });
  }

  // --- BOTONES DE ACCIÓN ---
  toggleVisibilidad(producto: Producto): void {
    if (!producto.id) return;
    const nuevoEstado = !producto.activo;

    if (confirm(`¿Estás segura de ${nuevoEstado ? 'MOSTRAR' : 'OCULTAR'} el producto "${producto.nombre}" en la tienda?`)) {
      this.productoService.apagarProducto(producto.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => producto.activo = nuevoEstado,
        error: (err) => console.error('Error al cambiar visibilidad', err)
      });
    }
  }

  eliminarDefinitivo(producto: Producto): void {
    if (!producto.id) return;

    if (confirm(`⚠️ ALERTA CRÍTICA: ¿Estás segura de ELIMINAR POR SIEMPRE el producto "${producto.nombre}"?\nEsto también borrará sus fotos y procesos de la base de datos.`)) {
      this.productoService.eliminarFisico(producto.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.productos = this.productos.filter(p => p.id !== producto.id),
        error: (err) => console.error('Error al eliminar físicamente', err)
      });
    }
  }

  // Búsqueda local instantánea usando el caché (sin llamadas extra al servidor)
  onSearch(event: any): void {
    const query = event.target.value.toLowerCase().trim();
    if (!query) {
      this.productos = [...this.todosLosProductos]; // Restauramos desde el caché local
      return;
    }

    // Filtro local instantáneo para que Sami sienta la app súper rápida
    this.productos = this.todosLosProductos.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query)
    );
  }

  trackByFn(index: number, producto: Producto): number {
    return producto.id!; // Angular usará el ID único para rastrear cada tarjeta
  }
}
