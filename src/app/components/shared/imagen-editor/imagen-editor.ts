import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AjusteImagen {
  posX: number;
  posY: number;
  escala: number;
  rotacion: number;
  volteoH: boolean;
  volteoV: boolean;
}

export const AJUSTE_DEFAULT: AjusteImagen = {
  posX: 50,
  posY: 50,
  escala: 1,
  rotacion: 0,
  volteoH: false,
  volteoV: false,
};

interface PreviewAspecto {
  ratio: number;
  etiqueta: string;
}

@Component({
  selector: 'app-imagen-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imagen-editor.html',
  styleUrl: './imagen-editor.css',
})
export class ImagenEditor implements OnInit {
  @Input() urlImagen!: string;
  @Input() ajuste: AjusteImagen = { ...AJUSTE_DEFAULT };
  @Input() aspectos: PreviewAspecto[] = [
    { ratio: 20.5 / 16.5, etiqueta: 'Card' },
    { ratio: 4 / 3, etiqueta: 'Mini' },
    { ratio: 48 / 28.1875, etiqueta: 'Hero' },
  ];
  // Si se pasa, la vista previa muestra la imagen recortada con esta forma
  // (clipPath SVG presente en el DOM) en lugar de los recortes rectangulares.
  @Input() formaClipId?: string;
  @Input() formaEtiqueta = 'En el sitio';

  @Output() guardar = new EventEmitter<AjusteImagen>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChild('lienzo', { static: false }) lienzo?: ElementRef<HTMLDivElement>;

  trabajo: AjusteImagen = { ...AJUSTE_DEFAULT };
  arrastrando = false;

  // Estado del arrastre tipo "pan" (mover la imagen dentro del marco)
  private rectArrastre?: DOMRect;
  private inicioX = 0;
  private inicioY = 0;
  private posXInicial = 50;
  private posYInicial = 50;

  ngOnInit(): void {
    // Inicializamos UNA SOLA VEZ con los valores recibidos. El padre puede
    // pasar un objeto nuevo en cada change detection (vía función) y eso no
    // debe pisar los cambios locales del usuario.
    this.trabajo = { ...AJUSTE_DEFAULT, ...(this.ajuste || {}) };
  }

  // Funciona tanto en el lienzo como en la vista previa: usamos el elemento
  // donde empieza el arrastre (currentTarget) para medir el desplazamiento.
  onLienzoMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.iniciarArrastre(event.clientX, event.clientY, event.currentTarget as HTMLElement);
  }

  onLienzoTouchStart(event: TouchEvent): void {
    if (event.touches.length === 0) return;
    const t = event.touches[0];
    this.iniciarArrastre(t.clientX, t.clientY, event.currentTarget as HTMLElement);
  }

  private iniciarArrastre(clientX: number, clientY: number, target: HTMLElement): void {
    this.arrastrando = true;
    this.rectArrastre = target.getBoundingClientRect();
    this.inicioX = clientX;
    this.inicioY = clientY;
    this.posXInicial = this.trabajo.posX;
    this.posYInicial = this.trabajo.posY;
  }

  @HostListener('document:mousemove', ['$event'])
  onDocMouseMove(event: MouseEvent): void {
    if (!this.arrastrando) return;
    this.panDesdeEvento(event.clientX, event.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onDocTouchMove(event: TouchEvent): void {
    if (!this.arrastrando || event.touches.length === 0) return;
    const t = event.touches[0];
    this.panDesdeEvento(t.clientX, t.clientY);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDocFinArrastre(): void {
    this.arrastrando = false;
  }

  /** Mueve la imagen siguiendo el cursor 1:1 (la imagen "sigue" tu dedo). */
  private panDesdeEvento(clientX: number, clientY: number): void {
    const rect = this.rectArrastre;
    if (!rect) return;
    const dx = clientX - this.inicioX;
    const dy = clientY - this.inicioY;
    if (this.formaClipId) {
      // Modo cropper: translate en % del marco, sin invertir ni depender del zoom.
      this.trabajo.posX = this.clampRango(this.posXInicial + (dx / rect.width) * 100, -120, 120);
      this.trabajo.posY = this.clampRango(this.posYInicial + (dy / rect.height) * 100, -120, 120);
    } else {
      // Modo focal (productos): punto focal object-position, afinado con el zoom.
      const factor = 100 / this.trabajo.escala;
      this.trabajo.posX = this.clampRango(this.posXInicial + (dx / rect.width) * factor, 0, 100);
      this.trabajo.posY = this.clampRango(this.posYInicial + (dy / rect.height) * factor, 0, 100);
    }
  }

  private clampRango(valor: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, +valor.toFixed(2)));
  }

  setRotacion(grados: number): void {
    this.trabajo.rotacion = grados;
  }

  toggleVolteoH(): void {
    this.trabajo.volteoH = !this.trabajo.volteoH;
  }

  toggleVolteoV(): void {
    this.trabajo.volteoV = !this.trabajo.volteoV;
  }

  restaurar(): void {
    // En modo cropper el centro es 0 (translate); en modo focal es 50 (object-position).
    const centro = this.formaClipId ? 0 : 50;
    this.trabajo = { ...AJUSTE_DEFAULT, posX: centro, posY: centro };
  }

  onGuardar(): void {
    this.guardar.emit({ ...this.trabajo });
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  get estiloImagenLienzo(): { [k: string]: string | number } {
    const t = this.trabajo;
    const flip = `scaleX(${t.volteoH ? -1 : 1}) scaleY(${t.volteoV ? -1 : 1})`;
    if (this.formaClipId) {
      // Modo cropper: pan (translate) + zoom/rotación SIEMPRE sobre el centro,
      // así girar no descentra y el arrastre no se invierte al rotar.
      return {
        'object-position': 'center',
        'transform': `translate(${t.posX}%, ${t.posY}%) rotate(${t.rotacion}deg) scale(${t.escala}) ${flip}`,
        'transform-origin': 'center center',
      };
    }
    // Modo focal (productos): punto focal vía object-position.
    return {
      'object-position': `${t.posX}% ${t.posY}%`,
      'transform': `rotate(${t.rotacion}deg) scale(${t.escala}) ${flip}`,
      'transform-origin': `${t.posX}% ${t.posY}%`,
    };
  }

  estiloPreview(aspecto: PreviewAspecto): { [k: string]: string | number } {
    return this.estiloImagenLienzo;
  }
}
