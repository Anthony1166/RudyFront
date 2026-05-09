import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);

  // Asumiendo que environment.apiUrl es 'http://localhost:8080/sami'
  private API_URL = environment.apiUrl;

  // 1. La ventanilla para subir fotos
  subirImagen(archivo: File): Observable<{ url: string }> {
    const formData = new FormData();
    // 'file' coincide exactamente con tu @RequestParam("file")
    formData.append('file', archivo);

    return this.http.post<{ url: string }>(`${this.API_URL}/archivos/subir`, formData);
  }

  // 2. La ventanilla para borrar fotos (Por si Sami se arrepiente)
  borrarImagen(urlImagen: string): Observable<void> {
    // Usamos HttpParams porque tu Spring Boot lo espera con @RequestParam("url")
    const params = new HttpParams().set('url', urlImagen);

    return this.http.delete<void>(`${this.API_URL}/archivos/borrar`, { params });
  }
}
