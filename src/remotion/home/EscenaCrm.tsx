import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Flota, Marca, enCurva, onda, type Punto } from "./piezas";
import { MARCAS } from "./iconos";
import { DURACION, color, fuente } from "./tema";

/**
 * Banner 3 · «con RESPUESTAS RÁPIDAS hay CLIENTES FELICES» (lado izquierdo,
 * 980 x 757).
 *
 * Lo que habia dibujado en la pieza original, ahora con codigo y movimiento:
 *  - el titulo (blanco y celeste) con la linea de luz entre las dos frases;
 *  - la red de herramientas: GHL al centro y, conectadas a el con hilos de luz
 *    violeta, WhatsApp, Facebook, Instagram, TikTok, la IA, Kommo y n8n, cada
 *    una en su baldosa de vidrio oscuro con borde de neon;
 *  - los puntos de luz que viajan por los hilos y el polvo de luz del fondo.
 *
 * Mismo negro azulado y mismo violeta neon que la pieza. Bucle de DURACION
 * cuadros.
 */

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Nodo = { x: number; y: number; tam: number; fase: number };

const GHL: Nodo = { x: 447, y: 473, tam: 158, fase: 0 };

const NODOS = {
  whatsapp: { x: 296, y: 333, tam: 108, fase: 0.8 },
  facebook: { x: 570, y: 324, tam: 108, fase: 1.9 },
  instagram: { x: 778, y: 361, tam: 108, fase: 3.0 },
  tiktok: { x: 754, y: 489, tam: 106, fase: 4.0 },
  ia: { x: 154, y: 442, tam: 108, fase: 5.1 },
  kommo: { x: 198, y: 591, tam: 120, fase: 0.4 },
  n8n: { x: 445, y: 640, tam: 112, fase: 2.5 },
} satisfies Record<string, Nodo>;

/** Un hilo de luz de GHL a un nodo: curva con curvatura propia. */
function hilo(a: Nodo, b: Nodo, curva: number): readonly [Punto, Punto, Punto, Punto] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return [
    { x: a.x, y: a.y },
    { x: a.x + dx * 0.15 - dy * curva, y: a.y + dy * 0.15 + dx * curva * 0.4 },
    { x: b.x - dx * 0.35 - dy * curva * 0.3, y: b.y - dy * 0.35 + dx * curva * 0.2 },
    { x: b.x, y: b.y },
  ];
}

const HILOS = [
  { id: "whatsapp", c: hilo(GHL, NODOS.whatsapp, 0.32), ini: 0.0 },
  { id: "facebook", c: hilo(GHL, NODOS.facebook, -0.28), ini: 0.17 },
  { id: "instagram", c: hilo(GHL, NODOS.instagram, -0.34), ini: 0.33 },
  { id: "tiktok", c: hilo(GHL, NODOS.tiktok, -0.1), ini: 0.5 },
  { id: "ia", c: hilo(GHL, NODOS.ia, 0.22), ini: 0.66 },
  { id: "kommo", c: hilo(GHL, NODOS.kommo, -0.3), ini: 0.8 },
  { id: "n8n", c: hilo(GHL, NODOS.n8n, 0.05), ini: 0.92 },
] as const;

const d = ([a, b, c, e]: readonly [Punto, Punto, Punto, Punto]) => `M ${a.x} ${a.y} C ${b.x} ${b.y} ${c.x} ${c.y} ${e.x} ${e.y}`;

/** Polvo de luz: puntos deterministas (sin azar) repartidos en tres bandas. */
const POLVO = Array.from({ length: 120 }, (_, i) => {
  const banda = i % 3;
  const t = (i * 0.61803398875) % 1;
  const x = t * 1000 - 10;
  const base = [250, 520, 660][banda];
  const y = base + Math.sin(t * Math.PI * (2.2 + banda)) * (90 + banda * 25) + (((i * 37) % 17) - 8) * 5;
  return { x, y, r: 0.8 + ((i * 13) % 7) * 0.22, fase: (i * 1.7) % (Math.PI * 2), k: 1 + (i % 3) };
});

