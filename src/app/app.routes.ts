import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { Administracion } from './components/admin-component/administracion/administracion';
import { AuthGuard } from './services/auth.guard';
import { Login } from './components/login/login';

// Componentes de Categoría
import { Listar as ListarCategorias } from './components/categoria/listar/listar';
import { Registrar as RegistrarCategoria } from './components/categoria/registrar/registrar';
import { Actualizar as ActualizarCategoria } from './components/categoria/actualizar/actualizar';

// Componentes de Proyecto
import { ListarProyectos } from './components/proyecto-component/listar/listar';
import { RegistrarProyecto } from './components/proyecto-component/registrar/registrar';
import { ActualizarProyecto } from './components/proyecto-component/actualizar/actualizar';

// Componentes de Imagen
import { ListarImagenes } from './components/imagen-component/listar-imagen/listar-imagen';
import { RegistrarImagen } from './components/imagen-component/registrar-imagen/registrar-imagen';

// Componente de Detalle de Proyecto
import {TestingComponent} from './components/testing-component/testing-component';
import {PagPerfil} from './components/home-component/pag-perfil/pag-perfil';
import {ProyectoDetalle} from './components/home-component/proyecto-detalle/proyecto-detalle';
import {ProductosTest} from './components/admin-component/productos-test/productos-test';
import {ListarCategoriaProd} from './components/prod/listar-categoria-prod/listar-categoria-prod';
import {ListarProducto} from './components/prod/producto/listar-producto/listar-producto';
import {RegistrarProducto} from './components/prod/producto/registrar-producto/registrar-producto';
import {ActualizarProducto} from './components/prod/producto/actualizar-producto/actualizar-producto';
import {ListarImagenProd} from './components/prod/imagen/listar-imagen-prod/listar-imagen-prod';
import {ActualizarImagenProd} from './components/prod/imagen/actualizar-imagen-prod/actualizar-imagen-prod';
import {ListarProcesoProd} from './components/prod/proceso-prod/listar-proceso-prod/listar-proceso-prod';
import {RegistrarProcesoProd} from './components/prod/proceso-prod/registrar-proceso-prod/registrar-proceso-prod';
import {ActualizarProcesoProd} from './components/prod/proceso-prod/actualizar-proceso-prod/actualizar-proceso-prod';
import {CatComp} from './components/home-component/Desarrollo-comp-prod/cat-comp/cat-comp';
import {
  ProductosCategoria
} from './components/home-component/Desarrollo-comp-prod/productos-categoria/productos-categoria';
import {ProdDetalle} from './components/home-component/Desarrollo-comp-prod/prod-detalle/prod-detalle';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  { path: 'Proyectos', component: PagPerfil},
  { path: 'login', component: Login },
  { path: 'testing1', component: TestingComponent },
  { path: 'proyecto/detalle/:id', component: ProyectoDetalle },

  { path: 'Categorias', component: CatComp},
  { path: 'categoria/:slug', component: ProductosCategoria   },
  { path: 'producto/:id', component: ProdDetalle},


  {
    path: 'administracion',
    component: Administracion,
    canActivate: [AuthGuard],
    children: [
      // CAMBIO AQUÍ: Redirigir a la lista de proyectos por defecto
      { path: '', redirectTo: 'proyecto/listar', pathMatch: 'full' }, // El dashboard sigue existiendo, pero no es el predeterminado

      // Rutas de Categoría
      { path: 'categoria/listar', component: ListarCategorias },
      { path: 'categoria/registrar', component: RegistrarCategoria },
      { path: 'categoria/actualizar/:id', component: ActualizarCategoria },

      // Rutas de Proyecto
      { path: 'proyecto/listar', component: ListarProyectos },
      { path: 'proyecto/registrar', component: RegistrarProyecto },
      { path: 'proyecto/actualizar/:id', component: ActualizarProyecto },

      // Rutas de Imágenes
      { path: 'imagenes/listar', component: ListarImagenes },
      { path: 'imagenes/registrar', component: RegistrarImagen },

      { path: 'categoria-producto/listar', component: ListarCategoriaProd},

      { path: 'producto/listar', component: ListarProducto },
      { path: 'producto/registrar', component: RegistrarProducto},
      { path: 'producto/actualizar/:id', component: ActualizarProducto},

      { path: 'imagen-producto/listar', component: ListarImagenProd},
      { path: 'imagen-producto/registrar', component: RegistrarProducto},
      { path: 'imagen-producto/actualizar/:id', component: ActualizarImagenProd},


      { path: 'producto/:id/imagenes', component: ListarImagenProd },


      { path: 'proceso-producto/listar', component: ListarProcesoProd},
      { path: 'proceso-producto/registrar', component: RegistrarProcesoProd},
      { path: 'proceso-producto/actualizar/:id', component: ActualizarProcesoProd},
      { path: 'producto/:id/procesos', component: ListarProcesoProd }
    ],

  },
];
