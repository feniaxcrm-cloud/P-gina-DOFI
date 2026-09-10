import { defineType, defineField } from "sanity";

/**
 * Los 4 banners full-width de la home, con su boton. Documento propio y
 * unico (singleton, _id fijo "banners").
 *
 * POR QUE SE SEPARO DE "Pagina de inicio"
 * -----------------------------------------------------------------
 * Antes este arreglo era un campo mas de paginaInicio, dentro de la pestaña
 * "Banners". El menu tenia una entrada llamada "Banners" que abria ese mismo
 * documento esperando caer en esa pestaña -- pero el Studio no permite
 * elegir con que pestaña abrir un documento (no hay API para eso en
 * structure builder), asi que la entrada caia siempre en "Hero" y habia que
 * adivinar que faltaba un click mas. Ya habia costado una vuelta entera
 * ("no encuentro donde editar las secciones").
 *
 * Con un documento propio el problema desaparece de raiz: la entrada
 * "Banners" del menu abre un formulario que SOLO tiene banners. Sin
 * pestañas, sin doble puerta de entrada, sin adivinar.
 *
 * El tipo del item (seccionContenido) NO se renombro: los 4 items publicados
 * se identifican por su _type, y cambiarlo los dejaria huerfanos.
 */
export const banners = defineType({
  name: "banners",
  title: "Banners",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      description: "Solo para identificar el documento en el menú. No se muestra en la web.",
      initialValue: "Banners",
      readOnly: true,
    }),
    defineField({
      name: "seccionesContenido",
      title: "Banners de la home",
      type: "array",
      description:
        "Los 4 banners full-width que van debajo de las tarjetas del Hero, en este mismo orden (el primero es el Banner 01). Arrastrá para reordenar. Cada uno es una sola imagen a todo el ancho, y su botón se configura adentro: texto, enlace, color y posición.",
      of: [{ type: "seccionContenido" }],
    }),
  ],
  preview: {
    select: { title: "titulo" },
    prepare: ({ title }) => ({ title: title || "Banners" }),
  },
});
