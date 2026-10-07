import { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ETIQUETA_OBJETIVO, type MetricasDemo } from "@/lib/metricas-demo";
import { curva, resorte } from "./curvas";
import { decimal, dolares, entero, moneda, porcentaje } from "./formato";
import { calcularSeries, DIAS, en, type Series } from "./series";
import { color, fuente, LOGO_META, PANEL, TIEMPOS, TOTAL_CUADROS } from "./tema";

/**
 * Composicion Remotion: el panel de una campaña de Meta Ads durante 30 dias.
 *
 * Todo depende SOLO del cuadro actual (useCurrentFrame) y de las series de
 * series.ts, calculadas a partir de las cifras finales cargadas en el Studio:
 * por eso se puede pausar, adelantar y retroceder como un video -- arrastrar
 * la barra de la pagina es "mover el dia" -- y por eso cambiar una cifra en el
 * Studio cambia todo el recorrido sin grabar nada.
 *
 * Que se ve, de arriba hacia abajo:
 *  - Cabecera: la campaña de ejemplo y la etiqueta EJEMPLO (siempre visible).
 *  - Estado: dia N de 30 y una barra de avance.
 *  - Seis KPIs de Meta en dos columnas: CPR, CTR, CPA, alcance,
 *    visualizaciones y frecuencia, cada uno "hasta ese dia". Los tres que se
 *    optimizan (CPR, CTR, CPA) muestran su mejora contra la primera semana.
 *  - Grafico: resultados por dia (barras) y CPR acumulado (linea); las
 *    optimizaciones (nueva creatividad, audiencia ajustada...) se marcan
 *    cuando el dia llega a ellas. Es el "Medir. Analizar. Optimizar." visible.
 *  - Totales: inversion, resultados y adquisiciones acumulados.
 *
 * TEXTO MINIMO: 17 px de diseño. El lienzo (560 de ancho) se muestra entre
 * 340 y 440 px, o sea 10 a 13 px reales en lo mas chico (las leyendas); las
 * cifras y los titulos van entre 25 y 40 px de diseño.
 */

export type PropsPanelMeta = {
  datos: MetricasDemo;
  /** Fija el "ruido" de las series: el mismo giro se ve siempre igual. */
  semilla: string;
};

// ---------------------------------------------------------------- medidas
const ANCHO = PANEL.ancho;
const PAD = 22;
const GX = 14;
const GY = 12;
const TILE_W = (ANCHO - 2 * PAD - GX) / 2;
const TILE_H = 118;
const GEO = {
  cabecera: 22,
  estado: 94,
  barra: 130,
  tiles: 150,
  grafico: 542,
  graficoAlto: 222,
  totales: 778,
} as const;

// Plot del grafico (coordenadas dentro de su tarjeta de 516 x 222).
const GRAFICO_ANCHO = ANCHO - 2 * PAD;
const PX0 = 14;
const PLOT_ANCHO = GRAFICO_ANCHO - 2 * PX0;
const PITCH = PLOT_ANCHO / DIAS;
const BARRA = 10.5;
const TOP = 76;
const BASE = 180;
const ALTO_PLOT = BASE - TOP;

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const xDia = (i: number) => PX0 + PITCH * i + PITCH / 2;

// ------------------------------------------------------------------- KPIs
type ClaveKpi = "cpr" | "ctr" | "cpa" | "alcance" | "visualizaciones" | "frecuencia";
type Kpi = {
  clave: ClaveKpi;
  etiqueta: string;
  leyenda: string;
  formato: (n: number) => string;
  /** Si se optimiza: cual direccion es mejorar. */
  mejora?: "baja" | "sube";
};

