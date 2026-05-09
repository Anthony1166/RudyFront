import { Component, OnInit, OnDestroy } from '@angular/core';
import {FooterPrincipal} from "../footer-principal/footer-principal";
import {Navbar} from "../navbar/navbar";
import {ProyectoMain} from "../proyecto-main/proyecto-main";
import {ProyectoProcesos} from "../proyecto-procesos/proyecto-procesos";
import {ActivatedRoute} from '@angular/router';
import {Proyecto} from '../../../model/proyecto';
import {ProyectoService} from '../../../services/proyecto.service';
import {FooterP1} from '../footer-p1/footer-p1';
import {Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-proyecto-detalle',
  imports: [
    Navbar,
    ProyectoMain,
    ProyectoProcesos,
    FooterP1
  ],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css'
})
export class ProyectoDetalle implements OnInit, OnDestroy {
  idDelProyecto!: number;
  proyecto!: Proyecto;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoService
  ) {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Usamos switchMap para cancelar la petición anterior si el parámetro cambia,
    // evitando el anti-patrón de subscribe anidado y posibles condiciones de carrera.
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = params.get('id');
        this.idDelProyecto = id ? +id : 0;
        return this.proyectoService.buscarPorId(this.idDelProyecto);
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
