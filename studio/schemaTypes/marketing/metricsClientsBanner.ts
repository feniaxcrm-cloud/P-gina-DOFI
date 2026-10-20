import { defineType, defineField } from "sanity";
import { camposBase } from "./camposBase";
import { miembroGiro } from "./giroNegocio";

/**
 * Sección "Clientes + métricas de Meta Ads" (página Tráfico / Ads).
 *
 * Desde el 2026-10-20 se ve igual que la de Marketing Digital: carrusel de
 * giros y, a la derecha, los LOGOS del giro abierto en círculos (forma y
 * tamaño en «Presentación de los logos»). El panel de Meta Ads de ejemplo
 * que iba a la derecha ya no se muestra; sus métricas por giro siguen
 * guardadas acá por si se vuelve a usar.
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
    "Carrusel de giros con sus empresas y, al lado, los logos del giro abierto en círculos.",
  fieldsets: [
    { name: "giros", title: "Giros de negocio", options: { collapsible: true, collapsed: false } },
    {
      name: "logos",
      title: "Logos (columna derecha)",
      description:
        "La columna derecha muestra los logos del giro abierto (pedido del 2026-10-20). Acá se elige su forma y su tamaño; los logos se cargan en cada giro («Empresas y logos»).",
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
                title: "Métricas de Meta Ads de este giro (hoy no se muestran)",
                type: "metricasDemo",
                description:
                  "Desde el 2026-10-20 la sección muestra los logos en lugar del panel de Meta Ads; estas métricas quedan guardadas por si se vuelve a usar.",
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
          "El carrusel avanza solo mientras nadie lo toca. Se detiene cuando el visitante elige un giro.",
      }),
      defineField({
        name: "ajusteLogos",
        title: "Presentación de los logos",
        type: "ajusteLogos",
        fieldset: "logos",
      }),
    ],
  }),
  preview: {
    select: { titulo: "titulo", activo: "activo" },
    prepare: ({ titulo, activo }) => ({
      title: titulo || "Clientes y casos de éxito",
      subtitle: `Clientes${activo === false ? " · Oculta" : ""}`,
    }),
  },
});
