/**
 * Prueba de las series del panel de Meta Ads (src/remotion/trafico/series.ts):
 * para CADA plantilla de metricas comprueba que
 *   1. el dia 30 coincide exacto con las cifras cargadas,
 *   2. el recorrido tiene la forma de una campaña real (CPR acumulado
 *      baja, alcance y visualizaciones solo suben, frecuencia entre 1 y la
 *      final, nada negativo, nada que no sea un numero),
 *   3. dos corridas con la misma semilla dan lo mismo.
 *
 * Uso: npx tsx scripts/probar-series-trafico.mts
 */
import { PLANTILLAS_METRICAS } from "../src/lib/metricas-demo";
import { calcularSeries, DIAS, en } from "../src/remotion/trafico/series";

let fallos = 0;
const falla = (clave: string, msg: string) => {
  fallos++;
  console.log(`  FALLA [${clave}] ${msg}`);
};
const cerca = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

for (const [clave, m] of Object.entries(PLANTILLAS_METRICAS)) {
  const s = calcularSeries(m, clave);
  const f = DIAS - 1;
  const R = m.inversion / m.cpr;
  const A = m.inversion / m.cpa;

  if (!cerca(s.gasto[f], m.inversion)) falla(clave, `gasto ${s.gasto[f]} != ${m.inversion}`);
  if (!cerca(s.cpr[f], m.cpr)) falla(clave, `CPR dia 30 ${s.cpr[f]} != ${m.cpr}`);
  if (!cerca(s.ctr[f], m.ctr)) falla(clave, `CTR dia 30 ${s.ctr[f]} != ${m.ctr}`);
  if (!cerca(s.cpa[f] ?? NaN, m.cpa)) falla(clave, `CPA dia 30 ${s.cpa[f]} != ${m.cpa}`);
  if (!cerca(s.alcance[f], m.alcance)) falla(clave, `alcance dia 30 ${s.alcance[f]} != ${m.alcance}`);
  if (!cerca(s.visualizaciones[f], m.visualizaciones)) falla(clave, `visualizaciones dia 30 != ${m.visualizaciones}`);
  if (!cerca(s.frecuencia[f], Math.max(1, m.visualizaciones / m.alcance))) falla(clave, `frecuencia dia 30 ${s.frecuencia[f]}`);
  if (!cerca(s.resultados[f], R)) falla(clave, `resultados ${s.resultados[f]} != ${R}`);
  if (!cerca(s.adquisiciones[f], A)) falla(clave, `adquisiciones ${s.adquisiciones[f]} != ${A}`);
  if (A >= R) falla(clave, "las adquisiciones deben ser menos que los resultados");

  for (let d = 1; d < DIAS; d++) {
    if (s.alcance[d] < s.alcance[d - 1] - 1e-9) falla(clave, `alcance baja el dia ${d + 1}`);
    if (s.visualizaciones[d] < s.visualizaciones[d - 1]) falla(clave, `visualizaciones bajan el dia ${d + 1}`);
    if (s.frecuencia[d] < s.frecuencia[d - 1] - 1e-9) falla(clave, `frecuencia baja el dia ${d + 1}`);
  }
  for (const [nombre, v] of Object.entries(s)) {
    if (!Array.isArray(v)) continue;
    for (const x of v as Array<number | null>) {
      if (x !== null && (!Number.isFinite(x) || x < 0)) falla(clave, `${nombre} tiene un valor invalido: ${x}`);
    }
  }
  // La campaña mejora: el CPR acumulado del dia 7 es mayor que el final, y el
  // dia 1 todavia mayor.
  if (!(s.cpr[0] > s.cpr[6] && s.cpr[6] > s.cpr[f])) falla(clave, `el CPR no baja: ${s.cpr[0].toFixed(2)} > ${s.cpr[6].toFixed(2)} > ${s.cpr[f].toFixed(2)}`);
  if (!(s.frecuencia[0] < 1.3)) falla(clave, `la frecuencia del dia 1 es ${s.frecuencia[0].toFixed(2)} (esperado ~1)`);
  const cpa7 = s.cpa[6];
  const dia1cpa = s.cpa.findIndex((v) => v !== null) + 1;

  const otra = calcularSeries(m, clave);
  if (JSON.stringify(otra) !== JSON.stringify(s)) falla(clave, "no es deterministica");

  console.log(
    `${clave.padEnd(13)} CPR ${s.cpr[0].toFixed(2)}→${s.cpr[6].toFixed(2)}→${s.cpr[f].toFixed(2)}` +
      `  CPA ${cpa7 === null ? "—" : cpa7.toFixed(1)}→${(s.cpa[f] ?? 0).toFixed(1)} (1ª adq. día ${dia1cpa})` +
      `  CTR ${s.ctr[0].toFixed(2)}→${s.ctr[f].toFixed(2)}%  frec ${s.frecuencia[0].toFixed(2)}→${s.frecuencia[f].toFixed(2)}` +
      `  res ${Math.round(R)} adq ${Math.round(A)}`
  );
}

// Interpolacion fraccionaria.
const s = calcularSeries(PLANTILLAS_METRICAS.restaurante, "restaurante");
const medio = en(s.cpr, 12.5)!;
if (!(medio <= Math.max(s.cpr[11], s.cpr[12]) && medio >= Math.min(s.cpr[11], s.cpr[12]))) falla("en()", "interpola fuera de rango");
// Un negocio de pocas adquisiciones (construccion: 24 en 30 dias) todavia no tiene
// ninguna el dia 1: el CPA queda en null y el panel muestra "—".
const poco = calcularSeries(PLANTILLAS_METRICAS.construccion, "construccion");
if (en(poco.cpa, 1) !== null) falla("en()", "CPA del dia 1 deberia ser null (sin adquisiciones)");
if (en(s.cpr, 0) !== s.cpr[0] || en(s.cpr, 99) !== s.cpr[DIAS - 1]) falla("en()", "no recorta los extremos");

console.log(fallos === 0 ? "\nTODO OK" : `\n${fallos} FALLO(S)`);
process.exit(fallos === 0 ? 0 : 1);
