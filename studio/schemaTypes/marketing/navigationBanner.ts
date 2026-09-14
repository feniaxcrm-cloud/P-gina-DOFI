import { defineType } from "sanity";
import { camposBase } from "./camposBase";

/** Sección "¿Cómo navegamos contigo?": composición editorial sobre morado. */
export const navigationBanner = defineType({
  name: "navigationBanner",
  title: "¿Cómo navegamos contigo?",
  type: "object",
  fields: camposBase({
    imagenRecortable: false,
    textos: {
      imagen:
        "Opcional. Si subes una pieza gráfica terminada, se muestra completa en lugar de la composición con brújula.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      titulo: "La última palabra se destaca en naranja.",
      descripcion: "Uno o dos párrafos breves, separados por una línea en blanco. Con dos, van en dos columnas.",
      destacado: "Opcional: frase corta debajo de los párrafos.",
    },
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "¿Cómo navegamos contigo?",
      subtitle: `Cómo navegamos${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
