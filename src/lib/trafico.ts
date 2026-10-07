import { sanityQuery } from "@/lib/sanity";
import { obtenerResenasGoogle } from "@/lib/google-places";
import { company } from "@/config/company";
import { GIRO_GROQ, iconoDe } from "@/lib/giros";
import { COPY_TRAFICO } from "@/lib/trafico-respaldo";
import { metricasParaGiro, normalizarMetricas, type MetricasDemo, type MetricasRaw } from "@/lib/metricas-demo";
import {
  IMG,
  bool,
  camposBase,
  normalizarGiros,
  normalizarResenas,
  normalizarSeccion,
  t,
  type BaseSeccion,
  type GiroNegocio,
  type GiroRaw,
  type RespuestaRaw,
  type SeccionCierre,
  type SeccionEquipo,
  type SeccionMetodo,
  type SeccionNavegacion,
  type SeccionQueEs,
  type SeccionRaw,
  type SeccionResenas,
} from "@/lib/marketing-digital";

/**
 * Datos de la pagina /trafico-ads.
 *
 * MISMA ESTRUCTURA QUE MARKETING DIGITAL: documento singleton
 * "traficoAdsPage" con `sections[]` ordenable en el Studio, los mismos campos
 * en cada seccion y los mismos componentes (portada, "Nuestro sistema",
 * mapa, metodo, resenas, cierre). Lo que agrega esta pagina, por pedido del
 * documento del equipo y de la direccion:
 *  - "platformsBanner": ¿Dónde traficamos? (Meta, TikTok, Google, web).
 *  - "ecosystemBanner": el ecosistema (Instagram -> Google -> web -> WhatsApp).
 *  - "metricsClientsBanner": Clientes con un PANEL DE METRICAS DE META por
 *    giro (CPR, CTR, CPA, alcance, visualizaciones, frecuencia) en lugar del
 *    video (src/lib/metricas-demo.ts).
 *
 * CLIENTES SIN GIROS PROPIOS: igual que en FENIAX, si la seccion no tiene
 * giros cargados usa los de Marketing Digital (las mismas empresas y logos,
 * sin cargarlos dos veces).
 *
 * RESPALDO: mientras el documento no tenga NINGUNA seccion activa, la pagina
 * se arma con respaldo() (abajo), con los textos de src/lib/trafico-respaldo.ts
 * (el documento del equipo). Con una sola seccion activa en el Studio, manda
 * el Studio. scripts/sembrar-trafico.mts carga esos mismos textos en el Studio.
 */

// ============================================================
// Tipos
// ============================================================

export const ICONOS_PLATAFORMA = [
  "meta",
  "tiktok",
  "google",
  "youtube",
  "instagram",
  "facebook",
  "whatsapp",
  "linkedin",
  "web",
] as const;
export type IconoPlataforma = (typeof ICONOS_PLATAFORMA)[number];

export type Plataforma = {
  key: string;
  nombre: string;
  /** Linea corta bajo el nombre ("Facebook + Instagram"). */
  etiqueta: string;
  descripcion: string;
  icono: IconoPlataforma;
};

export type SeccionPlataformas = BaseSeccion & { tipo: "platformsBanner"; plataformas: Plataforma[] };
export type SeccionEcosistema = BaseSeccion & { tipo: "ecosystemBanner" };
/** El cierre de esta pagina: la imagen va a la derecha, completa (no de fondo). */
export type SeccionCierreImagen = BaseSeccion & { tipo: "ctaImageBanner" };

export type GiroConMetricas = GiroNegocio & { metricas: MetricasDemo };

export type SeccionClientesMetricas = BaseSeccion & {
  tipo: "metricsClientsBanner";
  giros: GiroConMetricas[];
  /** Al terminar el recorrido de un giro, pasar solo al siguiente. */
  rotacionAutomatica: boolean;
};

export type SeccionTrafico =
  | SeccionEquipo
  | SeccionQueEs
  | SeccionNavegacion
  | SeccionMetodo
  | SeccionPlataformas
  | SeccionEcosistema
  | SeccionClientesMetricas
  | SeccionResenas
  | SeccionCierreImagen;

