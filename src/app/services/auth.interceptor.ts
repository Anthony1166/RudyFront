import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Solo añadimos el token si existe, NO está expirado,
    // y la petición NO es para login/register.
    const tokenValido = token && !this.estaExpirado(token);

    if (tokenValido && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => this.manejarError(error))
      );
    }

    // Si el token está expirado, limpiamos la sesión silenciosamente
    if (token && this.estaExpirado(token)) {
      this.authService.logout();
    }

    // Peticiones sin token (públicas, login, register)
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.manejarError(error))
    );
  }

  /**
   * Lee la fecha de expiración del JWT sin librerías externas.
   * Retorna true si el token ya expiró.
   */
  private estaExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // payload.exp está en segundos, Date.now() en milisegundos
      return payload.exp * 1000 < Date.now();
    } catch {
      // Si el token está malformado, lo tratamos como expirado
      return true;
    }
  }

  /**
   * Maneja errores globales de HTTP:
   * - 401 Unauthorized: sesión expirada → logout automático
   * - 403 Forbidden: sin permisos → redirige al login
   */
  private manejarError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401 || error.status === 403) {
      console.warn('[AuthInterceptor] Token inválido o expirado. Cerrando sesión...');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }
}
