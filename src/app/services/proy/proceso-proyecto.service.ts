import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcesoProyecto } from '../../model/proy/proceso-proyecto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcesoProyectoService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  listarPorProyecto(proyectoId: number): Observable<ProcesoProyecto[]> {
    return this.http.get<ProcesoProyecto[]>(`${this.API_URL}/proyecto/${proyectoId}/procesos`);
  }

  agregarProceso(proyectoId: number, proceso: ProcesoProyecto): Observable<ProcesoProyecto> {
    return this.http.post<ProcesoProyecto>(`${this.API_URL}/proyecto/${proyectoId}/proceso`, proceso);
  }

  actualizarProceso(id: number, proceso: ProcesoProyecto): Observable<ProcesoProyecto> {
    return this.http.put<ProcesoProyecto>(`${this.API_URL}/proceso-proyecto/${id}`, proceso);
  }

  eliminarProceso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/proceso-proyecto/${id}`);
  }

  reordenarLote(idsOrdenados: number[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/procesos-proyecto/reordenar`, idsOrdenados);
  }
}
