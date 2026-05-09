import { Categoria } from './categoria';
import { Imagen } from './imagen';

export class Proyecto {
  idProyecto: number;
  titulo: string;
  subtitulo: string; // Añadido
  descripcion: string;
  anio: number;
  categorias: Categoria[];
  imagenes: Imagen[];
}
