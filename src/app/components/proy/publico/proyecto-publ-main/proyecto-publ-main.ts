import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';

@Component({
  selector: 'app-proyecto-publ-main',
  imports: [CommonModule],
  templateUrl: './proyecto-publ-main.html',
  styleUrl: './proyecto-publ-main.css'
})
export class ProyectoPublMain {
  @Input() proyectoRecibido?: ProyectoAdmin;
  @Input() isLoading = true;
}
