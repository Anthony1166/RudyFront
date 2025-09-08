import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoginUser} from '../model/login-user';
import {Observable} from 'rxjs';
import {JwtAuthResponse} from '../model/jwt-auth-response';
import {User} from '../model/user';
import {RegisterUser} from '../model/register-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string= environment.apiUrl;

  private http:HttpClient=inject(HttpClient)
  constructor() {}

  login(loginData: LoginUser): Observable<JwtAuthResponse> {
    return this.http.post<JwtAuthResponse>(`${this.url}/auth/login`, loginData);
  }

  register(registerData: RegisterUser): Observable<User> {
    return this.http.post<User>(`${this.url}/auth/register`, registerData);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  saveCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
