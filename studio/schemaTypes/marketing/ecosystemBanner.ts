import { defineType } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección "Ecosistema" (página Tráfico / Ads): fondo morado profundo con el
 * texto a la izquierda y, a la derecha, una animación del recorrido de una
 * persona: descubre la marca en Instagram, la busca en Google, visita la web
 * y la contacta por WhatsApp.
 *
 * La animación es un video hecho con HyperFrames (carpeta video/ del
 * proyecto); no se edita desde acá. Si subes una imagen, la imagen
 * REEMPLAZA a la animación (completa, sin recortes).
 */
export const ecosystemBanner = defineType({
  name: "ecosystemBanner",
  title: "Ecosistema",
  type: "object",
  description:
    "Sección oscura con el recorrido Instagram → Google → web → WhatsApp animado. Subir una imagen reemplaza la animación.",
  fields: camposBase({
    imagenRecortable: false,
    textos: {
      subtitulo: "Etiqueta chica arriba del título. Ej.: «Ecosistema».",
      titulo: "La última palabra se destaca en naranja.",
      descripcion: "Deja una línea en blanco para separar párrafos.",
      destacado: "La frase que cierra el texto, más grande. Opcional.",
      imagen:
        "Opcional. Si la subes, reemplaza la animación del recorrido: se muestra completa, sin recortes ni deformación.",
    },
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Ecosistema",
      subtitle: `Ecosistema${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
