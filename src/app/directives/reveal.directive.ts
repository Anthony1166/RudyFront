import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Fracción del elemento visible para disparar la animación (0–1). */
  @Input() revealThreshold = 0.15;
  /** Delay opcional en segundos (útil para stagger manual). */
  @Input() revealDelay = 0;

  private host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.host.nativeElement;
    el.classList.add('reveal');
    if (this.revealDelay) {
      el.style.animationDelay = `${this.revealDelay}s`;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          this.observer?.disconnect();
        }
      },
      { threshold: this.revealThreshold }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
