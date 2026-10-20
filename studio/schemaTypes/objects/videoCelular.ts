import { defineField, defineType } from "sanity";
import { campoImagen } from "./campoImagen";

/** Un celular de la sección «Videos en celulares» (Asesorías): su video
 *  vertical, un título corto que va sobre el video y una portada opcional. */
export const videoCelular = defineType({
  name: "videoCelular",
  title: "Celular con video",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Video VERTICAL 9:16, MP4 (H.264) liviano, idealmente de menos de 15 MB. No se descarga hasta que la sección está por verse, y se reproduce cuando la persona lo toca.",
    }),
    defineField({
      name: "titulo",
      title: "Título sobre el video",
      type: "string",
      validation: (Rule) => Rule.max(40),
      description: "Opcional. Corto, va en mayúsculas abajo del video. Ej: «¿Cómo llegar?».",
    }),
    campoImagen({
      name: "portada",
      title: "Portada (opcional)",
      description: "Lo que se ve antes de reproducir. Idealmente, un cuadro del mismo video. Sin portada, se ve el primer cuadro.",
    }),
  ],
  preview: {
    select: { titulo: "titulo", media: "portada", archivo: "video.asset.originalFilename" },
    prepare: ({ titulo, media, archivo }) => ({
      title: titulo || archivo || "Celular sin video",
      subtitle: archivo ? "Con video" : "Sin video",
      media,
    }),
  },
});
