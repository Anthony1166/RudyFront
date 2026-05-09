import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Proyecto} from '../../../model/proyecto';
import {NgForOf, NgIf, SlicePipe, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-proyecto-main',
  imports: [
    UpperCasePipe,
    NgIf,
    NgForOf,
    SlicePipe
  ],
  templateUrl: './proyecto-main.html',
  styleUrl: './proyecto-main.css'
})
export class ProyectoMain implements OnChanges{
// Recibimos el objeto Proyecto entero desde el componente detalle
  @Input() proyectoRecibido!: Proyecto;

  isLoading = true;

  // Detectamos cuando cambia la propiedad de entrada
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoRecibido'] && changes['proyectoRecibido'].currentValue) {
      // Si recibimos un proyecto válido, apagamos la animación de carga
      this.isLoading = false;
    }
  }
}
