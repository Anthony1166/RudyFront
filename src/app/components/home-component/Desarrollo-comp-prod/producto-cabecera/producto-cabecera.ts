import {Component, Input, SimpleChanges} from '@angular/core';
import {Producto} from '../../../../model/prod/producto';
import {ImagenProducto} from '../../../../model/prod/imagen-producto';
import {DecimalPipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-producto-cabecera',
  imports: [
    UpperCasePipe,
    DecimalPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './producto-cabecera.html',
  styleUrl: './producto-cabecera.css'
})
export class ProductoCabecera {

  @Input() producto!: Producto;
  @Input() imagenes: ImagenProducto[] = [];

  // Variable para saber qué imagen está en el recuadro grande
  imagenActual: ImagenProducto | undefined;

  // Se ejecuta automáticamente cuando el Padre nos envía o actualiza la lista de imágenes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['imagenes'] && this.imagenes.length > 0) {
      // Regla de oro: La primera de la lista de la BD es siempre la principal
      // Ignoramos el campo 'esPortada' para esta vista
      this.imagenActual = this.imagenes[0];
    }
  }

  // Filtramos las miniaturas: Mostramos todas EXCEPTO la que está en tamaño grande
  get miniaturas(): ImagenProducto[] {
    if (!this.imagenes || !this.imagenActual) return [];

    return this.imagenes
      .filter(img => img.id !== this.imagenActual?.id)
      .slice(0, 3); // Mantenemos el límite de 3 miniaturas máximo
  }

  // Función que se dispara al hacer clic en una miniatura
  cambiarImagen(imagenClickeada: ImagenProducto) {
    this.imagenActual = imagenClickeada;
  }

  // --- LÓGICA PARA LA LISTA ---
  get listaCaracteristicas(): string[] {
    if (!this.producto?.caracteristicas) return [];
    return this.producto.caracteristicas.split('\n').filter(item => item.trim() !== '');
  }

  trackById(index: number, item: ImagenProducto): number {
    return item.id || 0;
  }

  abrirWhatsApp(): void {
    const nombre = this.producto.nombre;
    const mensaje = `Hola! Estoy interesado/a en su producto *${nombre}* ✨ ¿Me podrían brindar más información? 🙌`;
    window.open(`https://wa.me/51962284346?text=${encodeURIComponent(mensaje)}`, '_blank');
  }
}
