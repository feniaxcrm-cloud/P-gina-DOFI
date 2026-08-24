import {
  clients as clientesRespaldo,
  type Client,
  type VideoSource,
  type SocialLinks,
} from "@/data/clients";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Conexion a Sanity para las Cuentas (carrusel, muro de logos, pagina
 * individual y sitemap) y sus Contenidos asociados.
 *
 * Deliberadamente SIN el SDK @sanity/client: es un fetch() plano a la API
 * publica de consulta (query API), tal como la expone cualquier dataset con
 * lectura publica. No hace falta token para leer.
 *
 * Variables de entorno esperadas (ver .env.example):
 *   SANITY_PROJECT_ID
 *   SANITY_DATASET
 *
 * Se leen server-side (sin prefijo NEXT_PUBLIC_) porque estas funciones
 * corren en componentes de servidor: el fetch nunca llega al navegador.
 *
 * Los tipos de documento son "cuenta", "contenido" y "servicio" (ver
 * studio/schemaTypes/). Los campos del schema estan en español; los alias
 * del GROQ los mapean a los nombres que usa el resto de la app
 * (name/summary/cover/sector/...), asi que ClientCard, ClientsCarousel,
 * VideoTile y la pagina de detalle no necesitan saber nada de Sanity.
 */

const API_VERSION = "2024-01-01";

/** Reemplazo manual de vocales acentuadas: evita marcas combinadas en el
 *  codigo fuente (fragiles entre editores/encodings) para el slug de
 *  respaldo cuando un documento de Sanity no trae uno propio. */
const ACENTOS: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ü: "u",
  ñ: "n",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (ch) => ACENTOS[ch] ?? ch)
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/** Arma la URL de la API de consulta publica de Sanity, con parametros
 *  ($nombre) codificados correctamente via URLSearchParams. */
function buildQueryUrl(
  projectId: string,
  dataset: string,
  query: string,
  params?: Record<string, string>
): string {
  const search = new URLSearchParams({ query });
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      search.set(`$${key}`, JSON.stringify(value));
    }
  }
  return `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}?${search.toString()}`;
}

// ============================================================
// Cuentas
// ============================================================

type SanityCuentaResumen = {
  slug: string | null;
  name: string | null;
  summary: string | null;
  sector: string | null;
  logo: string | null;
  cover: string | null;
  services: (string | null)[] | null;
};

type SanityContenido = {
  _id: string;
  titulo: string | null;
  tipoMedia: "imagen" | "video" | null;
  imagenUrl: string | null;
  tipoVideo: "youtube" | "archivo" | null;
  youtubeId: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  formatoVideo: string | null;
  relacionAspecto: VideoSource["ratio"] | null;
};

type SanityCuentaCompleta = SanityCuentaResumen & {
  city: string | null;
  challenge: string | null;
  approach: string | null;
  results: { valor: string | null; etiqueta: string | null }[] | null;
  testimonial: { cita: string | null; autor: string | null; cargo: string | null } | null;
  social: {
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    sitioWeb?: string | null;
    otros?: { etiqueta: string; url: string }[] | null;
  } | null;
  contenidos: SanityContenido[] | null;
};

// Campos livianos: para el carrusel y el muro de logos, sin el join de
// contenidos (que solo hace falta en la pagina individual).
const CAMPOS_CUENTA_RESUMEN = `
  "slug": slug.current,
  "name": nombre,
  "summary": resumen,
  "sector": categoria,
  "logo": logo.asset->url + "?w=160&auto=format",
  "cover": portada.asset->url + "?w=1200&auto=format",
  "services": servicios[]->nombre
`;

const QUERY_CUENTAS_ACTIVAS = `*[_type == "cuenta" && activa == true] | order(orden asc){
  ${CAMPOS_CUENTA_RESUMEN}
}`;

const QUERY_SLUGS_ACTIVOS = `*[_type == "cuenta" && activa == true].slug.current`;

