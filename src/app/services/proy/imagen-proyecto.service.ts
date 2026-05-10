import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagenProyecto } from '../../model/proy/imagen-proyecto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagenProyectoService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  listarPorProyecto(proyectoId: number): Observable<ImagenProyecto[]> {
    return this.http.get<ImagenProyecto[]>(`${this.API_URL}/proyecto/${proyectoId}/imagenes`);
  }

  agregarImagen(proyectoId: number, imagen: ImagenProyecto): Observable<ImagenProyecto> {
    return this.http.post<ImagenProyecto>(`${this.API_URL}/proyecto/${proyectoId}/imagen`, imagen);
  }

  actualizarImagen(id: number, imagen: ImagenProyecto): Observable<ImagenProyecto> {
    return this.http.put<ImagenProyecto>(`${this.API_URL}/imagen-proyecto/${id}`, imagen);
  }

  eliminarImagen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/imagen-proyecto/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/imagenes-proyecto/reordenar`, idsOrdenados);
  }
}
