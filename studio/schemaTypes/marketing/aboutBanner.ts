import { defineType } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección "Introducción": título a la izquierda, texto a la derecha.
 * Reutilizable en cualquier página de sections[] (Marketing Digital la usa
 * como "¿Qué es DOFI?"; el título real siempre sale del campo "Título" de
 * cada instancia, este es solo el nombre del tipo en el Studio).
 */
export const aboutBanner = defineType({
  name: "aboutBanner",
  title: "Introducción",
  type: "object",
  fields: camposBase({
    imagenRecortable: false,
    textos: {
      imagen:
        "Opcional. Si subes una pieza gráfica terminada, se muestra completa (sin recortes) en lugar del diseño con texto, y el texto pasa a ser su descripción para Google.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      destacado: "Frase de cierre en morado. Ej: Navegar en un Mar de Oportunidades.",
    },
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Introducción",
      subtitle: `Introducción${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
