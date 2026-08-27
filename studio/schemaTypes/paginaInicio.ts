import { defineType, defineField } from "sanity";

/**
 * Página de inicio — documento único (singleton, ver deskStructure.ts).
 *
 * Hoy solo trae Hero y Capacidades (Replanteo Navbar + Hero + Sanity). El
 * resto de la home (Lo que hacemos / El Socio / Cierre) ya está cableado en
 * src/lib/sanity.ts esperando este mismo documento bajo "secciones[]", pero
 * ese campo NO se agrega acá todavía — está fuera del alcance de este
 * sprint y agregarlo a ciegas sin definir su editor en el Studio dejaría un
 * campo a medio terminar. Ver el reporte de auditoría para el detalle.
 */
export const paginaInicio = defineType({
  name: "paginaInicio",
  title: "Página de inicio",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "capacidades", title: "Capacidades" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      description: "Solo para identificar el documento en esta lista. No se muestra en la web.",
      initialValue: "Página de inicio",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "titulo",
          title: "Título (H1)",
          type: "string",
          description: 'Ej. "Un Mar de Ideas".',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "marca",
          title: "Marca",
          type: "string",
          description: 'Ej. "DOFI Agencia Creativa".',
        }),
        defineField({
          name: "mensaje",
          title: "Propuesta comercial",
          type: "string",
          description: 'Ej. "Convertimos atención en Ventas Inteligentes".',
        }),
        defineField({
          name: "imagen",
          title: "Imagen principal",
          type: "image",
          description:
            "Ocupa la mitad derecha del Hero. Elegí el punto focal (hotspot) sobre el sujeto: la web recorta distinto según el tamaño de pantalla y respeta ese punto.",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              description: "Describe la imagen para lectores de pantalla y SEO.",
            }),
          ],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ctaPrincipalTexto",
          title: "Texto del botón principal",
          type: "string",
          description: 'Ej. "Empecemos".',
        }),
        defineField({
          name: "ctaPrincipalEnlace",
          title: "Enlace del botón principal",
          type: "string",
          description: 'Ruta interna (ej. "/contactanos") o URL completa.',
        }),
        defineField({
          name: "ctaSecundarioTexto",
          title: "Texto del botón secundario",
          type: "string",
          description: 'Ej. "Conoce lo que hacemos".',
        }),
        defineField({
          name: "ctaSecundarioEnlace",
          title: "Enlace del botón secundario",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "capacidades",
      title: "Capacidades",
      type: "array",
      group: "capacidades",
      description:
        "La banda de 4 tarjetas superpuesta debajo del Hero. Arrastrá para reordenar.",
      of: [{ type: "capacidad" }],
    }),
  ],
  preview: {
    select: { title: "titulo" },
    prepare: ({ title }) => ({ title: title || "Página de inicio" }),
  },
});
