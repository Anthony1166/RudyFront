import { Component, inject, Input, HostBinding } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-prod',
  imports: [RouterLink, NgIf],
  templateUrl: './navbar-prod.html',
  styleUrl: './navbar-prod.css'
})
export class NavbarProd {
  private location = inject(Location);

  /** true = muestra la flecha ←  |  false = la oculta en móvil */
  @Input() mostrarFlecha: boolean = true;

  /** true = solo muestra la flecha en desktop (cat-comp mode) */
  @Input() soloFlecha: boolean = false;

  /** 'claro' = iconos/texto en blanco (tienda/portafolio) | 'crema' = #EBDDC1 (inicio, fondo oscuro) */
  @Input() tema: 'claro' | 'crema' = 'claro';

  /** Agrega clase CSS al host para que el CSS pueda reaccionar */
  @HostBinding('class.solo-flecha') get esSoloFlecha() {
    return this.soloFlecha;
  }

  /** Activa la paleta crema para el navbar del inicio */
  @HostBinding('class.tema-crema') get esTemaCrema() {
    return this.tema === 'crema';
  }

  volverAtras(): void {
    this.location.back();
  }
}
