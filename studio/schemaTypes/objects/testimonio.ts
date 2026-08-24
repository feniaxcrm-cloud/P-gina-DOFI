import { defineType, defineField } from "sanity";

export const testimonio = defineType({
  name: "testimonio",
  title: "Testimonio",
  type: "object",
  fields: [
    defineField({
      name: "cita",
      title: "Cita",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "autor",
      title: "Autor",
      type: "string",
      description: "Nombre de quien lo dice. Nunca solo el nombre sin cargo.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cargo",
      title: "Cargo",
      type: "string",
      description: 'Cargo y empresa. Ej "Gerente General, Taitico".',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "autor", subtitle: "cargo" },
  },
});
