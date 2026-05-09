import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-panel',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel {
  @Output() navegar = new EventEmitter<void>();

  alNavegar() { this.navegar.emit(); }
}
