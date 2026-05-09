import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {ProcesoDiseno} from '../../../model/proceso-diseno';
import {ProcesoDisenoService} from '../../../services/proceso-diseno.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-proyecto-procesos',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './proyecto-procesos.html',
  styleUrl: './proyecto-procesos.css'
})
export class ProyectoProcesos implements OnInit{
  // ¡La llave que nos pasa el componente Padre!
  @Input() idRecibido!: number;
  isLoading = true; // Empieza cargando
  procesos: ProcesoDiseno[] = [];
  private procesoService = inject(ProcesoDisenoService);

  @ViewChild('carousel') carousel!: ElementRef;
  isDown = false;
  startX = 0;
  scrollLeft = 0;

  ngOnInit(): void {
    if (this.idRecibido) {
      this.cargarProcesos();
    }
  }

  cargarProcesos() {
    this.procesoService.getProcesosByProyectoId(this.idRecibido).subscribe({
      next: (data) => {
        this.procesos = data.sort((a, b) => a.orden - b.orden);
        this.isLoading = false; // <-- ¡CLAVE! Apagamos los fantasmas
      },
      error: (err) => {
        console.error('Error al cargar los procesos de diseño', err);
        this.isLoading = false; // <-- También lo apagamos si hay error
      }
    });
  }

  getImagen(proceso: ProcesoDiseno): string {
    return proceso.imagen_proceso ? proceso.imagen_proceso : 'assets/placeholder-procesos.png';
  }

  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    const slider = this.carousel.nativeElement;
    this.startX = e.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseUp() {
    this.isDown = false;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();

    const slider = this.carousel.nativeElement;
    const x = e.pageX - slider.offsetLeft;

    // El número '2' al final es la velocidad de arrastre (puedes subirlo a 3 para más rápido)
    const walk = (x - this.startX) * 1;

    slider.scrollLeft = this.scrollLeft - walk;
  }

}
