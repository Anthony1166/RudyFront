import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../directives/reveal.directive';
import { PerfilService } from '../../../services/perfil.service';
import { PerfilSobreMi } from '../../../model/perfil-sobre-mi';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, RevealDirective],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  private perfilService = inject(PerfilService);

  // Valores por defecto: se muestran mientras llega la respuesta del backend
  // y sirven de fallback si la API falla.
  perfil: PerfilSobreMi = {
    titulo: '¡HOLA! SOY SAMI',
    descripcion: 'Estudiante de Diseño Industrial (9.º ciclo en la PUCP) enfocada en el desarrollo de productos funcionales y accesibles. Trabajo desde el prototipado y la manufactura, entendiendo el diseño como un proceso de prueba, error y ajuste continuo con una mirada centrada en el usuario.',
    urlImagen: '/assets/estrellitaSami.png',
    subtituloAreas: 'ÁREAS DE INTERÉS',
    areas: ['Diseño de productos', 'Manufactura en madera', 'Manufactura en plásticos', 'Educación infantil'],
    areasModo: 'texto',
    subtituloIdiomas: 'IDIOMAS',
    idiomas: ['Inglés B2', 'Francés A2'],
    idiomasModo: 'lista',
  };

  ngOnInit(): void {
    this.perfilService.obtener().subscribe({
      next: (data) => this.perfil = data,
      error: () => { /* mantiene los valores por defecto */ }
    });
  }

  /** Encuadre de la foto: pan (translate) + zoom/rotar/voltear sobre el centro.
   *  Misma fórmula que el editor (modo cropper). */
  estiloImg(): { [k: string]: string } {
    const p = this.perfil;
    const vh = p.imgVolteoH ? -1 : 1, vv = p.imgVolteoV ? -1 : 1;
    return {
      'object-position': 'center',
      'transform': `translate(${p.imgPosX ?? 0}%, ${p.imgPosY ?? 0}%) rotate(${p.imgRotacion ?? 0}deg) scale(${p.imgEscala ?? 1}) scaleX(${vh}) scaleY(${vv})`,
      'transform-origin': 'center center',
    };
  }
}
