import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {Producto} from '../../../../model/prod/producto';
import {CategoriaProducto} from '../../../../model/prod/categoria-producto';
import {ProductoService} from '../../../../services/prod/producto.service';
import {CategoriaProductoService} from '../../../../services/prod/categoria-producto.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registrar-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-producto.html',
  styleUrl: './registrar-producto.css'
})
export class RegistrarProducto implements OnInit{
  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    caracteristicas: '',
    subTitulo: '',
    activo: true,
    destacado: false,
    categorias: []
  };

  // Para las etiquetas seleccionables
  categoriasDisponibles: CategoriaProducto[] = [];
  categoriasSeleccionadas: Set<number> = new Set();

  cargandoCategorias = true;
  guardando = false;

  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaProductoService);
  private router = inject(Router);

  @Output() onCerrar = new EventEmitter<boolean>();


  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    // Cargamos TODAS las categorías para que Sami pueda elegir
    this.categoriaService.listarTodas().subscribe({
      next: (data) => {
        this.categoriasDisponibles = data;
        this.cargandoCategorias = false;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.cargandoCategorias = false;
      }
    });
  }

  // Permite seleccionar múltiples categorías como "botones"
  toggleCategoria(id: number | undefined): void {
    if (!id) return;
    if (this.categoriasSeleccionadas.has(id)) {
      this.categoriasSeleccionadas.delete(id);
    } else {
      this.categoriasSeleccionadas.add(id);
    }
  }

  guardarProducto(): void {
    if (!this.producto.nombre || !this.producto.descripcion || this.producto.precio <= 0) {
      alert('Por favor, completa los campos obligatorios.'); return;
    }

    this.guardando = true;
    this.producto.categorias = Array.from(this.categoriasSeleccionadas).map(id => ({ id } as CategoriaProducto));

    this.productoService.crearProducto(this.producto).subscribe({
      next: (productoGuardado) => {
        this.guardando = false;
        // 4. EN LUGAR DE NAVEGAR, EMITIMOS TRUE (Éxito -> Recargar lista)
        this.onCerrar.emit(true);
      },
      error: (err) => {
        console.error('Error', err); this.guardando = false;
      }
    });
  }
  cancelar(): void {
    this.onCerrar.emit(false); // Emitimos FALSE (Cancelar -> No recargar lista)
  }
}
