export class CategoriaProducto {
  id?: number; // Es opcional (?) porque al crear una nueva, aún no tiene ID
  nombre: string;
  urlImagen?: string;
  slug?: string;
  activo?: boolean;
  orden?: number;
  posX?: number;
  posY?: number;
  escala?: number;
  rotacion?: number;
  volteoH?: boolean;
  volteoV?: boolean;
}
