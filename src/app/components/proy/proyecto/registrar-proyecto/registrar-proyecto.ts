import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { CategoriaProyecto } from '../../../../model/proy/categoria-proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';
import { CategoriaProyectoService } from '../../../../services/proy/categoria-proyecto.service';

@Component({
  selector: 'app-registrar-proyecto',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-proyecto.html',
  styleUrl: './registrar-proyecto.css'
})
export class RegistrarProyecto implements OnInit {
  @Output() onCerrar = new EventEmitter<boolean>();

  proyecto: ProyectoAdmin = {
    titulo: '',
    anio: new Date().getFullYear(),
    activo: true,
    categorias: []
  };

  categoriasDisponibles: CategoriaProyecto[] = [];
  categoriasSeleccionadas: Set<number> = new Set();
  cargandoCategorias = true;
  guardando = false;

  private proyectoService = inject(ProyectoAdminService);
  private categoriaService = inject(CategoriaProyectoService);

  ngOnInit(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (data) => { this.categoriasDisponibles = data; this.cargandoCategorias = false; },
      error: () => this.cargandoCategorias = false
    });
  }

  toggleCategoria(id: number | undefined): void {
    if (!id) return;
    this.categoriasSeleccionadas.has(id)
      ? this.categoriasSeleccionadas.delete(id)
      : this.categoriasSeleccionadas.add(id);
  }

  guardarProyecto(): void {
    if (!this.proyecto.titulo?.trim() || !this.proyecto.anio) {
      alert('El título y el año son obligatorios.'); return;
    }
    this.guardando = true;
    this.proyecto.categorias = Array.from(this.categoriasSeleccionadas).map(id => ({ idCategoria: id } as CategoriaProyecto));

    this.proyectoService.crearProyecto(this.proyecto).subscribe({
      next: () => { this.guardando = false; this.onCerrar.emit(true); },
      error: (err) => { console.error('Error', err); this.guardando = false; }
    });
  }

  cancelar(): void { this.onCerrar.emit(false); }
}
