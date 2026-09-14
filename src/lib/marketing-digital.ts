import { sanityQuery } from "@/lib/sanity";
import { clients as clientesRespaldo } from "@/data/clients";
import { company } from "@/config/company";

/**
 * Datos de la pagina /marketing-digital.
 *
 * ESTRUCTURA: documento singleton "marketingDigitalPage" con un arreglo
 * `sections[]`. Cada item es una seccion tipada (teamBanner, aboutBanner,
 * navigationBanner, methodBanner, clientsBanner, reviewsBanner, ctaBanner) y
 * el ORDEN DEL ARREGLO ES EL ORDEN DE LA PAGINA: se reordena arrastrando en
 * el Studio. No hay un campo numerico "orden" aparte a proposito -- dos
 * fuentes de orden terminan contradiciendose.
 *
 * UNA sola consulta trae las secciones, los clientes activos de la
 * marquesina (tipo "cuenta", el mismo de /clientes) y las reseñas activas.
 *
 * RESPALDO: si Sanity no responde o el documento no tiene secciones, la
 * pagina se arma con SECCIONES_RESPALDO (el copy del brief). Si el documento
 * tiene secciones, se respeta tal cual: una seccion apagada no se muestra y
 * un campo vaciado queda vacio.
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
export type PasoMetodo = { titulo: string; descripcion: string };

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

export type ClienteMarquesina = { nombre: string; slug: string; logo: string | null };

/** Una empresa dentro de un giro. Puede venir de una Cuenta (su nombre y su
 *  logo son los de la Cuenta: no se duplican) o cargarse directo en el giro
 *  con su propio logo. `logo` trae las dimensiones reales del archivo para
 *  reservar su proporcion y no deformarlo. */
export type EmpresaGiro = {
  key: string;
  nombre: string;
  logo: { url: string; ancho: number; alto: number } | null;
};

/** Giro de negocio: un panel del carrusel de Clientes y su lista de empresas. */
export type GiroNegocio = {
  key: string;
  nombre: string;
  icono: IconoCategoria;
  imagen: ImagenSanity | null;
  empresas: EmpresaGiro[];
};

export const FORMATOS_VIDEO = ["vertical", "cuadrado", "horizontal"] as const;
export type FormatoVideo = (typeof FORMATOS_VIDEO)[number];
export type VideoSeccion = { url: string; formato: FormatoVideo; sonido: boolean };

export type Resena = {
  id: string;
  nombre: string;
  foto: string | null;
  empresa: string;
  estrellas: number;
  comentario: string;
  enlace: string | null;
};

/** Campos comunes a todas las secciones (los del brief). */
type Base = {
  key: string;
  imagen: ImagenSanity | null;
  imagenMovil: ImagenSanity | null;
  subtitulo: string;
  titulo: string;
  descripcion: string;
  destacado: string;
  cta: CtaSimple;
  animar: boolean;
};

export type SeccionEquipo = Base & { tipo: "teamBanner"; alineacion: Alineacion; overlay: Overlay };
export type SeccionQueEs = Base & { tipo: "aboutBanner" };
export type SeccionNavegacion = Base & { tipo: "navigationBanner" };
export type SeccionMetodo = Base & { tipo: "methodBanner"; pasos: PasoMetodo[]; mostrarPasos: boolean };
export type SeccionClientes = Base & {
  tipo: "clientsBanner";
  giros: GiroNegocio[];
  rotacionAutomatica: boolean;
  /** Columna derecha. La portada es `imagen` (campo comun de la seccion). */
  video: VideoSeccion | null;
  /** Marquesina continua: todas las Cuentas activas. */
  clientes: ClienteMarquesina[];
};
export type SeccionResenas = Base & { tipo: "reviewsBanner"; enlaceGoogle: string; resenas: Resena[] };
export type SeccionCierre = Base & { tipo: "ctaBanner"; alineacion: Alineacion; overlay: Overlay };

export type SeccionMarketing =
  | SeccionEquipo
  | SeccionQueEs
  | SeccionNavegacion
  | SeccionMetodo
  | SeccionClientes
  | SeccionResenas
  | SeccionCierre;

export type TipoSeccion = SeccionMarketing["tipo"];

// ============================================================
// Respaldo: el copy del brief, textual
// ============================================================

const CTA_VENTAS: CtaSimple = { texto: "Quiero Mejorar mis Ventas", enlace: "/contactanos" };

