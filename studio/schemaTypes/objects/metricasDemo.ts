import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Las métricas de la campaña de ejemplo de un giro (página Tráfico / Ads).
 *
 * En la web se dibujan como un panel de Meta Ads: CPR, CTR, CPA, alcance,
 * visualizaciones y frecuencia evolucionando durante 30 días. Se cargan SOLO
 * las cifras finales (las del día 30): cómo llega la campaña hasta ahí lo
 * calcula la web, y el día 30 coincide exacto con lo que escribas.
 *
 * Todo es opcional: lo que dejes vacío (o sea inválido) se completa con la
 * campaña de ejemplo del tipo de negocio del giro (restaurante, constructora,
 * estética, gimnasio...), así que un giro nuevo nunca queda sin panel.
 *
 * SON CIFRAS DE EJEMPLO: el panel dice «EJEMPLO» en pantalla y, debajo, el
 * texto del campo «Aviso al pie». Si algún día cargas los resultados REALES
 * de una campaña, cambia ese aviso para decirlo (por ejemplo: «Resultados
 * reales de una campaña de [cliente], julio 2026») y quita la idea de ejemplo.
 */

const OBJETIVOS = [
  { title: "Mensajes", value: "mensajes" },
  { title: "Clientes potenciales", value: "clientes_potenciales" },
  { title: "Ventas", value: "ventas" },
  { title: "Tráfico", value: "trafico" },
  { title: "Reconocimiento", value: "reconocimiento" },
];

type Opciones = { title: string; description: string; min?: number; max?: number };

const numero = (name: string, { title, description, min = 0.01, max }: Opciones) =>
  defineField({
    name,
    title,
    type: "number",
    description,
    validation: (Rule) => {
      const r = Rule.min(min);
      return max !== undefined ? r.max(max) : r;
    },
  });

export const metricasDemo = defineType({
  name: "metricasDemo",
  title: "Métricas de Meta Ads de este giro",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "campana",
      title: "Nombre de la campaña",
      type: "string",
      description: "Lo que se lee arriba del panel. Ej.: «Reservas por WhatsApp», «Cotizaciones de obra».",
    }),
    defineField({
      name: "objetivo",
      title: "Objetivo de la campaña",
      type: "string",
      options: { list: OBJETIVOS },
      description: "Se muestra bajo el nombre: «Meta Ads · Objetivo: Mensajes».",
    }),
    defineField({
      name: "resultado",
      title: "Qué cuenta como resultado",
      type: "string",
      description:
        "Lo que Meta cuenta como un resultado en esta campaña, en plural y corto. Ej.: «Conversaciones», «Clientes potenciales», «Compras». El CPR es el costo de cada uno.",
    }),
    defineField({
      name: "adquisicion",
      title: "Qué es una adquisición en este negocio",
      type: "string",
      description:
        "Lo que realmente le importa al negocio, en plural y corto. Ej.: «Reservas», «Visitas de obra», «Citas», «Membresías». El CPA es el costo de cada una.",
    }),
    numero("inversion", {
      title: "Inversión total (USD, 30 días)",
      description: "Cuánto se invirtió en los 30 días, en dólares. Ej.: 450.",
    }),
    numero("cpr", {
      title: "CPR · costo por resultado (USD)",
      description: "Ej.: 0.85. Los resultados salen de inversión ÷ CPR.",
    }),
    numero("ctr", {
      title: "CTR · porcentaje de clics",
      description: "Clics sobre visualizaciones, en porcentaje. Ej.: 2.8 (es 2,8%).",
      max: 100,
    }),
    numero("cpa", {
      title: "CPA · costo por adquisición (USD)",
      description: "Ej.: 3.40. Las adquisiciones salen de inversión ÷ CPA y deben ser menos que los resultados.",
    }),
    defineField({
      name: "alcance",
      title: "Alcance · personas únicas",
      type: "number",
      description: "Personas distintas que vieron el anuncio. Ej.: 48200.",
      validation: (Rule) =>
        Rule.min(1).custom((alcance, contexto) => {
          const visualizaciones = (contexto.parent as { visualizaciones?: number } | undefined)?.visualizaciones;
          if (typeof alcance === "number" && typeof visualizaciones === "number" && alcance > visualizaciones) {
            return "El alcance no puede ser mayor que las visualizaciones: cada persona alcanzada vio el anuncio al menos una vez.";
          }
          return true;
        }),
    }),
    numero("visualizaciones", {
      title: "Visualizaciones",
      description:
        "Veces que se mostró el anuncio. Ej.: 126500. La frecuencia (cuántas veces lo vio cada persona) se calcula sola: visualizaciones ÷ alcance.",
      min: 1,
    }),
    defineField({
      name: "hitos",
      title: "Optimizaciones que se marcan en el gráfico (opcional)",
      type: "array",
      description:
        "Hasta 4. Cuando la campaña llega a ese día, el gráfico lo marca con el texto. Vacío: «Día 7 · Nueva creatividad», «Día 14 · Audiencia ajustada» y «Día 21 · Presupuesto escalado».",
      validation: (Rule) => Rule.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "hito",
          title: "Optimización",
          fields: [
            defineField({
              name: "dia",
              title: "Día de la campaña",
              type: "number",
              description: "Entre el 2 y el 29.",
              validation: (Rule) => Rule.required().integer().min(2).max(29),
            }),
            defineField({
              name: "texto",
              title: "Qué se hizo",
              type: "string",
              description: "Corto: cabe una línea. Ej.: «Nueva creatividad».",
              validation: (Rule) => Rule.required().max(28),
            }),
          ],
          preview: {
            select: { dia: "dia", texto: "texto" },
            prepare: ({ dia, texto }) => ({ title: texto || "Optimización", subtitle: dia ? `Día ${dia}` : "" }),
          },
        }),
      ],
    }),
    defineField({
      name: "nota",
      title: "Aviso al pie del panel",
      type: "string",
      description:
        "Se ve siempre debajo del panel. Por defecto: «Cifras de ejemplo con fines ilustrativos: no corresponden a un cliente real.» Cámbialo solo si cargas resultados reales.",
    }),
  ],
});
