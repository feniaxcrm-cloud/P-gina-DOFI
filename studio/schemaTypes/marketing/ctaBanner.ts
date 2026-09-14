import { defineType } from "sanity";
import { camposBase, campoAlineacion, campoOverlay } from "./camposBase";

/** Sección de cierre comercial: foto de fondo, pregunta y botón grande. */
export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "Cierre (CTA final)",
  type: "object",
  fields: camposBase({
    textos: {
      imagen:
        "Fotografía de fondo (Daniel dando la mano). Usa el punto focal para elegir qué parte queda visible. Sin foto, usa el fondo de marca.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      titulo: "La pregunta de cierre.",
      cta: "El botón principal de la sección: se muestra en tamaño grande.",
    },
    diseno: [campoAlineacion("centro"), campoOverlay()],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Cierre",
      subtitle: `Cierre${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
