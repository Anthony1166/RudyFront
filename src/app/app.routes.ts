import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  { path: 'testing1', loadComponent: () => import('./components/testing-component/testing-component').then(m => m.TestingComponent) },

  // Portafolio público
  { path: 'Proyectos', loadComponent: () => import('./components/home-component/pag-perfil/pag-perfil').then(m => m.PagPerfil) },
  { path: 'proyecto/:slug', loadComponent: () => import('./components/proy/publico/proyecto-publ-detalle/proyecto-publ-detalle').then(m => m.ProyectoPublDetalle) },

  // Tienda pública
  { path: 'Categorias', loadComponent: () => import('./components/home-component/Desarrollo-comp-prod/cat-comp/cat-comp').then(m => m.CatComp) },
  { path: 'categoria/:slug', loadComponent: () => import('./components/home-component/Desarrollo-comp-prod/productos-categoria/productos-categoria').then(m => m.ProductosCategoria) },
  { path: 'producto/:id', loadComponent: () => import('./components/home-component/Desarrollo-comp-prod/prod-detalle/prod-detalle').then(m => m.ProdDetalle) },

  {
    path: 'administracion',
    loadComponent: () => import('./components/admin-component/administracion/administracion').then(m => m.Administracion),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'proyecto-portafolio/listar', pathMatch: 'full' },

      // Portafolio (proy/)
      { path: 'proyecto-portafolio/listar', loadComponent: () => import('./components/proy/proyecto/listar-proyecto/listar-proyecto').then(m => m.ListarProyecto) },
      { path: 'proyecto-portafolio/actualizar/:id', loadComponent: () => import('./components/proy/proyecto/actualizar-proyecto/actualizar-proyecto').then(m => m.ActualizarProyecto) },
      { path: 'categoria-proyecto/listar', loadComponent: () => import('./components/proy/listar-categoria-proy/listar-categoria-proy').then(m => m.ListarCategoriaProy) },

      // Productos (prod/)
      { path: 'categoria-producto/listar', loadComponent: () => import('./components/prod/listar-categoria-prod/listar-categoria-prod').then(m => m.ListarCategoriaProd) },

      { path: 'producto/listar', loadComponent: () => import('./components/prod/producto/listar-producto/listar-producto').then(m => m.ListarProducto) },
      { path: 'producto/registrar', loadComponent: () => import('./components/prod/producto/registrar-producto/registrar-producto').then(m => m.RegistrarProducto) },
      { path: 'producto/actualizar/:id', loadComponent: () => import('./components/prod/producto/actualizar-producto/actualizar-producto').then(m => m.ActualizarProducto) },

      { path: 'imagen-producto/listar', loadComponent: () => import('./components/prod/imagen/listar-imagen-prod/listar-imagen-prod').then(m => m.ListarImagenProd) },
      { path: 'imagen-producto/actualizar/:id', loadComponent: () => import('./components/prod/imagen/actualizar-imagen-prod/actualizar-imagen-prod').then(m => m.ActualizarImagenProd) },
      { path: 'producto/:id/imagenes', loadComponent: () => import('./components/prod/imagen/listar-imagen-prod/listar-imagen-prod').then(m => m.ListarImagenProd) },

      { path: 'proceso-producto/listar', loadComponent: () => import('./components/prod/proceso-prod/listar-proceso-prod/listar-proceso-prod').then(m => m.ListarProcesoProd) },
      { path: 'proceso-producto/actualizar/:id', loadComponent: () => import('./components/prod/proceso-prod/actualizar-proceso-prod/actualizar-proceso-prod').then(m => m.ActualizarProcesoProd) },
      { path: 'producto/:id/procesos', loadComponent: () => import('./components/prod/proceso-prod/listar-proceso-prod/listar-proceso-prod').then(m => m.ListarProcesoProd) }
    ]
  },
  { path: '**', redirectTo: '' }
];
