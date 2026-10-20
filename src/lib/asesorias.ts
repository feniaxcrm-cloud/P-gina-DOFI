import { sanityQuery } from "@/lib/sanity";
import { obtenerResenasGoogle } from "@/lib/google-places";
import { GIRO_GROQ } from "@/lib/giros";
import { COPY_ASESORIAS, IMAGENES_ASESORIAS } from "@/lib/asesorias-respaldo";
import { IMAGEN_CIERRE_SOCIOS } from "@/lib/cierre-socios";
import {
  AJUSTE_LOGOS_GROQ,
  AJUSTE_LOGOS_POR_DEFECTO,
  IMG,
  normalizarAjusteLogos,
  bool,
  camposBase,
  imagen,
  normalizarGiros,
  normalizarResenas,
  normalizarSeccion,
  t,
  type BaseSeccion,
  type GiroNegocio,
  type GiroRaw,
  type ImagenSanity,
  type ImgRaw,
  type RespuestaRaw,
  type SeccionCierre,
  type SeccionClientes,
  type SeccionMetodo,
  type SeccionNavegacion,
  type SeccionQueEs,
  type SeccionRaw,
  type SeccionResenas,
} from "@/lib/marketing-digital";

/**
 * Datos de la página /asesorias (Asesorías 1 a 1 · Rescatando Emprendedores).
 *
 * MISMA ESTRUCTURA QUE MARKETING DIGITAL: documento singleton "asesoriasPage"
 * con `sections[]` ordenable en el Studio y los mismos componentes donde la
 * sección es la misma (¿Qué es...?, reseñas, cierre). Lo propio de esta
 * página:
 *  - "splitHeroBanner": portada con título, logo, frase e imagen a la derecha.
 *  - Clientes y casos de éxito es EXACTAMENTE el de Marketing Digital
 *    (pedido del 2026-10-08): el carrusel de giros con sus logos y, al lado, el
 *    video. Es el mismo tipo ("clientsBanner"); lo que no se carga acá (giros,
 *    video, portada) se toma de Marketing Digital.
 *  - "achievementsBanner": LOGROS (pedido del 2026-10-07, reemplaza a las
 *    reseñas en esta página): un mazo de tarjetas y, al lado, la foto de la
 *    historia al frente. Cada clic en la tarjeta pasa a otra historia y cambia
 *    la foto. Cuántas tarjetas, sus fotos y sus textos se editan en el Studio.
 *
 * CLIENTES SIN GIROS NI VIDEO PROPIOS: igual que Tráfico y FENIAX, si la
 * sección no tiene giros cargados usa los de Marketing Digital (las mismas
 * empresas y logos, sin cargarlos dos veces); y con el video pasa lo mismo.
 *
 * CIERRE: el de Marketing Digital, con las dos imágenes que lo acompañan (el
 * hombre y el delfín), editables en el Studio.
 *
 * RESPALDO: mientras el documento no tenga NINGUNA sección activa, la página
 * se arma con respaldo() (abajo), con los textos e imágenes de
 * src/lib/asesorias-respaldo.ts. Con una sola sección activa, manda el Studio.
 */

// ============================================================
// Tipos
// ============================================================

export type CasoExito = {
  key: string;
  titulo: string;
  texto: string;
  /** Nombre del giro tal como se cargó; "" = sin giro. */
  giro: string;
  cliente: string;
  imagen: ImagenSanity | null;
};

/** Una tarjeta de Logros: la frase grande, su remate, la etiqueta (rubro o
 *  servicio), el nombre que va sobre la foto, la firma al pie y la foto. */
export type Logro = {
  key: string;
  titulo: string;
  texto: string;
  etiqueta: string;
  nombre: string;
  firma: string;
  foto: ImagenSanity | null;
};

export type SeccionPortadaAsesorias = BaseSeccion & { tipo: "splitHeroBanner"; logo: ImagenSanity | null };

