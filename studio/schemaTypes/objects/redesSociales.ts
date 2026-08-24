import { defineType, defineField } from "sanity";

const urlValidation = (Rule: any) =>
  Rule.uri({ scheme: ["http", "https"], allowRelative: false });

export const redesSociales = defineType({
  name: "redesSociales",
  title: "Redes y enlaces",
  type: "object",
  fields: [
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
      validation: urlValidation,
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
      validation: urlValidation,
    }),
    defineField({
      name: "tiktok",
      title: "TikTok",
      type: "url",
      validation: urlValidation,
    }),
    defineField({
      name: "sitioWeb",
      title: "Sitio web",
      type: "url",
      validation: urlValidation,
    }),
    defineField({
      name: "otros",
      title: "Otros enlaces",
      type: "array",
      of: [
        {
          type: "object",
          name: "enlace",
          fields: [
            defineField({
              name: "etiqueta",
              title: "Etiqueta",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({ scheme: ["http", "https"], allowRelative: false }),
            }),
          ],
          preview: {
            select: { title: "etiqueta", subtitle: "url" },
          },
        },
      ],
    }),
  ],
});
