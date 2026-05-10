import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { Administracion } from './components/admin-component/administracion/administracion';
import { AuthGuard } from './services/auth.guard';
import { Login } from './components/login/login';
import { TestingComponent } from './components/testing-component/testing-component';

// Público — Home
import { PagPerfil } from './components/home-component/pag-perfil/pag-perfil';
import { CatComp } from './components/home-component/Desarrollo-comp-prod/cat-comp/cat-comp';
import { ProductosCategoria } from './components/home-component/Desarrollo-comp-prod/productos-categoria/productos-categoria';
import { ProdDetalle } from './components/home-component/Desarrollo-comp-prod/prod-detalle/prod-detalle';

// Público — Portafolio (proy/)
import { ProyectoPublDetalle } from './components/proy/publico/proyecto-publ-detalle/proyecto-publ-detalle';

// Admin — Portafolio (proy/)
import { ListarCategoriaProy } from './components/proy/listar-categoria-proy/listar-categoria-proy';
import { ListarProyecto } from './components/proy/proyecto/listar-proyecto/listar-proyecto';
import { ActualizarProyecto as ActualizarProyectoProy } from './components/proy/proyecto/actualizar-proyecto/actualizar-proyecto';

// Admin — Productos (prod/)
import { ListarCategoriaProd } from './components/prod/listar-categoria-prod/listar-categoria-prod';
import { ListarProducto } from './components/prod/producto/listar-producto/listar-producto';
import { RegistrarProducto } from './components/prod/producto/registrar-producto/registrar-producto';
import { ActualizarProducto } from './components/prod/producto/actualizar-producto/actualizar-producto';
import { ListarImagenProd } from './components/prod/imagen/listar-imagen-prod/listar-imagen-prod';
import { ActualizarImagenProd } from './components/prod/imagen/actualizar-imagen-prod/actualizar-imagen-prod';
import { ListarProcesoProd } from './components/prod/proceso-prod/listar-proceso-prod/listar-proceso-prod';
import { RegistrarProcesoProd } from './components/prod/proceso-prod/registrar-proceso-prod/registrar-proceso-prod';
import { ActualizarProcesoProd } from './components/prod/proceso-prod/actualizar-proceso-prod/actualizar-proceso-prod';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'testing1', component: TestingComponent },

  // Portafolio público
  { path: 'Proyectos', component: PagPerfil },
  { path: 'proyecto/:slug', component: ProyectoPublDetalle },

  // Tienda pública
  { path: 'Categorias', component: CatComp },
  { path: 'categoria/:slug', component: ProductosCategoria },
  { path: 'producto/:id', component: ProdDetalle },

  {
    path: 'administracion',
    component: Administracion,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'proyecto-portafolio/listar', pathMatch: 'full' },

      // Portafolio (proy/)
      { path: 'proyecto-portafolio/listar', component: ListarProyecto },
      { path: 'proyecto-portafolio/actualizar/:id', component: ActualizarProyectoProy },
      { path: 'categoria-proyecto/listar', component: ListarCategoriaProy },

      // Productos (prod/)
      { path: 'categoria-producto/listar', component: ListarCategoriaProd },

      { path: 'producto/listar', component: ListarProducto },
      { path: 'producto/registrar', component: RegistrarProducto },
      { path: 'producto/actualizar/:id', component: ActualizarProducto },

      { path: 'imagen-producto/listar', component: ListarImagenProd },
      { path: 'imagen-producto/registrar', component: RegistrarProducto },
      { path: 'imagen-producto/actualizar/:id', component: ActualizarImagenProd },
      { path: 'producto/:id/imagenes', component: ListarImagenProd },

      { path: 'proceso-producto/listar', component: ListarProcesoProd },
      { path: 'proceso-producto/registrar', component: RegistrarProcesoProd },
      { path: 'proceso-producto/actualizar/:id', component: ActualizarProcesoProd },
      { path: 'producto/:id/procesos', component: ListarProcesoProd }
    ]
  }
];
