export interface ProcesoDiseno {
  id: number;
  titulo_fase: string;
  descripcion: string;
  imagen_proceso?: string; // El '?' indica que es opcional
  orden: number;
}
