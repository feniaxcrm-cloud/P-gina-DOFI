import { defineType } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Cierre comercial con la imagen A LA DERECHA (página Tráfico / Ads): el texto
 * y el botón grande a la izquierda y, al lado, una imagen completa.
 *
 * Distinto del «Cierre (CTA final)» de las demás páginas, donde la foto es el
 * FONDO. Acá la imagen no se recorta ni se deforma: se muestra tal como se
 * diseñó, a la derecha del texto (en teléfono, debajo). Sin imagen, se ve como
 * el cierre normal: fondo de marca y el texto centrado.
 */
export const ctaImageBanner = defineType({
  name: "ctaImageBanner",
  title: "Cierre con imagen a la derecha",
  type: "object",
  description:
    "Cierre comercial: texto y botón a la izquierda, imagen completa a la derecha. Sin imagen, se ve como el cierre normal.",
  fields: camposBase({
    imagenRecortable: false,
    textos: {
      imagen:
        "La imagen que va a la DERECHA del texto. Se muestra completa, sin recortes ni deformación (usa una pieza ya diseñada). Sin imagen, el cierre usa el fondo de marca con el texto centrado.",
      imagenMovil: "Opcional: una versión compuesta para teléfono. Sin ella, en móvil se usa la imagen de arriba.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      titulo: "La pregunta de cierre.",
      descripcion: "Una frase debajo del título.",
      destacado: "La línea que cierra el texto, en naranja. Opcional.",
      cta: "El botón principal de la sección: se muestra en tamaño grande y lleva al formulario de contacto.",
    },
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Cierre",
      subtitle: `Cierre con imagen${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
