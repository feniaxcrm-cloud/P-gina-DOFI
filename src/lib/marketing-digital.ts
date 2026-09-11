import { sanityQuery } from "@/lib/sanity";
import { clients as clientesRespaldo } from "@/data/clients";
import { company } from "@/config/company";

/**
 * Datos de la pagina /marketing-digital: documento singleton
 * "marketingDigitalPage" en Sanity (ver studio/schemaTypes/marketingDigitalPage.ts).
 *
 * UNA sola consulta trae las 7 secciones, los clientes activos del carrusel
 * y las reseñas activas. Los clientes salen del tipo "cuenta" -- el mismo que
 * usa /clientes --, no de un modelo aparte: asi una cuenta nueva aparece en
 * los dos lugares sin cargarla dos veces.
 *
 * RESPALDO
 * -----------------------------------------------------------------
 * Si Sanity no responde o el documento todavia no existe, la pagina se arma
 * entera con FALLBACK_MARKETING (el copy del brief). Si el documento existe,
 * se respeta tal cual: un campo vaciado en el Studio queda vacio, NO
 * reaparece el texto de respaldo -- si no, seria imposible borrar algo. Solo
 * una SECCION entera ausente cae a su respaldo.
 */

// ============================================================
// Tipos que consumen los componentes
// ============================================================

export type ImagenSanity = {
  /** URL de Sanity ya con ?w=.. */
  url: string;
  /** Dimensiones reales del archivo: dan la proporcion exacta, que es lo
   *  que permite mostrar una pieza completa sin recortarla ni deformarla. */
  ancho: number;
  alto: number;
  hotspot: { x: number; y: number } | null;
  alt: string;
};

export type CtaSimple = { texto: string; enlace: string } | null;
export type Overlay = "ninguno" | "suave" | "medio" | "fuerte";
export type Alineacion = "izquierda" | "centro" | "derecha";

/** Banner fotografico con texto HTML encima (1 · Equipo y 7 · Cierre). */
export type BannerFotoData = {
  imagen: ImagenSanity | null;
  imagenMovil: ImagenSanity | null;
  etiqueta: string;
  titulo: string;
  descripcion: string;
  destacado: string;
  cta: CtaSimple;
  alineacion: Alineacion;
  overlay: Overlay;
  animar: boolean;
};

/** Pieza grafica terminada (2 · Que es DOFI y 3 · Como navegamos). */
export type PiezaGraficaData = {
  imagen: ImagenSanity | null;
  imagenMovil: ImagenSanity | null;
  titulo: string;
  texto: string;
  destacado: string;
  textoAdicional: string;
  cta: CtaSimple;
  animar: boolean;
};

export type PasoMetodo = { titulo: string; descripcion: string };

export type MetodoData = {
  imagenes: ImagenSanity[];
  titulo: string;
  introduccion: string;
  pasos: PasoMetodo[];
  mostrarPasos: boolean;
  mensajeFinal: string;
  cta: CtaSimple;
  animar: boolean;
};

export const ICONOS_CATEGORIA = [
  "construccion",
  "belleza",
  "servicios",
  "comercio",
  "emprendedores",
  "salud",
  "gastronomia",
  "tecnologia",
] as const;
export type IconoCategoria = (typeof ICONOS_CATEGORIA)[number];

export type CategoriaData = { nombre: string; icono: IconoCategoria };

export type MultimediaData = {
  tipo: "video" | "imagen";
  videoUrl: string | null;
  poster: ImagenSanity | null;
  imagen: ImagenSanity | null;
  testimonio: { cita: string; autor: string; cargo: string } | null;
  texto: string;
  cuenta: { nombre: string; slug: string; logo: string | null } | null;
};

export type ClienteMarquesina = { nombre: string; slug: string; logo: string | null };

export type ClientesData = {
  titulo: string;
  descripcion: string;
  categorias: CategoriaData[];
  multimedia: MultimediaData;
  cta: CtaSimple;
  animar: boolean;
  clientes: ClienteMarquesina[];
};

export type Resena = {
  id: string;
  nombre: string;
  foto: string | null;
  empresa: string;
  estrellas: number;
  comentario: string;
  enlace: string | null;
};

export type ResenasData = {
  titulo: string;
  descripcion: string;
  enlaceGoogle: string;
  animar: boolean;
  resenas: Resena[];
};

export type PaginaMarketingDigital = {
  equipo: BannerFotoData;
  queEs: PiezaGraficaData;
  navegamos: PiezaGraficaData;
  metodo: MetodoData;
  clientes: ClientesData;
  resenas: ResenasData;
  ctaFinal: BannerFotoData;
};