function base(key: string, parcial: Partial<Base>): Base {
  return {
    key,
    imagen: null,
    imagenMovil: null,
    subtitulo: "",
    titulo: "",
    descripcion: "",
    destacado: "",
    cta: null,
    animar: true,
    ...parcial,
  };
}

export const SECCIONES_RESPALDO: SeccionMarketing[] = [
  {
    ...base("respaldo-equipo", {
      subtitulo: "Cuenca - Ecuador",
      titulo: "¿Necesitas un equipo de marketing completo?",
      descripcion: "Todo lo que necesitas para hacer crecer tu negocio, en un solo equipo.",
      destacado: "Un Mar de Ideas",
      cta: CTA_VENTAS,
    }),
    tipo: "teamBanner",
    alineacion: "izquierda",
    overlay: "medio",
  },
  {
    ...base("respaldo-que-es", {
      titulo: "¿Qué es DOFI?",
      descripcion:
        "¿Sabías que los delfines son seres de alta vibración que han venido a ayudar a las personas a despertar?\n\nUtilizamos este pensamiento como analogía, ya que somos un equipo especializado y con todas las herramientas necesarias que requiere tu marca para fluir en nuevos retos.",
      destacado: "Navegar en un Mar de Oportunidades.",
    }),
    tipo: "aboutBanner",
  },
  {
    ...base("respaldo-navegamos", {
      titulo: "¿Cómo navegamos contigo?",
      descripcion:
        "Dentro del infinito mar de ideas y posibilidades buscamos la mejor forma de adaptarnos a tu marca y guiarla hacia el éxito.\n\nDurante el viaje te guiamos por diferentes fases donde exploramos oportunidades y construimos la mejor propuesta para tu marca.",
    }),
    tipo: "navigationBanner",
  },
  {
    ...base("respaldo-metodo", {
      titulo: "Método DOFI en 5 pasos",
      destacado: "Ventas Inteligentes Garantizadas",
      cta: CTA_VENTAS,
    }),
    tipo: "methodBanner",
    mostrarPasos: true,
    pasos: [
      { titulo: "Adentrarnos en tu marca", descripcion: "Investigación de experiencia y características de la marca." },
      { titulo: "Bitácora de viaje", descripcion: "Desarrollo de propuesta de valor." },
      { titulo: "Preparados para zarpar", descripcion: "Creación de campaña publicitaria." },
      { titulo: "Navegando con viento a favor", descripcion: "Ejecución del plan de marketing de contenido." },
      { titulo: "Retorno de tu inversión", descripcion: "Monitoreo y optimización de datos." },
    ],
  },
  {
    ...base("respaldo-clientes", {
      titulo: "Clientes y casos de éxito",
      cta: { texto: "Ver casos de éxito", enlace: "/clientes" },
    }),
    tipo: "clientsBanner",
    // Los giros del Studio, sin empresas: asignarlas es decision editorial.
    giros: (
      [
        ["Construcción", "construccion"],
        ["Belleza", "belleza"],
        ["Servicios", "servicios"],
        ["Comercio", "comercio"],
        ["Emprendedores", "emprendedores"],
      ] as const
    ).map(([nombre, icono]) => ({ key: `respaldo-${icono}`, nombre, icono, imagen: null, empresas: [] })),
    rotacionAutomatica: true,
    video: null,
    clientes: [],
  },
  {
    ...base("respaldo-resenas", { titulo: "Reseñas en Google" }),
    tipo: "reviewsBanner",
    enlaceGoogle: company.location.mapsUrl,
    resenas: [],
  },
  {
    ...base("respaldo-cierre", {
      titulo: "¿Somos socios o le pasas tu oportunidad a alguien más?",
      cta: CTA_VENTAS,
    }),
    tipo: "ctaBanner",
    alineacion: "centro",
    overlay: "medio",
  },
];

// ============================================================
// Consulta
// ============================================================

/** Imagen con su alt, que vive DENTRO del campo imagen en el Studio. */
const IMG = `"url": asset->url, "ancho": asset->metadata.dimensions.width, "alto": asset->metadata.dimensions.height, "hotspot": hotspot{ x, y }, "alt": alt`;

/** Logo de una empresa de giro, con sus dimensiones reales (object-contain
 *  necesita la proporcion para reservar el espacio sin deformar). */
const LOGO = `"logo": logo.asset->url, "ancho": logo.asset->metadata.dimensions.width, "alto": logo.asset->metadata.dimensions.height`;

