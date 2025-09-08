import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private url: string= environment.apiUrl
  private http:HttpClient=inject(HttpClient)
  constructor() { }
}
