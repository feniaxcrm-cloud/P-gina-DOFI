import { defineType, defineField } from "sanity";

type Padre = { tipoMedia?: string; tipoVideo?: string };

/**
 * Contenido / trabajo realizado para una cuenta. Siempre referencia una
 * Cuenta (nunca se re-escribe su nombre a mano) — ver src/lib/sanity.ts en
 * la web, que arma videos[]/gallery[] de la pagina /clientes/<slug> a partir
 * de estos documentos.
 */
export const contenido = defineType({
  name: "contenido",
  title: "Contenido",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Titulo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cuenta",
      title: "Cuenta",
      type: "reference",
      to: [{ type: "cuenta" }],
      description: "A que cuenta pertenece este trabajo.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tipoMedia",
      title: "Tipo de contenido",
      type: "string",
      options: {
        list: [
          { title: "Imagen", value: "imagen" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "imagen",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }: { parent?: Padre }) => parent?.tipoMedia !== "imagen",
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const p = parent as Padre | undefined;
          if (p?.tipoMedia === "imagen" && !value) return "Falta la imagen";
          return true;
        }),
    }),
    defineField({
      name: "tipoVideo",
      title: "Fuente del video",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Archivo subido", value: "archivo" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }: { parent?: Padre }) => parent?.tipoMedia !== "video",
    }),
    defineField({
      name: "youtubeId",
      title: "ID de YouTube",
      type: "string",
      description: 'El codigo que va despues de "v=" en la URL del video.',
      hidden: ({ parent }: { parent?: Padre }) =>
        !(parent?.tipoMedia === "video" && parent?.tipoVideo === "youtube"),
    }),
    defineField({
      name: "archivoVideo",
      title: "Archivo de video",
      type: "file",
      options: { accept: "video/mp4" },
      hidden: ({ parent }: { parent?: Padre }) =>
        !(parent?.tipoMedia === "video" && parent?.tipoVideo === "archivo"),
    }),
    defineField({
      name: "poster",
      title: "Portada del video",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }: { parent?: Padre }) => parent?.tipoMedia !== "video",
    }),
    defineField({
      name: "formatoVideo",
      title: "Formato",
      type: "string",
      description: 'Etiqueta corta. Ej "Spot 30s", "Vertical 9:16".',
      hidden: ({ parent }: { parent?: Padre }) => parent?.tipoMedia !== "video",
    }),
    defineField({
      name: "relacionAspecto",
      title: "Relacion de aspecto",
      type: "string",
      options: {
        list: [
          { title: "16:9 (horizontal)", value: "16/9" },
          { title: "9:16 (vertical)", value: "9/16" },
          { title: "1:1 (cuadrado)", value: "1/1" },
        ],
      },
      initialValue: "16/9",
      hidden: ({ parent }: { parent?: Padre }) => parent?.tipoMedia !== "video",
    }),
    defineField({
      name: "descripcion",
      title: "Descripcion",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "categoria",
      title: "Categoria / tipo",
      type: "string",
      description: 'Libre. Ej "Campaña", "Reel", "Fotografia".',
    }),
    defineField({
      name: "fecha",
      title: "Fecha",
      type: "date",
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
    }),
    defineField({
      name: "publicado",
      title: "Publicado",
      type: "boolean",
      initialValue: true,
      description: "Si esta apagado, no aparece en la pagina de la cuenta aunque exista aqui.",
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      cuenta: "cuenta.nombre",
      media: "imagen",
      publicado: "publicado",
    },
    prepare: ({ title, cuenta, media, publicado }) => ({
      title,
      subtitle:
        publicado === false ? `${cuenta ?? "Sin cuenta"} · Sin publicar` : cuenta ?? "Sin cuenta",
      media,
    }),
  },
});
