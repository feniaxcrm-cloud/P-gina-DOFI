import type { MetadataRoute } from "next";
import { site, absoluteUrl } from "@/config/site";

/**
 * /robots.txt
 *
 * Antes no existia: la peticion caia en el robots.txt por defecto de
 * Cloudflare (el de "content signals"), que no declara sitemap ni sabe nada
 * de este proyecto.
 *
 * El comportamiento depende del entorno, no de una constante fija:
 *
 *   STAGING (*.workers.dev, local, sin NEXT_PUBLIC_SITE_URL)
 *     -> Disallow: / . Nada de esto debe entrar en un indice.
 *
 *   PRODUCCION (NEXT_PUBLIC_SITE_URL con dominio propio)
 *     -> Allow: / , se bloquea solo /api/, y se declara el sitemap.
 *
 * No se agregan reglas para crawlers de IA todavia: eso corresponde al
 * sprint de SEO/GEO, con la decision de negocio tomada.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.isIndexable) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
