import {CategoriaProducto} from './categoria-producto';
import {ImagenProducto} from './imagen-producto';
import {ProcesoProducto} from './proceso-producto';

export class Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  caracteristicas?: string;
  subTitulo?: string;
  slug?: string;
  destacado?: boolean;
  orden?: number;

  // Auditoría y Estado
  fechaCreacion?: string | Date;
  fechaActualizacion?: string | Date;
  activo?: boolean;

  // Las relaciones usando las interfaces exactas que acabamos de crear
  categorias?: CategoriaProducto[];
  imagenes?: ImagenProducto[];
  procesos?: ProcesoProducto[];
}
