import { clients as clientesRespaldo, type Client } from "@/data/clients";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Conexion a Sanity para la seccion de Clientes (carrusel de marcas).
 *
 * Deliberadamente SIN el SDK @sanity/client: es un fetch() plano a la API
 * publica de consulta (query API), tal como la expone cualquier dataset con
 * lectura publica. No hace falta token para leer.
 *
 * Variables de entorno esperadas (ya configuradas en Cloudflare):
 *   SANITY_PROJECT_ID
 *   SANITY_DATASET
 *
 * Se leen server-side (sin prefijo NEXT_PUBLIC_) porque esta funcion corre
 * en Clients.tsx, un componente de servidor: el fetch nunca llega al
 * navegador, asi que no hace falta exponerlas al cliente.
 *
 * AJUSTA "_type == \"cliente\"" si el nombre del documento en tu Sanity
 * Studio es distinto (revisalo en Structure). Los alias del GROQ ya mapean
 * titulo/descripcion/imagen/categoria a los nombres que usa el resto de la
 * app (name/summary/cover/sector), asi que ClientCard y ClientsCarousel no
 * necesitan saber nada de Sanity.
 */

const SANITY_TYPE = "cliente";
const API_VERSION = "2024-01-01";

const QUERY = `*[_type == "${SANITY_TYPE}" && defined(imagen.asset)]{
  "slug": slug.current,
  "name": titulo,
  "summary": descripcion,
  "sector": categoria,
  "cover": imagen.asset->url
} | order(_createdAt asc)`;

type SanityCliente = {
  slug: string | null;
  name: string | null;
  summary: string | null;
  sector: string | null;
  cover: string | null;
};

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

function toClient(doc: SanityCliente): Client | null {
  // titulo e imagen son los unicos campos realmente indispensables para
  // pintar la tarjeta (ver ClientCard). Sin ellos, se descarta el doc.
  if (!doc.name || !doc.cover) return null;
  return {
    slug: doc.slug || slugify(doc.name),
    name: doc.name,
    sector: doc.sector ?? "",
    city: "",
    summary: doc.summary ?? "",
    // Sanity no maneja "services" (etiquetas Creatividad/Audiovisual/...):
    // ese campo no esta en el alcance de esta migracion, queda vacio.
    services: [],
    cover: doc.cover,
    videos: [],
  };
}

/**
 * Trae las cuentas desde Sanity. Si faltan credenciales, la API falla o el
 * dataset viene vacio, cae de vuelta a src/data/clients.ts: el carrusel de
 * la home NUNCA debe quedar roto ni vacio por un problema de conexion.
 */
export async function getClientesSanity(): Promise<Client[]> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    console.error(
      "[sanity] Faltan SANITY_PROJECT_ID / SANITY_DATASET en el entorno. Se muestran las cuentas locales de respaldo (src/data/clients.ts)."
    );
    return clientesRespaldo;
  }

  const url = `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`;

  try {
    const res = await fetch(url, {
      // ISR: revalida cada 60s en vez de pegarle a Sanity en cada request,
      // pero sin necesitar un rebuild para ver contenido nuevo.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Sanity respondio ${res.status} ${res.statusText}`);
    }

    const { result } = (await res.json()) as { result: SanityCliente[] };
    const clientes = result
      .map(toClient)
      .filter((c): c is Client => c !== null);

    return clientes.length > 0 ? clientes : clientesRespaldo;
  } catch (err) {
    console.error(
      "[sanity] No se pudo obtener las cuentas, se muestran las locales de respaldo:",
      err
    );
    return clientesRespaldo;
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
