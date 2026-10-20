import { defineField, defineType } from "sanity";

/**
 * Cómo se presentan los logos de las empresas en «Clientes y casos de éxito»
 * (pedido del 2026-10-20): la columna derecha muestra los logos del giro
 * abierto, en círculos (o fichas redondeadas) del tamaño que se elija acá.
 *
 * Es SOLO PRESENTACIÓN: el archivo del logo no se toca. El logo se ve entero
 * dentro de la forma (nunca se recorta ni se deforma) y, si tiene el fondo
 * transparente, se mantiene.
 */
export const ajusteLogos = defineType({
  name: "ajusteLogos",
  title: "Presentación de los logos",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "forma",
      title: "Forma",
      type: "string",
      options: {
        list: [
          { title: "Círculo", value: "circular" },
          { title: "Ficha redondeada", value: "redondeado" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "circular",
      description: "El logo siempre se ve entero adentro: la forma es el marco, no un recorte del archivo.",
    }),
    defineField({
      name: "tamano",
      title: "Tamaño en computadora (px)",
      type: "number",
      initialValue: 112,
      validation: (Rule) => Rule.min(72).max(180).integer(),
      description: "Diámetro de cada logo en pantallas grandes. Entre 72 y 180. Recomendado: 112.",
    }),
    defineField({
      name: "tamanoMovil",
      title: "Tamaño en celular (px)",
      type: "number",
      initialValue: 84,
      validation: (Rule) => Rule.min(56).max(140).integer(),
      description: "Diámetro de cada logo en el celular. Entre 56 y 140. Recomendado: 84.",
    }),
  ],
});
