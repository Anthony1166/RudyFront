import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoginUser} from '../model/login-user';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {JwtAuthResponse} from '../model/jwt-auth-response';
import {User} from '../model/user';
import {RegisterUser} from '../model/register-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`; // Apunta a /sami/auth
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  private http = inject(HttpClient);

  // Estado reactivo del usuario
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  login(loginData: LoginUser): Observable<JwtAuthResponse> {
    return this.http.post<JwtAuthResponse>(`${this.API_URL}/login`, loginData).pipe(
      tap(response => {
        this.saveToken(response.token);
        // Creamos un objeto User básico con la respuesta
        const user: User = {
          username: response.username,
          // SOLUCIÓN: Guardamos el rol que viene en la respuesta del login
          role: { name: response.role }
        } as User;

        this.saveUserToStorage(user);
        this.currentUserSubject.next(user);
      })
    );
  }

  register(registerData: RegisterUser): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerData, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // payload.exp en segundos, Date.now() en milisegundos
      return payload.exp * 1000 > Date.now();
    } catch {
      return false; // Token malformado
    }
  }

  // Métodos privados de ayuda
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
