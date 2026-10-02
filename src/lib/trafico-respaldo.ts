/**
 * Textos de la pagina Tráfico/Ads.
 *
 * SALEN del documento "SECCION DE TRAFICO" que entrego el equipo, pero
 * RESUMIDOS: la direccion pidio (2026-10-01) poco texto y enfocado en vender
 * -- la propuesta de valor se entiende de un vistazo. Cada seccion lleva un
 * titular, UNA frase y, a lo sumo, una linea de cierre. Las ideas y las
 * frases clave son las del documento ("tráfico con propósito", "medir,
 * analizar, optimizar", "ecosistemas", "zarpemos juntos"); no se agrego
 * ninguna cifra ni promesa que el documento no haga. Las notas de redaccion
 * del documento ("Aquí aprovecharía mucho el concepto...") son indicaciones
 * para quien arma la pagina, no copy: no se publican.
 *
 * El titular del hero lleva la puntuacion en regla: "Muchos likes, muchas
 * vistas… pero ¿y las ventas?" (el original abria dos signos y cerraba uno).
 *
 * UNA SOLA FUENTE: los usa src/lib/trafico.ts (respaldo de la pagina cuando
 * Sanity no tiene secciones activas) y scripts/sembrar-trafico.mts (los carga
 * en el Studio para que se editen ahi). Datos planos, sin dependencias.
 */

const CTA_MARCA = { texto: "Quiero impulsar mi marca", enlace: "/contactanos" };

export const COPY_TRAFICO = {
  /** 01 · El problema */
  portada: {
    subtitulo: "Tráfico / Ads",
    titulo: "Muchos likes, muchas vistas… pero ¿y las ventas?",
    descripcion:
      "Convertimos la atención en clientes: campañas que llevan a las personas correctas a escribirte, registrarse o comprar.",
    destacado: "Tráfico con propósito.",
    cta: CTA_MARCA,
  },
  /** 02 · Nuestro sistema */
  sistema: {
    subtitulo: "Nuestro sistema",
    titulo: "Tráfico inteligente. Estrategias que se adaptan.",
    descripcion:
      "Cada marca es distinta. Diseñamos la campaña según tu objetivo y tu momento, y la mejoramos con datos.",
    destacado: "Cada campaña tiene un rumbo.",
  },
  /** 03 · ¿Cómo lo hacemos? (1/2): el mapa */
  mapa: {
    subtitulo: "¿Cómo lo hacemos?",
    titulo: "Construimos el mapa antes de zarpar.",
    descripcion: "Antes de invertir un dólar, definimos a dónde llevar el tráfico y qué debe pasar cuando llegue.",
  },
  /** 03 · ¿Cómo lo hacemos? (2/2): analizamos, medimos, optimizamos */
  metodo: {
    subtitulo: "Analizamos",
    titulo: "Para nosotros, todo son datos.",
    descripcion: "Medimos cada campaña y ajustamos sobre la marcha para que tu inversión rinda más.",
    destacado: "Medir. Analizar. Optimizar.",
    // Los siete frentes del documento, sin descripcion: el documento no la da.
    pasos: ["Objetivo", "Audiencia", "Oferta", "Canal", "Creatividad", "Conversión", "Datos"],
  },
  /** 04 · ¿Dónde traficamos? */
  plataformas: {
    subtitulo: "¿Dónde traficamos?",
    titulo: "El tráfico no tiene un solo destino.",
    descripcion: "Elegimos la plataforma donde está tu audiencia.",
    items: [
      {
        nombre: "Meta Ads",
        etiqueta: "Facebook + Instagram",
        icono: "meta",
        descripcion: "Reconocimiento, mensajes, clientes potenciales y ventas.",
      },
      {
        nombre: "TikTok Ads",
        etiqueta: "Descubrimiento + atención + acción",
        icono: "tiktok",
        descripcion: "Contenido que capta atención y llega a nuevas audiencias.",
      },
      {
        nombre: "Google Ads",
        etiqueta: "Cuando ya hay intención",
        icono: "google",
        descripcion: "Te encuentran justo cuando buscan lo que ofreces.",
      },
      {
        nombre: "Tráfico web",
        etiqueta: "Visitas que se convierten",
        icono: "web",
        descripcion: "Medimos qué hace cada visita y mejoramos el camino hacia la compra.",
      },
    ],
  },
  /** 05 · El ecosistema */
  ecosistema: {
    subtitulo: "Ecosistema",
    titulo: "No hacemos campañas aisladas. Construimos ecosistemas.",
    descripcion: "Te descubren en Instagram, te buscan en Google, visitan tu web y te escriben por WhatsApp.",
    destacado: "Estar en los lugares correctos, con estrategia.",
  },
  /** Clientes: el panel de metricas de Meta (pedido del equipo, no del documento). */
  clientes: {
    titulo: "Clientes y casos de éxito",
    descripcion: "Elige un giro y mira cómo medimos una campaña de Meta Ads.",
  },
  resenas: { titulo: "Reseñas en Google" },
  /** 06 · Cierre / CTA */
  cierre: {
    titulo: "¿Listos para poner tu inversión en movimiento?",
    descripcion: "Convierte tu presupuesto en tráfico, oportunidades y crecimiento.",
    destacado: "Zarpemos juntos.",
    cta: CTA_MARCA,
  },
} as const;
