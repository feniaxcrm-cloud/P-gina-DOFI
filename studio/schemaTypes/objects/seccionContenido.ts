import { defineType, defineField } from "sanity";

/**
 * Un banner de la home: los 4 bloques full-width que van debajo de las
 * tarjetas del Hero (ver paginaInicio.ts, campo "seccionesContenido").
 *
 * Sprint "Banners full-width": la seccion es UNA SOLA IMAGEN a todo el ancho
 * del viewport. La pieza grafica ES el diseño -- el mensaje y los titulos
 * viven dentro de la imagen, no en HTML.
 *
 * Sprint "CTA sobre los banners": vuelve el boton, pero como capa HTML
 * ENCIMA de la imagen, no dentro de ella. Por eso el texto, el enlace y la
 * posicion se editan aca y se pueden cambiar sin volver a exportar la pieza
 * grafica. Cada banner lleva su propio CTA, independiente de los otros tres.
 *
 * El nombre del TIPO no cambia ("seccionContenido"): renombrarlo dejaria
 * huerfanos los 4 items ya publicados, que se identifican por su _type.
 *
 * options.hotspot: true activa hotspot Y recorte (crop) -- son la misma
 * herramienta en el editor de Sanity. Es clave aca: la imagen se usa como
 * banner recortado a lo ancho, asi que el punto focal decide que parte
 * queda visible en cada tamaño de pantalla.
 */
export const seccionContenido = defineType({
  name: "seccionContenido",
  title: "Banner",
  type: "object",
  fieldsets: [
    {
      name: "cta",
      title: "Botón (CTA)",
      description:
        "El botón va por encima de la imagen, no dentro: podés cambiar texto, enlace y posición sin volver a editar la pieza gráfica. Si dejás el texto o el enlace vacíos, ese banner se muestra sin botón.",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "backgroundImage",
      title: "Imagen de fondo del banner",
      type: "image",
      options: { hotspot: true },
      description:
        "La pieza gráfica completa: ocupa todo el ancho de la pantalla. Usá el recorte y el punto focal (hotspot) para elegir qué parte se mantiene visible cuando el banner se achica en mobile.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundImageAlt",
      title: "Texto alternativo",
      type: "string",
      description:
        "Qué dice y qué muestra la pieza. Como el mensaje vive dentro de la imagen, este texto es lo único que leen los lectores de pantalla y los buscadores.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTexto",
      title: "Texto del botón",
      type: "string",
      fieldset: "cta",
      description: 'Ej: "Quiero Mejorar mis Ventas". Cuanto más corto, mejor se apoya sobre la imagen.',
    }),
    defineField({
      name: "ctaEnlace",
      title: "Enlace del botón",
      type: "string",
      fieldset: "cta",
      description:
        'Para una página de este sitio, escribí la ruta empezando con "/" (ej: /asesorias) y se abre en la misma pestaña. Si ponés una dirección completa (https://...), se abre en una pestaña nueva.',
      validation: (Rule) =>
        Rule.custom((valor) => {
          if (!valor) return true;
          if (/^(https?:\/\/|mailto:|tel:|\/)/.test(valor)) return true;
          return 'Tiene que empezar con "/" (una página de este sitio) o con https:// (un enlace externo).';
        }),
    }),
    defineField({
      name: "ctaPosicionDesktop",
      title: "Posición en desktop",
      type: "posicionCta",
      fieldset: "cta",
      description:
        "Dónde se apoya el botón en pantallas de 768px o más. Elegí una zona libre de la imagen: que no tape titulares, rostros ni logos.",
    }),
    defineField({
      name: "ctaPosicionMobile",
      title: "Posición en mobile",
      type: "posicionCta",
      fieldset: "cta",
      description:
        "Dónde se apoya el botón en pantallas de menos de 768px. Se configura aparte porque en mobile el banner es mucho más angosto y recorta la imagen: la zona que estaba libre en desktop puede no estarlo acá.",
    }),
  ],
  preview: {
    select: { media: "backgroundImage", alt: "backgroundImageAlt", cta: "ctaTexto" },
    prepare: ({ media, alt, cta }) => ({
      title: alt || "Banner sin texto alternativo",
      subtitle: cta ? `Botón: ${cta}` : "Sin botón",
      media,
    }),
  },
});
