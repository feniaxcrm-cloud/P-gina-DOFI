import { defineType, defineField } from "sanity";

/**
 * Dónde se apoya el botón sobre el banner. Se usa DOS veces por banner
 * (ver seccionContenido.ts): una para desktop y otra para mobile.
 *
 * POR QUE DOS EJES Y NO UN SOLO SELECT DE 9 OPCIONES
 * -----------------------------------------------------------------
 * Las 4 piezas graficas estan llenas de borde a borde (titulares, rostros,
 * logos, iconos). Se midio la ocupacion visual de cada una -- energia de
 * bordes por region -- y los huecos reales no caen en una grilla de 3x3: el
 * banner 01 necesita algo entre "izquierda" y "centro", y el 04 entre
 * "centro" y "derecha". El eje vertical tambien se abrio a 5 pasos al pedir
 * que cada boton quede DEBAJO del titulo de su pieza: en el banner 04 el
 * titulo termina cerca del 20% de la altura, y ni "arriba" (6%) ni "centro"
 * (50%) caen ahi.
 *
 * Con 5 pasos por eje hay ubicacion util en las 4 piezas y siguen siendo dos
 * desplegables cortos en vez de una lista de 25 combinaciones.
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
          { title: "Centro-arriba", value: "centro-arriba" },
          { title: "Centro", value: "centro" },
          { title: "Centro-abajo", value: "centro-abajo" },
          { title: "Abajo", value: "abajo" },
        ],
      },
      initialValue: "abajo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "desplazamientoX",
      title: "Ajuste fino horizontal (%)",
      type: "number",
      initialValue: 0,
      description:
        "Corrimiento sobre la posición elegida, en % del ancho del banner. Negativo = hacia la izquierda. Dejalo en 0 salvo que necesites afinar; sirve para los ajustes chicos que los pasos del desplegable no alcanzan.",
      validation: (Rule) => Rule.min(-30).max(30),
    }),
    defineField({
      name: "desplazamientoY",
      title: "Ajuste fino vertical (%)",
      type: "number",
      initialValue: 0,
      description:
        "Corrimiento sobre la posición elegida, en % del alto del banner. Negativo = hacia arriba.",
      validation: (Rule) => Rule.min(-30).max(30),
    }),
  ],
});