function Pastilla({ nodo, brillo = 1, children, borde = "rgba(150,110,255,0.6)", frame }: { nodo: Nodo; brillo?: number; borde?: string; children: React.ReactNode; frame: number }) {
  const respira = 0.8 + 0.2 * onda(frame, nodo.fase, 2);
  return (
    <Flota frame={frame} x={nodo.x} y={nodo.y} fase={nodo.fase} amp={7} vaiven={1.2} k={1}>
      <div
        style={{
          width: nodo.tam,
          height: nodo.tam,
          borderRadius: nodo.tam * 0.24,
          background: "linear-gradient(160deg, rgba(36,26,84,0.96) 0%, rgba(8,6,30,0.97) 100%)",
          border: `${nodo.tam > 140 ? 3 : 2}px solid ${borde}`,
          boxShadow: `0 0 ${26 * brillo * respira}px rgba(120,70,255,${0.5 * brillo}), inset 0 0 ${20 * brillo}px rgba(110,70,255,0.28), inset 0 2px 0 rgba(255,255,255,0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </Flota>
  );
}

export function EscenaCrm({ lineas }: { lineas: string[] }) {
  const frame = useCurrentFrame();
  const [l0, l1, l2, l3] = [lineas[0] ?? "", lineas[1] ?? "", lineas[2] ?? "", lineas[3] ?? ""];
  const brilloLinea = 0.75 + 0.25 * onda(frame, 0, 2);
  const destello = interpolate(frame, [20, 90], [-40, 140], sujetar);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: fuente.titulo }}>
      <svg width={980} height={757} viewBox="0 0 980 757" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <defs>
          <linearGradient id="crm-neon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8A5BFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#A77BFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8A5BFF" stopOpacity="0" />
          </linearGradient>
          <filter id="crm-brillo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {/* Las ondas de luz del fondo. */}
        {[
          "M -30 590 C 150 380 330 700 540 560 S 860 420 1010 520",
          "M -30 690 C 200 560 380 740 600 650 S 880 560 1010 640",
          "M 120 -10 C 300 120 520 20 760 120 S 960 80 1010 40",
        ].map((p, i) => (
          <g key={i}>
            <path d={p} fill="none" stroke="#7B4DFF" strokeWidth={5} opacity={0.35 * brilloLinea} filter="url(#crm-brillo)" />
            <path d={p} fill="none" stroke="url(#crm-neon)" strokeWidth={1.4} opacity={0.8} />
          </g>
        ))}
        {/* Los hilos de GHL a cada herramienta. */}
        {HILOS.map((h) => (
          <g key={h.id}>
            <path d={d(h.c)} fill="none" stroke="#7B4DFF" strokeWidth={6} opacity={0.35} filter="url(#crm-brillo)" />
            <path d={d(h.c)} fill="none" stroke="#A98BFF" strokeWidth={1.8} opacity={0.75} />
            <path
              d={d(h.c)}
              fill="none"
              stroke="#E6DCFF"
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.14 0.86"
              strokeDashoffset={-(((frame / DURACION + h.ini) % 1) * 1)}
            />
          </g>
        ))}
      </svg>

      {/* Polvo de luz. */}
      {POLVO.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.r * 2,
            height: p.r * 2,
            borderRadius: "50%",
            background: i % 5 === 0 ? "#D9C8FF" : "#9A72FF",
            opacity: 0.25 + 0.55 * Math.abs(onda(frame, p.fase, p.k)),
            boxShadow: i % 5 === 0 ? "0 0 8px 2px rgba(170,130,255,0.7)" : undefined,
          }}
        />
      ))}
      {/* Puntos de luz que viajan por los hilos. */}
      {HILOS.map((h, i) => {
        const t = (frame / DURACION + h.ini) % 1;
        const p = enCurva(h.c, t);
        return (
          <span
            key={h.id}
            style={{
              position: "absolute",
              left: p.x - 5,
              top: p.y - 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#fff",
              opacity: Math.min(1, t / 0.1, (1 - t) / 0.1),
              boxShadow: "0 0 14px 4px rgba(160,120,255,0.9)",
              zIndex: i,
            }}
          />
        );
      })}

      {/* Las herramientas. */}
      <Pastilla nodo={NODOS.whatsapp} frame={frame}>
        <Marca d={MARCAS.whatsapp} tam={66} relleno="#25D366" />
      </Pastilla>
      <Pastilla nodo={NODOS.facebook} frame={frame}>
        <span
          style={{
            width: 66,
            height: 66,
            borderRadius: "50%",
            background: "#1877F2",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span style={{ fontFamily: fuente.titulo, fontWeight: 800, fontSize: 70, lineHeight: 0.9, color: "#fff", marginBottom: -6, marginLeft: 6 }}>f</span>
        </span>
      </Pastilla>
      <Pastilla nodo={NODOS.instagram} frame={frame}>
        <svg width={66} height={66} viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="crm-ig" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FEDA75" />
              <stop offset="0.35" stopColor="#FA7E1E" />
              <stop offset="0.6" stopColor="#D62976" />
              <stop offset="1" stopColor="#962FBF" />
            </linearGradient>
          </defs>
          <path d={MARCAS.instagram} fill="url(#crm-ig)" />
        </svg>
      </Pastilla>
      <Pastilla nodo={NODOS.tiktok} frame={frame}>
        <span style={{ position: "relative", display: "block", width: 58, height: 58 }}>
          <span style={{ position: "absolute", inset: 0, transform: "translate(-3px,-2px)" }}>
            <Marca d={MARCAS.tiktok} tam={58} relleno="#25F4EE" />
          </span>
          <span style={{ position: "absolute", inset: 0, transform: "translate(3px,2px)" }}>
            <Marca d={MARCAS.tiktok} tam={58} relleno="#FE2C55" />
          </span>
          <span style={{ position: "absolute", inset: 0 }}>
            <Marca d={MARCAS.tiktok} tam={58} />
          </span>
        </span>
      </Pastilla>
      <Pastilla nodo={NODOS.ia} frame={frame}>
        {/* La IA: tres lazos entrecruzados (la marca de OpenAI no esta en simple-icons). */}
        <svg width={72} height={72} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.5} aria-hidden="true">
          {[0, 60, 120].map((g) => (
            <ellipse key={g} cx={12} cy={12} rx={8.4} ry={4.3} transform={`rotate(${g} 12 12)`} />
          ))}
          <circle cx={12} cy={12} r={1.6} fill="#fff" stroke="none" />
        </svg>
      </Pastilla>
      <Pastilla nodo={NODOS.kommo} frame={frame}>
        <svg width={70} height={70} viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="crm-kommo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#B7A0FF" />
              <stop offset="1" stopColor="#6A4DFF" />
            </linearGradient>
          </defs>
          <path d="M5 3.5 h4.4 v6.2 l7.6 -6.2 h5 l-9 7.6 L22.4 20.5 h-5.4 l-6.6 -6.7 -1 .9 V20.5 H5 Z" fill="url(#crm-kommo)" />
        </svg>
      </Pastilla>
      <Pastilla nodo={NODOS.n8n} frame={frame}>
        <Marca d={MARCAS.n8n} tam={62} relleno="#EA4B71" />
        <span style={{ fontFamily: fuente.titulo, fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1, marginTop: 2 }}>n8n</span>
      </Pastilla>
      {/* GHL, el centro. */}
      <Pastilla nodo={GHL} frame={frame} brillo={1.5} borde="#A77BFF">
        <svg width={92} height={64} viewBox="0 0 92 64" aria-hidden="true">
          {[
            { x: 6, c: "#F9B72D", h: 44 },
            { x: 34, c: "#2F7BFF", h: 56 },
            { x: 62, c: "#2FB24C", h: 44 },
          ].map((f) => (
            <g key={f.x} transform={`translate(${f.x} ${60 - f.h})`}>
              <path d={`M12 0 L24 14 H17 V${f.h} H7 V14 H0 Z`} fill={f.c} />
            </g>
          ))}
        </svg>
        <span style={{ fontFamily: fuente.titulo, fontWeight: 800, fontSize: 40, color: "#fff", lineHeight: 1, letterSpacing: "0.02em" }}>GHL</span>
      </Pastilla>

      {/* El titulo. */}
      <div style={{ position: "absolute", left: 78, top: 24, color: color.blanco }}>
        <div style={{ fontSize: 42, fontWeight: 400, lineHeight: 1.05 }}>{l0}</div>
        <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: "-0.012em", lineHeight: 1.05, marginTop: 2, textShadow: "0 2px 24px rgba(140,100,255,0.35)" }}>{l1}</div>
        <div style={{ fontSize: 42, fontWeight: 400, lineHeight: 1.05, marginTop: 4 }}>{l2}</div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: "-0.015em",
            lineHeight: 1.05,
            marginTop: 8,
            backgroundImage: `linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.95) 50%, transparent 62%), ${color.ciano}`,
            backgroundSize: "250% 100%, 100% 100%",
            backgroundPosition: `${destello}% 0, 0 0`,
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 16px rgba(40,170,255,0.45))",
          }}
        >
          {l3}
        </div>
      </div>
      {/* La linea de luz entre "hay" y el celeste. */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 156,
          width: 560,
          height: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, rgba(140,100,255,0), #B79CFF 50%, rgba(140,100,255,0))",
          opacity: brilloLinea,
          boxShadow: "0 0 18px 4px rgba(140,100,255,0.65)",
        }}
      />
    </AbsoluteFill>
  );
}
