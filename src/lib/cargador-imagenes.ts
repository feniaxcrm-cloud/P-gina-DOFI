/**
 * Cargador de imágenes de next/image (next.config.ts → images.loaderFile).
 *
 * POR QUÉ (2026-10-28, «los banners del Home no cargan rápido"): en Cloudflare
 * el optimizador de Next (/_next/image) no está activo -- OpenNext lo hace con
 * el servicio Cloudflare Images, que este proyecto no tiene enlazado -- y
 * devolvía el ARCHIVO ORIGINAL. Medido en vivo: la foto del hero (un PNG de
 * Sanity de 1676x939) bajaba como PNG de 6,2 MB, y dos veces (escritorio y
 * teléfono); el logo de la barra, 254 KB para mostrarse a 57 px.
 *
 * SANITY YA REDIMENSIONA: su CDN entrega cada imagen al ancho pedido y en el
 * mejor formato que acepta el navegador (WebP/AVIF con auto=format), con
 * caché en todo el mundo. Este cargador arma esa URL para cada ancho del
 * srcset; el navegador baja solo el que necesita, directo de Sanity.
 *
 *  - Si la URL ya trae alto (h, recortes cuadrados como las fotos de las
 *    reseñas), se escala junto con el ancho: el recorte no cambia.
 *  - fit=max (si la URL no trae otro fit): nunca agranda una imagen chica.
 *
 * Las imágenes del propio sitio (/public) se sirven tal cual: ya se guardan
 * en el tamaño en que se usan (ver los logos livianos en public/).
 */
export default function cargadorImagenes({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);
  const p = url.searchParams;
  const anchoPrevio = Number(p.get("w"));
  const altoPrevio = Number(p.get("h"));
  if (anchoPrevio > 0 && altoPrevio > 0) p.set("h", String(Math.round((width * altoPrevio) / anchoPrevio)));
  p.set("w", String(width));
  p.set("q", String(quality ?? 75));
  p.set("auto", "format");
  if (!p.has("fit")) p.set("fit", "max");
  return url.toString();
}
