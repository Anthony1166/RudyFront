import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ImagenService } from '../../../services/imagen.service';
import { ProyectoService } from '../../../services/proyecto.service';
import { Proyecto } from '../../../model/proyecto';

@Component({
  selector: 'app-registrar-imagen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registrar-imagen.html',
  styleUrls: ['./registrar-imagen.css']
})
export class RegistrarImagen implements OnInit {
  descripcion: string = '';
  idProyectoSeleccionado: number | null = null;
  selectedFile: File | null = null;

  proyectos: Proyecto[] = [];

  isLoading: boolean = false;
  errorMsg: string = '';
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private imagenService: ImagenService,
    private proyectoService: ProyectoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.proyectoService.listar().subscribe({
      next: (data) => {
        this.proyectos = data;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.errorMsg = 'No se pudieron cargar los proyectos para la selección.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      // Crear una URL de previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  subir(): void {
    if (!this.selectedFile || !this.idProyectoSeleccionado) {
      this.errorMsg = 'Debes seleccionar un archivo y un proyecto.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.imagenService.subirImagen(this.selectedFile, this.descripcion, this.idProyectoSeleccionado).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Imagen subida con éxito');
        this.router.navigate(['/administracion/imagenes/listar']);
      },
      error: (err) => {
        console.error('Error al subir la imagen', err);
        this.isLoading = false;
        this.errorMsg = 'Error al subir la imagen. Verifique el archivo y los datos.';
      }
    });
  }
}
