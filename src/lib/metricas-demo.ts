import { claveDeGiro, type ClaveGiro } from "@/lib/giro-tipo";
import type { IconoCategoria } from "@/lib/marketing-digital";

/**
 * Metricas DEMOSTRATIVAS de Meta Ads para la seccion Clientes de Tráfico/Ads.
 *
 * QUE SON: el panel de una campaña de ejemplo por giro de negocio, dibujado
 * en vivo con Remotion (src/remotion/trafico/PanelMeta.tsx): los KPIs que
 * mira cualquier anunciante en Meta -- CPR, CTR, CPA, alcance,
 * visualizaciones y frecuencia -- evolucionando durante 30 dias.
 *
 * NO SON RESULTADOS DE UN CLIENTE: son cifras de ejemplo, plausibles para la
 * region, con la que se explica COMO se mide. El panel lo dice en pantalla
 * (etiqueta "Ejemplo") y debajo lleva la `nota`. Quien cargue cifras reales
 * de una campaña en el Studio puede cambiar la nota ("Resultados reales de
 * una campaña de X, julio 2026"); por eso la nota es un campo editable y no
 * un texto fijo.
 *
 * SE CARGAN SEIS NUMEROS, NO UNA SERIE: el comportamiento dia a dia (el
 * aprendizaje de la campaña, el costo bajando, el alcance saturando) se
 * calcula en src/remotion/trafico/series.ts de forma deterministica y de
 * modo que el dia 30 coincida EXACTO con lo cargado. La frecuencia tampoco
 * se carga: es visualizaciones / alcance, como la calcula Meta.
 *
 * DE DONDE SALE CADA PANEL:
 *  1. Si el giro tiene sus metricas cargadas en el Studio, esas (campo por
 *     campo: lo que falte o sea invalido se completa con la plantilla).
 *  2. Si no, la plantilla de su tipo de negocio (PLANTILLAS_METRICAS),
 *     elegida por el nombre o el icono del giro (src/lib/giro-tipo.ts).
 *  Asi un giro nuevo creado en el Studio nunca queda sin panel.
 */

export const OBJETIVOS = ["mensajes", "clientes_potenciales", "ventas", "trafico", "reconocimiento"] as const;
export type ObjetivoCampana = (typeof OBJETIVOS)[number];

export const ETIQUETA_OBJETIVO: Record<ObjetivoCampana, string> = {
  mensajes: "Mensajes",
  clientes_potenciales: "Clientes potenciales",
  ventas: "Ventas",
  trafico: "Tráfico",
  reconocimiento: "Reconocimiento",
};

/** Una optimizacion que se marca en el grafico cuando el dia llega a ella. */
export type Hito = { dia: number; texto: string };

export type MetricasDemo = {
  /** "Reservas por WhatsApp": el nombre de la campaña de ejemplo. */
  campana: string;
  objetivo: ObjetivoCampana;
  /** Que cuenta Meta como resultado ("Conversaciones", "Clientes potenciales"). */
  resultado: string;
  /** Que es una adquisicion en ese negocio ("Reservas", "Visitas de obra"). */
  adquisicion: string;
  /** Inversion total de los 30 dias, en dolares. */
  inversion: number;
  /** Costo por resultado, en dolares. */
  cpr: number;
  /** Porcentaje de clics sobre visualizaciones. */
  ctr: number;
  /** Costo por adquisicion, en dolares. */
  cpa: number;
  /** Personas unicas alcanzadas. */
  alcance: number;
  visualizaciones: number;
  hitos: Hito[];
  /** Aviso al pie del panel. */
  nota: string;
};

export const NOTA_DEMO = "Cifras de ejemplo con fines ilustrativos: no corresponden a un cliente real.";

/** Las tres optimizaciones por defecto: el "Medir. Analizar. Optimizar." de
 *  la pagina, hecho visible en el grafico. */
