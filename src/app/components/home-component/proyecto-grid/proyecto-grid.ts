import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Proyecto} from '../../../model/proyecto';
import {ProyectoService} from '../../../services/proyecto.service';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-proyecto-grid',
  imports: [
    RouterLink,
    UpperCasePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './proyecto-grid.html',
  styleUrl: './proyecto-grid.css'
})
export class ProyectoGrid implements OnInit, OnDestroy{
  proyectos: Proyecto[] = [];
  isLoading = true;

  // Este mapa guardará el índice de la imagen actual para cada proyecto
  private imageIndexMap = new Map<number, number>();
  private intervalId: any;

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    // Solo llamamos a cargarProyectos una vez para no saturar la base de datos
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectoService.listar().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.isLoading = false; // Apagamos el fantasma de carga

        // Inicializamos el índice de imagen para cada proyecto en 0
        this.proyectos.forEach(p => this.imageIndexMap.set(p.idProyecto, 0));

        // Iniciamos la animación automática de imágenes
        this.startImageCarousel();
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.isLoading = false;
      }
    });
  }

  startImageCarousel(): void {
    // Cambia la foto de la tarjeta cada 3 segundos
    this.intervalId = setInterval(() => {
      this.proyectos.forEach(proyecto => {
        if (proyecto.imagenes && proyecto.imagenes.length > 1) {
          let currentIndex = this.imageIndexMap.get(proyecto.idProyecto) ?? 0;
          currentIndex = (currentIndex + 1) % proyecto.imagenes.length;
          this.imageIndexMap.set(proyecto.idProyecto, currentIndex);
        }
      });
    }, 3000);
  }

  getCurrentImage(proyecto: Proyecto): string {
    // Si no hay imágenes, muestra un placeholder
    if (!proyecto.imagenes || proyecto.imagenes.length === 0) {
      return 'assets/placeholder-procesos.png'; // O la ruta de tu imagen por defecto
    }

    const index = this.imageIndexMap.get(proyecto.idProyecto) ?? 0;
    return proyecto.imagenes[index].imagen;
  }

  ngOnDestroy(): void {
    // Limpiamos la memoria cuando salimos de la página
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
