import { defineType } from "sanity";
import { camposBase, campoAlineacion, campoOverlay } from "./camposBase";

/** Sección "Equipo DOFI": foto de fondo con texto encima. Abre la página. */
export const teamBanner = defineType({
  name: "teamBanner",
  title: "Equipo DOFI",
  type: "object",
  fields: camposBase({
    textos: {
      imagen:
        "Fotografía de fondo (Daniel con el equipo). Usa el punto focal para que las caras queden siempre visibles. Sin foto, el banner usa el fondo morado de marca.",
      subtitulo: "Etiqueta chica con pin de ubicación. Ej: Cuenca - Ecuador.",
      titulo: "La pregunta principal. Breve: está pensada para dos líneas.",
      descripcion: "Una frase corta.",
      destacado: "Slogan en naranja. Ej: Un Mar de Ideas.",
    },
    diseno: [campoAlineacion("izquierda"), campoOverlay()],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Equipo DOFI",
      subtitle: `Equipo DOFI${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