const QUERY_CUENTA_POR_SLUG = `*[_type == "cuenta" && activa == true && slug.current == $slug][0]{
  ${CAMPOS_CUENTA_RESUMEN},
  "city": ciudad,
  "challenge": reto,
  "approach": enfoque,
  "results": resultados[]{ "valor": valor, "etiqueta": etiqueta },
  "testimonial": testimonio{ "cita": cita, "autor": autor, "cargo": cargo },
  "social": redes,
  "cover": portada.asset->url + "?w=1600&auto=format",
  "contenidos": *[_type == "contenido" && references(^._id) && publicado == true] | order(orden asc){
    _id,
    "titulo": titulo,
    "tipoMedia": tipoMedia,
    "imagenUrl": imagen.asset->url + "?w=1200&auto=format",
    "tipoVideo": tipoVideo,
    "youtubeId": youtubeId,
    "videoUrl": archivoVideo.asset->url,
    "posterUrl": poster.asset->url + "?w=1200&auto=format",
    "formatoVideo": formatoVideo,
    "relacionAspecto": relacionAspecto
  }
}`;

function toAccountSummary(doc: SanityCuentaResumen): Client | null {
  if (!doc.name) return null;
  return {
    slug: doc.slug || slugify(doc.name),
    name: doc.name,
    sector: doc.sector ?? "",
    city: "",
    summary: doc.summary ?? "",
    services: (doc.services ?? []).filter((s): s is string => Boolean(s)),
    logo: doc.logo ?? undefined,
    cover: doc.cover ?? "/media/cover-16-9.jpg",
    videos: [],
  };
}

function toContenidoVideo(c: SanityContenido): VideoSource | null {
  const src = c.tipoVideo === "youtube" ? c.youtubeId : c.videoUrl;
  if (!src) return null;
  return {
    id: c._id,
    title: c.titulo ?? "",
    format: c.formatoVideo ?? "",
    kind: c.tipoVideo === "youtube" ? "youtube" : "file",
    src,
    poster: c.posterUrl ?? "/media/cover-16-9.jpg",
    ratio: c.relacionAspecto ?? "16/9",
  };
}

function toAccountFull(doc: SanityCuentaCompleta): Client | null {
  if (!doc.name) return null;

  const contenidos = doc.contenidos ?? [];
  const videos = contenidos
    .filter((c) => c.tipoMedia === "video")
    .map(toContenidoVideo)
    .filter((v): v is VideoSource => v !== null);
  const gallery = contenidos
    .filter((c): c is SanityContenido & { imagenUrl: string } => c.tipoMedia === "imagen" && Boolean(c.imagenUrl))
    .map((c) => c.imagenUrl);

  const results = (doc.results ?? [])
    .filter((r): r is { valor: string; etiqueta: string } => Boolean(r.valor && r.etiqueta))
    .map((r) => ({ value: r.valor, label: r.etiqueta }));

  const testimonial =
    doc.testimonial?.cita && doc.testimonial.autor && doc.testimonial.cargo
      ? {
          quote: doc.testimonial.cita,
          author: doc.testimonial.autor,
          role: doc.testimonial.cargo,
        }
      : undefined;

  const social: SocialLinks | undefined = doc.social
    ? {
        instagram: doc.social.instagram ?? undefined,
        facebook: doc.social.facebook ?? undefined,
        tiktok: doc.social.tiktok ?? undefined,
        sitioWeb: doc.social.sitioWeb ?? undefined,
        otros: doc.social.otros ?? undefined,
      }
    : undefined;

  return {
    slug: doc.slug || slugify(doc.name),
    name: doc.name,
    sector: doc.sector ?? "",
    city: doc.city ?? "",
    summary: doc.summary ?? "",
    services: (doc.services ?? []).filter((s): s is string => Boolean(s)),
    logo: doc.logo ?? undefined,
    cover: doc.cover ?? "/media/cover-16-9.jpg",
    videos,
    challenge: doc.challenge ?? undefined,
    approach: doc.approach ?? undefined,
    results: results.length > 0 ? results : undefined,
    gallery: gallery.length > 0 ? gallery : undefined,
    testimonial,
    social,
  };
}

/**
 * Cuentas activas para el carrusel y el muro de logos. Si faltan
 * credenciales, la API falla o el dataset viene vacio, cae de vuelta a
 * src/data/clients.ts: esas secciones NUNCA deben quedar rotas ni vacias
 * por un problema de conexion.
 */
