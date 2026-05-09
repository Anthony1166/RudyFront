import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Imagen } from '../../../model/imagen';
import { Proyecto } from '../../../model/proyecto';
import { ImagenService } from '../../../services/imagen.service';
import { ProyectoService } from '../../../services/proyecto.service';

@Component({
  selector: 'app-listar-imagen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listar-imagen.html',
  styleUrls: ['./listar-imagen.css']
})
export class ListarImagenes implements OnInit {
  imagenes: Imagen[] = [];
  proyectos: Proyecto[] = [];

  selectedProyectoId: string = '';

  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(
    private imagenService: ImagenService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this.cargarProyectos();
    this.aplicarFiltro(); // Carga inicial de todas las imágenes
  }

  cargarProyectos(): void {
    this.proyectoService.listar().subscribe({
      next: (data) => {
        this.proyectos = data;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
      }
    });
  }

  aplicarFiltro(): void {
    this.isLoading = true;
    this.errorMsg = '';

    const id = this.selectedProyectoId ? Number(this.selectedProyectoId) : null;

    const servicioObservable = id
      ? this.imagenService.listarPorProyecto(id)
      : this.imagenService.listarTodas();

    servicioObservable.subscribe({
      next: (data) => {
        this.imagenes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar imágenes', err);
        this.errorMsg = 'No se pudieron cargar las imágenes.';
        this.isLoading = false;
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.')) {
      this.imagenService.eliminar(id).subscribe({
        next: () => {
          this.imagenes = this.imagenes.filter(img => img.id !== id);
          alert('Imagen eliminada con éxito');
        },
        error: (err) => {
          console.error('Error al eliminar la imagen', err);
          alert('Error al eliminar la imagen.');
        }
      });
    }
  }
}
