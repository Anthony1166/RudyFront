import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../../services/perfil.service';
import { ToastService } from '../../../services/toast.service';
import { UploadService } from '../../../services/upload-service';
import { PerfilSobreMi } from '../../../model/perfil-sobre-mi';
import { AjusteImagen, ImagenEditor } from '../../shared/imagen-editor/imagen-editor';

@Component({
  selector: 'app-editar-perfil',
  imports: [CommonModule, FormsModule, ImagenEditor],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css'
})
export class EditarPerfil implements OnInit {
  perfil: PerfilSobreMi | null = null;
  cargando = true;
  guardando = false;
  subiendoImagen = false;
  mostrarEditor = false;

  private perfilService = inject(PerfilService);
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.perfilService.obtener().subscribe({
      next: (data) => { this.perfil = data; this.cargando = false; },
      error: () => { this.toast.error('No se pudo cargar el perfil'); this.cargando = false; }
    });
  }

  trackByIndex(i: number): number { return i; }

  // ── Áreas ──
  agregarArea(): void { this.perfil?.areas.push(''); }
  quitarArea(i: number): void { this.perfil?.areas.splice(i, 1); }

  // ── Idiomas ──
  agregarIdioma(): void { this.perfil?.idiomas.push(''); }
  quitarIdioma(i: number): void { this.perfil?.idiomas.splice(i, 1); }

  // ── Imagen ──
  alSeleccionarArchivo(event: Event): void {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo || !this.perfil) return;
    this.subiendoImagen = true;
    this.uploadService.subirImagen(archivo).subscribe({
      next: (r) => { this.perfil!.urlImagen = r.url; this.subiendoImagen = false; },
      error: () => { this.subiendoImagen = false; this.toast.error('Error al subir la imagen'); }
    });
  }

  abrirEditor(): void { if (this.perfil?.urlImagen) this.mostrarEditor = true; }
  cerrarEditor(): void { this.mostrarEditor = false; }

  ajusteActual(): AjusteImagen {
    return {
      // Centro = 0 en modo cropper (translate)
      posX: this.perfil?.imgPosX ?? 0,
      posY: this.perfil?.imgPosY ?? 0,
      escala: this.perfil?.imgEscala ?? 1,
      rotacion: this.perfil?.imgRotacion ?? 0,
      volteoH: this.perfil?.imgVolteoH ?? false,
      volteoV: this.perfil?.imgVolteoV ?? false,
    };
  }

  onGuardarAjuste(a: AjusteImagen): void {
    if (!this.perfil) return;
    this.perfil.imgPosX = a.posX;
    this.perfil.imgPosY = a.posY;
    this.perfil.imgEscala = a.escala;
    this.perfil.imgRotacion = a.rotacion;
    this.perfil.imgVolteoH = a.volteoH;
    this.perfil.imgVolteoV = a.volteoV;
    this.mostrarEditor = false;
  }

  /** Transform de la foto en el preview (misma fórmula cropper que el editor y el home). */
  estiloImg(): { [k: string]: string } {
    const p = this.perfil;
    if (!p) return {};
    const vh = p.imgVolteoH ? -1 : 1, vv = p.imgVolteoV ? -1 : 1;
    return {
      'object-position': 'center',
      'transform': `translate(${p.imgPosX ?? 0}%, ${p.imgPosY ?? 0}%) rotate(${p.imgRotacion ?? 0}deg) scale(${p.imgEscala ?? 1}) scaleX(${vh}) scaleY(${vv})`,
      'transform-origin': 'center center',
    };
  }

  // ── Guardar ──
  guardar(): void {
    if (!this.perfil) return;
    if (!this.perfil.titulo?.trim()) { this.toast.error('El título es obligatorio'); return; }

    this.guardando = true;
    const dto: PerfilSobreMi = {
      ...this.perfil,
      areas: this.perfil.areas.map(a => a.trim()).filter(a => a.length > 0),
      idiomas: this.perfil.idiomas.map(i => i.trim()).filter(i => i.length > 0),
    };

    this.perfilService.actualizar(dto).subscribe({
      next: (data) => { this.perfil = data; this.toast.exito('Sección "Sobre mí" actualizada'); this.guardando = false; },
      error: () => { this.toast.error('Error al guardar los cambios'); this.guardando = false; }
    });
  }
}
