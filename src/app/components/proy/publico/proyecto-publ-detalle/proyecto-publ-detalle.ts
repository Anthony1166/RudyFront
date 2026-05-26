import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { ProyectoAdmin } from '../../../../model/proy/proyecto';
import { ProyectoAdminService } from '../../../../services/proy/proyecto-admin.service';
import { NavbarProd } from '../../../home-component/Desarrollo-comp-prod/navbar-prod/navbar-prod';
import { FooterP1 } from '../../../home-component/footer-p1/footer-p1';
import { ProyectoPublMain } from '../proyecto-publ-main/proyecto-publ-main';
import { ProyectoPublProcesos } from '../proyecto-publ-procesos/proyecto-publ-procesos';

@Component({
  selector: 'app-proyecto-publ-detalle',
  imports: [CommonModule, NavbarProd, FooterP1, ProyectoPublMain, ProyectoPublProcesos],
  templateUrl: './proyecto-publ-detalle.html',
  styleUrl: './proyecto-publ-detalle.css'
})
export class ProyectoPublDetalle implements OnInit, OnDestroy {
  proyecto?: ProyectoAdmin;
  isLoading = true;
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
        this.isLoading = true;
        this.proyecto = undefined;
        const slug = params.get('slug')!;
        return this.proyectoService.obtenerPorSlug(slug).pipe(
          catchError(() => of(undefined))
        );
      })
    ).subscribe(data => {
      this.proyecto = data;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
