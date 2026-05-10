import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';
import { Navbar } from '../../../home-component/navbar/navbar';
import { FooterP1 } from '../../../home-component/footer-p1/footer-p1';
import { ProyectoPublMain } from '../proyecto-publ-main/proyecto-publ-main';
import { ProyectoPublProcesos } from '../proyecto-publ-procesos/proyecto-publ-procesos';

@Component({
  selector: 'app-proyecto-publ-detalle',
  imports: [CommonModule, Navbar, FooterP1, ProyectoPublMain, ProyectoPublProcesos],
  templateUrl: './proyecto-publ-detalle.html',
  styleUrl: './proyecto-publ-detalle.css'
})
export class ProyectoPublDetalle implements OnInit, OnDestroy {
  proyecto?: ProyectoAdmin;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoAdminService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params.get('slug')!;
        return this.proyectoService.obtenerPorSlug(slug);
      })
    ).subscribe(data => {
      this.proyecto = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
