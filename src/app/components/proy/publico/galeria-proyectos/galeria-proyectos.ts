import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';
import { NavbarProd } from '../../../home-component/Desarrollo-comp-prod/navbar-prod/navbar-prod';
import { AjusteImagenDirective } from '../../../../directives/ajuste-imagen.directive';

@Component({
  selector: 'app-galeria-proyectos',
  imports: [CommonModule, RouterLink, NavbarProd, AjusteImagenDirective],
  templateUrl: './galeria-proyectos.html',
  styleUrl: './galeria-proyectos.css'
})
export class GaleriaProyectos implements OnInit {
  proyectos: ProyectoAdmin[] = [];
  cargando = true;

  private proyectoService = inject(ProyectoAdminService);

  ngOnInit(): void {
    this.proyectoService.listarActivos().subscribe({
      next: (data) => { this.proyectos = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  getPortada(proyecto: ProyectoAdmin): string | null {
    const obj = this.getPortadaObj(proyecto);
    return obj ? obj.urlImagen : null;
  }

  getPortadaObj(proyecto: ProyectoAdmin): any {
    if (!proyecto.imagenes || proyecto.imagenes.length === 0) return null;
    const portada = proyecto.imagenes.find(img => img.esPortada);
    return portada ? portada : proyecto.imagenes[0];
  }
}
