import { defineType, defineField } from "sanity";
import { campoImagen } from "./campoImagen";

/**
 * Banner fotografico de Marketing Digital: una foto de fondo a todo el ancho
 * con texto HTML encima. Lo usan "1 · Equipo DOFI" y "7 · Cierre".
 *
 * Aca la foto SI se recorta (es un fondo, el mensaje va en HTML), por eso
 * lleva punto focal, overlay para leer el texto y parallax.
 */
export const mdBannerFoto = defineType({
  name: "mdBannerFoto",
  title: "Banner con foto",
  type: "object",
  fieldsets: [
    { name: "imagen", title: "Imagen", options: { collapsible: true, collapsed: false } },
    { name: "textos", title: "Textos", options: { collapsible: true, collapsed: false } },
    { name: "diseno", title: "Diseño y animación", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    campoImagen({
      name: "imagen",
      title: "Fotografía de fondo",
      fieldset: "imagen",
      description:
        "Ocupa todo el ancho. Usá el punto focal (hotspot) para elegir qué parte queda siempre visible, sobre todo la cara. Mientras no haya foto, el banner usa un fondo de marca.",
    }),
    campoImagen({
      name: "imagenMovil",
      title: "Versión para móvil (opcional)",
      fieldset: "imagen",
      description:
        "Una versión vertical de la misma foto para teléfonos. Sin ella, en móvil se recorta la foto de arriba usando su punto focal.",
    }),
    defineField({
      name: "etiqueta",
      title: "Etiqueta superior",
      type: "string",
      fieldset: "textos",
      description: 'Texto chico arriba del título, con un pin de ubicación. Ej: "Cuenca - Ecuador".',
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      fieldset: "textos",
      description: "La pregunta o frase principal del banner.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 2,
      fieldset: "textos",
    }),
    defineField({
      name: "destacado",
      title: "Texto destacado",
      type: "string",
      fieldset: "textos",
      description: 'Frase corta en naranja, debajo de la descripción. Ej: "Un Mar de Ideas".',
    }),
    defineField({
      name: "cta",
      title: "Botón",
      type: "ctaSimple",
      fieldset: "textos",
    }),
    defineField({
      name: "alineacion",
      title: "Posición del contenido",
      type: "string",
      fieldset: "diseno",
      description: "En escritorio. En móvil el texto va siempre abajo.",
      options: {
        list: [
          { title: "Izquierda", value: "izquierda" },
          { title: "Centro", value: "centro" },
          { title: "Derecha", value: "derecha" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "izquierda",
    }),
    defineField({
      name: "overlay",
      title: "Oscurecer la foto (overlay)",
      type: "string",
      fieldset: "diseno",
      description:
        "Oscurece la foto del lado del texto para que se lea bien. Si la foto es clara, subilo; si ya es oscura, bajalo.",
      options: {
        list: [
          { title: "Nada", value: "ninguno" },
          { title: "Suave", value: "suave" },
          { title: "Medio", value: "medio" },
          { title: "Fuerte", value: "fuerte" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "medio",
    }),
    defineField({
      name: "animar",
      title: "Animaciones",
      type: "boolean",
      fieldset: "diseno",
      description: "Entrada suave del texto y parallax ligero en la foto. Apagalo para que todo aparezca quieto.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "titulo", media: "imagen" },
    prepare: ({ title, media }) => ({ title: title || "Banner sin título", media }),
  },
});
