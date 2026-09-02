import { defineType, defineField } from "sanity";

/**
 * Un bloque de "Secciones de contenido" (texto + imagen) debajo de las 4
 * tarjetas del Hero, en la home (ver paginaInicio.ts, campo
 * "seccionesContenido"). Sprint "Crear 4 secciones de contenido debajo del
 * Hero".
 *
 * EL LADO (texto/imagen) NO se elige acá a proposito (spec §5/§10): el
 * frontend alterna solo segun la posicion en el arreglo (par/impar), asi
 * que este objeto no tiene ningun campo de "alineacion". Reordenar los
 * items en el Studio (arrastrar) es lo unico que cambia cual queda 01, 02,
 * etc. -- y el lado se recalcula solo.
 *
 * "imagen" y "imagenAlt" son obligatorios a proposito (a diferencia del
 * Hero, que tolera imagen null con un placeholder atmosferico): estas 4
 * secciones se piensan como bloques ya terminados desde que se publican,
 * no como un hueco que se va a llenar despues por partes. El frontend
 * igual tiene un respaldo visual por si el campo llega vacio de todas
 * formas (documento viejo, migracion a medias) -- ver ContentSection.tsx.
 *
 * options.hotspot: true ya activa TANTO el recorte (crop) como el punto
 * focal (hotspot) en el editor de imagen de Sanity -- son la misma
 * herramienta, no hace falta una opcion "crop" aparte.
 */
export const seccionContenido = defineType({
  name: "seccionContenido",
  title: "Sección de contenido",
  type: "object",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      description: "Podés recortarla y elegir el punto focal (hotspot) al subirla.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagenAlt",
      title: "Texto alternativo de la imagen",
      type: "string",
      description: "Describe la imagen para lectores de pantalla y buscadores.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTexto",
      title: "Texto del botón",
      type: "string",
      description: 'Ej. "Conocer más".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaEnlace",
      title: "Enlace del botón",
      type: "string",
      description:
        'Ruta interna (ej. "/contactanos") o URL completa (ej. "https://..."). Si es externa, se abre sola en una pestaña nueva -- no hace falta configurar eso acá.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "descripcion", media: "imagen" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Sección sin título",
      subtitle,
      media,
    }),
  },
});
