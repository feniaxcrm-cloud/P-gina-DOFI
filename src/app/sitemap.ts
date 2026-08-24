import type { MetadataRoute } from "next";
import { getAllActiveSlugs } from "@/lib/sanity";
import { absoluteUrl } from "@/config/site";

/**
 * /sitemap.xml
 *
 * Antes devolvia 404: las 27 URLs publicas no tenian ninguna ruta de
 * descubrimiento declarada.
 *
 * Se genera con la MISMA fuente que alimenta generateStaticParams() en
 * /clientes/[slug] (getAllActiveSlugs(), ver src/lib/sanity.ts), asi el
 * sitemap no puede declarar una pagina que no existe ni omitir una que si.
 * Las cuentas inactivas quedan fuera a proposito.
 *
 * Deliberadamente fuera: /api/*, rutas internas y cualquier cosa no
 * navegable.
 *
 * OJO: en staging el sitemap se genera igual (es util para verificar que
 * funciona), pero robots.ts NO lo declara y el sitio va con noindex. No
 * enviar este sitemap a Search Console hasta que exista el dominio
 * definitivo en NEXT_PUBLIC_SITE_URL.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();
  const slugs = await getAllActiveSlugs();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: absoluteUrl(`/clientes/${slug}`),
      lastModified: ahora,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
