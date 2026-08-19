import { clients as clientesRespaldo, type Client } from "@/data/clients";

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
 * Secciones de texto (documentos singleton)
 * ============================================================
 * "Lo que hacemos", "El Socio" y el cierre/formulario viven cada uno en un
 * unico documento de Sanity (de ahi el "[0]" en la query: siempre se toma
 * el primero/unico). Mismo patron que getClientesSanity(): si faltan
 * credenciales, la API falla o el documento no existe todavia en el
 * Studio, cada seccion cae de vuelta al texto que ya tenia la pagina, campo
 * por campo, asi que nunca queda una seccion vacia o a medias.
 */

/** Fetch generico a la query API publica. Devuelve null ante cualquier
 *  problema (sin credenciales, red, documento inexistente); cada
 *  getSeccionX() decide el respaldo especifico para sus propios campos. */
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

// --- "Lo que hacemos" (Services.tsx) ------------------------------------

export type SeccionHacemos = { titulo: string; descripcion: string };

const FALLBACK_HACEMOS: SeccionHacemos = {
  titulo: "Lo que hacemos",
  descripcion:
    "Tres frentes que se sostienen entre sí. La campaña atrae, el CRM ordena, la IA responde.",
};

export async function getSeccionHacemos(): Promise<SeccionHacemos> {
  const doc = await sanityQuery<Partial<SeccionHacemos>>(
    `*[_type == "seccionHacemos"][0]{titulo, descripcion}`
  );
  return {
    titulo: doc?.titulo || FALLBACK_HACEMOS.titulo,
    descripcion: doc?.descripcion || FALLBACK_HACEMOS.descripcion,
  };
}

// --- Filas de "Lo que hacemos": Marketing / CRM / IA (ServiceRow.tsx) ----

export type Pilar = {
  titulo: string;
  descripcion: string;
  etiquetas: string[];
};

// Mismo texto que tenia Services.tsx antes de esta migracion. El orden
// importa: Services.tsx le asigna el icono (megaphone/funnel/sparkle) por
// posicion, no hay campo de icono en Sanity.
const FALLBACK_PILARES: Pilar[] = [
  {
    titulo: "Marketing Digital 360",
    descripcion:
      "Una sola idea sostenida en todos los formatos, del concepto a la pauta.",
    etiquetas: [
      "Dirección creativa",
      "producción audiovisual",
      "contenidos",
      "pauta",
    ],
  },
  {
    titulo: "CRM",
    descripcion:
      "Cada conversación queda registrada, asignada y medida. Nada se enfría en una bandeja.",
    etiquetas: ["Kommo", "embudos", "campos", "automatizaciones", "reportes"],
  },
  {
    titulo: "Inteligencia Artificial",
    descripcion:
      "Atención que no duerme: responde, califica y entrega el lead listo al vendedor.",
    etiquetas: [
      "Bots de WhatsApp",
      "calificación automática",
      "respuestas con contexto",
    ],
  },
];

type SanityPilar = {
  titulo: string | null;
  descripcion: string | null;
  etiquetas: string[] | null;
};

function toPilar(doc: SanityPilar): Pilar | null {
  // etiquetas puede venir vacio (se renderiza sin metadato bajo la
  // descripcion), pero titulo y descripcion son la fila en si: sin ellos
  // se descarta el item en vez de mostrar una fila en blanco.
  if (!doc.titulo || !doc.descripcion) return null;
  return {
    titulo: doc.titulo,
    descripcion: doc.descripcion,
    etiquetas: doc.etiquetas ?? [],
  };
}

export async function getSeccionPilares(): Promise<Pilar[]> {
  const doc = await sanityQuery<{ pilares: SanityPilar[] | null }>(
    `*[_type == "seccionPilares"][0]{pilares[]{titulo, descripcion, etiquetas}}`
  );
  const pilares = (doc?.pilares ?? [])
    .map(toPilar)
    .filter((p): p is Pilar => p !== null);

  return pilares.length > 0 ? pilares : FALLBACK_PILARES;
}

// --- "El Socio" (Socio.tsx + SocioPortrait.tsx) --------------------------

export type SeccionSocio = {
  nombre: string;
  parrafo1: string;
  parrafo2: string;
  imagen: string;
};

const FALLBACK_SOCIO: SeccionSocio = {
  nombre: "Daniel Vallejo",
  parrafo1:
    "Daniel es quien se sienta con el dueño del negocio antes de que exista una sola pieza. Pregunta qué se vende, con qué margen y por qué el cliente vuelve. De ahí sale el brief, no de un formato.",
  parrafo2:
    "Su trabajo es que la creatividad y el sistema no vayan por separado. Que la campaña que se produce sea la que el CRM puede sostener, y que el equipo comercial reciba leads que efectivamente sabe atender.",
  imagen: "/media/socio-retrato.jpg",
};

export async function getSeccionSocio(): Promise<SeccionSocio> {
  const doc = await sanityQuery<Partial<SeccionSocio>>(
    `*[_type == "seccionSocio"][0]{nombre, parrafo1, parrafo2, "imagen": imagen.asset->url}`
  );
  return {
    nombre: doc?.nombre || FALLBACK_SOCIO.nombre,
    parrafo1: doc?.parrafo1 || FALLBACK_SOCIO.parrafo1,
    parrafo2: doc?.parrafo2 || FALLBACK_SOCIO.parrafo2,
    imagen: doc?.imagen || FALLBACK_SOCIO.imagen,
  };
}

// --- Cierre + formulario (Contact.tsx) ------------------------------------

export type SeccionCierre = {
  slogan: string;
  formularioTitulo: string;
  formularioSubtitulo: string;
};

const FALLBACK_CIERRE: SeccionCierre = {
  slogan: "Hablemos",
  formularioTitulo: "Tu próxima campaña empieza aquí",
  formularioSubtitulo:
    "Cuéntanos qué vendes y a quién. En la primera llamada sales con una ruta clara, con o sin nosotros.",
};

export async function getSeccionCierre(): Promise<SeccionCierre> {
  const doc = await sanityQuery<Partial<SeccionCierre>>(
    `*[_type == "seccionCierre"][0]{slogan, formularioTitulo, formularioSubtitulo}`
  );
  return {
    slogan: doc?.slogan || FALLBACK_CIERRE.slogan,
    formularioTitulo: doc?.formularioTitulo || FALLBACK_CIERRE.formularioTitulo,
    formularioSubtitulo:
      doc?.formularioSubtitulo || FALLBACK_CIERRE.formularioSubtitulo,
  };
}
