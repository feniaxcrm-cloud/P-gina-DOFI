import { defineType, defineField } from "sanity";

/**
 * Dónde se apoya el botón sobre el banner. Se usa DOS veces por banner
 * (ver seccionContenido.ts): una para desktop y otra para mobile.
 *
 * POR QUE DOS EJES Y NO UN SOLO SELECT DE 9 OPCIONES
 * -----------------------------------------------------------------
 * Las 4 piezas graficas estan llenas de borde a borde (titulares, rostros,
 * logos, iconos). Se midio la ocupacion visual de cada una -- energia de
 * bordes por region -- y los unicos huecos reales no caen en una grilla de
 * 3x3: el banner 01 necesita algo entre "izquierda" y "centro", y el 04
 * entre "centro" y "derecha". Con 5 pasos horizontales x 3 verticales hay
 * hueco disponible en las 4 piezas sin taparle nada a ninguna, y siguen
 * siendo dos desplegables cortos en vez de una lista de 15.
 *
 * El frontend traduce cada valor a (left/top + translate) -- ver la tabla
 * ANCLAS_X/ANCLAS_Y en src/components/ContentBanner.tsx. El boton NUNCA
 * queda pegado al borde: los extremos dejan un margen del 6%.
 */
export const posicionCta = defineType({
  name: "posicionCta",
  title: "Posición del botón",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({
      name: "horizontal",
      title: "Horizontal",
      type: "string",
      options: {
        list: [
          { title: "Izquierda", value: "izquierda" },
          { title: "Centro-izquierda", value: "centro-izquierda" },
          { title: "Centro", value: "centro" },
          { title: "Centro-derecha", value: "centro-derecha" },
          { title: "Derecha", value: "derecha" },
        ],
      },
      initialValue: "centro",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "vertical",
      title: "Vertical",
      type: "string",
      options: {
        list: [
          { title: "Arriba", value: "arriba" },
          { title: "Centro", value: "centro" },
          { title: "Abajo", value: "abajo" },
        ],
      },
      initialValue: "abajo",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
