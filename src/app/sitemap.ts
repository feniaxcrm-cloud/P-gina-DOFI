import type { MetadataRoute } from "next";
import { clients } from "@/data/clients";
import { absoluteUrl } from "@/config/site";

/**
 * /sitemap.xml
 *
 * Antes devolvia 404: las 27 URLs publicas no tenian ninguna ruta de
 * descubrimiento declarada.
 *
 * Se genera a partir de la MISMA lista que alimenta generateStaticParams()
 * en /clientes/[slug] (src/data/clients.ts), asi el sitemap no puede
 * declarar una pagina que no existe ni omitir una que si.
 *
 * Deliberadamente fuera: /api/*, rutas internas y cualquier cosa no
 * navegable.
 *
 * OJO: en staging el sitemap se genera igual (es util para verificar que
 * funciona), pero robots.ts NO lo declara y el sitio va con noindex. No
 * enviar este sitemap a Search Console hasta que exista el dominio
 * definitivo en NEXT_PUBLIC_SITE_URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...clients.map((cliente) => ({
      url: absoluteUrl(`/clientes/${cliente.slug}`),
      lastModified: ahora,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