// ============================================================
// Respaldo: el copy del brief, textual
// ============================================================

const CTA_VENTAS: CtaSimple = { texto: "Quiero Mejorar mis Ventas", enlace: "/contactanos" };

const MULTIMEDIA_VACIA: MultimediaData = {
  tipo: "video",
  videoUrl: null,
  poster: null,
  imagen: null,
  testimonio: null,
  texto: "",
  cuenta: null,
};

export const FALLBACK_MARKETING: PaginaMarketingDigital = {
  equipo: {
    imagen: null,
    imagenMovil: null,
    etiqueta: "Cuenca - Ecuador",
    titulo: "¿Necesitas un equipo completo de marketing para hacer crecer tu negocio?",
    descripcion:
      "Un equipo de marketing digital completo a una fracción de lo que te costaría contratarlo.",
    destacado: "Un Mar de Ideas",
    cta: CTA_VENTAS,
    alineacion: "izquierda",
    overlay: "medio",
    animar: true,
  },
  queEs: {
    imagen: null,
    imagenMovil: null,
    titulo: "¿Qué es DOFI?",
    texto:
      "¿Sabías que los delfines son seres de alta vibración que han venido a ayudar a las personas a despertar?\n\nUtilizamos este pensamiento como analogía, ya que somos un equipo especializado y con todas las herramientas necesarias que requiere tu marca para fluir en nuevos retos.",
    destacado: "Navegar en un Mar de Oportunidades.",
    textoAdicional: "",
    cta: null,
    animar: true,
  },
  navegamos: {
    imagen: null,
    imagenMovil: null,
    titulo: "¿Cómo navegamos contigo?",
    texto:
      "Dentro del infinito mar de ideas y posibilidades buscamos la mejor forma de adaptarnos a tu marca y guiarla hacia el éxito.",
    destacado: "",
    textoAdicional:
      "Durante el viaje te guiamos por diferentes fases donde exploramos oportunidades y construimos la mejor propuesta para tu marca.",
    cta: null,
    animar: true,
  },
  metodo: {
    imagenes: [],
    titulo: "Método DOFI en 5 pasos",
    introduccion: "",
    pasos: [
      {
        titulo: "Adentrarnos en tu marca",
        descripcion: "Investigación de experiencia y características de la marca.",
      },
      { titulo: "Bitácora de viaje", descripcion: "Desarrollo de propuesta de valor." },
      { titulo: "Preparados para zarpar", descripcion: "Creación de campaña publicitaria." },
      {
        titulo: "Navegando con viento a favor",
        descripcion: "Ejecución del plan de marketing de contenido.",
      },
      { titulo: "Retorno de tu inversión", descripcion: "Monitoreo y optimización de datos." },
    ],
    mostrarPasos: true,
    mensajeFinal: "Ventas inteligentes garantizadas.",
    cta: CTA_VENTAS,
    animar: true,
  },
  clientes: {
    titulo: "Clientes y casos de éxito",
    descripcion: "",
    categorias: [
      { nombre: "Construcción", icono: "construccion" },
      { nombre: "Belleza", icono: "belleza" },
      { nombre: "Servicios", icono: "servicios" },
      { nombre: "Comercio", icono: "comercio" },
      { nombre: "Emprendedores", icono: "emprendedores" },
    ],
    multimedia: MULTIMEDIA_VACIA,
    cta: { texto: "Ver casos de éxito", enlace: "/clientes" },
    animar: true,
    clientes: [],
  },
  resenas: {
    titulo: "Reseñas en Google",
    descripcion: "",
    enlaceGoogle: company.location.mapsUrl,
    animar: true,
    resenas: [],
  },
  ctaFinal: {
    imagen: null,
    imagenMovil: null,
    etiqueta: "",
    titulo: "¿Somos socios o le pasas tu oportunidad a alguien más?",
    descripcion: "",
    destacado: "",
    cta: CTA_VENTAS,
    alineacion: "centro",
    overlay: "medio",
    animar: true,
  },
};

// ============================================================
// Consulta
// ============================================================

/** Proyeccion de una imagen con su alt, que vive DENTRO del campo imagen
 *  (ver campoImagen en el Studio): el alt viaja siempre pegado a su archivo. */
