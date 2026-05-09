import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import { RouterLink } from '@angular/router';
import {Proyecto} from '../../../model/proyecto';
import {ProyectoService} from '../../../services/proyecto.service';

@Component({
  selector: 'app-carrusel-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrusel-proyectos.html',
  styleUrl: './carrusel-proyectos.css'
})
export class CarruselProyectos implements OnInit, OnDestroy{
  proyectos: Proyecto[] = [];
  isLoading = true;
  // Este mapa guardará el índice de la imagen actual para cada proyecto
  private imageIndexMap = new Map<number, number>();
  private intervalId: any;

  constructor(private proyectoService: ProyectoService) {}
// Referencia al contenedor del carrusel en el HTML
  @ViewChild('carousel') carousel!: ElementRef;

  // Variables para la lógica de arrastre
  isDown = false;
  startX: number = 0;
  scrollLeft: number = 0;



  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.startX = e.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseUp() {
    this.isDown = false;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return; // Si no está presionado el clic, no hace nada
    e.preventDefault();
    const x = e.pageX - this.carousel.nativeElement.offsetLeft;


    const walk = (x - this.startX) * 1;
    this.carousel.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  ngOnInit(): void {
    this.cargarProyectos();
    this.proyectoService.listar().subscribe(data => {
      this.proyectos = data.slice(0, 9);

      // Inicializamos el índice de imagen para cada proyecto en 0
      this.proyectos.forEach(p => this.imageIndexMap.set(p.idProyecto, 0));

      // Iniciamos el carrusel
      this.startImageCarousel();
    });
  }
  cargarProyectos() {
    this.proyectoService.listar().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.isLoading = false; // ¡Terminamos de cargar!
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  ngOnDestroy(): void {
    // Es muy importante limpiar el intervalo para evitar fugas de memoria
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startImageCarousel(): void {
    // Cambia la imagen cada 3 segundos (3000 milisegundos)
    this.intervalId = setInterval(() => {
      this.proyectos.forEach(proyecto => {
        if (proyecto.imagenes && proyecto.imagenes.length > 1) {
          let currentIndex = this.imageIndexMap.get(proyecto.idProyecto) ?? 0;
          // Usamos el operador de módulo (%) para crear un bucle infinito
          currentIndex = (currentIndex + 1) % proyecto.imagenes.length;
          this.imageIndexMap.set(proyecto.idProyecto, currentIndex);
        }
      });
    }, 3000);
  }

  // Función de ayuda para la plantilla HTML
  getCurrentImage(proyecto: Proyecto): string {
    // Si no hay imágenes, devuelve un placeholder
    if (!proyecto.imagenes || proyecto.imagenes.length === 0) {
      return 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    }

    const index = this.imageIndexMap.get(proyecto.idProyecto) ?? 0;
    return proyecto.imagenes[index].imagen;
  }


}
