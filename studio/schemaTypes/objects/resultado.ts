import { defineType, defineField } from "sanity";

/** Dato duro de una cuenta. NO inventar: dejar solo los que el cliente confirme. */
export const resultado = defineType({
  name: "resultado",
  title: "Resultado",
  type: "object",
  fields: [
    defineField({
      name: "valor",
      title: "Valor",
      type: "string",
      description: 'El numero, tal cual. Ej "3x", "-40%", "88".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "etiqueta",
      title: "Etiqueta",
      type: "string",
      description: 'Que mide ese numero. Ej "leads por semana".',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { valor: "valor", etiqueta: "etiqueta" },
    prepare: ({ valor, etiqueta }) => ({
      title: [valor, etiqueta].filter(Boolean).join(" — ") || "Resultado",
    }),
  },
});
