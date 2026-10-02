import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Página /trafico-ads. Documento único (singleton, _id fijo
 * "traficoAdsPage"), con su propia entrada en el menú.
 *
 * MISMA ESTRUCTURA QUE MARKETING DIGITAL: todo el contenido es la lista
 * `sections[]`, en ESE orden -- se cambia arrastrando. Para ocultar una
 * sección sin borrarla, se apaga "Mostrar en la página" dentro de ella. Los
 * campos de cada sección son los mismos.
 *
 * Además de las secciones de Marketing Digital, esta página tiene tres
 * propias:
 *  - Plataformas (¿Dónde traficamos?): tarjetas de Meta, TikTok, Google...
 *  - Ecosistema: el recorrido Instagram → Google → web → WhatsApp.
 *  - Clientes + métricas de Meta Ads: en vez de un video, un panel con los
 *    KPIs de una campaña de ejemplo por giro (CPR, CTR, CPA, alcance,
 *    visualizaciones, frecuencia). Los logos, fotos y empresas de cada giro
 *    se cargan dentro del giro, igual que en Marketing Digital.
 *
 * Mientras no haya NINGUNA sección activa, la web muestra un contenido de
 * respaldo armado con el documento «SECCION DE TRAFICO». Con una sola sección
 * activa, manda lo que esté acá.
 */
export const traficoAdsPage = defineType({
  name: "traficoAdsPage",
  title: "Tráfico / Ads",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título interno",
      type: "string",
      initialValue: "Tráfico / Ads",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      description:
        "Las secciones de la página, en este mismo orden: arrastra para reordenar. Con «Agregar elemento» eliges el tipo de sección. Para ocultar una sin borrarla, entra y apaga «Mostrar en la página».",
      of: [
        defineArrayMember({ type: "teamBanner" }),
        defineArrayMember({ type: "aboutBanner" }),
        defineArrayMember({ type: "navigationBanner" }),
        defineArrayMember({ type: "methodBanner" }),
        defineArrayMember({ type: "platformsBanner" }),
        defineArrayMember({ type: "ecosystemBanner" }),
        defineArrayMember({ type: "metricsClientsBanner" }),
        defineArrayMember({ type: "reviewsBanner" }),
        defineArrayMember({ type: "ctaBanner" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Tráfico / Ads" }),
  },
});
