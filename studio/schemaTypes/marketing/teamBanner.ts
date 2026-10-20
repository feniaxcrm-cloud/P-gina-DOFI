import { defineField, defineType } from "sanity";
import { camposBase, campoAlineacion, campoOverlay } from "./camposBase";
import { camposVideoTikTok } from "./camposVideoTikTok";

/** El documento de Marketing Digital: el único cuya portada lleva la imagen
 *  de la derecha en PNG (pedido del 2026-10-16). */
const MARKETING = "marketingDigitalPage";
const esMarketing = ({ document }: { document?: { _type?: string } }) => document?._type === MARKETING;
/** ChatBots/CRM: su portada lleva el celular con el video estilo TikTok
 *  (pedido del 2026-10-20). */
const esCrm = ({ document }: { document?: { _type?: string } }) => document?._type === "chatbotsCrmPage";

/** Sección "Equipo DOFI": foto de fondo con texto encima. Abre la página.
 *
 *  EN MARKETING DIGITAL el fondo NO es editable: es el morado de marca de
 *  siempre. Lo que se cambia es la imagen de la DERECHA, un PNG con
 *  transparencia que se apoya sobre ese fondo («Imagen de la derecha»). Por
 *  eso ahí se ocultan la foto de fondo y su versión móvil. En las demás
 *  páginas que usan este tipo (portadas de Tráfico/Ads y ChatBots/CRM) todo
 *  sigue igual.
 *
 *  EN CHATBOTS/CRM la derecha de la portada es un celular con un video estilo
 *  TikTok (contadores simulados): sus campos solo aparecen ahí. */
export const teamBanner = defineType({
  name: "teamBanner",
  title: "Equipo DOFI",
  type: "object",
  fieldsets: [
    {
      name: "celular",
      title: "Celular con video estilo TikTok (derecha de la portada)",
      description:
        "El video se muestra dentro de un iPhone como una publicación de TikTok. Los contadores son una simulación: arrancan en los números de acá y suben mientras el video se reproduce.",
      options: { collapsible: true, collapsed: false },
      hidden: (contexto) => !esCrm(contexto),
    },
  ],
  fields: [
    ...camposBase({
      textos: {
        imagen:
          "Fotografía de fondo (Daniel con el equipo). Usa el punto focal para que las caras queden siempre visibles. Sin foto, el banner usa el fondo morado de marca.",
        subtitulo: "Etiqueta chica con pin de ubicación. Ej: Cuenca - Ecuador.",
        titulo: "La pregunta principal. Breve: está pensada para dos líneas.",
        descripcion: "Una frase corta.",
        destacado: "Slogan en naranja. Ej: Un Mar de Ideas.",
      },
      diseno: [campoAlineacion("izquierda"), campoOverlay()],
    }).map((campo) =>
      campo.name === "imagen" || campo.name === "imagenMovil" ? { ...campo, hidden: esMarketing } : campo
    ),
    ...camposVideoTikTok({ fieldset: "celular", hidden: (contexto) => !esCrm(contexto) }),
    defineField({
      name: "imagenDerecha",
      title: "Imagen de la derecha (PNG con transparencia)",
      type: "image",
      hidden: (contexto) => !esMarketing(contexto),
      options: { accept: "image/png" },
      description:
        "La imagen del lado derecho de la portada (por ejemplo, el equipo con los delfines). Súbela en PNG con el fondo transparente: se apoya sobre el fondo morado de la portada, que no cambia. Mejor recortada justo al contenido (sin márgenes vacíos) y de al menos 1600 px de ancho. En el teléfono va arriba del texto, centrada.",
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          description: "Qué muestra la imagen, en una frase. Opcional: el título ya dice de qué trata la portada.",
        }),
      ],
    }),
  ],
  preview: {
    select: { titulo: "titulo", activo: "activo", media: "imagen", derecha: "imagenDerecha" },
    prepare: ({ titulo, activo, media, derecha }) => ({
      title: titulo || "Equipo DOFI",
      subtitle: `Equipo DOFI${activo === false ? " · Oculta" : ""}`,
      media: derecha ?? media,
    }),
  },
});
