import { defineType, defineField } from "sanity";

/**
 * Un banner de la home: los 4 bloques full-width que van debajo de las
 * tarjetas del Hero (ver paginaInicio.ts, campo "seccionesContenido").
 *
 * Sprint "Banners full-width": la seccion pasa a ser UNA SOLA IMAGEN a todo
 * el ancho del viewport. La pieza grafica ES el diseño -- el mensaje, los
 * titulos y los botones viven dentro de la imagen, no en HTML.
 *
 * Por eso este objeto perdio todos sus campos anteriores (titulo,
 * descripcion, imagen/imagenAlt, imagenSecundaria/imagenSecundariaAlt,
 * ctaTexto/ctaEnlace): existian solo para la maqueta de dos columnas con
 * texto y boton, que ya no existe. El contenido que tenian quedo respaldado
 * en audit/backup-secciones-contenido-2026-09-08.json antes de migrarse, y
 * el CTA vuelve mas adelante como campo propio cuando se defina la
 * composicion final de cada banner.
 *
 * El nombre del TIPO no cambia ("seccionContenido"): renombrarlo dejaria
 * huerfanos los 4 items ya publicados, que se identifican por su _type.
 *
 * options.hotspot: true activa hotspot Y recorte (crop) -- son la misma
 * herramienta en el editor de Sanity. Es clave aca: la imagen se usa como
 * banner recortado a lo ancho, asi que el punto focal decide que parte
 * queda visible en cada tamaño de pantalla.
 */
export const seccionContenido = defineType({
  name: "seccionContenido",
  title: "Banner",
  type: "object",
  fields: [
    defineField({
      name: "backgroundImage",
      title: "Imagen de fondo del banner",
      type: "image",
      options: { hotspot: true },
      description:
        "La pieza gráfica completa: ocupa todo el ancho de la pantalla. Usá el recorte y el punto focal (hotspot) para elegir qué parte se mantiene visible cuando el banner se achica en mobile.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundImageAlt",
      title: "Texto alternativo",
      type: "string",
      description:
        "Qué dice y qué muestra la pieza. Como el mensaje vive dentro de la imagen, este texto es lo único que leen los lectores de pantalla y los buscadores.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: "backgroundImage", subtitle: "backgroundImageAlt" },
    prepare: ({ media, subtitle }) => ({
      title: "Banner",
      subtitle: subtitle || "Sin texto alternativo",
      media,
    }),
  },
});