const QUERY_MARKETING = `{
  "pagina": *[_type == "marketingDigitalPage"][0]{
    sections[]{
      _type, _key, activo, subtitulo, titulo, descripcion, destacado, animar,
      cta{ texto, enlace },
      "imagen": imagen{ ${IMG} },
      "imagenMovil": imagenMovil{ ${IMG} },
      _type in ["teamBanner", "ctaBanner"] => { alineacion, overlay },
      _type == "methodBanner" => { mostrarPasos, pasos[]{ titulo, descripcion } },
      _type == "clientsBanner" => {
        "giros": categorias[]{
          _key, nombre, icono,
          "imagen": imagen{ ${IMG} },
          "empresas": empresas[]{
            _key,
            defined(_ref) => @->{ nombre, activa, ${LOGO} },
            !defined(_ref) => { nombre, ${LOGO} }
          }
        },
        rotacionAutomatica,
        "videoUrl": video.asset->url, formatoVideo, sonidoVideo
      },
      _type == "reviewsBanner" => { enlaceGoogle }
    }
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

/** Una empresa de giro cruda. Si era una referencia a una Cuenta borrada,
 *  llega solo con _key (sin nombre) y se descarta. */
type EmpresaRaw = {
  _key?: Txt;
  nombre?: Txt;
  activa?: boolean | null;
  logo?: Txt;
  ancho?: number | null;
  alto?: number | null;
} | null;

type GiroRaw = {
  _key?: Txt;
  nombre?: Txt;
  icono?: Txt;
  imagen?: ImgRaw;
  empresas?: EmpresaRaw[] | null;
} | null;

type SeccionRaw = {
  _type?: Txt;
  _key?: Txt;
  activo?: boolean | null;
  subtitulo?: Txt;
  titulo?: Txt;
  descripcion?: Txt;
  destacado?: Txt;
  animar?: boolean | null;
  cta?: CtaRaw;
  imagen?: ImgRaw;
  imagenMovil?: ImgRaw;
  alineacion?: Txt;
  overlay?: Txt;
  mostrarPasos?: boolean | null;
  pasos?: { titulo?: Txt; descripcion?: Txt }[] | null;
  giros?: GiroRaw[] | null;
  rotacionAutomatica?: boolean | null;
  videoUrl?: Txt;
  formatoVideo?: Txt;
  sonidoVideo?: boolean | null;
  enlaceGoogle?: Txt;
};

type RespuestaRaw = {
  pagina: { sections?: SeccionRaw[] | null } | null;
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
 *  adivinar su proporcion: se descarta y la seccion usa su estado sin imagen. */
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

/** `altFoto`: en las fotos de fondo el titulo es un buen alt por defecto.
 *  En las piezas graficas no: su alt lo arma el componente con el texto que
 *  la pieza trae dibujado. */
function camposBase(raw: SeccionRaw, altFoto: boolean): Base {
  const titulo = t(raw.titulo);
  return {
    key: t(raw._key) || t(raw._type),
    imagen: imagen(raw.imagen, 2400, altFoto ? titulo : ""),
    imagenMovil: imagen(raw.imagenMovil, 1200, altFoto ? titulo : ""),
    subtitulo: t(raw.subtitulo),
    titulo,
    descripcion: t(raw.descripcion),
    destacado: t(raw.destacado),
    cta: cta(raw.cta),
    animar: bool(raw.animar, true),
  };
}

const ALINEACIONES = ["izquierda", "centro", "derecha"] as const;
const OVERLAYS = ["ninguno", "suave", "medio", "fuerte"] as const;

/** Giros con sus empresas, en el orden del Studio. Se descartan: giros sin
 *  nombre, empresas sin nombre (referencia a una Cuenta borrada) y Cuentas
 *  desactivadas -- una Cuenta apagada no aparece en ningun lado del sitio. */
function normalizarGiros(raw: GiroRaw[] | null | undefined): GiroNegocio[] {
  return (raw ?? [])
    .filter((g): g is NonNullable<GiroRaw> => Boolean(g && t(g.nombre)))
    .map((g, i) => ({
      key: t(g._key) || `giro-${i}`,
      nombre: t(g.nombre),
      icono: unoDe(g.icono, ICONOS_CATEGORIA, "servicios"),
      imagen: imagen(g.imagen, 1200, t(g.nombre)),
      empresas: (g.empresas ?? [])
        .filter((e): e is NonNullable<EmpresaRaw> => Boolean(e && t(e.nombre)) && e?.activa !== false)
        .map((e, j) => ({
          key: t(e._key) || `${i}-${j}`,
          nombre: t(e.nombre),
          logo:
            t(e.logo) && e.ancho && e.alto
              ? { url: `${t(e.logo)}?w=360&fit=max&auto=format`, ancho: e.ancho, alto: e.alto }
              : null,
        })),
    }));
}

function normalizarVideo(raw: SeccionRaw): VideoSeccion | null {
  const url = t(raw.videoUrl);
  if (!url) return null;
  return { url, formato: unoDe(raw.formatoVideo, FORMATOS_VIDEO, "vertical"), sonido: bool(raw.sonidoVideo, false) };
}

function normalizarSeccion(
  raw: SeccionRaw,
  clientes: ClienteMarquesina[],
  resenas: Resena[]
): SeccionMarketing | null {
  if (!raw || raw.activo === false) return null;

  switch (raw._type) {
    case "teamBanner":
    case "ctaBanner":
      return {
        ...camposBase(raw, true),
        tipo: raw._type,
        alineacion: unoDe(raw.alineacion, ALINEACIONES, raw._type === "teamBanner" ? "izquierda" : "centro"),
        overlay: unoDe(raw.overlay, OVERLAYS, "medio"),
      };
    case "aboutBanner":
    case "navigationBanner":
      return { ...camposBase(raw, false), tipo: raw._type };
    case "methodBanner":
      return {
        ...camposBase(raw, false),
        tipo: "methodBanner",
        mostrarPasos: bool(raw.mostrarPasos, true),
        pasos: (raw.pasos ?? [])
          .map((p) => ({ titulo: t(p.titulo), descripcion: t(p.descripcion) }))
          .filter((p) => p.titulo),
      };
    case "clientsBanner":
      return {
        // En Clientes, `imagen` es la portada del video: alt vacio (decorativa).
        ...camposBase(raw, false),
        tipo: "clientsBanner",
        giros: normalizarGiros(raw.giros),
        rotacionAutomatica: bool(raw.rotacionAutomatica, true),
        video: normalizarVideo(raw),
        clientes,
      };
    case "reviewsBanner":
      return {
        ...camposBase(raw, false),
        tipo: "reviewsBanner",
        enlaceGoogle: t(raw.enlaceGoogle) || company.location.mapsUrl,
        resenas,
      };
    default:
      // Un tipo que este codigo todavia no sabe pintar se ignora sin romper.
      return null;
  }
}

function normalizarClientes(raw: RespuestaRaw["clientes"] | undefined): ClienteMarquesina[] {
  return (raw ?? [])
    .filter((c) => t(c.nombre))
    .map((c) => ({ nombre: t(c.nombre), slug: t(c.slug), logo: t(c.logo) || null }));
}

/** Reseñas: SOLO las que alguien cargo a mano en el Studio, copiadas de
 *  Google. Nunca hay reseñas de respaldo en el codigo -- una reseña inventada
 *  es publicidad engañosa. */
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

function conDatos(s: SeccionMarketing, clientes: ClienteMarquesina[], resenas: Resena[]): SeccionMarketing {
  if (s.tipo === "clientsBanner") return { ...s, clientes };
  if (s.tipo === "reviewsBanner") return { ...s, resenas };
  return s;
}

export async function getPaginaMarketingDigital(): Promise<{ secciones: SeccionMarketing[] }> {
  const respuesta = await sanityQuery<RespuestaRaw>(QUERY_MARKETING);

  // Sin Sanity (credenciales, red): clientes del respaldo local, el mismo
  // que usa el resto del sitio. Con Sanity, solo las cuentas activas.
  const clientes = respuesta
    ? normalizarClientes(respuesta.clientes)
    : clientesRespaldo.map((c) => ({ nombre: c.name, slug: c.slug, logo: c.logo ?? null }));
  const resenas = normalizarResenas(respuesta?.resenas);

  const crudas = respuesta?.pagina?.sections ?? [];
  if (crudas.length === 0) {
    return { secciones: SECCIONES_RESPALDO.map((s) => conDatos(s, clientes, resenas)) };
  }

  return {
    secciones: crudas
      .map((s) => normalizarSeccion(s, clientes, resenas))
      .filter((s): s is SeccionMarketing => s !== null),
  };
}
