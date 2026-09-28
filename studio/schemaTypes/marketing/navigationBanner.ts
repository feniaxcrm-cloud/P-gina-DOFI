import { defineType } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección editorial de fondo oscuro: composición con brújula sobre morado.
 * Reutilizable en cualquier página de sections[] (Marketing Digital la usa
 * como "¿Cómo navegamos contigo?"; el título real sale del campo "Título"
 * de cada instancia).
 */
export const navigationBanner = defineType({
  name: "navigationBanner",
  title: "Bloque editorial (fondo oscuro)",
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
      title: titulo || "Bloque editorial",
      subtitle: `Fondo oscuro${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
