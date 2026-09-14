import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección "Reseñas de Google". Las reseñas se cargan en el menú "Reseñas".
 *
 * Sin campos de imagen: esta sección no usa ninguna. Tener un campo que no
 * hace nada solo confunde a quien edita.
 */
export const reviewsBanner = defineType({
  name: "reviewsBanner",
  title: "Reseñas de Google",
  type: "object",
  description: "Las reseñas se cargan en el menú «Reseñas». Mientras no haya ninguna, la sección invita a leerlas en Google.",
  fields: camposBase({
    conImagen: false,
    textos: {
      subtitulo: "Etiqueta chica junto al ícono de Google. Vacío: dice «Google».",
      destacado: "Opcional.",
      cta: "Opcional. Sin reseñas cargadas, reemplaza al botón «Ver reseñas en Google».",
    },
    extras: [
      defineField({
        name: "enlaceGoogle",
        title: "Enlace al perfil de Google",
        type: "url",
        description: "Donde están todas las reseñas. Por defecto, la ficha de Google Maps del local.",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo" },
    prepare: ({ titulo, activo }) => ({
      title: titulo || "Reseñas de Google",
      subtitle: `Reseñas${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
