import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { Panel } from '../panel/panel';

@Component({
  selector: 'app-administracion',
  imports: [
    Panel,
    RouterOutlet
  ],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css'
})
export class Administracion {
  sidebarAbierto = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() { this.sidebarAbierto = !this.sidebarAbierto; }
  cerrarSidebar() { this.sidebarAbierto = false; }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
