import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';

@Component({
  selector: 'app-galeria-proyectos',
  imports: [CommonModule, RouterLink],
  templateUrl: './galeria-proyectos.html',
  styleUrl: './galeria-proyectos.css'
})
export class GaleriaProyectos implements OnInit {
  proyectos: ProyectoAdmin[] = [];
  isLoading = true;

  private proyectoService = inject(ProyectoAdminService);

  ngOnInit(): void {
    this.proyectoService.listarActivos().subscribe({
      next: (data) => { this.proyectos = data; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  getPortada(proyecto: ProyectoAdmin): string {
    if (!proyecto.imagenes || proyecto.imagenes.length === 0) return 'assets/placeholder-procesos.png';
    const portada = proyecto.imagenes.find(img => img.esPortada);
    return portada ? portada.urlImagen : proyecto.imagenes[0].urlImagen;
  }
}