export type SeccionLogros = BaseSeccion & {
  tipo: "achievementsBanner";
  logros: Logro[];
  pasoAutomatico: boolean;
  segundosPorLogro: number;
};

/** Un celular de «Videos en celulares»: su video (o null mientras no se
 *  suba), el título que va sobre el video y la portada. */
export type VideoCelular = { url: string | null; titulo: string; portada: ImagenSanity | null };

/** «Videos en celulares» (pedido del 2026-10-20): tres celulares, el del
 *  centro es el principal. Cada uno con su propio video desde el Studio. */
export type SeccionCelulares = BaseSeccion & {
  tipo: "celularesBanner";
  izquierdo: VideoCelular;
  central: VideoCelular;
  derecho: VideoCelular;
};

export type SeccionAsesorias =
  | SeccionPortadaAsesorias
  | SeccionCelulares
  | SeccionQueEs
  | SeccionNavegacion
  | SeccionMetodo
  | SeccionClientes
  | SeccionLogros
  | SeccionResenas
  | SeccionCierre;

export type TipoSeccionAsesorias = SeccionAsesorias["tipo"];

/** Compara nombres de giro sin mayúsculas, tildes ni espacios de más: el
 *  caso guarda el nombre que eligió el editor, y el giro pudo cargarse
 *  "CONSTRUCCIÓN" o "Construccion". */
