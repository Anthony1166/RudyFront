import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // environment.apiUrl ya es ".../sami", así que solo agregamos el resto
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() { }

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.API_URL}/categorias`);
  }

  registrar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.API_URL}/categoria`, categoria);
  }

  actualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API_URL}/categoria/${id}`, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/categoria/${id}`);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API_URL}/categoria/${id}`);
  }
}
