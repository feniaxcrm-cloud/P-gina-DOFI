/**
 * Tema UNICO de las composiciones Remotion de FENIAX. Ningun color, curva ni
 * resorte se escribe suelto en un componente: todo sale de aca.
 *
 * Dos grupos de color:
 *  - `marca`: la paleta del brandbook de FENIAX (seccion 03, "Paleta de
 *    color"). Solo aparece en lo que es de FENIAX: el aviso del CRM y el
 *    avatar de la portada.
 *  - `whatsapp`: los colores reales de la app (claro y oscuro). La demo tiene
 *    que leerse como WhatsApp a primera vista; pintarla de morado la volveria
 *    un dibujo.
 *
 * DATOS PUROS, SIN IMPORTAR REMOTION: este archivo lo usa tambien el marco
 * del telefono, que va en la carga inicial de la pagina. Las curvas y los
 * resortes (que si necesitan `Easing` de Remotion) viven en curvas.ts, que
 * solo importa la composicion -- asi Remotion queda en el paquete diferido.
 */

export const FPS = 30;

/** Pantalla de un telefono de 390 x 844 pt (el tamaño "medio" de iPhone). El
 *  Player la escala al ancho que tenga el marco en la pagina. */
export const PANTALLA = { ancho: 390, alto: 844 } as const;

export const marca = {
  morado: "#792883",
  berenjena: "#2A1638",
  naranja: "#ED6D19",
  rojo: "#E5352A",
  blanco: "#FFFFFF",
  degradadoIA: "linear-gradient(180deg, #ED6D19 0%, #E5352A 100%)",
  degradadoAvatar: "linear-gradient(150deg, #792883 0%, #2A1638 100%)",
  /** Aviso del CRM: vidrio berenjena con filo naranja. */
  avisoFondo: "rgba(42, 22, 56, 0.94)",
  avisoBorde: "rgba(237, 109, 25, 0.35)",
  avisoSombra: "0 18px 40px -12px rgba(42, 22, 56, 0.65), 0 0 0 4px rgba(237, 109, 25, 0.10)",
  avisoIconoSombra: "0 6px 16px -6px rgba(229, 53, 42, 0.8)",
  avisoTenue: "rgba(255, 255, 255, 0.65)",
  avisoSuave: "rgba(255, 255, 255, 0.78)",
} as const;

/** Sombras de la app (iguales en claro y oscuro). */
export const sombra = {
  burbuja: "0 1px 0.5px rgba(11, 20, 26, 0.13)",
  barra: "0 1px 0 rgba(11, 20, 26, 0.08)",
} as const;

export type TemaChat = "claro" | "oscuro";

type ColoresWhatsApp = {
  fondo: string;
  garabatos: string;
  barra: string;
  barraTexto: string;
  barraTenue: string;
  entrante: string;
  saliente: string;
  texto: string;
  meta: string;
  leido: string;
  compositor: string;
  campo: string;
  campoTexto: string;
  verde: string;
  chip: string;
  chipTexto: string;
};

export const whatsapp: Record<TemaChat, ColoresWhatsApp> = {
  claro: {
    fondo: "#EFEAE2",
    garabatos: "rgba(84, 101, 111, 0.07)",
    barra: "#FFFFFF",
    barraTexto: "#111B21",
    barraTenue: "#667781",
    entrante: "#FFFFFF",
    saliente: "#D9FDD3",
    texto: "#111B21",
    meta: "#667781",
    leido: "#53BDEB",
    compositor: "#F0F2F5",
    campo: "#FFFFFF",
    campoTexto: "#111B21",
    verde: "#00A884",
    chip: "#FFFFFF",
    chipTexto: "#54656F",
  },
  oscuro: {
    fondo: "#0B141A",
    garabatos: "rgba(233, 237, 239, 0.035)",
    barra: "#1F2C34",
    barraTexto: "#E9EDEF",
    barraTenue: "#8696A0",
    entrante: "#202C33",
    saliente: "#005C4B",
    texto: "#E9EDEF",
    meta: "rgba(233, 237, 239, 0.6)",
    leido: "#53BDEB",
    compositor: "#1F2C34",
    campo: "#2A3942",
    campoTexto: "#E9EDEF",
    verde: "#00A884",
    chip: "#1F2C34",
    chipTexto: "#8696A0",
  },
};

/** La tipografia del sistema, como la app real (San Francisco en iPhone,
 *  Segoe en Windows, Roboto en Android). */
export const FUENTE_SISTEMA =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * Ritmo de la conversacion, en SEGUNDOS (se pasa a cuadros con el fps). Se
 * calibro leyendo la demo a velocidad real: el cliente teclea a un ritmo
 * humano, la IA tarda lo justo en "escribir" (responde en segundos, que es
 * justamente lo que se vende) y cada respuesta queda en pantalla el tiempo
 * de leerla.
 */
export const ritmo = {
  arranque: 0.6,
  /** Segundos por caracter que teclea el cliente, con tope abajo y arriba. */
  tecleoPorCaracter: 0.034,
  tecleoMin: 0.7,
  tecleoMax: 2.2,
  /** Pausa entre enviar y que la IA empiece a escribir. */
  trasEnviar: 0.35,
  /** "escribiendo..." de la IA. */
  escribiendoPorCaracter: 0.012,
  escribiendoMin: 0.8,
  escribiendoMax: 1.5,
  /** Tiempo de lectura de cada respuesta antes del siguiente mensaje. */
  lecturaPorCaracter: 0.03,
  lecturaMin: 1.1,
  lecturaMax: 3.4,
  /** Extra si la respuesta trae una foto. */
  lecturaFoto: 0.8,
  /** Despues del ultimo mensaje: espera, aviso del CRM y salida. */
  antesDelAviso: 0.7,
  aviso: 3.2,
  salida: 0.45,
} as const;
