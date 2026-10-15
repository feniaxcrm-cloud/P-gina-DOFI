/**
 * Tema de las escenas Remotion de los banners del Home. Ningun color, medida
 * ni curva se escribe suelto en una escena: todo sale de aca o de piezas.tsx.
 *
 * LOS COLORES SON LOS DE LAS PIEZAS ORIGINALES (pedido del 2026-10-08: "los
 * colores de cada banner deben mantenerse exactamente"). Se midieron sobre
 * las cuatro imagenes que estaban publicadas (2077 x 757): el fondo de cada
 * una, el degradado de sus titulos y el color de cada baldosa. Remotion no
 * inventa paleta: redibuja con codigo lo que ya estaba dibujado.
 *
 * DATOS PUROS, SIN IMPORTAR REMOTION: este archivo tambien lo lee el banner
 * del servidor (geometria del escenario y fondos), que no debe cargar Remotion.
 */

export const FPS = 30;

/** Una vuelta de 8 segundos: toda la escena es periodica en este numero de
 *  cuadros (las ondas dan 1, 2 o 3 vueltas exactas), asi el bucle no tiene
 *  costura. */
export const DURACION = 240;

/** Con movimiento reducido: un cuadro con todo en su sitio. */
export const CUADRO_QUIETO = 0;

/** El escenario es la proporcion de las piezas originales: 2077 x 757. Las
 *  zonas de cada escena y de cada foto se dan en esas unidades. */
export const ESCENARIO = { ancho: 2077, alto: 757 } as const;

export type ClaveEscena = "redes" | "pauta" | "crm" | "asesorias";

export const CLAVES_ESCENA: readonly ClaveEscena[] = ["redes", "pauta", "crm", "asesorias"];

export type GeometriaEscena = {
  /** Donde esta la escena (Remotion) y donde la foto, en unidades del escenario. */
  escena: { x: number; ancho: number };
  foto: { x: number; ancho: number };
  /** De que lado va la foto. */
  ladoFoto: "izquierda" | "derecha";
  /** Fondo del banner entero (CSS): el color de la pieza original. */
  fondo: string;
  /** Color liso de los bordes, para lo que sobra a los lados del escenario. */
  borde: string;
  /** Que parte de la foto se funde con el fondo (el lado que mira a la escena). */
  difuminado: "izquierda" | "derecha";
  /** El archivo de la foto de primer plano que viene de fabrica. */
  fotoRespaldo: { url: string; ancho: number; alto: number };
  /** Lo que dice la pieza (para lectores de pantalla y como respaldo del texto). */
  lineasPorDefecto: string[];
  /** TELÉFONO (opcional): encuadre más angosto de la foto para que su
   *  protagonista quede centrado. `ancho` es el ancho visible en unidades del
   *  escenario (el alto es siempre 757) y `foco` el centro horizontal de la
   *  persona en la foto de fábrica (0-1). Una foto subida en el Studio usa su
   *  punto focal. Sin esto, la foto se ve entera. */
  movil?: { ancho: number; foco: number };
};

export const GEOMETRIA: Record<ClaveEscena, GeometriaEscena> = {
  // Morado y naranja. Escena a la izquierda, la gente a la derecha.
  redes: {
    escena: { x: 0, ancho: 1010 },
    foto: { x: 940, ancho: 1137 },
    ladoFoto: "derecha",
    fondo:
      "radial-gradient(60% 95% at 66% 22%, rgb(150,40,245) 0%, rgba(150,40,245,0) 70%), radial-gradient(70% 100% at 0% 100%, rgb(96,14,180) 0%, rgba(96,14,180,0) 72%), rgb(120,21,208)",
    borde: "rgb(120,21,208)",
    difuminado: "izquierda",
    fotoRespaldo: { url: "/home/banner-redes-foto.webp", ancho: 1137, alto: 757 },
    lineasPorDefecto: ["Redes Sociales que", "SÍ VENDEN"],
  },
  // Blanco con lila. La gente a la izquierda, la escena a la derecha.
  pauta: {
    escena: { x: 790, ancho: 1287 },
    foto: { x: 0, ancho: 830 },
    ladoFoto: "izquierda",
    fondo:
      "radial-gradient(70% 90% at 70% 100%, rgb(240,238,252) 0%, rgba(240,238,252,0) 70%), rgb(251,252,254)",
    borde: "rgb(251,252,254)",
    difuminado: "derecha",
    fotoRespaldo: { url: "/home/banner-pauta-foto.webp", ancho: 830, alto: 757 },
    lineasPorDefecto: ["PAUTA INTELIGENTE =", "VENTAS INTELIGENTES"],
  },
  // Negro azulado con neon violeta. Escena a la izquierda, la gente a la derecha.
  crm: {
    escena: { x: 0, ancho: 980 },
    foto: { x: 930, ancho: 1147 },
    ladoFoto: "derecha",
    fondo:
      "radial-gradient(55% 80% at 8% 85%, rgb(30,12,86) 0%, rgba(30,12,86,0) 70%), radial-gradient(60% 90% at 100% 100%, rgb(14,26,128) 0%, rgba(14,26,128,0) 72%), rgb(2,8,26)",
    borde: "rgb(2,8,26)",
    difuminado: "izquierda",
    fotoRespaldo: { url: "/home/banner-crm-foto.webp", ancho: 1147, alto: 757 },
    lineasPorDefecto: ["con", "RESPUESTAS RÁPIDAS", "hay", "CLIENTES FELICES"],
  },
  // Morado profundo con luces. La gente a la izquierda, la escena a la derecha.
  asesorias: {
    escena: { x: 880, ancho: 1197 },
    foto: { x: 0, ancho: 920 },
    ladoFoto: "izquierda",
    fondo:
      "radial-gradient(60% 90% at 78% 50%, rgb(66,16,150) 0%, rgba(66,16,150,0) 72%), radial-gradient(55% 90% at 0% 0%, rgb(82,6,170) 0%, rgba(82,6,170,0) 70%), rgb(46,11,112)",
    borde: "rgb(46,11,112)",
    difuminado: "derecha",
    fotoRespaldo: { url: "/home/banner-asesorias-foto.webp", ancho: 920, alto: 757 },
    lineasPorDefecto: ["RESCATANDO", "EMPRENDEDORES"],
    // En el teléfono la foto completa dejaba a Daniel y el «Asesorías uno a
    // uno» corridos a la derecha (a la izquierda solo hay sellos de la
    // mascota): se encuadra en ellos (pedido del 2026-10-16).
    movil: { ancho: 640, foco: 0.636 },
  },
};

/** Paleta de las escenas (rgb sueltos de las piezas originales). */
export const color = {
  // Redes
  naranjaTitulo: "linear-gradient(180deg, #FFC03A 0%, #FF9A1F 55%, #FF7A12 100%)",
  moradoBrillo: "#B04BFF",
  // Pauta
  tintaAzul: "linear-gradient(180deg, #4A24F2 0%, #6B2FE0 100%)",
  tintaNoche: "linear-gradient(180deg, #120C5C 0%, #190F6B 55%, #3A1C98 100%)",
  // CRM
  ciano: "linear-gradient(180deg, #7FE6FF 0%, #1FB6FF 55%, #3E8CFF 100%)",
  neon: "#8A5BFF",
  // Comunes
  blanco: "#FFFFFF",
} as const;

/** La tipografia: Sora (la del sitio) y Archivo condensada para "Pauta". */
export const fuente = {
  titulo: "var(--font-sora), 'Sora', system-ui, sans-serif",
  condensada: "var(--font-archivo), 'Archivo', 'Arial Narrow', sans-serif",
  serif: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
} as const;
