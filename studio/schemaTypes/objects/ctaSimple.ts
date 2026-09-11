import { defineType, defineField } from "sanity";

/**
 * Un boton: texto + enlace. Si falta cualquiera de los dos, la web no
 * muestra el boton (nunca un boton a medias).
 */
export const ctaSimple = defineType({
  name: "ctaSimple",
  title: "Botón",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({
      name: "texto",
      title: "Texto del botón",
      type: "string",
      description: 'Ej: "Quiero Mejorar mis Ventas".',
    }),
    defineField({
      name: "enlace",
      title: "Enlace",
      type: "string",
      description:
        'Página de este sitio empezando con "/" (ej: /contactanos). Una dirección completa https://... se abre en pestaña nueva.',
      validation: (Rule) =>
        Rule.custom((valor) => {
          if (!valor) return true;
          if (/^(https?:\/\/|mailto:|tel:|\/)/.test(valor)) return true;
          return 'Tiene que empezar con "/" (una página de este sitio) o con https:// (un enlace externo).';
        }),
    }),
  ],
});