export function claveGiro(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// Respaldo (textos e imágenes en src/lib/asesorias-respaldo.ts)
// ============================================================

function base(key: string, parcial: Partial<BaseSeccion>): BaseSeccion {
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

function imagenLocal(i: { archivo: string; ancho: number; alto: number; alt: string }): ImagenSanity {
  return { url: `/asesorias/${i.archivo}`, ancho: i.ancho, alto: i.alto, hotspot: null, alt: i.alt };
}

/** Lo de Clientes que Asesorías toma de Marketing Digital cuando no lo trae. */
type ClientesMarketing = Pick<SeccionClientes, "subtitulo" | "titulo" | "descripcion" | "rotacionAutomatica" | "ajusteLogos">;

function respaldo(girosMarketing: GiroNegocio[], marketing: ClientesMarketing | null): SeccionAsesorias[] {
  const c = COPY_ASESORIAS;
  const img = IMAGENES_ASESORIAS;
  return [
    {
      ...base("asesorias-portada", {
        titulo: c.portada.titulo,
        descripcion: c.portada.descripcion,
        cta: { ...c.portada.cta },
        imagen: imagenLocal(img.portada),
      }),
      tipo: "splitHeroBanner",
      logo: imagenLocal(img.logo),
    },
    { ...base("asesorias-que-es", c.queEs), tipo: "aboutBanner" },
    {
      ...base("asesorias-clientes", {
        subtitulo: marketing?.subtitulo ?? "",
        titulo: marketing?.titulo || c.clientes.titulo,
        descripcion: marketing?.descripcion ?? "",
      }),
      tipo: "clientsBanner",
      giros: girosMarketing,
      rotacionAutomatica: marketing?.rotacionAutomatica ?? true,
      ajusteLogos: marketing?.ajusteLogos ?? AJUSTE_LOGOS_POR_DEFECTO,
    },
    {
      ...base("asesorias-logros", { subtitulo: c.logros.subtitulo, titulo: c.logros.titulo }),
      tipo: "achievementsBanner",
      logros: c.logros.items.map((l, i) => ({
        key: `logro-${i}`,
        titulo: l.titulo,
        texto: l.texto,
        etiqueta: l.etiqueta,
        nombre: l.nombre,
        firma: l.firma,
        foto: imagenLocal(img.logros[l.foto]),
      })),
      pasoAutomatico: c.logros.pasoAutomatico,
      segundosPorLogro: c.logros.segundosPorLogro,
    },
    {
      ...base("asesorias-cierre", {
        titulo: c.cierre.titulo,
        descripcion: c.cierre.descripcion,
        cta: { ...c.cierre.cta },
        imagen: IMAGEN_CIERRE_SOCIOS,
      }),
      tipo: "ctaBanner",
      alineacion: "centro",
      overlay: "medio",
    },
  ];
}

// ============================================================
// Consulta
// ============================================================

/** Un celular de «Videos en celulares»: el archivo, su título y su portada. */
const CELULAR = `"url": video.asset->url, titulo, "portada": portada{ ${IMG} }`;

const QUERY_ASESORIAS = `{
  "pagina": *[_type == "asesoriasPage"][0]{
    sections[]{
      _type, _key, activo, subtitulo, titulo, descripcion, destacado, animar,
      cta{ texto, enlace },
      "imagen": imagen{ ${IMG} },
      "imagenMovil": imagenMovil{ ${IMG} },
      _type in ["teamBanner", "ctaBanner"] => { alineacion, overlay },
      _type == "methodBanner" => { mostrarPasos, pasos[]{ titulo, descripcion } },
      _type == "splitHeroBanner" => { "logo": logo{ ${IMG} } },
      _type == "clientsBanner" => {
        "giros": categorias[]{ ${GIRO_GROQ} },
        rotacionAutomatica,
        ${AJUSTE_LOGOS_GROQ}
      },
      _type == "celularesBanner" => {
        "izquierdo": celularIzquierdo{ ${CELULAR} },
        "central": celularCentral{ ${CELULAR} },
        "derecho": celularDerecho{ ${CELULAR} }
      },
      _type == "achievementsBanner" => {
        "logros": logros[]{ _key, titulo, texto, etiqueta, nombre, firma, "foto": foto{ ${IMG} } },
        pasoAutomatico,
        segundosPorLogro
      },
      _type == "reviewsBanner" => { enlaceGoogle, cantidadMostrada }
    }
  },
  "girosMarketing": *[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias[]{ ${GIRO_GROQ} },
  "clientesMarketing": *[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0]{
    subtitulo, titulo, descripcion, rotacionAutomatica,
    ${AJUSTE_LOGOS_GROQ}
  },
  "resenas": *[_type == "resena" && activa != false] | order(orden asc, _createdAt desc){
    "id": _id, nombre, empresa, estrellas, comentario, fecha,
    "foto": foto.asset->url + "?w=160&h=160&fit=crop&auto=format",
    "enlace": enlaceOriginal
  }
}`;

type Txt = string | null | undefined;

type LogroRaw = {
  _key?: Txt;
  titulo?: Txt;
  texto?: Txt;
  etiqueta?: Txt;
  nombre?: Txt;
  firma?: Txt;
  foto?: ImgRaw;
} | null;

type CelularRaw = { url?: Txt; titulo?: Txt; portada?: ImgRaw } | null;

type SeccionAsesoriasRaw = SeccionRaw & {
  logo?: ImgRaw;
  izquierdo?: CelularRaw;
  central?: CelularRaw;
  derecho?: CelularRaw;
  logros?: LogroRaw[] | null;
  pasoAutomatico?: boolean | null;
  segundosPorLogro?: number | null;
};

type RespuestaAsesorias = {
  pagina: { sections?: SeccionAsesoriasRaw[] | null } | null;
  girosMarketing: GiroRaw[] | null;
  clientesMarketing: SeccionAsesoriasRaw | null;
  resenas: RespuestaRaw["resenas"];
};

// ============================================================
// Normalizado
// ============================================================

/** Un logro sin titulo no es una tarjeta a medias: no se muestra. */
/** Un celular sin video igual se muestra (con su aviso): la sección conserva
 *  sus tres teléfonos mientras se cargan los videos. */
function celular(raw: CelularRaw | undefined): VideoCelular {
  const titulo = t(raw?.titulo);
  return { url: t(raw?.url) || null, titulo, portada: imagen(raw?.portada, 800, titulo) };
}

function normalizarLogros(raw: LogroRaw[] | null | undefined): Logro[] {
  return (raw ?? [])
    .filter((l): l is NonNullable<LogroRaw> => Boolean(l && t(l.titulo)))
    .map((l, i) => ({
      key: t(l._key) || `logro-${i}`,
      titulo: t(l.titulo),
      texto: t(l.texto),
      etiqueta: t(l.etiqueta),
      nombre: t(l.nombre),
      firma: t(l.firma),
      foto: imagen(l.foto, 1100, [t(l.nombre), t(l.titulo)].filter(Boolean).join(": ")),
    }));
}

/** Segundos por tarjeta en el paso automatico: entre 4 y 30, 6 por defecto. */
function segundos(v: number | null | undefined, porDefecto: number): number {
  return typeof v === "number" && v >= 4 ? Math.min(30, Math.round(v)) : porDefecto;
}

function normalizarSeccionAsesorias(
  raw: SeccionAsesoriasRaw,
  resenas: SeccionResenas["resenas"],
  girosMarketing: GiroNegocio[],
  marketing: ClientesMarketing | null
): SeccionAsesorias | null {
  if (!raw || raw.activo === false) return null;

  switch (raw._type) {
    case "splitHeroBanner":
      return { ...camposBase(raw, false), tipo: "splitHeroBanner", logo: imagen(raw.logo, 1400) };

    case "clientsBanner": {
      // La normalización es la de Marketing Digital; sin giros propios se
      // usan los de Marketing Digital.
      const s = normalizarSeccion(raw, resenas);
      if (!s || s.tipo !== "clientsBanner") return null;
      return { ...s, giros: s.giros.length > 0 ? s.giros : girosMarketing };
    }

    case "celularesBanner":
      return {
        ...camposBase(raw, false),
        cta: null,
        tipo: "celularesBanner",
        izquierdo: celular(raw.izquierdo),
        central: celular(raw.central),
        derecho: celular(raw.derecho),
      };

    case "achievementsBanner":
      return {
        ...camposBase(raw, false),
        // Sin boton: las tarjetas son el contenido de la seccion.
        cta: null,
        tipo: "achievementsBanner",
        logros: normalizarLogros(raw.logros),
        pasoAutomatico: bool(raw.pasoAutomatico, true),
        segundosPorLogro: segundos(raw.segundosPorLogro, 6),
      };

    default: {
      // Los demás tipos son los de Marketing Digital, con la misma
      // normalización. La portada de foto (teamBanner) no forma parte de esta
      // página: tiene la suya (splitHeroBanner).
      const s = normalizarSeccion(raw, resenas);
      if (!s || s.tipo === "teamBanner") return null;
      return s;
    }
  }
}

export async function getPaginaAsesorias(): Promise<{ secciones: SeccionAsesorias[] }> {
  const [respuesta, resenasGoogle] = await Promise.all([
    sanityQuery<RespuestaAsesorias>(QUERY_ASESORIAS),
    obtenerResenasGoogle(),
  ]);
  const resenas =
    resenasGoogle && resenasGoogle.length > 0 ? resenasGoogle : normalizarResenas(respuesta?.resenas);
  const girosMarketing = normalizarGiros(respuesta?.girosMarketing);
  const raw = respuesta?.clientesMarketing;
  const marketing: ClientesMarketing | null = raw
    ? {
        subtitulo: t(raw.subtitulo),
        titulo: t(raw.titulo),
        descripcion: t(raw.descripcion),
        rotacionAutomatica: bool(raw.rotacionAutomatica, true),
        ajusteLogos: normalizarAjusteLogos(raw.ajusteLogos),
      }
    : null;

  const secciones = (respuesta?.pagina?.sections ?? [])
    .map((s) => normalizarSeccionAsesorias(s, resenas, girosMarketing, marketing))
    .filter((s): s is SeccionAsesorias => s !== null);

  return { secciones: secciones.length > 0 ? secciones : respaldo(girosMarketing, marketing) };
}
