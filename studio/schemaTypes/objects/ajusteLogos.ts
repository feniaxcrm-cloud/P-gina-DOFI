import { defineField, defineType } from "sanity";

/**
 * Cómo se presentan los logos de las empresas en «Clientes y casos de éxito»
 * (pedido del 2026-10-20): la columna derecha muestra los logos del giro
 * abierto, en círculos (o fichas redondeadas) del tamaño que se elija acá.
 *
 * Es SOLO PRESENTACIÓN: el archivo del logo no se toca. El logo se ve entero
 * (nunca se recorta ni se deforma) y, si tiene el fondo transparente, se
 * mantiene. Desde el 2026-10-23 la forma por defecto es «Logos redondos»:
 * cada logo en su VERSIÓN CIRCULAR (el logo mismo redondo, no metido en un
 * círculo). «Forma original» queda como opción.
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
          { title: "Logos redondos (recomendado)", value: "circular" },
          { title: "Forma original de cada logo", value: "original" },
        ],
        layout: "radio",
      },
      initialValue: "circular",
      description:
        "«Logos redondos»: cada logo en su versión circular (el campo «Logo circular» de la empresa o de la Cuenta; si falta, la web recorta el logo en círculo). «Forma original»: cada logo como es, cuadrado o alargado.",
    }),
    defineField({
      name: "tamano",
      title: "Tamaño en computadora (px)",
      type: "number",
      initialValue: 120,
      validation: (Rule) => Rule.min(72).max(180).integer(),
      description: "Diámetro de cada logo en pantallas grandes (o su alto, en «Forma original»). Entre 72 y 180. Recomendado: 120.",
    }),
    defineField({
      name: "tamanoMovil",
      title: "Tamaño en celular (px)",
      type: "number",
      initialValue: 92,
      validation: (Rule) => Rule.min(56).max(140).integer(),
      description: "Diámetro de cada logo en el celular (o su alto, en «Forma original»). Entre 56 y 140. Recomendado: 92.",
    }),
  ],
});
