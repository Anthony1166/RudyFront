import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection, inject } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { ThemeService } from './services/theme.service';
import { catchError, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Carga los colores de fondo desde el backend antes del primer render.
    // Si la API falla, los fallbacks de cada CSS mantienen los colores por defecto.
    provideAppInitializer(() => inject(ThemeService).cargarColores().pipe(catchError(() => of([]))))
  ]
};
