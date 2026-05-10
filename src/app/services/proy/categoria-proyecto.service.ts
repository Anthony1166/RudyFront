import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaProyecto } from '../../model/proy/categoria-proyecto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaProyectoService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  listarPublicas(): Observable<CategoriaProyecto[]> {
    return this.http.get<CategoriaProyecto[]>(`${this.API_URL}/categorias-proy/publicas`);
  }

  listarTodas(): Observable<CategoriaProyecto[]> {
    return this.http.get<CategoriaProyecto[]>(`${this.API_URL}/categorias-proy`);
  }

  crearCategoria(categoria: CategoriaProyecto): Observable<CategoriaProyecto> {
    return this.http.post<CategoriaProyecto>(`${this.API_URL}/categoria-proy`, categoria);
  }

  actualizarCategoria(id: number, categoria: CategoriaProyecto): Observable<CategoriaProyecto> {
    return this.http.put<CategoriaProyecto>(`${this.API_URL}/categoria-proy/${id}`, categoria);
  }

  apagarCategoria(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/categoria-proy/${id}/apagar`, {});
  }

  eliminarFisico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/categoria-proy/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/categorias-proy/reordenar`, idsOrdenados);
  }
}
