import { defineType, defineField, defineArrayMember } from "sanity";
import { camposBase } from "./camposBase";

/**
 * Sección "¿Dónde traficamos?" (página Tráfico / Ads).
 *
 * Una tarjeta por plataforma: su marca, la frase que la resume y lo que se
 * hace en ella. Se agregan, quitan y reordenan acá; cada una elige su ícono
 * de una lista. El orden de la lista es el orden de las tarjetas.
 */

const ICONOS = [
  { title: "Meta (Facebook + Instagram)", value: "meta" },
  { title: "TikTok", value: "tiktok" },
  { title: "Google Ads", value: "google" },
  { title: "YouTube", value: "youtube" },
  { title: "Instagram", value: "instagram" },
  { title: "Facebook", value: "facebook" },
  { title: "WhatsApp", value: "whatsapp" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "Tráfico web (globo)", value: "web" },
];

export const platformsBanner = defineType({
  name: "platformsBanner",
  title: "Plataformas (¿Dónde traficamos?)",
  type: "object",
  description: "Tarjetas de las plataformas donde se trafica: Meta, TikTok, Google, tráfico web...",
  fields: camposBase({
    conImagen: false,
    omitir: ["destacado", "cta"],
    textos: {
      subtitulo: "Etiqueta chica arriba del título. Ej.: «¿Dónde traficamos?».",
      titulo: "Ej.: «El tráfico no tiene un solo destino.»",
      descripcion: "Una frase debajo del título.",
    },
    extras: [
      defineField({
        name: "plataformas",
        title: "Plataformas",
        type: "array",
        description: "Arrastra para reordenar. En pantallas grandes se ven 4 por fila.",
        of: [
          defineArrayMember({
            type: "object",
            name: "plataforma",
            title: "Plataforma",
            fields: [
              defineField({ name: "nombre", title: "Nombre", type: "string", validation: (Rule) => Rule.required() }),
              defineField({
                name: "etiqueta",
                title: "Frase que la resume",
                type: "string",
                description: "Bajo el nombre. Ej.: «Facebook + Instagram».",
              }),
              defineField({ name: "descripcion", title: "Qué hacemos en ella", type: "text", rows: 4 }),
              defineField({
                name: "icono",
                title: "Ícono",
                type: "string",
                options: { list: ICONOS },
                initialValue: "web",
              }),
            ],
            preview: {
              select: { nombre: "nombre", etiqueta: "etiqueta" },
              prepare: ({ nombre, etiqueta }) => ({ title: nombre || "Plataforma sin nombre", subtitle: etiqueta }),
            },
          }),
        ],
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", plataformas: "plataformas" },
    prepare: ({ titulo, activo, plataformas }) => ({
      title: titulo || "¿Dónde traficamos?",
      subtitle: `Plataformas · ${Array.isArray(plataformas) ? plataformas.length : 0}${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
