import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

export interface AjusteImagenInput {
  posX?: number | null;
  posY?: number | null;
  escala?: number | null;
  rotacion?: number | null;
  volteoH?: boolean | null;
  volteoV?: boolean | null;
}

/**
 * Aplica los ajustes de imagen (punto focal + zoom + rotar/voltear) sobre
 * un <img>. Expone los valores como CSS custom properties y aplica el
 * object-position directamente.
 *
 * Variables emitidas (sobre el elemento):
 *   --ai-pos-x / --ai-pos-y : punto focal (con unidad %)
 *   --ai-scl                : factor de zoom
 *   --ai-rot                : rotación (con unidad deg)
 *   --ai-vh / --ai-vv       : volteos (-1 o 1)
 *
 * El CSS del componente debe aplicar el transform combinando esas
 * variables, por ejemplo:
 *   transform: rotate(var(--ai-rot, 0deg))
 *              scale(var(--ai-scl, 1))
 *              scaleX(var(--ai-vh, 1))
 *              scaleY(var(--ai-vv, 1));
 *
 * Así los hovers del propio componente pueden combinarse con los
 * ajustes (cambiando solo la variable de scale, por ejemplo).
 */
@Directive({
  selector: '[appAjusteImagen]',
  standalone: true,
})
export class AjusteImagenDirective implements OnChanges {
  @Input('appAjusteImagen') ajuste: AjusteImagenInput | null | undefined;

  private host = inject(ElementRef<HTMLElement>);

  ngOnChanges(): void {
    const a = this.ajuste ?? {};
    const el = this.host.nativeElement;
    const px = a.posX ?? 50;
    const py = a.posY ?? 50;
    const scl = a.escala ?? 1;
    const rot = a.rotacion ?? 0;
    const vh = a.volteoH ? -1 : 1;
    const vv = a.volteoV ? -1 : 1;

    el.style.setProperty('--ai-pos-x', `${px}%`);
    el.style.setProperty('--ai-pos-y', `${py}%`);
    el.style.setProperty('--ai-scl', `${scl}`);
    el.style.setProperty('--ai-rot', `${rot}deg`);
    el.style.setProperty('--ai-vh', `${vh}`);
    el.style.setProperty('--ai-vv', `${vv}`);

    el.style.objectPosition = `${px}% ${py}%`;
    el.style.transformOrigin = `${px}% ${py}%`;
  }
}
