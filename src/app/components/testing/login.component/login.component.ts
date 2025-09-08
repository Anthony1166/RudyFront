import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {LoginUser} from '../../../model/login-user';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {JwtAuthResponse} from '../../../model/jwt-auth-response';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login.component',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData: LoginUser = { username: '', password: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (res: JwtAuthResponse) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
