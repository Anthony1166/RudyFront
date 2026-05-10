import { CategoriaProyecto } from './categoria-proyecto';
import { ImagenProyecto } from './imagen-proyecto';

export class ProyectoAdmin {
  idProyecto?: number;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  anio: number;
  slug?: string;
  activo?: boolean;
  orden?: number;
  categorias?: CategoriaProyecto[];
  imagenes?: ImagenProyecto[];
}
