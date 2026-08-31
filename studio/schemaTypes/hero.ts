import { defineType, defineField } from "sanity";

/**
 * Hero — documento único (singleton, ver deskStructure.ts), solo la
 * fotografía principal del Hero.
 *
 * Antes vivía como el campo `imagen` anidado dentro de `paginaInicio.hero`
 * (junto con título/marca/mensaje/CTA) — un solo formulario grande donde la
 * foto era un campo más entre muchos, nada que hiciera evidente "acá se
 * cambia la imagen del Hero". Sprint "Implementación final del Hero +
 * Sanity + Cards" (§5-9) lo separa en su propio documento, con su propio
 * lugar en el menú del Studio, para que cambiar la foto sea una acción de
 * un solo paso: entrar a "Hero", reemplazar la imagen, publicar.
 *
 * Documento único a propósito (spec §5, "no permitir múltiples documentos
 * Hero"): mismo patrón que paginaInicio — un _id fijo (ver ID_HERO en
 * deskStructure.ts), se abre directo en su formulario en vez de una lista
 * con "Crear nuevo" que invitaría a duplicados que src/lib/sanity.ts nunca
 * busca (la query siempre trae el documento con ese _id fijo).
 *
 * El título/marca/mensaje/CTA del Hero SIGUEN en paginaInicio.hero — este
 * sprint solo pidió mover la imagen (spec §6: únicamente heroImage y
 * heroImageAlt), no reorganizar el resto.
 */
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagen principal",
      type: "image",
      description:
        "La fotografía grande que ocupa todo el Hero, detrás del texto y los overlays morados. Elegí el punto focal (hotspot) sobre el sujeto: la web recorta distinto según el tamaño de pantalla y siempre respeta ese punto.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImageAlt",
      title: "Texto alternativo",
      type: "string",
      description: "Texto alternativo descriptivo de la imagen del Hero.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: "heroImage" },
    prepare: ({ media }) => ({ title: "Hero", subtitle: "Imagen principal del sitio", media }),
  },
});