export async function getActiveAccounts(): Promise<Client[]> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    console.error(
      "[sanity] Faltan SANITY_PROJECT_ID / SANITY_DATASET en el entorno. Se muestran las cuentas locales de respaldo (src/data/clients.ts)."
    );
    return clientesRespaldo;
  }

  const url = buildQueryUrl(projectId, dataset, QUERY_CUENTAS_ACTIVAS);

  try {
    const res = await fetch(url, {
      // ISR: revalida cada 60s en vez de pegarle a Sanity en cada request.
      // /api/revalidate invalida esto al instante cuando se publica algo.
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Sanity respondio ${res.status} ${res.statusText}`);

    const { result } = (await res.json()) as { result: SanityCuentaResumen[] };
    const cuentas = result.map(toAccountSummary).filter((c): c is Client => c !== null);

    return cuentas.length > 0 ? cuentas : clientesRespaldo;
  } catch (err) {
    console.error("[sanity] No se pudo obtener las cuentas, se muestran las locales de respaldo:", err);
    return clientesRespaldo;
  }
}

/** Solo los slugs de cuentas activas, para generateStaticParams() y el sitemap. */
export async function getAllActiveSlugs(): Promise<string[]> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    return clientesRespaldo.map((c) => c.slug);
  }

  const url = buildQueryUrl(projectId, dataset, QUERY_SLUGS_ACTIVOS);

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Sanity respondio ${res.status} ${res.statusText}`);

    const { result } = (await res.json()) as { result: (string | null)[] };
    const slugs = result.filter((s): s is string => Boolean(s));

    return slugs.length > 0 ? slugs : clientesRespaldo.map((c) => c.slug);
  } catch (err) {
    console.error("[sanity] No se pudo obtener los slugs de cuentas, se usan los locales de respaldo:", err);
    return clientesRespaldo.map((c) => c.slug);
  }
}

/**
 * Una cuenta activa completa, con su contenido asociado ya separado en
 * videos/gallery. Usada por la pagina individual /clientes/[slug]. Si la
 * cuenta no existe o esta inactiva, o si Sanity no responde, cae al
 * respaldo local (y si tampoco esta ahi, null -> notFound()).
 */
