import { defineField, defineType } from "sanity";

/**
 * Cómo se presentan los logos de las empresas en «Clientes y casos de éxito»
 * (pedido del 2026-10-20): la columna derecha muestra los logos del giro
 * abierto, en círculos (o fichas redondeadas) del tamaño que se elija acá.
 *
 * Es SOLO PRESENTACIÓN: el archivo del logo no se toca. El logo se ve entero
 * (nunca se recorta ni se deforma) y, si tiene el fondo transparente, se
 * mantiene. Desde el 2026-10-22 la forma por defecto es la ORIGINAL de cada
 * logo (un logo cuadrado se ve cuadrado, uno redondo se ve redondo); el
 * círculo y la ficha quedan como opciones.
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
          { title: "Forma original de cada logo (recomendado)", value: "original" },
          { title: "Dentro de un círculo", value: "circular" },
          { title: "Dentro de una ficha redondeada", value: "redondeado" },
        ],
        layout: "radio",
      },
      initialValue: "original",
      description:
        "«Forma original»: cada logo se ve como es (cuadrado, redondo o apaisado), sin marco. Círculo y ficha ponen el logo, entero, dentro de ese marco.",
    }),
    defineField({
      name: "tamano",
      title: "Tamaño en computadora (px)",
      type: "number",
      initialValue: 120,
      validation: (Rule) => Rule.min(72).max(180).integer(),
      description: "Alto de cada logo (o diámetro del marco) en pantallas grandes. Entre 72 y 180. Recomendado: 120.",
    }),
    defineField({
      name: "tamanoMovil",
      title: "Tamaño en celular (px)",
      type: "number",
      initialValue: 92,
      validation: (Rule) => Rule.min(56).max(140).integer(),
      description: "Alto de cada logo (o diámetro del marco) en el celular. Entre 56 y 140. Recomendado: 92.",
    }),
  ],
});
