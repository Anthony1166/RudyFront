import { Component } from '@angular/core';
import { FooterP1 } from '../footer-p1/footer-p1';
import { GaleriaProyectos } from '../../proy/publico/galeria-proyectos/galeria-proyectos';

@Component({
  selector: 'app-pag-perfil',
  imports: [GaleriaProyectos, FooterP1],
  templateUrl: './pag-perfil.html',
  styleUrl: './pag-perfil.css'
})
export class PagPerfil {}
