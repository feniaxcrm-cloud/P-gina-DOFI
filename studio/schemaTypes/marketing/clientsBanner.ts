import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";
import { miembroGiro } from "./giroNegocio";

/**
 * Sección "Clientes y casos de éxito".
 *
 *   Giros de negocio  -> cada giro con sus empresas (y el logo de cada una)
 *   Columna derecha   -> los LOGOS del giro abierto, en círculos (pedido del
 *                        2026-10-20: el celular con el video se mudó a la
 *                        portada de ChatBots/CRM). Forma y tamaño se eligen en
 *                        «Presentación de los logos».
 *
 * SIN MARQUESINA DEBAJO (pedido del 2026-10-07: la sección entra entera en
 * una pantalla): los logos se ven en la fila del giro abierto, que se
 * desliza sola cuando no entran.
 *
 * EMPRESAS DE UN GIRO, sin duplicar datos: lo normal es elegir una Cuenta
 * existente (su nombre y su logo son los de la Cuenta; cambiar el logo en la
 * Cuenta lo cambia en todo el sitio). Para una empresa que no es Cuenta, se
 * agrega con su propio logo.
 *
 * NOMBRE HISTÓRICO: el campo de los giros se llama `categorias` en los datos
 * (así se llamaba cuando solo eran íconos). Se conservó para no migrar el
 * contenido ya cargado; en el Studio se ve como "Giros de negocio".
 */

export const clientsBanner = defineType({
  name: "clientsBanner",
  title: "Clientes y casos de éxito",
  type: "object",
  description:
    "Carrusel de giros de negocio con sus empresas y, al lado, los logos del giro abierto en círculos.",
  fieldsets: [
    {
      name: "giros",
      title: "Carrusel de giros de negocio",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "logos",
      title: "Logos (columna derecha)",
      description:
        "La columna derecha muestra los logos del giro abierto. Acá se elige su forma y su tamaño; los logos se cargan en cada giro («Empresas y logos»).",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: camposBase({
    conImagen: false,
    // Sin "cta": la sección ya no tiene botón (se quitó "Ver casos de éxito").
    omitir: ["destacado", "cta"],
    textos: {
      titulo: "Se muestra en una sola línea en escritorio.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      descripcion: "Opcional: una frase debajo del título.",
    },
    extras: [
      defineField({
        name: "categorias",
        title: "Giros de negocio",
        type: "array",
        fieldset: "giros",
        description:
          "Cada giro es un panel del carrusel. El orden de esta lista es el orden del carrusel: arrastra para reordenar. Dentro de cada giro agregas sus empresas; sus logos aparecen al abrir el giro. Sin giros, la sección muestra la estructura vacía: nunca se inventan.",
        of: [
          miembroGiro({
            descripcionImagen:
              "Llena el panel: a color cuando el giro está abierto y en gris cuando no. Sin foto, el panel usa los colores DOFI.",
          }),
        ],
      }),
      defineField({
        name: "rotacionAutomatica",
        title: "Rotación automática",
        type: "boolean",
        fieldset: "giros",
        initialValue: true,
        description:
          "El carrusel avanza solo mientras nadie lo toca. Se detiene cuando el visitante elige un giro y después de dos vueltas.",
      }),
      defineField({
        name: "ajusteLogos",
        title: "Presentación de los logos",
        type: "ajusteLogos",
        fieldset: "logos",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo" },
    prepare: ({ titulo, activo }) => ({
      title: titulo || "Clientes y casos de éxito",
      subtitle: `Clientes${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
