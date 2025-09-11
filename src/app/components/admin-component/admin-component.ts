import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginUser } from '../../model/login-user';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-component',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css'
})
export class AdminComponent {
  loginData: LoginUser = {
    username: '',
    password: ''
  };
  errorMsg: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMsg = 'Por favor, completa todos los campos.';
      return;
    }
    this.authService.login(this.loginData).subscribe({
      next: (resp) => {
        this.authService.saveToken(resp.token);
        // Puedes guardar el usuario si lo deseas:
        // this.authService.saveCurrentUser({username: resp.username, role: resp.role});
        this.errorMsg = '';
        this.router.navigate(['/administracion']);
      },
      error: () => {
        this.errorMsg = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
