import { defineType, defineField } from "sanity";

/**
 * Una tarjeta de la banda de capacidades del Hero (home). Selector
 * controlado de icono: solo las 4 claves que el frontend sabe mapear a un
 * icono Phosphor real (src/components/CapabilityBand.tsx) — evita subir un
 * SVG arbitrario o mezclar estilos de icono (ver DOFI — Replanteo Navbar +
 * Hero + Sanity, §35-37).
 */
export const capacidad = defineType({
  name: "capacidad",
  title: "Capacidad",
  type: "object",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 2,
      description: "Breve. Una frase, no un párrafo — la tarjeta es compacta.",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "icono",
      title: "Ícono",
      type: "string",
      description: "Define qué ícono se dibuja. No es un archivo: es una clave fija.",
      options: {
        list: [
          { title: "Brújula — planificación / estrategia", value: "strategy" },
          { title: "Chat — conversación", value: "conversation" },
          { title: "Cámara de video — producción audiovisual", value: "video" },
          { title: "Calendario — publicación de contenido", value: "publishing" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "activa",
      title: "Activa",
      type: "boolean",
      description: "Desactivala para ocultarla de la home sin borrarla.",
      initialValue: true,
    }),
    defineField({
      name: "enlace",
      title: "Enlace (opcional)",
      type: "string",
      description:
        "Si lo completás, la tarjeta se vuelve clickeable. Vacío = tarjeta informativa, sin acción.",
    }),
  ],
  preview: {
    select: { title: "titulo", icono: "icono", activa: "activa" },
    prepare: ({ title, icono, activa }) => ({
      title,
      subtitle: `${icono ?? "sin ícono"}${activa === false ? " · Inactiva" : ""}`,
    }),
  },
});
