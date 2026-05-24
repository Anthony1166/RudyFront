import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  constructor() {
    this.toastService.toasts.subscribe(t => this.toasts = t);
  }

  quitar(id: number): void {
    this.toastService.quitar(id);
  }
}
