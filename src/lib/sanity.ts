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
