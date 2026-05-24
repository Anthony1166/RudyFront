import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  tipo: 'exito' | 'error' | 'info';
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  readonly toasts = this.toasts$.asObservable();

  exito(mensaje: string): void { this.agregar('exito', mensaje); }
  error(mensaje: string): void { this.agregar('error', mensaje); }
  info(mensaje: string): void { this.agregar('info', mensaje); }

  quitar(id: number): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }

  private agregar(tipo: Toast['tipo'], mensaje: string): void {
    const id = Date.now();
    this.toasts$.next([...this.toasts$.value, { id, tipo, mensaje }]);
    setTimeout(() => this.quitar(id), 4000);
  }
}
