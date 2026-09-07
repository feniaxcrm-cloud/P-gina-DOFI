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
 * DOS IMAGENES POR SECCION (Sprint "CTA debajo de la imagen con texto")
 * -----------------------------------------------------------------
 * "imagen" (la de siempre, con su contenido ya cargado) es la IMAGEN CON
 * TEXTO: la pieza diseñada que lleva el mensaje adentro, y es la que manda
 * en la composicion -- el boton va justo debajo de ella. "imagenSecundaria"
 * es la IMAGEN NORMAL, la foto de apoyo que va en la otra columna.
 *
 * El nombre del campo "imagen" NO se renombro a proposito: renombrarlo
 * dejaria huerfano el contenido ya publicado en las 4 secciones. Solo
 * cambia su etiqueta en el Studio para que se entienda cual es cual.
 *
 * "titulo" y "descripcion" siguen existiendo y siguen siendo obligatorios,
 * pero desde este sprint el frontend YA NO los pinta: el mensaje vive
 * dentro de la imagen con texto. Se conservan porque son la fuente del
 * contenido (y del `alt` de la imagen) y porque borrar campos con
 * contenido cargado es destructivo.
 *
 * "imagenSecundaria" es OPCIONAL a proposito, al reves que "imagen": si
 * fuera obligatoria, las 4 secciones ya publicadas quedarian invalidas y
 * el Studio bloquearia cualquier edicion (aunque solo se quiera tocar el
 * CTA) hasta subir las 4 fotos nuevas. El frontend pinta un respaldo
 * atmosferico mientras falte -- nunca un hueco roto.
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
      title: "Imagen CON TEXTO (la principal)",
      type: "image",
      options: { hotspot: true },
      description:
        "La pieza diseñada que lleva el mensaje adentro. Es la que manda en la sección: el botón va justo debajo de ella. Podés recortarla y elegir el punto focal (hotspot) al subirla.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagenAlt",
      title: "Texto alternativo de la imagen con texto",
      type: "string",
      description:
        "Describe la imagen para lectores de pantalla y buscadores. Como el mensaje vive dentro de la imagen, conviene que acá esté ese mismo mensaje escrito.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagenSecundaria",
      title: "Imagen NORMAL (la de apoyo)",
      type: "image",
      options: { hotspot: true },
      description:
        "La foto complementaria, va en la otra columna. Opcional: mientras no la cargues, la web muestra un fondo suave en su lugar en vez de un hueco.",
    }),
    defineField({
      name: "imagenSecundariaAlt",
      title: "Texto alternativo de la imagen normal",
      type: "string",
      description: "Describe la foto de apoyo para lectores de pantalla y buscadores.",
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
