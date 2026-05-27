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

  @Output() guardar = new EventEmitter<AjusteImagen>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChild('lienzo', { static: false }) lienzo?: ElementRef<HTMLDivElement>;

  trabajo: AjusteImagen = { ...AJUSTE_DEFAULT };
  arrastrando = false;

  ngOnInit(): void {
    // Inicializamos UNA SOLA VEZ con los valores recibidos. El padre puede
    // pasar un objeto nuevo en cada change detection (vía función) y eso no
    // debe pisar los cambios locales del usuario.
    this.trabajo = { ...AJUSTE_DEFAULT, ...(this.ajuste || {}) };
  }

  onLienzoMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.arrastrando = true;
    this.actualizarDesdeEvento(event.clientX, event.clientY);
  }

  onLienzoTouchStart(event: TouchEvent): void {
    if (event.touches.length === 0) return;
    this.arrastrando = true;
    const t = event.touches[0];
    this.actualizarDesdeEvento(t.clientX, t.clientY);
  }

  @HostListener('document:mousemove', ['$event'])
  onDocMouseMove(event: MouseEvent): void {
    if (!this.arrastrando) return;
    this.actualizarDesdeEvento(event.clientX, event.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onDocTouchMove(event: TouchEvent): void {
    if (!this.arrastrando || event.touches.length === 0) return;
    const t = event.touches[0];
    this.actualizarDesdeEvento(t.clientX, t.clientY);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onDocFinArrastre(): void {
    this.arrastrando = false;
  }

  private actualizarDesdeEvento(clientX: number, clientY: number): void {
    const el = this.lienzo?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    this.trabajo.posX = Math.max(0, Math.min(100, +x.toFixed(2)));
    this.trabajo.posY = Math.max(0, Math.min(100, +y.toFixed(2)));
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
    this.trabajo = { ...AJUSTE_DEFAULT };
  }

  onGuardar(): void {
    this.guardar.emit({ ...this.trabajo });
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  get estiloImagenLienzo(): { [k: string]: string | number } {
    const t = this.trabajo;
    return {
      'object-position': `${t.posX}% ${t.posY}%`,
      'transform': `rotate(${t.rotacion}deg) scale(${t.escala}) scaleX(${t.volteoH ? -1 : 1}) scaleY(${t.volteoV ? -1 : 1})`,
      'transform-origin': `${t.posX}% ${t.posY}%`,
    };
  }

  estiloPreview(aspecto: PreviewAspecto): { [k: string]: string | number } {
    return this.estiloImagenLienzo;
  }
}