export const HITOS_BASE: Hito[] = [
  { dia: 7, texto: "Nueva creatividad" },
  { dia: 14, texto: "Audiencia ajustada" },
  { dia: 21, texto: "Presupuesto escalado" },
];

type Plantilla = Omit<MetricasDemo, "hitos" | "nota">;

/**
 * Cifras conservadoras para la region (CPM de 2 a 5 dolares, costo por
 * conversacion entre 0,70 y 1,90, costo por cliente potencial segun el
 * ticket del negocio). Coherentes entre si:
 *   resultados = inversion / CPR, adquisiciones = inversion / CPA,
 *   adquisiciones < resultados, frecuencia = visualizaciones / alcance (2,1 a 2,6).
 */
export const PLANTILLAS_METRICAS: Record<ClaveGiro, Plantilla> = {
  restaurante: {
    campana: "Reservas por WhatsApp",
    objetivo: "mensajes",
    resultado: "Conversaciones",
    adquisicion: "Reservas",
    inversion: 450,
    cpr: 0.85,
    ctr: 2.8,
    cpa: 3.4,
    alcance: 48200,
    visualizaciones: 126500,
  },
  construccion: {
    campana: "Cotizaciones de obra",
    objetivo: "clientes_potenciales",
    resultado: "Clientes potenciales",
    adquisicion: "Visitas de obra",
    inversion: 900,
    cpr: 4.6,
    ctr: 1.4,
    cpa: 38,
    alcance: 61000,
    visualizaciones: 148000,
  },
  belleza: {
    campana: "Citas de tratamientos",
    objetivo: "mensajes",
    resultado: "Conversaciones",
    adquisicion: "Citas",
    inversion: 380,
    cpr: 0.72,
    ctr: 3.1,
    cpa: 4.8,
    alcance: 41300,
    visualizaciones: 98400,
  },
  fitness: {
    campana: "Planes y clases de prueba",
    objetivo: "clientes_potenciales",
    resultado: "Clientes potenciales",
    adquisicion: "Membresías",
    inversion: 420,
    cpr: 1.9,
    ctr: 1.9,
    cpa: 14,
    alcance: 52800,
    visualizaciones: 112000,
  },
  salud: {
    campana: "Citas de consulta",
    objetivo: "mensajes",
    resultado: "Conversaciones",
    adquisicion: "Citas",
    inversion: 350,
    cpr: 1.1,
    ctr: 2.2,
    cpa: 7.5,
    alcance: 34500,
    visualizaciones: 76000,
  },
  retail: {
    campana: "Ventas de la tienda online",
    objetivo: "ventas",
    resultado: "Compras",
    adquisicion: "Clientes nuevos",
    inversion: 600,
    cpr: 5.9,
    ctr: 1.6,
    cpa: 9.4,
    alcance: 70400,
    visualizaciones: 168000,
  },
  educacion: {
    campana: "Inscripciones a cursos",
    objetivo: "clientes_potenciales",
    resultado: "Clientes potenciales",
    adquisicion: "Inscripciones",
    inversion: 500,
    cpr: 2.4,
    ctr: 1.7,
    cpa: 25,
    alcance: 55000,
    visualizaciones: 119000,
  },
  turismo: {
    campana: "Cotizaciones de paquetes",
    objetivo: "mensajes",
    resultado: "Conversaciones",
    adquisicion: "Reservas",
    inversion: 550,
    cpr: 1.25,
    ctr: 2.4,
    cpa: 22,
    alcance: 59000,
    visualizaciones: 131000,
  },
  autos: {
    campana: "Pruebas de manejo",
    objetivo: "clientes_potenciales",
    resultado: "Clientes potenciales",
    adquisicion: "Pruebas de manejo",
    inversion: 1200,
    cpr: 6.8,
    ctr: 1.2,
    cpa: 48,
    alcance: 88000,
    visualizaciones: 210000,
  },
  inmobiliaria: {
    campana: "Interesados en proyectos",
    objetivo: "clientes_potenciales",
    resultado: "Clientes potenciales",
    adquisicion: "Visitas",
    inversion: 800,
    cpr: 5.2,
    ctr: 1.3,
    cpa: 40,
    alcance: 70000,
    visualizaciones: 160000,
  },
  tecnologia: {
    campana: "Demos del producto",
    objetivo: "clientes_potenciales",
    resultado: "Clientes potenciales",
    adquisicion: "Demos",
    inversion: 650,
    cpr: 7.5,
    ctr: 1.1,
    cpa: 36,
    alcance: 43500,
    visualizaciones: 92000,
  },
  servicios: {
    campana: "Solicitudes de cotización",
    objetivo: "mensajes",
    resultado: "Conversaciones",
    adquisicion: "Cotizaciones",
    inversion: 400,
    cpr: 1.6,
    ctr: 1.8,
    cpa: 9.5,
    alcance: 40000,
    visualizaciones: 88000,
  },
};

