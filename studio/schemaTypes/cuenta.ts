import { defineType, defineField } from "sanity";

/**
 * Cuenta (cliente de DOFI/FENIAX). Fuente unica de verdad para el carrusel,
 * el muro de logos, la pagina individual /clientes/<slug> y el sitemap —
 * ver src/lib/sanity.ts en la web. Una cuenta desactivada deja de aparecer
 * en toda la web publica, pero se conserva aqui junto con sus contenidos.
 */
export const cuenta = defineType({
  name: "cuenta",
  title: "Cuenta",
  type: "document",
  groups: [
    { name: "principal", title: "Informacion principal", default: true },
    { name: "detalle", title: "Pagina individual" },
    { name: "redes", title: "Redes y enlaces" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      group: "principal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "principal",
      description: "Se usa en la URL: /clientes/<slug>.",
      options: { source: "nombre", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "activa",
      title: "Activa",
      type: "boolean",
      group: "principal",
      description:
        "Desactivala en vez de borrarla: deja de aparecer en el carrusel, el muro de logos, la pagina individual y el sitemap, pero sus datos y contenidos se conservan aqui.",
      initialValue: true,
    }),
    defineField({
      name: "orden",
      title: "Orden de aparicion",
      type: "number",
      group: "principal",
      description: "Cuentas con numero mas bajo aparecen primero.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "principal",
      options: { hotspot: true },
      description:
        "Opcional. Sin logo, la web muestra un monograma con las iniciales del nombre (el comportamiento de hoy).",
    }),
    defineField({
      name: "portada",
      title: "Imagen principal",
      type: "image",
      group: "principal",
      options: { hotspot: true },
      description: "Opcional. Sin ella, la pagina de la cuenta usa una portada generica.",
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "string",
      group: "principal",
      description: 'Rubro de la cuenta. Ej "Restaurante", "Movilidad", "Alimentos".',
    }),
    defineField({
      name: "ciudad",
      title: "Ciudad",
      type: "string",
      group: "principal",
    }),
    defineField({
      name: "resumen",
      title: "Resumen",
      type: "text",
      rows: 2,
      group: "principal",
      description:
        "Frase corta de que se hizo para la cuenta. Se ve en la tarjeta y el carrusel. Maximo ~18 palabras.",
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "servicios",
      title: "Servicios",
      type: "array",
      group: "principal",
      of: [{ type: "reference", to: [{ type: "servicio" }] }],
    }),
    defineField({
      name: "reto",
      title: "El reto",
      type: "text",
      rows: 4,
      group: "detalle",
      description: "Reto del negocio antes de entrar. 1-2 parrafos. Opcional.",
    }),
    defineField({
      name: "enfoque",
      title: "Lo que hicimos",
      type: "text",
      rows: 4,
      group: "detalle",
      description: "Que se hizo. 1-2 parrafos. Opcional.",
    }),
    defineField({
      name: "resultados",
      title: "Resultados",
      type: "array",
      group: "detalle",
      of: [{ type: "resultado" }],
      description: "Datos duros. Solo los confirmados por el cliente; no inventar.",
    }),
    defineField({
      name: "testimonio",
      title: "Testimonio",
      type: "testimonio",
      group: "detalle",
    }),
    defineField({
      name: "redes",
      title: "Redes y enlaces",
      type: "redesSociales",
      group: "redes",
    }),
  ],
  preview: {
    select: {
      title: "nombre",
      subtitle: "categoria",
      media: "logo",
      activa: "activa",
    },
    prepare: ({ title, subtitle, media, activa }) => ({
      title,
      subtitle: activa === false ? `${subtitle ?? "Sin categoria"} · Inactiva` : subtitle,
      media,
    }),
  },
});
