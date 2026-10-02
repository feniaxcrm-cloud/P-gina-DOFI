import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";
import { miembroGiro } from "./giroNegocio";

/**
 * Sección "Clientes + métricas de Meta Ads" (página Tráfico / Ads).
 *
 * Es la sección de Clientes de Marketing Digital con una diferencia: en vez
 * de un video, la columna derecha es un PANEL DE META ADS con los KPIs de una
 * campaña de ejemplo (CPR, CTR, CPA, alcance, visualizaciones y frecuencia)
 * que cambia con el giro abierto: Gastronomía → una campaña de reservas por
 * WhatsApp; Construcción → cotizaciones de obra; Belleza → citas...
 *
 * GIROS: mismo formulario que en Marketing Digital (giroNegocio.ts, con sus
 * empresas, logos y foto) + las «Métricas de Meta Ads de este giro»,
 * opcionales. Sin métricas propias, el giro usa la campaña de ejemplo de su
 * tipo de negocio.
 *
 * SIN GIROS CARGADOS ACÁ, la web muestra los giros de Marketing Digital (las
 * mismas empresas y logos, sin cargarlos dos veces).
 *
 * Sin botón al final: «Ver casos de éxito» se quitó de Clientes en todas las
 * páginas.
 */
export const metricsClientsBanner = defineType({
  name: "metricsClientsBanner",
  title: "Clientes + métricas de Meta Ads",
  type: "object",
  description:
    "Carrusel de giros con sus empresas y, al lado, un panel de Meta Ads de ejemplo (CPR, CTR, CPA, alcance, visualizaciones, frecuencia) que cambia con el giro.",
  fieldsets: [
    { name: "giros", title: "Giros de negocio y sus métricas", options: { collapsible: true, collapsed: false } },
  ],
  fields: camposBase({
    conImagen: false,
    // Sin "cta": la sección ya no tiene botón (se quitó "Ver casos de éxito").
    omitir: ["destacado", "cta"],
    textos: {
      titulo: "Se muestra en una sola línea en escritorio.",
      subtitulo: "Opcional: etiqueta chica arriba del título.",
      descripcion: "Opcional: una frase debajo del título. Ej.: «Elige un giro y mira cómo medimos una campaña».",
    },
    extras: [
      defineField({
        name: "categorias",
        title: "Giros de negocio",
        type: "array",
        fieldset: "giros",
        description:
          "Cada giro es un panel del carrusel y tiene su panel de métricas. Arrastra para reordenar. Para sumar fotos o logos de clientes: entra al giro → «Empresas y logos» y «Foto del giro». Vacío: se usan los giros de Marketing Digital.",
        of: [
          miembroGiro({
            descripcionImagen:
              "Llena el panel: a color cuando el giro está abierto y en gris cuando no. Sin foto, el panel usa los colores DOFI.",
            extras: [
              defineField({
                name: "metricas",
                title: "Métricas de Meta Ads de este giro (opcional)",
                type: "metricasDemo",
                description:
                  "Vacías: se usa la campaña de ejemplo según el nombre o ícono del giro (restaurante, constructora, estética, gimnasio, consultorio, tienda, academia, turismo, autos, inmobiliaria...).",
              }),
            ],
          }),
        ],
      }),
      defineField({
        name: "rotacionAutomatica",
        title: "Pasar solo al siguiente giro",
        type: "boolean",
        fieldset: "giros",
        initialValue: true,
        description:
          "Cuando una campaña llega al día 30, se abre el giro siguiente. Si el visitante elige un giro, se queda en ese.",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo" },
    prepare: ({ titulo, activo }) => ({
      title: titulo || "Clientes + métricas de Meta Ads",
      subtitle: `Clientes + métricas${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