const KPIS: Kpi[] = [
  { clave: "cpr", etiqueta: "CPR", leyenda: "Costo por resultado", formato: moneda, mejora: "baja" },
  { clave: "ctr", etiqueta: "CTR", leyenda: "Porcentaje de clics", formato: porcentaje, mejora: "sube" },
  { clave: "cpa", etiqueta: "CPA", leyenda: "Costo por adquisición", formato: moneda, mejora: "baja" },
  { clave: "alcance", etiqueta: "ALCANCE", leyenda: "Personas únicas", formato: entero },
  { clave: "visualizaciones", etiqueta: "VISUALIZACIONES", leyenda: "Veces que se mostró", formato: entero },
  { clave: "frecuencia", etiqueta: "FRECUENCIA", leyenda: "Veces por persona", formato: decimal },
];

function serieDe(clave: ClaveKpi, s: Series): ReadonlyArray<number | null> {
  return s[clave];
}

// ------------------------------------------------------------------ tiempo
/** El dia (1 a 30) que muestra un cuadro. LINEAL A PROPOSITO: es un eje de
 *  tiempo, no un movimiento (los dias pasan parejos). Lo que se ve fluido son
 *  las series, que ya son curvas. */
function diaEn(frame: number) {
  const t = interpolate(frame, [TIEMPOS.intro, TIEMPOS.intro + TIEMPOS.recorrido], [0, 1], sujetar);
  return 1 + (DIAS - 1) * t;
}

/** Entrada de cada pieza: sube 14 px y aparece, con resorte, escalonada. */
function useEntrada(retraso: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - retraso, fps, config: resorte.suave, durationInFrames: 22 });
  return { opacity: p, transform: `translateY(${(1 - p) * 14}px)` };
}

// ------------------------------------------------------------------ piezas
const caja = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  width: w,
  height: h,
});

function Cabecera({ datos }: { datos: MetricasDemo }) {
  const entrada = useEntrada(0);
  return (
    <div
      style={{
        ...caja(PAD, GEO.cabecera, ANCHO - 2 * PAD, 58),
        display: "flex",
        alignItems: "center",
        gap: 14,
        ...entrada,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: color.veloFuerte,
          border: `1px solid ${color.borde}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill={color.texto} aria-hidden="true">
          <path d={LOGO_META} />
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: fuente.display,
            fontSize: 25,
            fontWeight: 700,
            lineHeight: "30px",
            color: color.texto,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {datos.campana}
        </div>
        <div style={{ fontFamily: fuente.texto, fontSize: 19, lineHeight: "24px", color: color.tenue, whiteSpace: "nowrap" }}>
          Meta Ads · Objetivo: {ETIQUETA_OBJETIVO[datos.objetivo]}
        </div>
      </div>
    </div>
  );
}

function Estado({ dp }: { dp: number }) {
  const entrada = useEntrada(3);
  const dia = Math.min(DIAS, Math.max(1, Math.floor(dp)));
  return (
    <>
      <div
        style={{
          ...caja(PAD, GEO.estado, ANCHO - 2 * PAD, 28),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: fuente.texto,
          fontSize: 20,
          color: color.texto,
          ...entrada,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: color.mejora, boxShadow: `0 0 0 4px ${color.mejoraVelo}` }} />
          Activa
        </span>
        <span style={{ fontFamily: fuente.display, fontWeight: 700, color: color.acentoSuave, fontVariantNumeric: "tabular-nums" }}>
          Día {dia} de {DIAS}
        </span>
        <span
          style={{
            fontFamily: fuente.display,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: color.acentoSuave,
            border: `1.5px solid ${color.acento}`,
            borderRadius: 999,
            padding: "3px 14px",
          }}
        >
          EJEMPLO
        </span>
      </div>
      <div style={{ ...caja(PAD, GEO.barra, ANCHO - 2 * PAD, 4), borderRadius: 4, background: color.veloFuerte, overflow: "hidden", ...entrada }}>
        <div
          style={{
            width: `${((dp - 1) / (DIAS - 1)) * 100}%`,
            height: "100%",
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color.marca}, ${color.acento})`,
          }}
        />
      </div>
    </>
  );
}

