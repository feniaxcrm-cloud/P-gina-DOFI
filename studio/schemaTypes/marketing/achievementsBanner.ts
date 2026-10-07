import { defineType, defineField, defineArrayMember } from "sanity";
import { camposBase } from "./camposBase";
import { campoImagen } from "../objects/campoImagen";

/**
 * Sección "Logros" (página Asesorías). Reemplaza a «Reseñas en Google» en esa
 * página (pedido del 2026-10-07).
 *
 *   ┌───────────────────┐   — LOGROS DE NUESTROS EMPRENDEDORES
 *   │   foto de la      │   Historias que nos ENORGULLECEN
 *   │   historia        │   ┌──────────────┐
 *   │ [nombre]          │   │ tarjeta      │  ← un clic: pasa a otra
 *   │ [etiqueta]        │   └──────────────┘     historia y cambia la foto
 *   └───────────────────┘   [Ver otro logro →]  01 / 04
 *
 * CADA LOGRO ES UNA TARJETA CON SU FOTO: la cantidad de tarjetas es la de la
 * lista (se agregan, se borran y se reordenan arrastrando), y cada una trae
 * su propia foto, su frase y su etiqueta. Al pasar de tarjeta, la foto de la
 * izquierda cambia a la de esa historia.
 */
export const achievementsBanner = defineType({
  name: "achievementsBanner",
  title: "Logros (tarjetas con foto)",
  type: "object",
  description:
    "Un mazo de tarjetas y, al lado, la foto de la historia que está al frente. Cada clic en la tarjeta pasa a la siguiente y cambia la foto.",
  fieldsets: [{ name: "logros", title: "Logros", options: { collapsible: true, collapsed: false } }],
  fields: camposBase({
    conImagen: false,
    omitir: ["destacado", "cta"],
    textos: {
      subtitulo: "Etiqueta chica arriba del título. Ej.: «Logros de nuestros emprendedores».",
      titulo: "Ej.: «Historias que nos enorgullecen». La última palabra se resalta con el color de marca y un subrayado.",
      descripcion: "Opcional: una frase debajo del título.",
    },
    extras: [
      defineField({
        name: "logros",
        title: "Logros",
        type: "array",
        fieldset: "logros",
        description:
          "Cada logro es una tarjeta con su foto. El orden de esta lista es el orden en la web: arrastra para reordenar. Para quitar uno, bórralo de la lista.",
        of: [
          defineArrayMember({
            type: "object",
            name: "logro",
            title: "Logro",
            fields: [
              campoImagen({
                name: "foto",
                title: "Foto",
                description:
                  "Se muestra grande a la izquierda mientras esta tarjeta está al frente. Es vertical (4:5): usa el punto focal para elegir qué parte queda a la vista.",
              }),
              defineField({
                name: "titulo",
                title: "Frase del logro",
                type: "string",
                description: "La frase grande de la tarjeta. Corta: entra en dos líneas. Ej.: «Duplicó sus clientes».",
                validation: (Rule) => Rule.required().max(60),
              }),
              defineField({
                name: "texto",
                title: "Remate",
                type: "text",
                rows: 2,
                description: "Completa la frase. Ej.: «en tres meses, con una ruta comercial clara».",
                validation: (Rule) => Rule.max(160),
              }),
              defineField({
                name: "etiqueta",
                title: "Etiqueta",
                type: "string",
                description:
                  "Rubro o servicio, va en la tarjeta y sobre la foto. Ej.: «Gastronomía». Si coincide con un giro de Clientes, lleva su ícono.",
                validation: (Rule) => Rule.max(40),
              }),
              defineField({
                name: "nombre",
                title: "Nombre (sobre la foto)",
                type: "string",
                description: "Opcional: el nombre de la persona o del negocio, arriba a la izquierda de la foto.",
                validation: (Rule) => Rule.max(40),
              }),
              defineField({
                name: "firma",
                title: "Firma (al pie de la tarjeta)",
                type: "string",
                description: "Opcional. Ej.: «María, dueña de Panadería La Esquina».",
                validation: (Rule) => Rule.max(70),
              }),
            ],
            preview: {
              select: { title: "titulo", etiqueta: "etiqueta", nombre: "nombre", media: "foto" },
              prepare: ({ title, etiqueta, nombre, media }) => ({
                title: title || "Logro sin frase",
                subtitle: [etiqueta, nombre].filter(Boolean).join(" · ") || "Sin etiqueta",
                media,
              }),
            },
          }),
        ],
      }),
      defineField({
        name: "pasoAutomatico",
        title: "Pasar solo a la siguiente tarjeta",
        type: "boolean",
        fieldset: "logros",
        initialValue: true,
        description:
          "El mazo avanza solo mientras la sección está en pantalla. Se pausa con el cursor encima y se detiene en cuanto el visitante pasa una tarjeta.",
      }),
      defineField({
        name: "segundosPorLogro",
        title: "Segundos por tarjeta",
        type: "number",
        fieldset: "logros",
        initialValue: 6,
        description: "Cuánto queda cada tarjeta al frente antes de pasar a la siguiente.",
        validation: (Rule) => Rule.integer().min(4).max(30),
        hidden: ({ parent }) => parent?.pasoAutomatico === false,
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", logros: "logros" },
    prepare: ({ titulo, activo, logros }) => {
      const n = Array.isArray(logros) ? logros.length : 0;
      return {
        title: titulo || "Logros",
        subtitle: `${n === 1 ? "1 logro" : `${n} logros`}${activo === false ? " · Oculta" : ""}`,
      };
    },
  },
});