export function metricasParaGiro(nombre: string, icono: IconoCategoria | null): MetricasDemo {
  return {
    ...PLANTILLAS_METRICAS[claveDeGiro(nombre, icono)],
    hitos: HITOS_BASE.map((h) => ({ ...h })),
    nota: NOTA_DEMO,
  };
}

// ============================================================
// Desde Sanity (forma cruda y laxa: cualquier campo puede faltar)
// ============================================================

type Txt = string | null | undefined;
export type MetricasRaw = {
  campana?: Txt;
  objetivo?: Txt;
  resultado?: Txt;
  adquisicion?: Txt;
  inversion?: number | null;
  cpr?: number | null;
  ctr?: number | null;
  cpa?: number | null;
  alcance?: number | null;
  visualizaciones?: number | null;
  hitos?: Array<{ dia?: number | null; texto?: Txt } | null> | null;
  nota?: Txt;
} | null;

const txt = (v: Txt, porDefecto: string) => (typeof v === "string" && v.trim() ? v.trim() : porDefecto);
const positivo = (v: number | null | undefined, porDefecto: number) =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? v : porDefecto;

/** La metrica cargada en el Studio, completada campo a campo con la plantilla
 *  del giro. Un dato invalido (cero, negativo, alcance mayor que las
 *  visualizaciones) no rompe el panel: se usa el de la plantilla. */
export function normalizarMetricas(raw: MetricasRaw | undefined, base: MetricasDemo): MetricasDemo {
  if (!raw) return base;

  let alcance = positivo(raw.alcance, base.alcance);
  let visualizaciones = positivo(raw.visualizaciones, base.visualizaciones);
  // Cada persona alcanzada vio el anuncio al menos una vez: alcance <= visualizaciones.
  if (alcance > visualizaciones) {
    alcance = base.alcance;
    visualizaciones = base.visualizaciones;
  }

  const hitos = (raw.hitos ?? [])
    .map((h) => ({ dia: Math.round(Number(h?.dia)), texto: txt(h?.texto, "") }))
    .filter((h) => Number.isFinite(h.dia) && h.dia >= 2 && h.dia <= 29 && h.texto)
    .sort((a, b) => a.dia - b.dia)
    .slice(0, 4);

  return {
    campana: txt(raw.campana, base.campana),
    objetivo: (OBJETIVOS as readonly string[]).includes(raw.objetivo ?? "")
      ? (raw.objetivo as ObjetivoCampana)
      : base.objetivo,
    resultado: txt(raw.resultado, base.resultado),
    adquisicion: txt(raw.adquisicion, base.adquisicion),
    inversion: positivo(raw.inversion, base.inversion),
    cpr: positivo(raw.cpr, base.cpr),
    ctr: Math.min(100, positivo(raw.ctr, base.ctr)),
    cpa: positivo(raw.cpa, base.cpa),
    alcance,
    visualizaciones,
    hitos: hitos.length > 0 ? hitos : base.hitos,
    nota: txt(raw.nota, base.nota),
  };
}
