import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Proyecto} from '../model/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() { }

  // GET /sami/proyectos
  listar(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.API_URL}/proyectos`);
  }

  // POST /sami/proyecto
  registrar(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.API_URL}/proyecto`, proyecto);
  }

  // PUT /sami/proyecto/{id}
  actualizar(id: number, proyecto: Proyecto): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.API_URL}/proyecto/${id}`, proyecto);
  }

  // DELETE /sami/proyecto/{id}
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/proyecto/${id}`);
  }

  // GET /sami/proyecto/{id}
  buscarPorId(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.API_URL}/proyecto/${id}`);
  }

  // GET /sami/proyectoByCat/{categoriaId}
  filtrarPorCategoria(categoriaId: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.API_URL}/proyectoByCat/${categoriaId}`);
  }

  // GET /sami/proyectosAnio/{anio}
  filtrarPorAnio(anio: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.API_URL}/proyectosAnio/${anio}`);
  }
}
