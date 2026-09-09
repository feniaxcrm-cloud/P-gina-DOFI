/**
 * Navegación principal del sitio. FUENTE UNICA DE VERDAD.
 *
 * Estos enlaces vivian dentro de Nav.tsx (el Header). Al pedir que el pie
 * ofreciera "todas las opciones que existen en el Header" habia dos caminos:
 * copiar el arreglo al Footer, o sacarlo a un lugar comun. Copiarlo garantiza
 * que tarde o temprano el pie y el header muestren cosas distintas -- es
 * exactamente el problema que ya habia pasado con los datos corporativos y
 * que resolvio src/config/company.ts.
 *
 * Asi que se movio aca y lo importan los dos. El Header NO cambia: pinta la
 * misma lista, con las mismas rutas y el mismo resaltado de pagina activa.
 *
 * `match` decide si un enlace es la pagina actual. Solo lo usa el Header
 * (el pie no resalta nada), pero vive junto al enlace porque es parte de la
 * definicion de la ruta, no de como la dibuja cada componente.
 */

export type NavLink = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

/** Coincide con la ruta exacta y con cualquier subruta ("/x" y "/x/algo"). */
const esRuta = (base: string) => (pathname: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

/**
 * Las 4 rutas de servicio se verificaron contra la arquitectura de rutas
 * antes de escribirse (no se inventaron): existen como paginas reales en
 * src/app/. Son rutas, no anclas -- por eso el pie tampoco usa "#".
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/", match: (p) => p === "/" },
  {
    label: "Marketing Digital",
    href: "/marketing-digital",
    match: esRuta("/marketing-digital"),
  },
  {
    label: "Tráfico / Ads",
    href: "/trafico-ads",
    match: esRuta("/trafico-ads"),
  },
  {
    label: "ChatBots / CRM",
    href: "/chatbots-crm",
    match: esRuta("/chatbots-crm"),
  },
  { label: "Asesorías", href: "/asesorias", match: esRuta("/asesorias") },
];
