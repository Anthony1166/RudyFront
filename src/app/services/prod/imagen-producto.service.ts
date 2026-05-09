import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ImagenProducto} from '../../model/prod/imagen-producto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenProductoService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  listarPorProducto(productoId: number): Observable<ImagenProducto[]> {
    return this.http.get<ImagenProducto[]>(`${this.API_URL}/producto/${productoId}/imagenes`);
  }

  agregarImagen(productoId: number, imagen: ImagenProducto): Observable<ImagenProducto> {
    return this.http.post<ImagenProducto>(`${this.API_URL}/producto/${productoId}/imagen`, imagen);
  }

  actualizarImagen(id: number, imagen: ImagenProducto): Observable<ImagenProducto> {
    return this.http.put<ImagenProducto>(`${this.API_URL}/imagen-producto/${id}`, imagen);
  }

  eliminarImagen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/imagen-producto/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/imagenes-producto/reordenar`, idsOrdenados);
  }
}
