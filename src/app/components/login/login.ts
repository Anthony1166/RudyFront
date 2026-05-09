import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {LoginUser} from '../../model/login-user';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
    imports: [
        FormsModule,
        NgIf
    ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData: LoginUser = { username: '', password: '' };
  error: string = '';
  isLoading: boolean = false; // Variable para controlar la carga

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true; // Activar carga
    this.error = ''; // Limpiar errores previos

    this.authService.login(this.loginData).subscribe({
      next: () => {
        // No ponemos isLoading = false aquí para que el spinner siga
        // hasta que la navegación termine y cambie de página.
        this.router.navigate(['/administracion']);
      },
      error: () => {
        this.isLoading = false; // Desactivar carga si falla
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
