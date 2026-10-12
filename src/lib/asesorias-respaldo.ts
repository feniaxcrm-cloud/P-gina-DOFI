import { TEXTO_CTA, enlaceFormulario } from "@/lib/cta";

/**
 * Textos de la página Asesorías 1 a 1 · Rescatando Emprendedores.
 *
 * Salen del brief del 2026-10-05, reescritos para que sean comerciales y
 * cortos: la frase de la portada y "¿Qué es Rescatando Emprendedores?"
 * (la experiencia de Dani con más de 500 empresas, la reunión 1 a 1, la ruta
 * estratégica, que no es una charla motivacional).
 *
 * LOS LOGROS SON DE PRUEBA: textos y fotos de ejemplo (recortes de la foto
 * grupal de la portada) que se reemplazan desde el Studio por los reales (por
 * eso firman "Ejemplo — reemplázalo"). Clientes y el cierre son los de
 * Marketing Digital.
 *
 * Datos planos: los usa la web como respaldo (src/lib/asesorias.ts, mientras
 * el documento no tenga ninguna sección activa) y el script que los carga en
 * el Studio (scripts/sembrar-asesorias.mts).
 */

/** Archivos en public/asesorias/, con sus medidas reales. */
export const IMAGENES_ASESORIAS = {
  logo: { archivo: "rescatando-emprendedores.webp", ancho: 2000, alto: 667, alt: "Rescatando Emprendedores" },
  portada: {
    archivo: "emprendedores.webp",
    ancho: 972,
    alto: 667,
    alt: "Dani junto a emprendedores de distintos rubros: construcción, salud, gastronomía, comercio y servicios",
  },
  /** Fotos de ejemplo de los logros: recortes de la foto grupal sobre el
   *  fondo de marca. Se reemplazan desde el Studio por las fotos reales. */
  logros: {
    construccion: { archivo: "logro-construccion.webp", ancho: 378, alto: 472, alt: "Emprendedor de construcción (imagen de ejemplo)" },
    salud: { archivo: "logro-salud.webp", ancho: 403, alto: 505, alt: "Emprendedora de salud (imagen de ejemplo)" },
    gastronomia: { archivo: "logro-gastronomia.webp", ancho: 373, alto: 468, alt: "Emprendedores de gastronomía (imagen de ejemplo)" },
    comercio: { archivo: "logro-comercio.webp", ancho: 450, alto: 562, alt: "Emprendedoras de comercio (imagen de ejemplo)" },
  },
} as const;

export type ClaveImagenLogro = keyof typeof IMAGENES_ASESORIAS.logros;

const CTA_ASESORIAS = { texto: TEXTO_CTA, enlace: enlaceFormulario("asesorias") };

export const COPY_ASESORIAS = {
  portada: {
    titulo: "Asesorías 1 a 1",
    descripcion:
      "Tu negocio merece otra oportunidad. Te ayudamos a verlo con otros ojos: detectamos lo que está frenando tus ventas y trazamos un camino claro para crecer.",
    cta: CTA_ASESORIAS,
  },
  queEs: {
    titulo: "¿Qué es Rescatando Emprendedores?",
    descripcion:
      "Nace de la experiencia de Dani acompañando a más de 500 empresas. Todo lo que aprendió lo lleva a una reunión 1 a 1 contigo: revisamos tu negocio a fondo, qué vendes y cómo lo vendes, para encontrar las oportunidades y los puntos que hoy te frenan.\n\nSales con una ruta estratégica clara para seguir avanzando. No es una charla motivacional ni psicológica: es una asesoría enfocada en mejorar tu negocio y tus ventas.",
    destacado: "Una ruta para vender más.",
  },
  clientes: {
    titulo: "Clientes y casos de éxito",
  },
  /** Logros (pedido del 2026-10-07): reemplazan a «Reseñas en Google» en esta
   *  página. Tarjetas que se pasan con un clic (o solas) y, a la izquierda, la
   *  foto de cada historia. SON DE PRUEBA, como los casos: textos sin cifras
   *  ni nombres reales, firmados «Ejemplo — reemplázalo». La cantidad de
   *  tarjetas, sus fotos y sus mensajes se editan en el Studio. */
  logros: {
    subtitulo: "Logros de nuestros emprendedores",
    titulo: "Historias que nos enorgullecen",
    items: [
      {
        titulo: "Ordenó su negocio",
        texto: "y hoy sabe qué vender, a quién y cómo.",
        etiqueta: "Construcción",
        nombre: "Ejemplo",
        firma: "Ejemplo — reemplázalo",
        foto: "construccion" as ClaveImagenLogro,
      },
      {
        titulo: "Encontró a su cliente ideal",
        texto: "y enfocó sus ventas donde sí le compran.",
        etiqueta: "Salud",
        nombre: "Ejemplo",
        firma: "Ejemplo — reemplázalo",
        foto: "salud" as ClaveImagenLogro,
      },
      {
        titulo: "Lanzó su nueva oferta",
        texto: "con un precio y un mensaje que venden.",
        etiqueta: "Gastronomía",
        nombre: "Ejemplo",
        firma: "Ejemplo — reemplázalo",
        foto: "gastronomia" as ClaveImagenLogro,
      },
      {
        titulo: "Volvió a creer en su marca",
        texto: "con una ruta clara para los próximos meses.",
        etiqueta: "Comercio",
        nombre: "Ejemplo",
        firma: "Ejemplo — reemplázalo",
        foto: "comercio" as ClaveImagenLogro,
      },
    ],
    pasoAutomatico: true,
    segundosPorLogro: 6,
  },
  cierre: {
    titulo: "¿Le damos a tu negocio otra oportunidad?",
    descripcion: "Agenda tu asesoría 1 a 1 y sal con una ruta clara para vender más.",
    cta: CTA_ASESORIAS,
  },
};
