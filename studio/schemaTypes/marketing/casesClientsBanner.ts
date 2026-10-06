import { defineType, defineField, defineArrayMember } from "sanity";
import { camposBase } from "./camposBase";
import { miembroGiro } from "./giroNegocio";
import { campoImagen } from "../objects/campoImagen";
import { SelectorGiro } from "../../components/SelectorGiro";

/**
 * Sección "Clientes + casos de éxito" (página Asesorías).
 *
 *   Título y descripción
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros + logos │ Mazo de casos      │
 *   │ (el panel abierto muestra │ [Ver otro caso →]  │
 *   │  la imagen del caso)      │ 01 / 03            │
 *   └──────────────────────────┴────────────────────┘
 *   Marquesina continua de clientes
 *
 * Es la sección de Clientes de Marketing Digital con una diferencia: en vez
 * del video, la columna derecha es un MAZO DE TARJETAS de casos de éxito (la
 * del frente sale volando al pasar a la siguiente, como en el video de
 * referencia). TEXTO E IMAGEN VAN JUNTOS: cada caso trae su propia imagen, y
 * al pasar de caso el carrusel de la izquierda abre el giro del caso y
 * muestra esa imagen en su panel.
 *
 * ORDEN: el de la lista, igual que en todo el Studio. Arrastrar un caso es
 * cambiar su posición en la web; no hay un número aparte que pueda
 * contradecir a la lista.
 *
 * GIROS: mismo formulario que en Marketing Digital (giroNegocio.ts). Sin
 * giros cargados acá, la web usa los de Marketing Digital (las mismas
 * empresas y logos, sin cargarlos dos veces).
 */
export const casesClientsBanner = defineType({
  name: "casesClientsBanner",
  title: "Clientes + casos de éxito",
  type: "object",
  description:
    "Carrusel de giros con sus empresas y, al lado, el mazo de casos de éxito. Cada caso tiene texto e imagen: al pasar de caso, el carrusel abre su giro y muestra esa imagen.",
  fieldsets: [
    { name: "casos", title: "Casos de éxito", options: { collapsible: true, collapsed: false } },
    { name: "giros", title: "Giros de negocio (opcional)", options: { collapsible: true, collapsed: true } },
  ],
  fields: camposBase({
    conImagen: false,
    omitir: ["destacado", "cta"],
    textos: {
      titulo: "Se muestra en una sola línea en escritorio.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      descripcion: "Opcional: una frase debajo del título.",
    },
    extras: [
      defineField({
        name: "casos",
        title: "Casos de éxito",
        type: "array",
        fieldset: "casos",
        description:
          "Cada caso es una tarjeta del mazo, con su imagen. El orden de esta lista es el orden en la web: arrastra para reordenar. Para quitar uno, bórralo de la lista.",
        of: [
          defineArrayMember({
            type: "object",
            name: "casoExito",
            title: "Caso de éxito",
            fields: [
              defineField({
                name: "titulo",
                title: "Título del caso",
                type: "string",
                description: "La frase grande de la tarjeta. Corta: entra en dos o tres líneas. Ej.: «Sus ventas volvieron a moverse».",
                validation: (Rule) => Rule.required().max(90),
              }),
              defineField({
                name: "texto",
                title: "Texto",
                type: "text",
                rows: 3,
                description: "Qué encontramos y qué cambió, en una o dos frases.",
                validation: (Rule) => Rule.max(240),
              }),
              defineField({
                name: "giro",
                title: "Giro",
                type: "string",
                description: "Al llegar a este caso, el carrusel de la izquierda abre este giro.",
                components: { input: SelectorGiro },
              }),
              campoImagen({
                name: "imagen",
                title: "Imagen del caso",
                description:
                  "Se muestra en el panel abierto del carrusel mientras este caso está al frente. El panel es vertical: usa el punto focal para elegir qué parte queda a la vista.",
              }),
              defineField({
                name: "cliente",
                title: "Cliente o firma (opcional)",
                type: "string",
                description: "Va al pie de la tarjeta. Ej.: el nombre del negocio o de la persona.",
              }),
            ],
            preview: {
              select: { title: "titulo", giro: "giro", cliente: "cliente", media: "imagen" },
              prepare: ({ title, giro, cliente, media }) => ({
                title: title || "Caso sin título",
                subtitle: [giro || "Sin giro", cliente].filter(Boolean).join(" · "),
                media,
              }),
            },
          }),
        ],
      }),
      defineField({
        name: "pasoAutomatico",
        title: "Pasar solo al siguiente caso",
        type: "boolean",
        fieldset: "casos",
        initialValue: true,
        description:
          "El mazo avanza solo mientras la sección está en pantalla. Se pausa con el cursor encima y se detiene en cuanto el visitante pasa un caso o elige un giro.",
      }),
      defineField({
        name: "segundosPorCaso",
        title: "Segundos por caso",
        type: "number",
        fieldset: "casos",
        initialValue: 7,
        description: "Cuánto queda cada caso al frente antes de pasar al siguiente.",
        validation: (Rule) => Rule.integer().min(4).max(30),
        hidden: ({ parent }) => parent?.pasoAutomatico === false,
      }),
      defineField({
        name: "categorias",
        title: "Giros de negocio",
        type: "array",
        fieldset: "giros",
        description:
          "Vacío (recomendado): se usan los giros de Marketing Digital, con sus empresas y logos. Cárgalos acá solo si esta página necesita otros giros.",
        of: [
          miembroGiro({
            descripcionImagen:
              "Llena el panel cuando el giro está abierto y no hay un caso al frente con imagen propia. Sin foto, el panel usa los colores DOFI.",
          }),
        ],
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", casos: "casos" },
    prepare: ({ titulo, activo, casos }) => {
      const n = Array.isArray(casos) ? casos.length : 0;
      return {
        title: titulo || "Clientes + casos de éxito",
        subtitle: `${n === 1 ? "1 caso" : `${n} casos`}${activo === false ? " · Oculta" : ""}`,
      };
    },
  },
});
