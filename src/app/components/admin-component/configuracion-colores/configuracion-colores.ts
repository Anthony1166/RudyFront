import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { ToastService } from '../../../services/toast.service';
import { ConfiguracionColor } from '../../../model/configuracion-color';

@Component({
  selector: 'app-configuracion-colores',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-colores.html',
  styleUrl: './configuracion-colores.css'
})
export class ConfiguracionColores implements OnInit {
  configuraciones: ConfiguracionColor[] = [];
  cargando = true;
  guardandoClave: string | null = null;

  private themeService = inject(ThemeService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.themeService.listar().subscribe({
      next: (data) => {
        this.configuraciones = data;
        this.cargando = false;
      },
      error: () => {
        this.toast.error('No se pudieron cargar las configuraciones de color');
        this.cargando = false;
      }
    });
  }

  /** Preview en vivo: aplica el degradado mientras el admin mueve el color picker. */
  previsualizar(config: ConfiguracionColor): void {
    this.themeService.aplicarUno(config.clave, config.colorTop, config.colorBottom);
  }

  guardar(config: ConfiguracionColor): void {
    this.guardandoClave = config.clave;
    this.themeService.actualizar(config.clave, config).subscribe({
      next: (actualizada) => {
        this.fusionar(actualizada);
        this.themeService.aplicarUno(actualizada.clave, actualizada.colorTop, actualizada.colorBottom);
        this.toast.exito(`Colores de "${config.nombre}" guardados`);
        this.guardandoClave = null;
      },
      error: () => {
        this.toast.error('Error al guardar los colores');
        this.guardandoClave = null;
      }
    });
  }

  restaurar(config: ConfiguracionColor): void {
    if (!confirm(`¿Restaurar "${config.nombre}" a sus colores originales?`)) return;

    this.guardandoClave = config.clave;
    this.themeService.restaurarDefault(config.clave).subscribe({
      next: (restaurada) => {
        this.fusionar(restaurada);
        this.themeService.aplicarUno(restaurada.clave, restaurada.colorTop, restaurada.colorBottom);
        this.toast.exito(`"${config.nombre}" restaurado al color original`);
        this.guardandoClave = null;
      },
      error: () => {
        this.toast.error('Error al restaurar los colores');
        this.guardandoClave = null;
      }
    });
  }

  /** Reemplaza en la lista local la config que devolvió el backend. */
  private fusionar(actualizada: ConfiguracionColor): void {
    const i = this.configuraciones.findIndex(c => c.clave === actualizada.clave);
    if (i !== -1) this.configuraciones[i] = actualizada;
  }

  /** ¿Los colores actuales difieren del default? Habilita el botón restaurar. */
  esModificado(config: ConfiguracionColor): boolean {
    return config.colorTop?.toLowerCase() !== config.colorTopDefault?.toLowerCase()
      || config.colorBottom?.toLowerCase() !== config.colorBottomDefault?.toLowerCase();
  }

  gradiente(config: ConfiguracionColor): string {
    return `linear-gradient(180deg, ${config.colorTop} 0%, ${config.colorBottom} 100%)`;
  }
}
