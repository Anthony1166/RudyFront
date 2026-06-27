import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PerfilSobreMi } from '../model/perfil-sobre-mi';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // --- PÚBLICO ---
  obtener(): Observable<PerfilSobreMi> {
    return this.http.get<PerfilSobreMi>(`${this.API_URL}/perfil-sobre-mi`);
  }

  // --- PRIVADO (Panel de Admin) ---
  actualizar(dto: PerfilSobreMi): Observable<PerfilSobreMi> {
    return this.http.put<PerfilSobreMi>(`${this.API_URL}/perfil-sobre-mi`, dto);
  }
}
