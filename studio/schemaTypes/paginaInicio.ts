import { defineType, defineField } from "sanity";

/**
 * Página de inicio — documento único (singleton, ver deskStructure.ts).
 *
 * Hoy solo trae Hero y Capacidades (Replanteo Navbar + Hero + Sanity). El
 * resto de la home (Lo que hacemos / El Socio / Cierre) ya está cableado en
 * src/lib/sanity.ts esperando este mismo documento bajo "secciones[]", pero
 * ese campo NO se agrega acá todavía — está fuera del alcance de este
 * sprint y agregarlo a ciegas sin definir su editor en el Studio dejaría un
 * campo a medio terminar. Ver el reporte de auditoría para el detalle.
 *
 * LA IMAGEN DEL HERO YA NO VIVE ACÁ (Sprint "Implementación final del Hero +
 * Sanity + Cards", §5-9): se movió a su propio documento singleton `hero`
 * (ver hero.ts), con su propio lugar en el menú del Studio, para que
 * cambiar la fotografía sea una acción de un solo paso y no un campo más
 * entre título/marca/mensaje/CTA. Este objeto `hero` solo conserva el
 * texto y los botones — src/lib/sanity.ts combina ambos documentos en un
 * solo HeroContent para el frontend.
 *
 * BANNERS (Sprint "Banners full-width"): los 4 bloques que van debajo de las
 * tarjetas del Hero. Cada uno es UNA SOLA IMAGEN a todo el ancho del
 * viewport -- ver seccionContenido.ts. El campo sigue llamandose
 * "seccionesContenido" a proposito: renombrarlo dejaria huerfanos los 4
 * items ya publicados. El orden del arreglo (arrastrar para reordenar) ES
 * el 01/02/03/04 de la pagina.
 */
export const paginaInicio = defineType({
  name: "paginaInicio",
  title: "Página de inicio",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "capacidades", title: "Capacidades" },
    { name: "seccionesContenido", title: "Banners" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      description: "Solo para identificar el documento en esta lista. No se muestra en la web.",
      initialValue: "Página de inicio",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "titulo",
          title: "Título (H1)",
          type: "string",
          description: 'Ej. "Un Mar de Ideas".',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "marca",
          title: "Marca",
          type: "string",
          description: 'Ej. "DOFI Agencia Creativa".',
        }),
        defineField({
          name: "mensaje",
          title: "Propuesta comercial",
          type: "string",
          description: 'Ej. "Convertimos atención en Ventas Inteligentes".',
        }),
        defineField({
          name: "ctaPrincipalTexto",
          title: "Texto del botón principal",
          type: "string",
          description: 'Ej. "Quiero Mejorar mis Ventas".',
        }),
        defineField({
          name: "ctaPrincipalEnlace",
          title: "Enlace del botón principal",
          type: "string",
          description: 'Ruta interna (ej. "/contactanos") o URL completa.',
        }),
        defineField({
          name: "ctaSecundarioTexto",
          title: "Texto del botón secundario",
          type: "string",
          description: 'Ej. "Mira Nuestro Trabajo".',
        }),
        defineField({
          name: "ctaSecundarioEnlace",
          title: "Enlace del botón secundario",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "capacidades",
      title: "Capacidades",
      type: "array",
      group: "capacidades",
      description:
        "La banda de 4 tarjetas superpuesta debajo del Hero. Arrastrá para reordenar.",
      of: [{ type: "capacidad" }],
    }),
    defineField({
      name: "seccionesContenido",
      title: "Banners",
      type: "array",
      group: "seccionesContenido",
      description:
        "Los 4 banners full-width debajo de las tarjetas del Hero, en este mismo orden (el primero es el Banner 01, el que sigue más abajo en la página). Arrastrá para reordenar. Cada banner es una sola imagen a todo el ancho: el mensaje va dentro de la pieza gráfica.",
      of: [{ type: "seccionContenido" }],
    }),
  ],
  preview: {
    select: { title: "titulo" },
    prepare: ({ title }) => ({ title: title || "Página de inicio" }),
  },
});
