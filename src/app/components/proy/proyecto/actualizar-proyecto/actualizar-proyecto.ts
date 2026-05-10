import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { CategoriaProyecto } from '../../../../model/proy/categoria-proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';
import { CategoriaProyectoService } from '../../../../services/proy/categoria-proyecto.service';
import { ListarImagenProy } from '../imagen-proy/listar-imagen-proy/listar-imagen-proy';
import { ListarProcesoProy } from '../proceso-proy/listar-proceso-proy/listar-proceso-proy';

@Component({
  selector: 'app-actualizar-proyecto',
  imports: [CommonModule, FormsModule, RouterLink, ListarImagenProy, ListarProcesoProy],
  templateUrl: './actualizar-proyecto.html',
  styleUrl: './actualizar-proyecto.css'
})
export class ActualizarProyecto implements OnInit {
  pestaniaActiva: 'detalles' | 'galeria' | 'procesos' = 'detalles';
  proyecto: ProyectoAdmin = { titulo: '', anio: new Date().getFullYear(), categorias: [] };
  idProyecto!: number;

  categoriasDisponibles: CategoriaProyecto[] = [];
  categoriasSeleccionadas: Set<number> = new Set();
  cargandoCategorias = true;
  cargandoDatos = true;
  guardando = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proyectoService = inject(ProyectoAdminService);
  private categoriaService = inject(CategoriaProyectoService);

  ngOnInit(): void {
    this.idProyecto = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => {
        this.categoriasDisponibles = data;
        this.cargandoCategorias = false;
        this.cargarDatosProyecto();
      },
      error: () => this.cargandoCategorias = false
    });
  }

  cargarDatosProyecto(): void {
    this.proyectoService.obtenerPorId(this.idProyecto).subscribe({
      next: (data) => {
        this.proyecto = data;
        this.proyecto.categorias?.forEach(cat => { if (cat.idCategoria) this.categoriasSeleccionadas.add(cat.idCategoria); });
        this.cargandoDatos = false;
      },
      error: () => {
        alert('No se pudo cargar el proyecto.');
        this.router.navigate(['/administracion/proyecto-portafolio/listar']);
      }
    });
  }

  toggleCategoria(id: number | undefined): void {
    if (!id) return;
    this.categoriasSeleccionadas.has(id)
      ? this.categoriasSeleccionadas.delete(id)
      : this.categoriasSeleccionadas.add(id);
  }

  actualizarProyecto(): void {
    if (!this.proyecto.titulo?.trim() || !this.proyecto.anio) return;
    this.guardando = true;
    this.proyecto.categorias = Array.from(this.categoriasSeleccionadas).map(id => ({ idCategoria: id } as CategoriaProyecto));

    this.proyectoService.actualizarProyecto(this.idProyecto, this.proyecto).subscribe({
      next: () => { this.guardando = false; this.router.navigate(['/administracion/proyecto-portafolio/listar']); },
      error: (err) => { console.error('Error', err); alert('Error al guardar los cambios.'); this.guardando = false; }
    });
  }
}
