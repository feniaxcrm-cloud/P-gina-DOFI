import { defineField } from "sanity";
import { campoImagen } from "../objects/campoImagen";

/**
 * Los campos del video estilo TikTok (un iPhone con la interfaz de TikTok y
 * contadores simulados que suben mientras el video corre). Desde el
 * 2026-10-20 ese celular vive en la portada de ChatBots/CRM (antes estaba en
 * «Clientes y casos de éxito»).
 */
export function camposVideoTikTok({
  fieldset,
  hidden,
}: {
  fieldset: string;
  hidden?: (contexto: { document?: { _type?: string } }) => boolean;
}) {
  return [
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      fieldset,
      hidden,
      options: { accept: "video/mp4,video/webm" },
      description:
        "Video VERTICAL 9:16 (como los de TikTok o Reels), MP4 (H.264) liviano, idealmente de menos de 15 MB. Arranca solo y en silencio cuando se ve, una vez; tocarlo lo pausa y al terminar aparece «Ver de nuevo».",
    }),
    defineField({
      name: "ajusteVideo",
      title: "Ajuste del video",
      type: "string",
      fieldset,
      hidden,
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
    { ...campoImagen({ name: "portadaVideo", title: "Portada del video (opcional)", fieldset, description: "Se ve mientras el video carga. Idealmente, un cuadro del mismo video." }), hidden },
    defineField({
      name: "sonidoVideo",
      title: "Mostrar botón de sonido",
      type: "boolean",
      fieldset,
      hidden,
      initialValue: false,
    }),
    defineField({
      name: "usuarioTikTok",
      title: "Usuario",
      type: "string",
      fieldset,
      hidden,
      initialValue: "@dofiagenciacreativa",
      description: "El usuario que firma la publicación. Ej: @dofiagenciacreativa.",
    }),
    defineField({
      name: "descripcionVideo",
      title: "Descripción del video",
      type: "string",
      fieldset,
      hidden,
      validation: (Rule) => Rule.max(150),
      description: "Opcional. Una frase corta debajo del usuario (se ven hasta dos líneas).",
    }),
    defineField({
      name: "meGusta",
      title: "Me gusta (al empezar)",
      type: "number",
      fieldset,
      hidden,
      initialValue: 8240,
      validation: (Rule) => Rule.min(0).integer(),
      description: "Los contadores son una simulación: arrancan en este número y suben mientras el video corre.",
    }),
    defineField({
      name: "comentarios",
      title: "Comentarios (al empezar)",
      type: "number",
      fieldset,
      hidden,
      initialValue: 312,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "compartidos",
      title: "Compartidos (al empezar)",
      type: "number",
      fieldset,
      hidden,
      initialValue: 145,
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ];
}