function Tile({ indice, kpi, s, dp }: { indice: number; kpi: Kpi; s: Series; dp: number }) {
  const entrada = useEntrada(4 + indice * 2);
  const columna = indice % 2;
  const fila = Math.floor(indice / 2);
  const serie = serieDe(kpi.clave, s);
  const valor = en(serie, dp);

  // Mejora contra la primera semana: solo los KPIs que se optimizan, y recien
  // cuando ya paso la semana.
  let chip: { texto: string; bien: boolean } | null = null;
  const referencia = en(serie, 7);
  if (kpi.mejora && valor !== null && referencia !== null && referencia > 0) {
    const delta = (valor - referencia) / referencia;
    if (Math.abs(delta) >= 0.01) {
      chip = {
        texto: `${delta < 0 ? "▼" : "▲"} ${Math.round(Math.abs(delta) * 100)}% vs. sem. 1`,
        bien: kpi.mejora === "baja" ? delta < 0 : delta > 0,
      };
    }
  }
  // La mejora contra la semana 1 no existe antes de que pase esa semana:
  // tampoco se pinta (ni se deja en el DOM con opacidad 0).
  const chipOpacidad = interpolate(dp, [7.6, 8.6], [0, 1], sujetar);
  if (chipOpacidad <= 0) chip = null;

  return (
    <div
      style={{
        ...caja(PAD + columna * (TILE_W + GX), GEO.tiles + fila * (TILE_H + GY), TILE_W, TILE_H),
        borderRadius: 18,
        background: color.velo,
        border: `1px solid ${color.borde}`,
        ...entrada,
      }}
    >
      <div style={{ position: "absolute", left: 16, top: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: fuente.display, fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: color.acentoSuave }}>
          {kpi.etiqueta}
        </span>
        {chip && (
          <span
            style={{
              fontFamily: fuente.texto,
              fontSize: 17,
              fontWeight: 600,
              color: chip.bien ? color.mejora : color.acentoSuave,
              background: chip.bien ? color.mejoraVelo : color.veloFuerte,
              borderRadius: 999,
              padding: "1px 9px",
              opacity: chipOpacidad,
              whiteSpace: "nowrap",
            }}
          >
            {chip.texto}
          </span>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 42,
          fontFamily: fuente.display,
          fontSize: 40,
          fontWeight: 700,
          lineHeight: "44px",
          color: color.texto,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
        }}
      >
        {valor === null ? "—" : kpi.formato(valor)}
      </div>
      <div style={{ position: "absolute", left: 16, top: 88, fontFamily: fuente.texto, fontSize: 19, lineHeight: "24px", color: color.tenue, whiteSpace: "nowrap" }}>
        {kpi.leyenda}
      </div>
    </div>
  );
}

