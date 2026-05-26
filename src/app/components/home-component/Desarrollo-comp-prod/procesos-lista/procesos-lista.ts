import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ProcesoProducto } from '../../../../model/prod/proceso-producto';
import { CommonModule } from '@angular/common';
import { AjusteImagenDirective } from '../../../../directives/ajuste-imagen.directive';

@Component({
  selector: 'app-procesos-lista',
  standalone: true,
  imports: [CommonModule, AjusteImagenDirective],
  templateUrl: './procesos-lista.html',
  styleUrl: './procesos-lista.css'
})
export class ProcesosLista implements AfterViewInit, OnChanges {
  @Input() procesos: ProcesoProducto[] | undefined = [];
  @Input() cargando: boolean = true;
  @ViewChild('carousel') carousel!: ElementRef<HTMLElement>;

  canScrollLeft = false;
  canScrollRight = true;

  constructor(private cdr: ChangeDetectorRef) {}

  get showArrows(): boolean {
    return (this.procesos?.length || 0) > 3;
  }

  obtenerPuntos(descripcion: string | undefined): string[] {
    if (!descripcion) return [];
    return descripcion.split('\n').filter(punto => punto.trim() !== '');
  }

  ngOnChanges() {
    // Cuando los datos cambian/llegan, volvemos a verificar el estado de las flechas
    setTimeout(() => this.checkScroll(), 300);
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScroll(), 300);
  }

  checkScroll() {
    if (!this.carousel) return;
    const el = this.carousel.nativeElement;
    // Si el scroll está más allá de 5px (tolerancia por decimales o padding), podemos ir a la izquierda
    this.canScrollLeft = Math.round(el.scrollLeft) > 5;
    // Si el scroll actual + el ancho visible es menor que el ancho total, podemos ir a la derecha
    // Se añade tolerancia de 5px por los decimales
    this.canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 5;

    this.cdr.detectChanges();
  }
  scrollIzq() {
    if (!this.carousel) return;
    const el = this.carousel.nativeElement;
    const card = el.querySelector('.proceso-card');
    if (!card) return;

    const cardWidth = card.clientWidth;
    const gap = 40; // 2.5rem = 40px
    el.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });

    setTimeout(() => this.checkScroll(), 400); // Revisar flechas después de animar
  }

  scrollDer() {
    if (!this.carousel) return;
    const el = this.carousel.nativeElement;
    const card = el.querySelector('.proceso-card');
    if (!card) return;

    const cardWidth = card.clientWidth;
    const gap = 40; // 2.5rem = 40px
    el.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });

    setTimeout(() => this.checkScroll(), 400); // Revisar flechas después de animar
  }
}