const IMG = `"url": asset->url, "ancho": asset->metadata.dimensions.width, "alto": asset->metadata.dimensions.height, "hotspot": hotspot{ x, y }, "alt": alt`;
const CTA = `cta{ texto, enlace }`;
const BANNER_FOTO = `etiqueta, titulo, descripcion, destacado, ${CTA}, alineacion, overlay, animar, "imagen": imagen{ ${IMG} }, "imagenMovil": imagenMovil{ ${IMG} }`;
const PIEZA = `titulo, texto, destacado, textoAdicional, ${CTA}, animar, "imagen": imagen{ ${IMG} }, "imagenMovil": imagenMovil{ ${IMG} }`;

const QUERY_MARKETING = `{
  "pagina": *[_type == "marketingDigitalPage"][0]{
    equipo{ ${BANNER_FOTO} },
    queEs{ ${PIEZA} },
    navegamos{ ${PIEZA} },
    metodo{
      titulo, introduccion, mostrarPasos, mensajeFinal, ${CTA}, animar,
      "imagenes": imagenes[]{ ${IMG} },
      pasos[]{ titulo, descripcion }
    },
    clientes{
      titulo, descripcion, ${CTA}, animar,
      categorias[]{ nombre, icono },
      multimedia{
        tipo, texto,
        "videoUrl": video.asset->url,
        "poster": poster{ ${IMG} },
        "imagen": imagen{ ${IMG} },
        testimonio{ cita, autor, cargo },
        "cuenta": cuentaRelacionada->{ nombre, "slug": slug.current, "logo": logo.asset->url + "?w=240&auto=format" }
      }
    },
    resenas{ titulo, descripcion, enlaceGoogle, animar },
    ctaFinal{ ${BANNER_FOTO} }
  },
  "clientes": *[_type == "cuenta" && activa == true] | order(orden asc){
    nombre, "slug": slug.current, "logo": logo.asset->url + "?w=320&auto=format"
  },
  "resenas": *[_type == "resena" && activa != false] | order(orden asc, _createdAt desc){
    "id": _id, nombre, empresa, estrellas, comentario,
    "foto": foto.asset->url + "?w=160&h=160&fit=crop&auto=format",
    "enlace": enlaceOriginal
  }
}`;

// ============================================================
// Forma cruda (laxa: cualquier campo puede faltar)
// ============================================================

type Txt = string | null | undefined;
type ImgRaw =
  | { url?: Txt; ancho?: number | null; alto?: number | null; hotspot?: { x: number; y: number } | null; alt?: Txt }
  | null
  | undefined;
type CtaRaw = { texto?: Txt; enlace?: Txt } | null | undefined;

type BannerFotoRaw =
  | {
      etiqueta?: Txt;
      titulo?: Txt;
      descripcion?: Txt;
      destacado?: Txt;
      cta?: CtaRaw;
      alineacion?: Txt;
      overlay?: Txt;
      animar?: boolean | null;
      imagen?: ImgRaw;
      imagenMovil?: ImgRaw;
    }
  | null
  | undefined;

type PiezaRaw =
  | {
      titulo?: Txt;
      texto?: Txt;
      destacado?: Txt;
      textoAdicional?: Txt;
      cta?: CtaRaw;
      animar?: boolean | null;
      imagen?: ImgRaw;
      imagenMovil?: ImgRaw;
    }
  | null
  | undefined;

type MetodoRaw =
  | {
      titulo?: Txt;
      introduccion?: Txt;
      mostrarPasos?: boolean | null;
      mensajeFinal?: Txt;
      cta?: CtaRaw;
      animar?: boolean | null;
      imagenes?: ImgRaw[] | null;
      pasos?: { titulo?: Txt; descripcion?: Txt }[] | null;
    }
  | null
  | undefined;

type ClientesRaw =
  | {
      titulo?: Txt;
      descripcion?: Txt;
      cta?: CtaRaw;
      animar?: boolean | null;
      categorias?: { nombre?: Txt; icono?: Txt }[] | null;
      multimedia?: {
        tipo?: Txt;
        texto?: Txt;
        videoUrl?: Txt;
        poster?: ImgRaw;
        imagen?: ImgRaw;
        testimonio?: { cita?: Txt; autor?: Txt; cargo?: Txt } | null;
        cuenta?: { nombre?: Txt; slug?: Txt; logo?: Txt } | null;
      } | null;
    }
  | null
  | undefined;

type ResenasRaw =
  | { titulo?: Txt; descripcion?: Txt; enlaceGoogle?: Txt; animar?: boolean | null }
  | null
  | undefined;