function Grafico({ s, dp, datos }: { s: Series; dp: number; datos: MetricasDemo }) {
  const entrada = useEntrada(14);

  // CPR acumulado: escala propia (hacia abajo = mas barato).
  const lo = s.minCpr * 0.9;
  const hi = s.maxCpr * 1.03;
  const yCpr = (v: number) => BASE - 4 - ((v - lo) / (hi - lo)) * (ALTO_PLOT - 14);

  const ultimo = Math.min(DIAS - 1, Math.floor(dp - 1));
  const cprAhora = en(s.cpr, dp) ?? s.cpr[0];
  const xCola = PX0 + PITCH * (dp - 1) + PITCH / 2;
  const yCola = yCpr(cprAhora);
  const puntos = [
    ...Array.from({ length: ultimo + 1 }, (_, i) => `${xDia(i).toFixed(1)},${yCpr(s.cpr[i]).toFixed(1)}`),
    `${xCola.toFixed(1)},${yCola.toFixed(1)}`,
  ];

  const etiquetaX: Array<[number, "start" | "middle" | "end", string]> = [
    [1, "start", "Día 1"],
    [7, "middle", "7"],
    [14, "middle", "14"],
    [21, "middle", "21"],
    [DIAS, "end", "30"],
  ];

  // La etiqueta de optimizacion visible es la ultima que ya paso; cada una
  // aparece y deja paso a la siguiente con un fundido corto.
  const hitos = datos.hitos;

  return (
    <div
      style={{
        ...caja(PAD, GEO.grafico, GRAFICO_ANCHO, GEO.graficoAlto),
        borderRadius: 20,
        background: color.velo,
        border: `1px solid ${color.borde}`,
        ...entrada,
      }}
    >
      <svg width={GRAFICO_ANCHO} height={GEO.graficoAlto} viewBox={`0 0 ${GRAFICO_ANCHO} ${GEO.graficoAlto}`} style={{ display: "block" }} aria-hidden="true">
        <defs>
          <linearGradient id="panel-barra" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-brand-lift)" stopOpacity="0.95" />
            <stop offset="1" stopColor="var(--color-brand-lift)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Leyenda */}
        <rect x={PX0} y={20} width={12} height={12} rx={3} fill="var(--color-brand-lift)" />
        <text x={PX0 + 20} y={32} fontFamily={fuente.display} fontSize={20} fontWeight={700} fill={color.texto}>
          Resultados por día
        </text>
        <line x1={338} y1={26} x2={360} y2={26} stroke="var(--color-accent)" strokeWidth={3.5} strokeLinecap="round" />
        <text x={368} y={32} fontFamily={fuente.texto} fontSize={18} fill={color.tenue}>
          CPR acumulado
        </text>

        {/* Rejilla y base */}
        {[0, 1, 2, 3].map((k) => (
          <line
            key={k}
            x1={PX0}
            x2={GRAFICO_ANCHO - PX0}
            y1={TOP + (k * ALTO_PLOT) / 3}
            y2={TOP + (k * ALTO_PLOT) / 3}
            stroke={k === 3 ? "rgba(255,255,255,0.22)" : color.rejilla}
            strokeDasharray={k === 3 ? undefined : "3 5"}
          />
        ))}

        {/* Optimizaciones: linea punteada desde el dia en que ocurren */}
        {hitos.map((h) =>
          dp >= h.dia ? (
            <g key={`m-${h.dia}`}>
              <line x1={xDia(h.dia - 1)} x2={xDia(h.dia - 1)} y1={TOP - 4} y2={BASE} stroke="var(--color-accent)" strokeOpacity={0.55} strokeDasharray="3 4" />
              <rect x={xDia(h.dia - 1) - 4.5} y={TOP - 9} width={9} height={9} rx={2} transform={`rotate(45 ${xDia(h.dia - 1)} ${TOP - 4.5})`} fill="var(--color-accent)" />
            </g>
          ) : null
        )}

        {/* Barras: resultados por dia */}
        {s.resultadosDia.map((r, i) => {
          const crecimiento = interpolate(dp - i, [0, 1], [0, 1], sujetar);
          const h = (r / s.maxResultadosDia) * (ALTO_PLOT - 4) * crecimiento;
          const actual = i === ultimo;
          return (
            <rect
              key={i}
              x={xDia(i) - BARRA / 2}
              y={BASE - h}
              width={BARRA}
              height={Math.max(0, h)}
              rx={3}
              fill={actual ? "var(--color-accent-lift)" : "url(#panel-barra)"}
            />
          );
        })}

        {/* Linea del CPR acumulado y su punto */}
        <polyline points={puntos.join(" ")} fill="none" stroke="var(--color-accent)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <line x1={xCola} x2={xCola} y1={TOP - 4} y2={BASE} stroke="rgba(255,255,255,0.28)" />
        <circle cx={xCola} cy={yCola} r={6.5} fill="var(--color-accent)" stroke="#fff" strokeWidth={2.5} />
        <text
          x={Math.min(GRAFICO_ANCHO - 70, Math.max(PX0 + 36, xCola))}
          y={Math.max(TOP + 14, yCola - 14)}
          textAnchor="middle"
          fontFamily={fuente.display}
          fontSize={21}
          fontWeight={700}
          fill={color.texto}
          stroke="rgba(18,10,38,0.85)"
          strokeWidth={4}
          paintOrder="stroke"
        >
          {moneda(cprAhora)}
        </text>

        {/* Eje de dias */}
        {etiquetaX.map(([d, ancla, txt]) => (
          <text
            key={d}
            x={ancla === "start" ? PX0 : ancla === "end" ? GRAFICO_ANCHO - PX0 : xDia(d - 1)}
            y={206}
            textAnchor={ancla}
            fontFamily={fuente.texto}
            fontSize={17}
            fill={color.apagado}
          >
            {txt}
          </text>
        ))}

        {/* Optimizacion vigente */}
        {hitos.map((h, j) => {
          const entra = interpolate(dp - h.dia, [0, 0.5], [0, 1], sujetar);
          const sigue = hitos[j + 1];
          const sale = sigue ? interpolate(dp - sigue.dia, [0, 0.5], [0, 1], sujetar) : 0;
          const opacidad = entra * (1 - sale);
          if (opacidad <= 0) return null;
          return (
            <text
              key={`t-${h.dia}`}
              x={PX0}
              y={58}
              fontFamily={fuente.texto}
              fontSize={18}
              fontWeight={600}
              fill="var(--color-accent-lift)"
              opacity={opacidad}
            >
              {`Día ${h.dia} · ${h.texto}`}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function Totales({ s, dp, datos }: { s: Series; dp: number; datos: MetricasDemo }) {
  const entrada = useEntrada(18);
  const columnas: Array<{ x: number; w: number; valor: string; etiqueta: string }> = [
    { x: PAD, w: 112, valor: dolares(en(s.gasto, dp) ?? 0), etiqueta: "Inversión" },
    { x: PAD + 118, w: 206, valor: entero(en(s.resultados, dp) ?? 0), etiqueta: datos.resultado },
    { x: PAD + 330, w: 186, valor: entero(en(s.adquisiciones, dp) ?? 0), etiqueta: datos.adquisicion },
  ];
  return (
    <>
      {columnas.map((c, i) => (
        <div
          key={i}
          style={{
            ...caja(c.x, GEO.totales, c.w, 44),
            paddingLeft: i === 0 ? 0 : 14,
            borderLeft: i === 0 ? "none" : `1px solid ${color.borde}`,
            ...entrada,
          }}
        >
          <div
            style={{
              fontFamily: fuente.display,
              fontSize: 27,
              fontWeight: 700,
              lineHeight: "28px",
              color: color.texto,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {c.valor}
          </div>
          <div style={{ fontFamily: fuente.texto, fontSize: 18, lineHeight: "20px", color: color.tenue, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {c.etiqueta}
          </div>
        </div>
      ))}
    </>
  );
}

export function PanelMeta({ datos, semilla }: PropsPanelMeta) {
  const frame = useCurrentFrame();
  const series = useMemo(() => calcularSeries(datos, semilla), [datos, semilla]);
  const dp = diaEn(frame);
  const salida = interpolate(frame, [TOTAL_CUADROS - TIEMPOS.salida, TOTAL_CUADROS - 1], [1, 0], {
    ...sujetar,
    easing: curva.entrada,
  });

  return (
    <AbsoluteFill style={{ background: color.fondo, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: salida, transform: `scale(${0.985 + 0.015 * salida})` }}>
        <Cabecera datos={datos} />
        <Estado dp={dp} />
        {KPIS.map((kpi, i) => (
          <Tile key={kpi.clave} indice={i} kpi={kpi} s={series} dp={dp} />
        ))}
        <Grafico s={series} dp={dp} datos={datos} />
        <Totales s={series} dp={dp} datos={datos} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
