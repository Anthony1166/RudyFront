import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Imagen } from '../model/imagen';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() { }

  // POST /sami/imagen - ¡Este es especial!
  subirImagen(file: File, descripcion: string, idProyecto: number): Observable<Imagen> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('descripcion', descripcion);
    formData.append('idProyecto', idProyecto.toString());

    // No se necesita 'Content-Type' en los headers, el navegador lo pone automáticamente con el boundary correcto para multipart/form-data
    return this.http.post<Imagen>(`${this.API_URL}/imagen`, formData);
  }

  // GET /sami/imagenes
  listarTodas(): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${this.API_URL}/imagenes`);
  }

  // GET /sami/proyectoimg/{proyectoId}
  listarPorProyecto(proyectoId: number): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${this.API_URL}/proyectoimg/${proyectoId}`);
  }

  // DELETE /sami/imagen/{id}
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/imagen/${id}`);
  }

  // PUT /sami/imagen/{id}
  actualizar(id: number, descripcion: string): Observable<Imagen> {
    // El backend solo actualiza la descripción, así que enviamos un objeto simple
    return this.http.put<Imagen>(`${this.API_URL}/imagen/${id}`, { descripcion });
  }

  // GET /sami/imagen/{id}
  buscarPorId(id: number): Observable<Imagen> {
    return this.http.get<Imagen>(`${this.API_URL}/imagen/${id}`);
  }
}
