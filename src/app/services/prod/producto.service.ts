import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Producto} from '../../model/prod/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // ==========================================
  // --- PÚBLICO (Para la tienda de clientes) ---
  // ==========================================

  listarActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/productos`);
  }

  listarNuevos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/productos/nuevos`);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/producto/${id}`);
  }

  obtenerPorSlug(slug: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.API_URL}/producto/slug/${slug}`);
  }

  listarPorCategoria(categoriaSlug: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/productos/categoria/${categoriaSlug}`);
  }

  buscarProductos(termino: string = ''): Observable<Producto[]> {
    const params = new HttpParams().set('termino', termino);
    return this.http.get<Producto[]>(`${this.API_URL}/productos/buscar`, { params });
  }

  // ==========================================
  // --- PRIVADO (Para el Panel de Admin Sami) ---
  // ==========================================

  listarTodosAdmin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/admin/productos`);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.API_URL}/producto`, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.API_URL}/producto/${id}`, producto);
  }

  apagarProducto(id: number): Observable<void> {
    // Usamos PUT al endpoint de apagar
    return this.http.put<void>(`${this.API_URL}/producto/${id}/apagar`, {});
  }

  eliminarFisico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/producto/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/productos/reordenar`, idsOrdenados);
  }
  listarPorCategoriaAdmin(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API_URL}/admin/productos/categoria/${categoriaId}`);
  }
}
