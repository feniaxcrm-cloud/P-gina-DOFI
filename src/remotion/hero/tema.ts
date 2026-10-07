/**
 * Tema UNICO de la composicion del hero del Home (Remotion): "Ventas
 * Inteligentes", el recorrido ATRAER -> CONVERTIR -> ESCALAR. Ningun color,
 * medida ni tiempo se escribe suelto en la composicion: todo sale de aca.
 *
 * Los colores salen de los tokens del sitio (var(--color-*): el <Player> pinta
 * en el DOM de la pagina, no en un iframe), asi la animacion cambia sola si
 * cambia la marca. Solo lo que no existe como token (velos translucidos)
 * vive aca como valor.
 *
 * DATOS PUROS, SIN IMPORTAR REMOTION: lo usa tambien la envoltura de la pagina
 * (que va en la carga inicial). Las curvas, que si necesitan Remotion, estan en
 * curvas.ts y solo las importa la composicion.
 */

export const FPS = 30;

/** Lienzo. Se muestra entre ~320 y ~520 px de ancho: el texto mas chico mide
 *  18 px de diseño (11 a 16 px reales). */
export const LIENZO = { ancho: 600, alto: 680 } as const;

/** 12 segundos en bucle exacto: el cuadro 0 y el ultimo son el mismo estado
 *  (tres tarjetas en reposo), asi la vuelta no tiene costura. */
export const TOTAL_CUADROS = 360;

/** Cuadro quieto (movimiento reducido): las tres etapas completas a la vista. */
export const CUADRO_QUIETO = 318;

/** Ventanas de cada etapa, en cuadros. */
export const ETAPAS = {
  atraer: { desde: 12, hasta: 122 },
  viajeAB: { desde: 104, hasta: 140 },
  convertir: { desde: 132, hasta: 242 },
  viajeBC: { desde: 226, hasta: 262 },
  escalar: { desde: 252, hasta: 338 },
  reinicio: { desde: 336, hasta: 358 },
} as const;

/** Tarjetas: posicion, tamaño y giro de cada una dentro del lienzo. */
export const TARJETAS = {
  atraer: { x: 0, y: 24, ancho: 322, alto: 236, giro: -3 },
  convertir: { x: 276, y: 206, ancho: 324, alto: 252, giro: 2.4 },
  escalar: { x: 28, y: 446, ancho: 344, alto: 226, giro: -1.6 },
} as const;

type Punto = { x: number; y: number };
type Curva = readonly [Punto, Punto, Punto, Punto];

/** Las dos curvas que unen las tarjetas, por el hueco entre ellas (nunca
 *  debajo): de Atraer a Convertir y de Convertir a Escalar. Cada una es una
 *  sola curva cubica: con sus cuatro puntos se dibuja Y se ubica el punto de
 *  luz que viaja por ella. */
const AB: Curva = [
  { x: 322, y: 140 },
  { x: 372, y: 140 },
  { x: 404, y: 158 },
  { x: 404, y: 202 },
];
const BC: Curva = [
  { x: 446, y: 462 },
  { x: 446, y: 516 },
  { x: 414, y: 560 },
  { x: 376, y: 560 },
];

function trazar([a, b, c, d]: Curva) {
  return `M ${a.x} ${a.y} C ${b.x} ${b.y}, ${c.x} ${c.y}, ${d.x} ${d.y}`;
}

export const RUTAS = {
  ab: { puntos: AB, d: trazar(AB) },
  bc: { puntos: BC, d: trazar(BC) },
} as const;

export const color = {
  texto: "var(--color-foam)",
  tenue: "var(--color-mist)",
  apagado: "var(--color-mist-dim)",
  acento: "var(--color-accent)",
  acentoSuave: "var(--color-accent-lift)",
  marca: "var(--color-brand)",
  marcaSuave: "var(--color-brand-lift)",
  whatsapp: "var(--color-whatsapp)",
  vidrio: "rgba(255, 255, 255, 0.075)",
  vidrioActivo: "rgba(255, 255, 255, 0.11)",
  borde: "rgba(255, 255, 255, 0.14)",
  bordeActivo: "rgba(255, 148, 64, 0.75)",
  velo: "rgba(255, 255, 255, 0.08)",
  veloFuerte: "rgba(255, 255, 255, 0.16)",
  burbujaCliente: "rgba(255, 255, 255, 0.92)",
  burbujaIA: "linear-gradient(135deg, #6D4BC9 0%, #4B2A93 100%)",
  sombra: "0 30px 60px -28px rgba(8, 4, 20, 0.85)",
  sombraActiva: "0 34px 70px -26px rgba(244, 123, 32, 0.45), 0 30px 60px -30px rgba(8, 4, 20, 0.9)",
} as const;

export const fuente = {
  display: "var(--font-sora), ui-sans-serif, system-ui, sans-serif",
  texto: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
} as const;