type RespuestaRaw = {
  pagina: {
    equipo?: BannerFotoRaw;
    queEs?: PiezaRaw;
    navegamos?: PiezaRaw;
    metodo?: MetodoRaw;
    clientes?: ClientesRaw;
    resenas?: ResenasRaw;
    ctaFinal?: BannerFotoRaw;
  } | null;
  clientes: { nombre?: Txt; slug?: Txt; logo?: Txt }[] | null;
  resenas:
    | {
        id?: Txt;
        nombre?: Txt;
        empresa?: Txt;
        estrellas?: number | null;
        comentario?: Txt;
        foto?: Txt;
        enlace?: Txt;
      }[]
    | null;
};

// ============================================================
// Normalizado
// ============================================================

const t = (v: Txt): string => (typeof v === "string" ? v.trim() : "");
const bool = (v: boolean | null | undefined, porDefecto: boolean) =>
  typeof v === "boolean" ? v : porDefecto;

function unoDe<T extends string>(v: Txt, validos: readonly T[], porDefecto: T): T {
  return (validos as readonly string[]).includes(v ?? "") ? (v as T) : porDefecto;
}

/** Una imagen sin archivo, o sin dimensiones, no se puede mostrar sin
 *  adivinar su proporcion: se descarta y la seccion usa su estado vacio. */
function imagen(raw: ImgRaw, ancho: number, altPorDefecto = ""): ImagenSanity | null {
  if (!raw?.url || !raw.ancho || !raw.alto) return null;
  return {
    url: `${raw.url}?w=${ancho}&auto=format`,
    ancho: raw.ancho,
    alto: raw.alto,
    hotspot: raw.hotspot ?? null,
    alt: t(raw.alt) || altPorDefecto,
  };
}

/** Un boton sin texto o sin enlace no es un boton a medias: es ningun boton. */
function cta(raw: CtaRaw): CtaSimple {
  const texto = t(raw?.texto);
  const enlace = t(raw?.enlace);
  return texto && enlace ? { texto, enlace } : null;
}

function bannerFoto(raw: NonNullable<BannerFotoRaw>, respaldo: BannerFotoData): BannerFotoData {
  const titulo = t(raw.titulo) || respaldo.titulo;
  return {
    imagen: imagen(raw.imagen, 2400, titulo),
    imagenMovil: imagen(raw.imagenMovil, 1200, titulo),
    etiqueta: t(raw.etiqueta),
    titulo,
    descripcion: t(raw.descripcion),
    destacado: t(raw.destacado),
    cta: cta(raw.cta),
    alineacion: unoDe(raw.alineacion, ["izquierda", "centro", "derecha"] as const, respaldo.alineacion),
    overlay: unoDe(raw.overlay, ["ninguno", "suave", "medio", "fuerte"] as const, respaldo.overlay),
    animar: bool(raw.animar, true),
  };
}

function pieza(raw: NonNullable<PiezaRaw>, respaldo: PiezaGraficaData): PiezaGraficaData {
  return {
    imagen: imagen(raw.imagen, 2400),
    imagenMovil: imagen(raw.imagenMovil, 1200),
    titulo: t(raw.titulo) || respaldo.titulo,
    texto: t(raw.texto),
    destacado: t(raw.destacado),
    textoAdicional: t(raw.textoAdicional),
    cta: cta(raw.cta),
    animar: bool(raw.animar, true),
  };
}

function metodo(raw: NonNullable<MetodoRaw>, respaldo: MetodoData): MetodoData {
  const pasos = (raw.pasos ?? [])
    .map((p) => ({ titulo: t(p.titulo), descripcion: t(p.descripcion) }))
    .filter((p) => p.titulo);
  return {
    imagenes: (raw.imagenes ?? [])
      .map((i) => imagen(i, 2400, "Método DOFI"))
      .filter((i): i is ImagenSanity => i !== null),
    titulo: t(raw.titulo) || respaldo.titulo,
    introduccion: t(raw.introduccion),
    pasos,
    mostrarPasos: bool(raw.mostrarPasos, true) && pasos.length > 0,
    mensajeFinal: t(raw.mensajeFinal),
    cta: cta(raw.cta),
    animar: bool(raw.animar, true),
  };
}

