import { defineType, defineField } from "sanity";
import { campoImagen } from "./campoImagen";

/**
 * Sección de Marketing Digital construida alrededor de una PIEZA GRÁFICA
 * TERMINADA ("2 · ¿Qué es DOFI?" y "3 · ¿Cómo navegamos contigo?").
 *
 * La pieza se muestra completa y tal cual: nunca se recorta ni se le pone
 * nada encima. Por eso la imagen no ofrece punto focal.
 *
 * Los textos cumplen dos funciones: mientras no haya pieza, se muestran en
 * la página con diseño propio; cuando la pieza está, dejan de mostrarse
 * (ya están dibujados en la imagen) y pasan a ser lo que leen Google y los
 * lectores de pantalla.
 */
export const mdPiezaGrafica = defineType({
  name: "mdPiezaGrafica",
  title: "Pieza gráfica",
  type: "object",
  fieldsets: [
    { name: "pieza", title: "Pieza gráfica", options: { collapsible: true, collapsed: false } },
    { name: "textos", title: "Textos de la pieza", options: { collapsible: true, collapsed: false } },
    { name: "extra", title: "Contenido adicional", options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    campoImagen({
      name: "imagen",
      title: "Pieza gráfica",
      fieldset: "pieza",
      recortable: false,
      description:
        "La pieza terminada. Se muestra completa, del ancho de la pantalla, sin recortes. En el texto alternativo copiá lo que dice la pieza.",
    }),
    campoImagen({
      name: "imagenMovil",
      title: "Versión para móvil (opcional)",
      fieldset: "pieza",
      recortable: false,
      description:
        "La misma pieza compuesta para teléfono (vertical o cuadrada). Sin ella, en móvil se ve la pieza de arriba completa, pero más chica.",
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      fieldset: "textos",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "text",
      rows: 5,
      fieldset: "textos",
      description: "Dejá una línea en blanco para separar párrafos.",
    }),
    defineField({
      name: "destacado",
      title: "Frase de cierre",
      type: "string",
      fieldset: "textos",
      description: 'Ej: "Navegar en un Mar de Oportunidades."',
    }),
    defineField({
      name: "textoAdicional",
      title: "Texto adicional",
      type: "text",
      rows: 3,
      fieldset: "extra",
      description: "Se muestra SIEMPRE, debajo de la pieza: contenido que la imagen no trae.",
    }),
    defineField({
      name: "cta",
      title: "Botón",
      type: "ctaSimple",
      fieldset: "extra",
    }),
    defineField({
      name: "animar",
      title: "Animaciones",
      type: "boolean",
      fieldset: "extra",
      description: "Entrada suave al hacer scroll. La pieza en sí nunca se mueve.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "titulo", media: "imagen" },
    prepare: ({ title, media }) => ({
      title: title || "Pieza sin título",
      subtitle: media ? "Pieza cargada" : "Falta la pieza: se muestra el texto",
      media,
    }),
  },
});
