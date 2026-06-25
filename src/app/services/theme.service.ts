import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ConfiguracionColor } from '../model/configuracion-color';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // ==========================================
  // --- PÚBLICO ---
  // ==========================================

  /**
   * Carga los colores desde el backend y los aplica como variables CSS en :root.
   * Se invoca al arrancar la app (ver app.config.ts) para que el sitio público
   * salga ya con los colores guardados.
   */
  cargarColores(): Observable<ConfiguracionColor[]> {
    return this.listar().pipe(
      tap(configs => configs.forEach(c => this.aplicarUno(c.clave, c.colorTop, c.colorBottom)))
    );
  }

  listar(): Observable<ConfiguracionColor[]> {
    return this.http.get<ConfiguracionColor[]>(`${this.API_URL}/configuracion-colores`);
  }

  /** Escribe las variables CSS de un componente en el :root del documento. */
  aplicarUno(clave: string, top: string, bottom: string): void {
    const root = document.documentElement;
    root.style.setProperty(`--bg-${clave}-top`, top);
    root.style.setProperty(`--bg-${clave}-bottom`, bottom);
  }

  // ==========================================
  // --- PRIVADO (Panel de Admin) ---
  // ==========================================

  actualizar(clave: string, dto: ConfiguracionColor): Observable<ConfiguracionColor> {
    return this.http.put<ConfiguracionColor>(`${this.API_URL}/configuracion-colores/${clave}`, dto);
  }

  restaurarDefault(clave: string): Observable<ConfiguracionColor> {
    return this.http.put<ConfiguracionColor>(`${this.API_URL}/configuracion-colores/${clave}/restaurar`, {});
  }
}
