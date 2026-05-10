import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesoProyecto } from '../../../../model/proy/proceso-proyecto';
import { ProcesoProyectoService } from '../../../../services/proy/proceso-proyecto.service';

@Component({
  selector: 'app-proyecto-publ-procesos',
  imports: [CommonModule],
  templateUrl: './proyecto-publ-procesos.html',
  styleUrl: './proyecto-publ-procesos.css'
})
export class ProyectoPublProcesos implements OnInit {
  @Input() idRecibido!: number;
  isLoading = true;
  procesos: ProcesoProyecto[] = [];

  private procesoService = inject(ProcesoProyectoService);

  @ViewChild('carousel') carousel!: ElementRef;
  isDown = false;
  startX = 0;
  scrollLeft = 0;

  ngOnInit(): void {
    if (this.idRecibido) this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.procesoService.listarPorProyecto(this.idRecibido).subscribe({
      next: (data) => {
        this.procesos = data.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getImagen(proceso: ProcesoProyecto): string {
    return proceso.urlImagen ?? 'assets/placeholder-procesos.png';
  }

  onMouseDown(e: MouseEvent): void {
    this.isDown = true;
    const slider = this.carousel.nativeElement;
    this.startX = e.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }

  onMouseLeave(): void { this.isDown = false; }

  onMouseUp(): void { this.isDown = false; }

  onMouseMove(e: MouseEvent): void {
    if (!this.isDown) return;
    e.preventDefault();
    const slider = this.carousel.nativeElement;
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = this.scrollLeft - (x - this.startX);
  }
}
