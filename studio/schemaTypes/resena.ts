import { defineType, defineField } from "sanity";

/**
 * Una reseña de Google, cargada a mano.
 *
 * SOLO RESEÑAS REALES. Copiá las del perfil de Google de DOFI tal cual: el
 * texto, las estrellas y el nombre de quien la escribió. Una reseña
 * inventada o editada es publicidad engañosa, y Google sanciona los
 * perfiles que la usan. Por eso el sitio no trae ninguna reseña de ejemplo.
 */
export const resena = defineType({
  name: "resena",
  title: "Reseña",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      description: "Tal como aparece en Google.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "estrellas",
      title: "Estrellas",
      type: "number",
      options: {
        list: [
          { title: "★★★★★  5", value: 5 },
          { title: "★★★★☆  4", value: 4 },
          { title: "★★★☆☆  3", value: 3 },
          { title: "★★☆☆☆  2", value: 2 },
          { title: "★☆☆☆☆  1", value: 1 },
        ],
        layout: "radio",
      },
      initialValue: 5,
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: "comentario",
      title: "Comentario",
      type: "text",
      rows: 5,
      description: "Copiado textual de Google, sin corregir ni recortar.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "empresa",
      title: "Empresa (opcional)",
      type: "string",
      description: "Solo si la persona la menciona o es cliente conocido.",
    }),
    defineField({
      name: "foto",
      title: "Foto (opcional)",
      type: "image",
      description: "La foto de perfil de Google. Sin ella se muestran sus iniciales.",
      options: { hotspot: true },
    }),
    defineField({
      name: "enlaceOriginal",
      title: "Enlace a la reseña en Google (opcional)",
      type: "url",
      description: "Permite que cualquiera verifique que la reseña es real.",
    }),
    defineField({
      name: "activa",
      title: "Mostrar en la web",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
      description: "Las de número más bajo aparecen primero.",
    }),
  ],
  orderings: [
    { title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", estrellas: "estrellas", empresa: "empresa", media: "foto", activa: "activa" },
    prepare: ({ title, estrellas, empresa, media, activa }) => ({
      title: title || "Reseña sin nombre",
      subtitle: `${"★".repeat(estrellas ?? 0)}${empresa ? ` · ${empresa}` : ""}${activa === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