export type TipoSeccionTrafico = SeccionTrafico["tipo"];

export type PaginaTrafico = { secciones: SeccionTrafico[] };

// ============================================================
// Respaldo (textos en src/lib/trafico-respaldo.ts)
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

function respaldo(girosMarketing: GiroConMetricas[], resenas: SeccionResenas["resenas"]): SeccionTrafico[] {
  const c = COPY_TRAFICO;
  return [
    { ...base("trafico-portada", { ...c.portada, cta: { ...c.portada.cta } }), tipo: "teamBanner", alineacion: "izquierda", overlay: "medio" },
    { ...base("trafico-sistema", c.sistema), tipo: "aboutBanner" },
    { ...base("trafico-mapa", c.mapa), tipo: "navigationBanner" },
    {
      ...base("trafico-metodo", { subtitulo: c.metodo.subtitulo, titulo: c.metodo.titulo, descripcion: c.metodo.descripcion, destacado: c.metodo.destacado, cta: { ...c.metodo.cta } }),
      tipo: "methodBanner",
      mostrarPasos: true,
      pasos: c.metodo.pasos.map((titulo) => ({ titulo, descripcion: "" })),
    },
    {
      ...base("trafico-plataformas", { subtitulo: c.plataformas.subtitulo, titulo: c.plataformas.titulo, descripcion: c.plataformas.descripcion }),
      tipo: "platformsBanner",
      plataformas: c.plataformas.items.map((p, i) => ({ ...p, key: `plataforma-${i}` })),
    },
    { ...base("trafico-ecosistema", c.ecosistema), tipo: "ecosystemBanner" },
    {
      ...base("trafico-clientes", c.clientes),
      tipo: "metricsClientsBanner",
      giros: girosMarketing,
      rotacionAutomatica: true,
    },
    {
      ...base("trafico-resenas", c.resenas),
      tipo: "reviewsBanner",
      enlaceGoogle: company.location.mapsUrl,
      resenas,
      cantidadMostrada: null,
    },
    { ...base("trafico-cierre", { ...c.cierre, cta: { ...c.cierre.cta } }), tipo: "ctaImageBanner" },
  ];
}

// ============================================================
// Consulta
// ============================================================

const METRICAS = `"metricas": metricas{
  campana, objetivo, resultado, adquisicion, inversion, cpr, ctr, cpa, alcance, visualizaciones, nota,
  "hitos": hitos[]{ dia, texto }
}`;

