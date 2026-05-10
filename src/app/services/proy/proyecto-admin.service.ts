import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProyectoAdmin } from '../../model/proy/proyecto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProyectoAdminService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  // --- PÚBLICO ---
  listarActivos(): Observable<ProyectoAdmin[]> {
    return this.http.get<ProyectoAdmin[]>(`${this.API_URL}/proyectos`);
  }

  obtenerPorSlug(slug: string): Observable<ProyectoAdmin> {
    return this.http.get<ProyectoAdmin>(`${this.API_URL}/proyecto/slug/${slug}`);
  }

  buscarProyectos(termino: string): Observable<ProyectoAdmin[]> {
    const params = new HttpParams().set('termino', termino);
    return this.http.get<ProyectoAdmin[]>(`${this.API_URL}/proyectos/buscar`, { params });
  }

  // --- ADMIN ---
  listarTodosAdmin(): Observable<ProyectoAdmin[]> {
    return this.http.get<ProyectoAdmin[]>(`${this.API_URL}/admin/proyectos`);
  }

  listarPorCategoriaAdmin(categoriaId: number): Observable<ProyectoAdmin[]> {
    return this.http.get<ProyectoAdmin[]>(`${this.API_URL}/admin/proyectos/categoria/${categoriaId}`);
  }

  listarPorAnio(anio: number): Observable<ProyectoAdmin[]> {
    return this.http.get<ProyectoAdmin[]>(`${this.API_URL}/proyectos/anio/${anio}`);
  }

  obtenerPorId(id: number): Observable<ProyectoAdmin> {
    return this.http.get<ProyectoAdmin>(`${this.API_URL}/proyecto/${id}`);
  }

  crearProyecto(proyecto: ProyectoAdmin): Observable<ProyectoAdmin> {
    return this.http.post<ProyectoAdmin>(`${this.API_URL}/proyecto`, proyecto);
  }

  actualizarProyecto(id: number, proyecto: ProyectoAdmin): Observable<ProyectoAdmin> {
    return this.http.put<ProyectoAdmin>(`${this.API_URL}/proyecto/${id}`, proyecto);
  }

  apagarProyecto(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/proyecto/${id}/apagar`, {});
  }

  eliminarFisico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/proyecto/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/proyectos/reordenar`, idsOrdenados);
  }
}
