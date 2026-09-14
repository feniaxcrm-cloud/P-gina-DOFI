import { defineType } from "sanity";
import { camposBase } from "./camposBase";

/** Sección "¿Qué es DOFI?": título a la izquierda, texto a la derecha. */
export const aboutBanner = defineType({
  name: "aboutBanner",
  title: "¿Qué es DOFI?",
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
      title: titulo || "¿Qué es DOFI?",
      subtitle: `¿Qué es DOFI?${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
