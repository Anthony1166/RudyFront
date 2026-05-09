import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CategoriaProducto} from '../../model/prod/categoria-producto';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {
  // Asegúrate de que esta sea la URL de tu backend en Spring Boot
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() { }

  // --- PÚBLICO ---
  listarPublicas(): Observable<CategoriaProducto[]> {
    return this.http.get<CategoriaProducto[]>(`${this.API_URL}/categorias-prod/publicas`);
  }

  // --- PRIVADO (Panel de Admin) ---
  listarTodas(): Observable<CategoriaProducto[]> {
    return this.http.get<CategoriaProducto[]>(`${this.API_URL}/categorias-prod`);
  }

  crearCategoria(categoria: CategoriaProducto): Observable<CategoriaProducto> {
    return this.http.post<CategoriaProducto>(`${this.API_URL}/categoria-prod`, categoria);
  }

  obtenerCategoriaPorId(id: number): Observable<CategoriaProducto> {
    return this.http.get<CategoriaProducto>(`${this.API_URL}/categorias-prod/${id}`);
  }
  actualizarCategoria(id: number, categoria: CategoriaProducto): Observable<CategoriaProducto> {
    return this.http.put<CategoriaProducto>(`${this.API_URL}/categoria-prod/${id}`, categoria);
  }

  apagarCategoria(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/categoria-prod/${id}/apagar`, {});
  }

  eliminarFisico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/categoria-prod/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/categorias-prod/reordenar`, idsOrdenados);
  }
}
