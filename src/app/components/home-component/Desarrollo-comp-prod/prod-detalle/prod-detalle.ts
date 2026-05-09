import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FooterP1} from '../../footer-p1/footer-p1';
import {ProcesosLista} from '../procesos-lista/procesos-lista';
import {NavbarProd} from '../navbar-prod/navbar-prod';
import {ProductoCabecera} from '../producto-cabecera/producto-cabecera';
import {ActivatedRoute} from '@angular/router';
import {Producto} from '../../../../model/prod/producto';
import {ImagenProducto} from '../../../../model/prod/imagen-producto';
import {ProcesoProducto} from '../../../../model/prod/proceso-producto';
import {ProductoService} from '../../../../services/prod/producto.service';
import {ProcesoProductoService} from '../../../../services/prod/proceso-producto.service';
import {ImagenProductoService} from '../../../../services/prod/imagen-producto.service';
import {NgIf} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-prod-detalle',
  imports: [
    FooterP1,
    NavbarProd,
    ProductoCabecera,
    NgIf,
    ProcesosLista
  ],
  templateUrl: './prod-detalle.html',
  styleUrl: './prod-detalle.css'
})
export class ProdDetalle implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private imagenService = inject(ImagenProductoService);
  private procesoService = inject(ProcesoProductoService);
  private meta = inject(Meta);
  private titleService = inject(Title);

  // Variables para guardar la data que viene de BD
  producto: Producto | null = null;
  imagenes: ImagenProducto[] = [];
  procesos: ProcesoProducto[] = [];
  cargando = true;
  cargandoProcesos = true;

  ngOnInit() {
    // 1. Obtenemos el ID de la URL
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const productoId = Number(idParam);
      this.cargarTodo(productoId);
    }
  }

  cargarTodo(id: number) {
    // 2. Jalamos la info principal del producto
    this.productoService.obtenerPorId(id).subscribe({
      next: (prod) => {
        this.producto = prod;
        this.cargando = false;
        this.titleService.setTitle(`${prod.nombre} | Avacas`);
        this.meta.updateTag({ property: 'og:title', content: prod.nombre });
        this.meta.updateTag({ property: 'og:description', content: prod.descripcion || prod.nombre });
        this.meta.updateTag({ property: 'og:url', content: window.location.href });
        this.meta.updateTag({ property: 'og:type', content: 'product' });
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      }
    });

    // 3. Jalamos las imágenes de este producto
    this.imagenService.listarPorProducto(id).subscribe({
      next: (imgs) => {
        this.imagenes = imgs;
        if (imgs.length > 0) {
          this.meta.updateTag({ property: 'og:image', content: imgs[0].urlImagen });
        }
      }
    });

    // 4. Jalamos los procesos ("Cómo lo haremos")
    this.cargandoProcesos = true;
    this.procesoService.listarPorProducto(id).subscribe({
      next: (procs) => {
        this.procesos = procs;
        this.cargandoProcesos = false;
      },
      error: () => this.cargandoProcesos = false
    });
  }

  ngOnDestroy() {
    this.titleService.setTitle('Avacas');
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:type'");
    this.meta.removeTag("name='twitter:card'");
  }
}
