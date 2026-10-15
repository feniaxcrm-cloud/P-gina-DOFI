import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";
import { campoImagen } from "../objects/campoImagen";
import { miembroGiro } from "./giroNegocio";

/**
 * Sección "Clientes y casos de éxito".
 *
 *   Giros de negocio  -> cada giro con sus empresas (y el logo de cada una)
 *   Video             -> columna derecha, como una publicación de TikTok en un
 *                        iPhone (pedido del 2026-10-16): el video 9:16, el
 *                        usuario, la descripción y los contadores (simulados:
 *                        arrancan en el valor de acá y suben mientras se ve).
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
    "Carrusel de giros de negocio con sus empresas y, al lado, un video. Los logos de cada giro se ven al abrirlo.",
  fieldsets: [
    {
      name: "giros",
      title: "Carrusel de giros de negocio",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "video",
      title: "Video estilo TikTok (columna derecha)",
      description:
        "El video se muestra dentro de un iPhone, como una publicación de TikTok: el video, el usuario, la descripción y los contadores de Me gusta, Comentarios y Compartir. Los contadores son una simulación: arrancan en los números de acá y suben mientras el video se reproduce (no son métricas reales de TikTok).",
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
        name: "video",
        title: "Video",
        type: "file",
        fieldset: "video",
        options: { accept: "video/mp4,video/webm" },
        description:
          "Video VERTICAL 9:16 (como los de TikTok o Reels), MP4 (H.264) liviano, idealmente de menos de 15 MB. Arranca solo y en silencio cuando se ve, una vez; tocarlo lo pausa y al terminar aparece «Ver de nuevo». Para cambiarlo, sube otro archivo aquí.",
      }),
      defineField({
        name: "ajusteVideo",
        title: "Ajuste del video en su columna",
        type: "string",
        fieldset: "video",
        description: "Cómo entra el video en la pantalla del teléfono (9:16). En ningún caso se deforma.",
        options: {
          list: [
            { title: "Rellenar la pantalla (puede recortar los bordes)", value: "rellenar" },
            { title: "Mostrar el video completo (sin recortes)", value: "completo" },
          ],
          layout: "radio",
        },
        initialValue: "rellenar",
      }),
      campoImagen({
        name: "imagen",
        title: "Portada del video (opcional)",
        fieldset: "video",
        description:
          "Se ve mientras el video carga y a quienes prefieren menos movimiento. Idealmente, un cuadro del mismo video.",
      }),
      defineField({
        name: "sonidoVideo",
        title: "Mostrar botón de sonido",
        type: "boolean",
        fieldset: "video",
        initialValue: false,
        description: "Actívalo solo si el audio importa (por ejemplo, un testimonio).",
      }),
      defineField({
        name: "usuarioTikTok",
        title: "Usuario",
        type: "string",
        fieldset: "video",
        initialValue: "@dofiagenciacreativa",
        description: "El usuario que firma la publicación. Ej: @dofiagenciacreativa.",
      }),
      defineField({
        name: "descripcionVideo",
        title: "Descripción del video",
        type: "string",
        fieldset: "video",
        validation: (Rule) => Rule.max(150),
        description: "Opcional. Una frase corta debajo del usuario (se ven hasta dos líneas).",
      }),
      defineField({
        name: "meGusta",
        title: "Me gusta (al empezar)",
        type: "number",
        fieldset: "video",
        initialValue: 8240,
        validation: (Rule) => Rule.min(0).integer(),
        description: "El número con el que arranca el contador. Mientras el video corre, sube solo.",
      }),
      defineField({
        name: "comentarios",
        title: "Comentarios (al empezar)",
        type: "number",
        fieldset: "video",
        initialValue: 312,
        validation: (Rule) => Rule.min(0).integer(),
      }),
      defineField({
        name: "compartidos",
        title: "Compartidos (al empezar)",
        type: "number",
        fieldset: "video",
        initialValue: 145,
        validation: (Rule) => Rule.min(0).integer(),
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen" },
    prepare: ({ titulo, activo, media }) => ({
      title: titulo || "Clientes y casos de éxito",
      subtitle: `Clientes${activo === false ? " · Oculta" : ""}`,
      media,
    }),
  },
});
