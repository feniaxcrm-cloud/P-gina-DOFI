import { sanityQuery } from "@/lib/sanity";
import { obtenerResenasGoogle } from "@/lib/google-places";
import { company } from "@/config/company";
import { GIRO_GROQ } from "@/lib/giros";
import { COPY_ASESORIAS, IMAGENES_ASESORIAS } from "@/lib/asesorias-respaldo";
import {
  IMG,
  bool,
  camposBase,
  imagen,
  logosDeGiros,
  normalizarGiros,
  normalizarResenas,
  normalizarSeccion,
  t,
  type BaseSeccion,
  type ClienteMarquesina,
  type GiroNegocio,
  type GiroRaw,
  type ImagenSanity,
  type ImgRaw,
  type RespuestaRaw,
  type SeccionCierre,
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
 *  - "casesClientsBanner": Clientes con un MAZO DE CASOS al lado del carrusel
 *    de giros. Cada caso trae texto, imagen y (opcional) su giro: al pasar de
 *    caso, el carrusel abre ese giro y muestra la imagen del caso.
 *
 * CLIENTES SIN GIROS PROPIOS: igual que Tráfico y FENIAX, si la sección no
 * tiene giros cargados usa los de Marketing Digital (las mismas empresas y
 * logos, sin cargarlos dos veces).
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

export type SeccionPortadaAsesorias = BaseSeccion & { tipo: "splitHeroBanner"; logo: ImagenSanity | null };

export type SeccionCasos = BaseSeccion & {
  tipo: "casesClientsBanner";
  giros: GiroNegocio[];
  casos: CasoExito[];
  pasoAutomatico: boolean;
  segundosPorCaso: number;
  clientes: ClienteMarquesina[];
};

export type SeccionAsesorias =
  | SeccionPortadaAsesorias
  | SeccionQueEs
  | SeccionNavegacion
  | SeccionMetodo
  | SeccionCasos
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

function respaldo(girosMarketing: GiroNegocio[], resenas: SeccionResenas["resenas"]): SeccionAsesorias[] {
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
      ...base("asesorias-clientes", { titulo: c.clientes.titulo }),
      tipo: "casesClientsBanner",
      giros: girosMarketing,
      casos: c.clientes.casos.map((caso, i) => ({
        key: `caso-${i}`,
        titulo: caso.titulo,
        texto: caso.texto,
        giro: caso.giro,
        cliente: caso.cliente,
        imagen: imagenLocal(img.casos[caso.imagen]),
      })),
      pasoAutomatico: c.clientes.pasoAutomatico,
      segundosPorCaso: c.clientes.segundosPorCaso,
      clientes: logosDeGiros(girosMarketing),
    },
    {
      ...base("asesorias-resenas", c.resenas),
      tipo: "reviewsBanner",
      enlaceGoogle: company.location.mapsUrl,
      resenas,
      cantidadMostrada: null,
      autoplay: false,
      velocidadAutoplay: 6,
    },
    {
      ...base("asesorias-cierre", { titulo: c.cierre.titulo, descripcion: c.cierre.descripcion, cta: { ...c.cierre.cta } }),
      tipo: "ctaBanner",
      alineacion: "centro",
      overlay: "medio",
    },
  ];
}

// ============================================================
// Consulta
// ============================================================

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
      _type == "casesClientsBanner" => {
        "giros": categorias[]{ ${GIRO_GROQ} },
        "casos": casos[]{ _key, titulo, texto, giro, cliente, "imagen": imagen{ ${IMG} } },
        pasoAutomatico,
        segundosPorCaso
      },
      _type == "reviewsBanner" => { enlaceGoogle, cantidadMostrada, autoplay, velocidadAutoplay }
    }
  },
  "girosMarketing": *[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias[]{ ${GIRO_GROQ} },
  "resenas": *[_type == "resena" && activa != false] | order(orden asc, _createdAt desc){
    "id": _id, nombre, empresa, estrellas, comentario, fecha,
    "foto": foto.asset->url + "?w=160&h=160&fit=crop&auto=format",
    "enlace": enlaceOriginal
  }
}`;

type Txt = string | null | undefined;

type CasoRaw = { _key?: Txt; titulo?: Txt; texto?: Txt; giro?: Txt; cliente?: Txt; imagen?: ImgRaw } | null;

type SeccionAsesoriasRaw = SeccionRaw & {
  logo?: ImgRaw;
  casos?: CasoRaw[] | null;
  pasoAutomatico?: boolean | null;
  segundosPorCaso?: number | null;
};

type RespuestaAsesorias = {
  pagina: { sections?: SeccionAsesoriasRaw[] | null } | null;
  girosMarketing: GiroRaw[] | null;
  resenas: RespuestaRaw["resenas"];
};

// ============================================================
// Normalizado
// ============================================================

/** Un caso sin título no es una tarjeta a medias: no se muestra. */
function normalizarCasos(raw: CasoRaw[] | null | undefined): CasoExito[] {
  return (raw ?? [])
    .filter((c): c is NonNullable<CasoRaw> => Boolean(c && t(c.titulo)))
    .map((c, i) => ({
      key: t(c._key) || `caso-${i}`,
      titulo: t(c.titulo),
      texto: t(c.texto),
      giro: t(c.giro),
      cliente: t(c.cliente),
      imagen: imagen(c.imagen, 900, t(c.titulo)),
    }));
}

function normalizarSeccionAsesorias(
  raw: SeccionAsesoriasRaw,
  resenas: SeccionResenas["resenas"],
  girosMarketing: GiroNegocio[]
): SeccionAsesorias | null {
  if (!raw || raw.activo === false) return null;

  switch (raw._type) {
    case "splitHeroBanner":
      return { ...camposBase(raw, false), tipo: "splitHeroBanner", logo: imagen(raw.logo, 1400) };

    case "casesClientsBanner": {
      const propios = normalizarGiros(raw.giros);
      const giros = propios.length > 0 ? propios : girosMarketing;
      const segundos = raw.segundosPorCaso;
      return {
        ...camposBase(raw, false),
        // Sin botón: "Ver casos de éxito" se quitó de Clientes en todas las páginas.
        cta: null,
        tipo: "casesClientsBanner",
        giros,
        casos: normalizarCasos(raw.casos),
        pasoAutomatico: bool(raw.pasoAutomatico, true),
        segundosPorCaso: typeof segundos === "number" && segundos >= 4 ? Math.min(30, Math.round(segundos)) : 7,
        clientes: logosDeGiros(giros),
      };
    }

    default: {
      // Los demás tipos son los de Marketing Digital, con la misma
      // normalización. La portada de foto (teamBanner) y Clientes con video
      // (clientsBanner) no forman parte de esta página.
      const s = normalizarSeccion(raw, resenas);
      if (!s || s.tipo === "teamBanner" || s.tipo === "clientsBanner") return null;
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

  const secciones = (respuesta?.pagina?.sections ?? [])
    .map((s) => normalizarSeccionAsesorias(s, resenas, girosMarketing))
    .filter((s): s is SeccionAsesorias => s !== null);

  return { secciones: secciones.length > 0 ? secciones : respaldo(girosMarketing, resenas) };
}
