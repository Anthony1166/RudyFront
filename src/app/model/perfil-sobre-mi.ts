export interface PerfilSobreMi {
  id?: number;
  titulo: string;
  descripcion: string;
  urlImagen: string;

  // Encuadre de la imagen
  imgPosX?: number;
  imgPosY?: number;
  imgEscala?: number;
  imgRotacion?: number;
  imgVolteoH?: boolean;
  imgVolteoV?: boolean;

  // Bloque "Áreas de interés"
  subtituloAreas: string;
  areas: string[];
  areasModo: 'lista' | 'texto';

  // Bloque "Idiomas"
  subtituloIdiomas: string;
  idiomas: string[];
  idiomasModo: 'lista' | 'texto';
}