const QUERY_TRAFICO = `{
  "pagina": *[_type == "traficoAdsPage"][0]{
    sections[]{
      _type, _key, activo, subtitulo, titulo, descripcion, destacado, animar,
      cta{ texto, enlace },
      "imagen": imagen{ ${IMG} },
      "imagenMovil": imagenMovil{ ${IMG} },
      _type in ["teamBanner", "ctaBanner"] => { alineacion, overlay },
      _type == "methodBanner" => { mostrarPasos, pasos[]{ titulo, descripcion } },
      _type == "platformsBanner" => { plataformas[]{ _key, nombre, etiqueta, descripcion, icono } },
      _type == "metricsClientsBanner" => {
        "giros": categorias[]{ ${GIRO_GROQ}, ${METRICAS} },
        rotacionAutomatica
      },
      _type == "reviewsBanner" => { enlaceGoogle, cantidadMostrada }
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

type GiroMetricasRaw = NonNullable<GiroRaw> & { metricas?: MetricasRaw };

type PlataformaRaw = { _key?: Txt; nombre?: Txt; etiqueta?: Txt; descripcion?: Txt; icono?: Txt } | null;

type SeccionTraficoRaw = SeccionRaw & {
  plataformas?: PlataformaRaw[] | null;
  giros?: GiroMetricasRaw[] | null;
};

type RespuestaTrafico = {
  pagina: { sections?: SeccionTraficoRaw[] | null } | null;
  girosMarketing: GiroRaw[] | null;
  resenas: RespuestaRaw["resenas"];
};

// ============================================================
// Normalizado
// ============================================================

function normalizarPlataformas(raw: PlataformaRaw[] | null | undefined): Plataforma[] {
  return (raw ?? [])
    .filter((p): p is NonNullable<PlataformaRaw> => Boolean(p && t(p.nombre)))
    .map((p, i) => ({
      key: t(p._key) || `plataforma-${i}`,
      nombre: t(p.nombre),
      etiqueta: t(p.etiqueta),
      descripcion: t(p.descripcion),
      icono: (ICONOS_PLATAFORMA as readonly string[]).includes(t(p.icono)) ? (t(p.icono) as IconoPlataforma) : "web",
    }));
}

/** Giros con su panel de metricas. Reutiliza normalizarGiros (empresas, logos,
 *  Cuentas apagadas) y le suma las metricas de cada giro, en el mismo orden:
 *  las cargadas en el Studio completadas campo a campo con la plantilla de su
 *  tipo de negocio. */
function girosConMetricas(raw: GiroMetricasRaw[] | GiroRaw[] | null | undefined): GiroConMetricas[] {
  const crudos = (raw ?? []).filter((g): g is NonNullable<GiroRaw> => Boolean(g && t(g.nombre)));
  return normalizarGiros(crudos).map((g, i) => {
    const plantilla = metricasParaGiro(g.nombre, iconoDe(crudos[i]?.icono));
    return { ...g, metricas: normalizarMetricas((crudos[i] as GiroMetricasRaw).metricas, plantilla) };
  });
}

function normalizarSeccionTrafico(
  raw: SeccionTraficoRaw,
  resenas: SeccionResenas["resenas"],
  girosMarketing: GiroConMetricas[]
): SeccionTrafico | null {
  if (!raw || raw.activo === false) return null;

  switch (raw._type) {
    case "platformsBanner":
      return { ...camposBase(raw, false), tipo: "platformsBanner", plataformas: normalizarPlataformas(raw.plataformas) };

    case "ecosystemBanner":
      return { ...camposBase(raw, true), tipo: "ecosystemBanner" };

    case "ctaImageBanner":
      return { ...camposBase(raw, true), tipo: "ctaImageBanner" };

    case "metricsClientsBanner": {
      const propios = girosConMetricas(raw.giros);
      const giros = propios.length > 0 ? propios : girosMarketing;
      return {
        ...camposBase(raw, false),
        // Sin boton: "Ver casos de éxito" se quito de Clientes (2026-10-01).
        cta: null,
        tipo: "metricsClientsBanner",
        giros,
        rotacionAutomatica: bool(raw.rotacionAutomatica, true),
      };
    }

    default: {
      // Los demas tipos son los de Marketing Digital, con la misma
      // normalizacion. clientsBanner (el del video) no forma parte de esta pagina.
      const s = normalizarSeccion(raw, resenas);
      if (!s || s.tipo === "clientsBanner") return null;
      // Un cierre del tipo de las demas paginas ("ctaBanner", foto de fondo) se
      // muestra como el de esta (imagen a la derecha): misma seccion, mismos
      // textos y boton. Cubre un documento anterior al cambio.
      if (s.tipo === "ctaBanner") {
        const { alineacion: _alineacion, overlay: _overlay, ...resto } = s;
        return { ...resto, tipo: "ctaImageBanner" };
      }
      return s;
    }
  }
}

export async function getPaginaTrafico(): Promise<PaginaTrafico> {
  const [respuesta, resenasGoogle] = await Promise.all([
    sanityQuery<RespuestaTrafico>(QUERY_TRAFICO),
    obtenerResenasGoogle(),
  ]);
  const resenas =
    resenasGoogle && resenasGoogle.length > 0 ? resenasGoogle : normalizarResenas(respuesta?.resenas);
  const girosMarketing = girosConMetricas(respuesta?.girosMarketing);

  const secciones = (respuesta?.pagina?.sections ?? [])
    .map((s) => normalizarSeccionTrafico(s, resenas, girosMarketing))
    .filter((s): s is SeccionTrafico => s !== null);

  return { secciones: secciones.length > 0 ? secciones : respaldo(girosMarketing, resenas) };
}