function clientesSeccion(
  raw: NonNullable<ClientesRaw>,
  respaldo: ClientesData,
  clientes: ClienteMarquesina[]
): ClientesData {
  const m = raw.multimedia;
  const cita = t(m?.testimonio?.cita);
  const autor = t(m?.testimonio?.autor);
  return {
    titulo: t(raw.titulo) || respaldo.titulo,
    descripcion: t(raw.descripcion),
    categorias: (raw.categorias ?? [])
      .map((c) => ({ nombre: t(c.nombre), icono: unoDe(c.icono, ICONOS_CATEGORIA, "servicios") }))
      .filter((c) => c.nombre),
    multimedia: {
      tipo: unoDe(m?.tipo, ["video", "imagen"] as const, "video"),
      videoUrl: t(m?.videoUrl) || null,
      poster: imagen(m?.poster, 1600),
      imagen: imagen(m?.imagen, 1600),
      // Un testimonio sin cita o sin autor no se muestra: sin firma, una
      // cita no es un testimonio.
      testimonio: cita && autor ? { cita, autor, cargo: t(m?.testimonio?.cargo) } : null,
      texto: t(m?.texto),
      cuenta: t(m?.cuenta?.nombre)
        ? { nombre: t(m?.cuenta?.nombre), slug: t(m?.cuenta?.slug), logo: t(m?.cuenta?.logo) || null }
        : null,
    },
    cta: cta(raw.cta),
    animar: bool(raw.animar, true),
    clientes,
  };
}

function resenasSeccion(raw: NonNullable<ResenasRaw>, respaldo: ResenasData, resenas: Resena[]): ResenasData {
  return {
    titulo: t(raw.titulo) || respaldo.titulo,
    descripcion: t(raw.descripcion),
    enlaceGoogle: t(raw.enlaceGoogle) || respaldo.enlaceGoogle,
    animar: bool(raw.animar, true),
    resenas,
  };
}

function normalizarClientes(raw: RespuestaRaw["clientes"] | undefined): ClienteMarquesina[] {
  return (raw ?? [])
    .filter((c) => t(c.nombre))
    .map((c) => ({ nombre: t(c.nombre), slug: t(c.slug), logo: t(c.logo) || null }));
}

/** Reseñas: SOLO las que alguien cargo a mano en el Studio, copiadas de
 *  Google. Nunca hay reseñas de respaldo en el codigo -- una reseña
 *  inventada es publicidad engañosa. Sin reseñas, la seccion lo dice y
 *  manda al perfil real de Google. */
function normalizarResenas(raw: RespuestaRaw["resenas"] | undefined): Resena[] {
  return (raw ?? [])
    .filter((r) => t(r.nombre) && t(r.comentario) && typeof r.estrellas === "number")
    .map((r) => ({
      id: t(r.id) || t(r.nombre),
      nombre: t(r.nombre),
      foto: t(r.foto) || null,
      empresa: t(r.empresa),
      estrellas: Math.min(5, Math.max(1, Math.round(r.estrellas as number))),
      comentario: t(r.comentario),
      enlace: t(r.enlace) || null,
    }));
}

export async function getPaginaMarketingDigital(): Promise<PaginaMarketingDigital> {
  const respuesta = await sanityQuery<RespuestaRaw>(QUERY_MARKETING);
  const F = FALLBACK_MARKETING;

  // Sin Sanity (credenciales, red): clientes del respaldo local, el mismo
  // que usa el resto del sitio. Con Sanity, solo las cuentas activas.
  const clientes = respuesta
    ? normalizarClientes(respuesta.clientes)
    : clientesRespaldo.map((c) => ({ nombre: c.name, slug: c.slug, logo: c.logo ?? null }));
  const resenas = normalizarResenas(respuesta?.resenas);

  const p = respuesta?.pagina;
  if (!p) {
    return {
      ...F,
      clientes: { ...F.clientes, clientes },
      resenas: { ...F.resenas, resenas },
    };
  }

  return {
    equipo: p.equipo ? bannerFoto(p.equipo, F.equipo) : F.equipo,
    queEs: p.queEs ? pieza(p.queEs, F.queEs) : F.queEs,
    navegamos: p.navegamos ? pieza(p.navegamos, F.navegamos) : F.navegamos,
    metodo: p.metodo ? metodo(p.metodo, F.metodo) : F.metodo,
    clientes: p.clientes
      ? clientesSeccion(p.clientes, F.clientes, clientes)
      : { ...F.clientes, clientes },
    resenas: p.resenas ? resenasSeccion(p.resenas, F.resenas, resenas) : { ...F.resenas, resenas },
    ctaFinal: p.ctaFinal ? bannerFoto(p.ctaFinal, F.ctaFinal) : F.ctaFinal,
  };
}
