import { Component } from '@angular/core';
import {FooterPrincipal} from "../footer-principal/footer-principal";
import {ProyectoGrid} from '../proyecto-grid/proyecto-grid';
import {FooterP1} from '../footer-p1/footer-p1';

@Component({
  selector: 'app-pag-perfil',
  imports: [
    ProyectoGrid,
    FooterP1
  ],
  templateUrl: './pag-perfil.html',
  styleUrl: './pag-perfil.css'
})
export class PagPerfil {

}
