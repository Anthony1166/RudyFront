import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProcesoDiseno } from '../model/proceso-diseno';

@Injectable({
  providedIn: 'root'
})
export class ProcesoDisenoService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);

  // GET /sami/proceso-diseno/{proyectoId}
  getProcesosByProyectoId(proyectoId: number): Observable<ProcesoDiseno[]> {
    return this.http.get<ProcesoDiseno[]>(`${this.API_URL}/proceso-diseno/${proyectoId}`);
  }

  // POST /sami/proceso-diseno/{proyectoId}
  createProceso(
    proyectoId: number,
    tituloFase: string,
    descripcion: string,
    orden: number,
    imagen?: File
  ): Observable<ProcesoDiseno> {
    const formData = new FormData();
    formData.append('titulo_fase', tituloFase);
    formData.append('descripcion', descripcion);
    formData.append('orden', orden.toString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.post<ProcesoDiseno>(`${this.API_URL}/proceso-diseno/${proyectoId}`, formData);
  }

  // PUT /sami/proceso-diseno/{procesoId}
  updateProceso(
    procesoId: number,
    tituloFase: string,
    descripcion: string,
    orden: number,
    imagen?: File
  ): Observable<ProcesoDiseno> {
    const formData = new FormData();
    formData.append('titulo_fase', tituloFase);
    formData.append('descripcion', descripcion);
    formData.append('orden', orden.toString());
    if (imagen) {
      formData.append('imagen', imagen);
    }

    return this.http.put<ProcesoDiseno>(`${this.API_URL}/proceso-diseno/${procesoId}`, formData);
  }

  // DELETE /sami/proceso-diseno/{procesoId}
  deleteProceso(procesoId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/proceso-diseno/${procesoId}`);
  }
}