export async function getAccountBySlug(slug: string): Promise<Client | null> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    return clientesRespaldo.find((c) => c.slug === slug) ?? null;
  }

  const url = buildQueryUrl(projectId, dataset, QUERY_CUENTA_POR_SLUG, { slug });

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Sanity respondio ${res.status} ${res.statusText}`);

    const { result } = (await res.json()) as { result: SanityCuentaCompleta | null };
    if (!result) return clientesRespaldo.find((c) => c.slug === slug) ?? null;

    return toAccountFull(result);
  } catch (err) {
    console.error(`[sanity] No se pudo obtener la cuenta "${slug}", se usa el respaldo local:`, err);
    return clientesRespaldo.find((c) => c.slug === slug) ?? null;
  }
}

/**
 * ============================================================
 * paginaInicio: una sola consulta para todas las secciones de texto
 * ============================================================
 * Reemplaza las 4 consultas sueltas que existian antes (una por
 * componente). Ahora hay un unico documento "paginaInicio" con un arreglo
 * ordenable "secciones[]"; cada item se resuelve segun su _type via
 * proyeccion condicional de GROQ. page.tsx pinta ese arreglo con un solo
 * .map() sobre un diccionario _type -> componente (ver RENDERERS ahi), asi
 * que si el orden cambia en el Studio, la pagina cambia de orden sola.
 *
 * Alcance actual: "secciones[]" en Sanity solo trae seccionHacemos,
 * seccionSocio, seccionPilares y seccionCierre. Hero, LogoWall, Tools,
 * Clients, Manifesto y Process no tienen todavia un tipo de documento en
 * el Studio (no estan en este GROQ), asi que page.tsx los sigue pintando
 * fijos, alrededor del bloque dinamico.
 *
 * seccionPilares llega en el arreglo pero con forma de lista de
 * herramientas (listaHerramientas[]{nombre, icono}) que no trae el texto
 * de rol/descripcion que Tools.tsx necesita por herramienta, ni el color
 * de marca ni el ancho de celda del bento. Mientras esos campos no esten
 * definidos, normalizarSeccion() la descarta sin romper nada (con un aviso
 * en consola) y Tools.tsx se queda con su contenido de siempre.
 */

// --- Fetch generico a la query API publica --------------------------------

/** Devuelve null ante cualquier problema (sin credenciales, red, documento
 *  inexistente); getSeccionesPaginaInicio() decide el respaldo. */
async function sanityQuery<T>(query: string): Promise<T | null> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    console.error(
      "[sanity] Faltan SANITY_PROJECT_ID / SANITY_DATASET en el entorno."
    );
    return null;
  }

  const url = `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Sanity respondio ${res.status} ${res.statusText}`);
    }
    const { result } = (await res.json()) as { result: T | null };
    return result ?? null;
  } catch (err) {
    console.error("[sanity] fetch fallo:", err);
    return null;
  }
}

// --- Tipos de las secciones ya conectadas a un componente -----------------

export type SeccionHacemosData = {
  _type: "seccionHacemos";
  titulo: string;
  subtitulo: string;
  tarjetas: { titulo: string; descripcion: string }[];
};

export type SeccionSocioData = {
  _type: "seccionSocio";
  nombre: string;
  descripcion: string;
  foto: string;
};

export type SeccionCierreData = {
  _type: "seccionCierre";
  titulo: string;
  textoBoton: string;
  enlace: string;
};

/** Union de las secciones que page.tsx sabe pintar hoy. */
export type SeccionData =
  | SeccionHacemosData
  | SeccionSocioData
  | SeccionCierreData;

// --- Forma cruda que devuelve Sanity (antes de validar/limpiar) -----------

// Forma laxa a proposito: cada item siempre trae _type, pero el resto de
// campos depende de cual sea y puede no venir (incluso puede ser un _type
// que este archivo todavia no conoce). Validar la forma exacta por tipo es
// responsabilidad de normalizarSeccion(), no de este tipo — un union
// discriminado con un miembro generico "cualquier otro _type" hace que
// TypeScript no pueda acotar los casos conocidos dentro del switch.
type SeccionRaw = {
  _type: string;
  titulo?: string | null;
  subtitulo?: string | null;
  tarjetas?: { titulo: string | null; descripcion: string | null }[] | null;
  nombre?: string | null;
  descripcion?: string | null;
  foto?: string | null;
  listaHerramientas?: { nombre: string | null; icono: string | null }[] | null;
  textoBoton?: string | null;
  enlace?: string | null;
};

type PaginaInicioRaw = {
  titulo: string | null;
  secciones: SeccionRaw[] | null;
};

const QUERY_PAGINA_INICIO = `*[_type == "paginaInicio"][0]{
  titulo,
  secciones[]{
    _type,
    _type == "seccionHacemos" => { titulo, subtitulo, tarjetas[]{ titulo, descripcion } },
    _type == "seccionSocio" => { nombre, descripcion, "foto": foto.asset->url },
    _type == "seccionPilares" => { titulo, listaHerramientas[]{ nombre, icono } },
    _type == "seccionCierre" => { titulo, textoBoton, enlace }
  }
}`;

// Texto de siempre, por si el documento paginaInicio no existe todavia o
// falta alguna seccion puntual en el Studio. Mismo orden que tenia la
// pagina antes de esta migracion.
const SECCIONES_FALLBACK: SeccionData[] = [
  {
    _type: "seccionHacemos",
    titulo: "Lo que hacemos",
    subtitulo:
      "Tres frentes que se sostienen entre sí. La campaña atrae, el CRM ordena, la IA responde.",
    tarjetas: [
      {
        titulo: "Marketing Digital 360",
        descripcion:
          "Una sola idea sostenida en todos los formatos, del concepto a la pauta.",
      },
      {
        titulo: "CRM",
        descripcion:
          "Cada conversación queda registrada, asignada y medida. Nada se enfría en una bandeja.",
      },
      {
        titulo: "Inteligencia Artificial",
        descripcion:
          "Atención que no duerme: responde, califica y entrega el lead listo al vendedor.",
      },
    ],
  },
  {
    _type: "seccionSocio",
    nombre: "Daniel Vallejo",
    descripcion:
      "Daniel es quien se sienta con el dueño del negocio antes de que exista una sola pieza. Pregunta qué se vende, con qué margen y por qué el cliente vuelve. De ahí sale el brief, no de un formato.\n\nSu trabajo es que la creatividad y el sistema no vayan por separado. Que la campaña que se produce sea la que el CRM puede sostener, y que el equipo comercial reciba leads que efectivamente sabe atender.",
    foto: "/media/socio-retrato.jpg",
  },
  {
    _type: "seccionCierre",
    titulo: "Hablemos",
    textoBoton: "Escribir por WhatsApp",
    // El enlace sale de la configuracion corporativa, no escrito a mano.
    // Aqui vivia "wa.me/593999999999", un numero inventado, y como Sanity no
    // esta sirviendo contenido en produccion, ESTE respaldo era el que se
    // publicaba: el CTA de WhatsApp del sitio apuntaba a un numero que no
    // existe. Si algun dia se edita el enlace desde el Studio, ese valor
    // gana sobre este respaldo.
    enlace: whatsappUrl,
  },
];

/** Valida un item crudo del arreglo y lo deja listo para pintar, o
 *  descarta lo que venga incompleto o de un tipo que todavia no tiene
 *  componente asignado (ver nota de seccionPilares mas arriba). */
function normalizarSeccion(raw: SeccionRaw): SeccionData | null {
  switch (raw._type) {
    case "seccionHacemos": {
      const tarjetas = (raw.tarjetas ?? []).filter(
        (t): t is { titulo: string; descripcion: string } =>
          Boolean(t.titulo && t.descripcion)
      );
      if (!raw.titulo || !raw.subtitulo || tarjetas.length === 0) return null;
      return {
        _type: "seccionHacemos",
        titulo: raw.titulo,
        subtitulo: raw.subtitulo,
        tarjetas,
      };
    }
    case "seccionSocio": {
      if (!raw.nombre || !raw.descripcion || !raw.foto) return null;
      return {
        _type: "seccionSocio",
        nombre: raw.nombre,
        descripcion: raw.descripcion,
        foto: raw.foto,
      };
    }
    case "seccionCierre": {
      if (!raw.titulo || !raw.textoBoton || !raw.enlace) return null;
      return {
        _type: "seccionCierre",
        titulo: raw.titulo,
        textoBoton: raw.textoBoton,
        enlace: raw.enlace,
      };
    }
    case "seccionPilares":
      console.error(
        '[sanity] seccionPilares llego del CMS pero todavia no tiene componente asignado (le faltan campos que Tools.tsx necesita). Se ignora sin romper la pagina; Tools.tsx sigue con su contenido fijo.'
      );
      return null;
    default:
      console.error(
        `[sanity] La seccion "${raw._type}" no tiene componente asignado en page.tsx, se ignora.`
      );
      return null;
  }
}

/**
 * Trae y arma el arreglo final de secciones para la home. Si Sanity no
 * responde o el documento no existe, usa SECCIONES_FALLBACK completo. Si
 * responde pero le falta alguna seccion puntual, respeta el orden real de
 * lo que si vino bien formado y agrega al final el respaldo de lo que
 * falte, para que ninguna seccion desaparezca de la pagina mientras se
 * termina de cargar contenido en el Studio.
 */
export async function getSeccionesPaginaInicio(): Promise<SeccionData[]> {
  const doc = await sanityQuery<PaginaInicioRaw>(QUERY_PAGINA_INICIO);
  const crudo = doc?.secciones ?? [];
  const validas = crudo
    .map(normalizarSeccion)
    .filter((s): s is SeccionData => s !== null);

  const tiposPresentes = new Set(validas.map((s) => s._type));
  const faltantes = SECCIONES_FALLBACK.filter(
    (s) => !tiposPresentes.has(s._type)
  );

  return [...validas, ...faltantes];
}
