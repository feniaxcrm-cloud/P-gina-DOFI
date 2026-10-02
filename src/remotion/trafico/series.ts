/**
 * Las series de 30 dias del panel de Meta Ads, calculadas a partir de las
 * cifras FINALES de la campaña (las que se cargan en el Studio).
 *
 * FUNCION PURA Y DETERMINISTICA: mismas cifras y misma `semilla`, misma
 * serie, siempre (el "ruido" sale de un generador con semilla, nunca de
 * Math.random). Sin dependencias: se puede probar sola (ver
 * scripts/probar-series-trafico.mts).
 *
 * LA REGLA: el DIA 30 COINCIDE EXACTO con lo cargado -- CPR, CTR, CPA,
 * alcance, visualizaciones y frecuencia -- porque cada serie diaria se
 * escala para que su suma sea el total pedido. Lo que se inventa es solo el
 * CAMINO hasta ahi, y es el que tiene una campaña de verdad:
 *  - APRENDIZAJE: el primer dia cada resultado cuesta bastante mas que al
 *    final (el algoritmo todavia no sabe a quien mostrarle el anuncio) y el
 *    costo baja a medida que se optimiza. Por eso el CPR acumulado empieza
 *    alto y termina en el valor cargado.
 *  - CTR: mejora al cambiar la creatividad y afinar la audiencia.
 *  - FRECUENCIA: sube de ~1 hasta visualizaciones/alcance; el alcance se
 *    deriva de ella (alcance = visualizaciones acumuladas / frecuencia), asi
 *    que satura solo, como en Meta.
 *  - PRESUPUESTO: el gasto diario sube un 25% de principio a fin.
 *
 * Todas las series acumuladas (alcance, visualizaciones, CPR, CTR, CPA...)
 * son "hasta ese dia", como las muestra Meta con un rango de fechas.
 */

export const DIAS = 30;

export type EntradaSeries = {
  inversion: number;
  cpr: number;
  ctr: number;
  cpa: number;
  alcance: number;
  visualizaciones: number;
};

export type Series = {
  // Por dia (indice 0 = dia 1).
  gastoDia: number[];
  resultadosDia: number[];
  adquisicionesDia: number[];
  visualizacionesDia: number[];
  clicsDia: number[];
  // Acumulados hasta ese dia.
  gasto: number[];
  resultados: number[];
  adquisiciones: number[];
  visualizaciones: number[];
  clics: number[];
  alcance: number[];
  frecuencia: number[];
  cpr: number[];
  ctr: number[];
  /** null mientras todavia no hay ni una adquisicion (se muestra "—"). */
  cpa: (number | null)[];
  /** Para escalar el grafico. */
  maxResultadosDia: number;
  maxCpr: number;
  minCpr: number;
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: generador con semilla, rapido y suficiente para ruido visual. */
function generador(semilla: number) {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const suma = (v: number[]) => v.reduce((a, b) => a + b, 0);
const acumular = (v: number[]) => {
  let t = 0;
  return v.map((x) => (t += x));
};
/** Escala una serie para que sume exactamente `total`. */
const escalar = (v: number[], total: number) => {
  const k = total / suma(v);
  return v.map((x) => x * k);
};

export function calcularSeries(e: EntradaSeries, semilla: string): Series {
  const rnd = generador(hash(semilla));
  // Un canal de ruido por magnitud, siempre en el mismo orden.
  const ruido = (amplitud: number) => Array.from({ length: DIAS }, () => 1 + (rnd() * 2 - 1) * amplitud);
  const nCosto = ruido(0.07);
  const nCpm = ruido(0.05);
  const nCtr = ruido(0.05);
  const nConv = ruido(0.1);

  const dias = Array.from({ length: DIAS }, (_, d) => d);

  // Gasto: sube 25% de principio a fin.
  const pesos = dias.map((d) => 1 + (0.25 * d) / (DIAS - 1));
  const gastoDia = escalar(pesos, e.inversion);

  // Resultados: el costo diario baja con el aprendizaje de la campaña.
  const costoRel = dias.map((d) => (0.85 + 0.75 * Math.exp(-d / 8)) * nCosto[d]);
  const resultadosDia = escalar(
    dias.map((d) => gastoDia[d] / costoRel[d]),
    e.inversion / e.cpr
  );

  // Visualizaciones: siguen al gasto (CPM casi plano).
  const visualizacionesDia = escalar(
    dias.map((d) => gastoDia[d] / nCpm[d]),
    e.visualizaciones
  );

  // Clics: el CTR diario mejora; el total cierra en visualizaciones x CTR.
  const clicsDia = escalar(
    dias.map((d) => visualizacionesDia[d] * (0.78 + 0.4 * (1 - Math.exp(-d / 9))) * nCtr[d]),
    (e.visualizaciones * e.ctr) / 100
  );

  // Adquisiciones: siguen a los resultados, con una conversion que mejora.
  const adquisicionesDia = escalar(
    dias.map((d) => resultadosDia[d] * (0.85 + 0.3 * (1 - Math.exp(-d / 10))) * nConv[d]),
    e.inversion / e.cpa
  );

  const gasto = acumular(gastoDia);
  const resultados = acumular(resultadosDia);
  const adquisiciones = acumular(adquisicionesDia);
  const visualizaciones = acumular(visualizacionesDia);
  const clics = acumular(clicsDia);

  // Frecuencia: de ~1 a visualizaciones/alcance; el alcance sale de ella.
  const frecFinal = Math.max(1, e.visualizaciones / e.alcance);
  const frecuencia = dias.map((d) => 1 + (frecFinal - 1) * Math.pow(visualizaciones[d] / e.visualizaciones, 0.85));
  let tope = 0;
  const alcance = dias.map((d) => (tope = Math.max(tope, visualizaciones[d] / frecuencia[d])));

  const cpr = dias.map((d) => gasto[d] / resultados[d]);
  const ctr = dias.map((d) => (clics[d] / visualizaciones[d]) * 100);
  const cpa = dias.map((d) => (adquisiciones[d] >= 1 ? gasto[d] / adquisiciones[d] : null));

  return {
    gastoDia,
    resultadosDia,
    adquisicionesDia,
    visualizacionesDia,
    clicsDia,
    gasto,
    resultados,
    adquisiciones,
    visualizaciones,
    clics,
    alcance,
    frecuencia,
    cpr,
    ctr,
    cpa,
    maxResultadosDia: Math.max(...resultadosDia),
    maxCpr: Math.max(...cpr),
    minCpr: Math.min(...cpr),
  };
}

/** Valor de una serie en una posicion fraccionaria del recorrido: `dp` va de
 *  1 (dia 1) a DIAS (dia 30). Interpola entre dos dias. Si alguno de los dos
 *  extremos es null (sin datos todavia), devuelve null. */
export function en(serie: ReadonlyArray<number | null>, dp: number): number | null {
  const x = Math.min(DIAS - 1, Math.max(0, dp - 1));
  const i0 = Math.floor(x);
  const i1 = Math.min(DIAS - 1, i0 + 1);
  const a = serie[i0];
  const b = serie[i1];
  if (a === null || b === null) return null;
  return a + (b - a) * (x - i0);
}
