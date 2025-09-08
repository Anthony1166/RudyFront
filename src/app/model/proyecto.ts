import {Categoria} from './categoria';
import {Imagen} from './imagen';

export class Proyecto {
  idProyecto: number;
  titulo: string;
  descripcion: string;
  anio: number;
  categoria: Categoria;
  imagenes: Imagen[];
}
