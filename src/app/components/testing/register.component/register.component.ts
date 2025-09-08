import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RegisterUser} from '../../../model/register-user';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register.component',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: RegisterUser = { username: '', password: '', email: '', phone: '' };
  success: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
      },
      error: () => {
        this.error = 'Error en el registro';
        this.success = false;
      }
    });
  }
}
