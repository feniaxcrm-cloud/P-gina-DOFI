/**
 * URL publica del sitio y decision de indexabilidad. FUENTE UNICA DE VERDAD.
 *
 * PROBLEMA QUE RESUELVE
 * ---------------------
 * layout.tsx tenia escrito a mano `const siteUrl = "https://dofi.agency"`,
 * un dominio que NO esta sirviendo este sitio. Con eso, og:url apuntaba a un
 * destino equivocado en cada enlace compartido, y metadataBase resolvia
 * cualquier URL absoluta contra un host inexistente.
 *
 * COMO FUNCIONA
 * -------------
 * El dominio real se define en NEXT_PUBLIC_SITE_URL. Mientras esa variable
 * no traiga un dominio propio, el sitio se considera STAGING:
 *
 *   - staging    -> noindex,nofollow  ·  sin canonical  ·  robots cerrado
 *   - produccion -> indexable         ·  canonical absoluto  ·  sitemap
 *
 * La regla es CONDICIONAL a proposito: nada de `noindex` fijo en el codigo.
 * En cuanto NEXT_PUBLIC_SITE_URL apunte al dominio definitivo, el sitio pasa
 * a ser indexable sin tocar una linea.
 *
 * Se usa NEXT_PUBLIC_ porque metadataBase se evalua en el arbol del layout y
 * el valor debe quedar inyectado en el build (Cloudflare Workers no expone
 * process.env arbitrario en el cliente).
 */

/** Host de staging de Cloudflare Workers. No es un dominio de produccion:
 *  es un subdominio compartido de terceros y no debe indexarse. */
const HOST_STAGING = "pagina-dofi.feniax-crm.workers.dev";

/** Respaldo cuando no hay NEXT_PUBLIC_SITE_URL. metadataBase EXIGE una URL
 *  absoluta valida, asi que no puede quedar vacio; se usa el propio staging
 *  y se marca el sitio como no indexable. */
const URL_RESPALDO = `https://${HOST_STAGING}`;

/** Normaliza: recorta, fuerza protocolo y quita la barra final. Asi
 *  absoluteUrl() nunca produce "//ruta" ni "dominio.comruta". */
function normalizarUrl(valor: string | undefined): string | null {
  const limpio = valor?.trim();
  if (!limpio) return null;

  const conProtocolo = /^https?:\/\//i.test(limpio) ? limpio : `https://${limpio}`;

  try {
    const url = new URL(conProtocolo);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

/** ¿Este host es un entorno definitivo o un preview/staging/local? */
function esHostDeProduccion(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }

  if (host === HOST_STAGING) return false;
  if (host.endsWith(".workers.dev")) return false;
  if (host.endsWith(".pages.dev")) return false;
  if (host.endsWith(".vercel.app")) return false;
  if (host === "localhost" || host === "127.0.0.1") return false;
  if (host.endsWith(".local")) return false;

  // Necesita al menos un punto: "midominio" no es un dominio publico.
  return host.includes(".");
}

const configurada = normalizarUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** URL base, siempre absoluta y sin barra final. */
export const siteUrl = configurada ?? URL_RESPALDO;

/**
 * true solo cuando NEXT_PUBLIC_SITE_URL trae un dominio propio.
 *
 * Es la unica condicion que abre la indexacion. Gobierna a la vez:
 * robots.ts, sitemap.ts, el canonical y la etiqueta robots del layout.
 */
export const isProductionSite = configurada !== null && esHostDeProduccion(configurada);

/** Alias legible en los puntos donde lo que importa es el permiso de
 *  indexacion, no el entorno. */
export const isIndexable = isProductionSite;

/** Construye una URL absoluta a partir de una ruta interna.
 *  absoluteUrl("/clientes/taitico") -> "https://dominio/clientes/taitico" */
export function absoluteUrl(path = "/"): string {
  const ruta = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${ruta === "/" ? "/" : ruta}`;
}

export const site = {
  url: siteUrl,
  isProduction: isProductionSite,
  isIndexable,
  absoluteUrl,
} as const;
