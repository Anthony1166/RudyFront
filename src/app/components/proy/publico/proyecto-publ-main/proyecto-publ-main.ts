import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';

@Component({
  selector: 'app-proyecto-publ-main',
  imports: [CommonModule],
  templateUrl: './proyecto-publ-main.html',
  styleUrl: './proyecto-publ-main.css'
})
export class ProyectoPublMain implements OnChanges {
  @Input() proyectoRecibido?: ProyectoAdmin;
  isLoading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoRecibido']?.currentValue) {
      this.isLoading = false;
    }
  }
}
