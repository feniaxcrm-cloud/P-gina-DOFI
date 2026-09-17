import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección "Reseñas de Google". Muestra tarjetas de reseñas directamente, sin
 * botón: si la API de Google está configurada (ver .env.example) y devuelve
 * reseñas, se muestran esas; si no, las cargadas a mano en el menú "Reseñas".
 *
 * SIN BOTÓN A PROPÓSITO: esta sección ya no tiene CTA (se omite con
 * `omitir: ["cta"]`) porque el contenido de la sección son las reseñas
 * mismas, no una invitación a leerlas en otro lado.
 *
 * Sin campos de imagen: esta sección no usa ninguna. Tener un campo que no
 * hace nada solo confunde a quien edita.
 */
export const reviewsBanner = defineType({
  name: "reviewsBanner",
  title: "Reseñas de Google",
  type: "object",
  description: "Tarjetas de reseñas. Prioridad: reseñas reales de Google si la API está configurada; si no, las cargadas en el menú «Reseñas».",
  fields: camposBase({
    conImagen: false,
    omitir: ["cta"],
    textos: {
      subtitulo: "Etiqueta chica junto al ícono de Google. Vacío: dice «Google».",
      destacado: "Opcional.",
    },
    extras: [
      defineField({
        name: "enlaceGoogle",
        title: "Enlace al perfil de Google",
        type: "url",
        description: "Donde están todas las reseñas. Por defecto, la ficha de Google Maps del local.",
      }),
      defineField({
        name: "cantidadMostrada",
        title: "Cantidad de reseñas a mostrar",
        type: "number",
        description: "Máximo de tarjetas en el carrusel. Vacío: se muestran todas las disponibles.",
        validation: (Rule) => Rule.integer().min(1).max(50),
      }),
      defineField({
        name: "autoplay",
        title: "Avance automático",
        type: "boolean",
        description: "El carrusel avanza solo cada tantos segundos. Se detiene al pasar el cursor o enfocar con teclado, y no se activa con movimiento reducido. Apagado por defecto.",
        initialValue: false,
      }),
      defineField({
        name: "velocidadAutoplay",
        title: "Velocidad del avance automático (segundos)",
        type: "number",
        description: "Solo aplica si el avance automático está activo.",
        initialValue: 6,
        validation: (Rule) => Rule.integer().min(3).max(30),
        hidden: ({ parent }) => !parent?.autoplay,
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
