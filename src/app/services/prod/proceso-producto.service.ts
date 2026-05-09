import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProcesoProducto} from '../../model/prod/proceso-producto';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesoProductoService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  listarPorProducto(productoId: number): Observable<ProcesoProducto[]> {
    return this.http.get<ProcesoProducto[]>(`${this.API_URL}/producto/${productoId}/procesos`);
  }

  agregarProceso(productoId: number, proceso: ProcesoProducto): Observable<ProcesoProducto> {
    return this.http.post<ProcesoProducto>(`${this.API_URL}/producto/${productoId}/proceso`, proceso);
  }

  actualizarProceso(id: number, proceso: ProcesoProducto): Observable<ProcesoProducto> {
    return this.http.put<ProcesoProducto>(`${this.API_URL}/proceso-producto/${id}`, proceso);
  }

  eliminarProceso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/proceso-producto/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/procesos-producto/reordenar`, idsOrdenados);
  }
}
