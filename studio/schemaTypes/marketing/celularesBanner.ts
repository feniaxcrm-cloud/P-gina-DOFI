import { defineField, defineType } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección «Videos en celulares» (Asesorías, pedido del 2026-10-20): tres
 * celulares en una fila, el del centro más grande (el principal) y dos a los
 * lados. Cada uno tiene su propio video, título y portada.
 *
 * Rendimiento: los videos no se descargan hasta que la sección está por verse
 * y se reproducen cuando la persona toca uno (uno a la vez).
 */
export const celularesBanner = defineType({
  name: "celularesBanner",
  title: "Videos en celulares",
  type: "object",
  description: "Tres celulares con video, el del centro más grande. Cada uno con su propio video.",
  fieldsets: [{ name: "celulares", title: "Los tres celulares", options: { collapsible: true, collapsed: false } }],
  fields: camposBase({
    conImagen: false,
    omitir: ["destacado", "cta"],
    textos: {
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      titulo: "El título de la sección.",
      descripcion: "Opcional: una frase debajo del título.",
    },
    extras: [
      defineField({ name: "celularIzquierdo", title: "Celular izquierdo", type: "videoCelular", fieldset: "celulares" }),
      defineField({
        name: "celularCentral",
        title: "Celular central (el principal, más grande)",
        type: "videoCelular",
        fieldset: "celulares",
      }),
      defineField({ name: "celularDerecho", title: "Celular derecho", type: "videoCelular", fieldset: "celulares" }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo" },
    prepare: ({ titulo, activo }) => ({
      title: titulo || "Videos en celulares",
      subtitle: `Tres celulares con video${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
