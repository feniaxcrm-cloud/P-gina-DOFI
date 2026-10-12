import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Megaphone, ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import { Baldosa, Burbuja, Esfera, Flota, Marca, onda, pulso } from "./piezas";
import { MARCAS } from "./iconos";
import { DURACION, color, fuente } from "./tema";

/**
 * Banner 2 · «PAUTA INTELIGENTE = VENTAS INTELIGENTES» (lado derecho,
 * 1287 x 757; el origen es el x = 790 del escenario).
 *
 * Lo que habia dibujado en la pieza original, ahora con codigo y movimiento:
 *  - el titulo en tipografia condensada (violeta y azul noche) con un destello;
 *  - las baldosas 3D de Meta, TikTok Ads Manager y Claude;
 *  - el "me gusta" azul, la burbuja roja con corazon, el grafico de barras y el
 *    megafono;
 *  - las esferas azules, doradas y violetas, y las orbitas finas que las
 *    cruzan (con una luz que corre por ellas).
 *
 * Mismo fondo blanco con lila y mismos colores que la pieza. Bucle de
 * DURACION cuadros.
 */

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ESFERAS = [
  { x: 109, y: 104, r: 28, t: "azul", f: 0.2 },
  { x: 61, y: 224, r: 18, t: "azul", f: 1.1 },
  { x: 86, y: 426, r: 24, t: "oro", f: 2.0 },
  { x: 158, y: 480, r: 16, t: "violeta", f: 3.0 },
  { x: 366, y: 345, r: 15, t: "azul", f: 4.2 },
  { x: 522, y: 424, r: 20, t: "azul", f: 5.1 },
  { x: 411, y: 391, r: 16, t: "violeta", f: 0.6 },
  { x: 775, y: 473, r: 18, t: "oro", f: 1.7 },
  { x: 578, y: 567, r: 18, t: "oro", f: 2.6 },
  { x: 169, y: 634, r: 20, t: "oro", f: 3.7 },
  { x: 505, y: 629, r: 12, t: "violeta", f: 4.6 },
  { x: 58, y: 556, r: 36, t: "azul", f: 5.5 },
  { x: 1072, y: 220, r: 16, t: "violeta", f: 0.9 },
  { x: 1092, y: 624, r: 24, t: "oro", f: 2.2 },
] as const;

const ORBITAS = [
  // Alrededor de Meta.
  { cx: 215, cy: 300, rx: 300, ry: 118, giro: -14, ini: 0.0 },
  // Alrededor de TikTok.
  { cx: 392, cy: 520, rx: 262, ry: 74, giro: -6, ini: 0.3 },
  // Alrededor de Claude.
  { cx: 940, cy: 548, rx: 290, ry: 104, giro: 10, ini: 0.6 },
  // La que cruza todo el banner.
  { cx: 640, cy: 370, rx: 640, ry: 190, giro: 6, ini: 0.15 },
];

export function EscenaPauta({ lineas }: { lineas: string[] }) {
  const frame = useCurrentFrame();
  const [linea1, linea2] = [lineas[0] ?? "", lineas[1] ?? ""];
  const [palabra1, ...resto] = linea2.split(" ");
  const palabra2 = resto.join(" ");
  const destello = interpolate(frame, [30, 100], [-40, 140], sujetar);

  const titulo = (px: number, relleno: string): React.CSSProperties => ({
    fontFamily: fuente.condensada,
    fontWeight: 900,
    fontVariationSettings: '"wdth" 66',
    fontSize: px,
    textTransform: "uppercase",
    letterSpacing: "-0.005em",
    lineHeight: 0.9,
    backgroundImage: `linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.75) 50%, transparent 60%), ${relleno}`,
    backgroundSize: "250% 100%, 100% 100%",
    backgroundPosition: `${destello}% 0, 0 0`,
    backgroundRepeat: "no-repeat",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Las orbitas finas. */}
      <svg width={1287} height={757} viewBox="0 0 1287 757" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <defs>
          <linearGradient id="pauta-orbita" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8A63FF" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#C58BFF" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FF8FC9" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {ORBITAS.map((o, i) => (
          <g key={i} transform={`translate(${o.cx} ${o.cy}) rotate(${o.giro})`}>
            <ellipse rx={o.rx} ry={o.ry} fill="none" stroke="url(#pauta-orbita)" strokeWidth={1.6} opacity={0.5} />
            <ellipse
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke="url(#pauta-orbita)"
              strokeWidth={2.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.16 0.84"
              strokeDashoffset={-(frame / DURACION + o.ini) % 1}
            />
          </g>
        ))}
      </svg>

      {/* Esferas. */}
      {ESFERAS.map((e, i) => (
        <Esfera key={i} x={e.x} y={e.y} r={e.r} tono={e.t} frame={frame} fase={e.f} amp={10} k={i % 3 === 0 ? 2 : 1} />
      ))}

      {/* Meta */}
      <Flota frame={frame} x={210} y={302} fase={0.3} amp={11} vaiven={2}>
        <Baldosa
          tam={218}
          claro="#2347DD"
          oscuro="#0B1260"
          canto="#2A62F0"
          giro={-6}
          rx={14}
          ry={-16}
          grosor={22}
          radio={0.24}
          brillo={0.45}
          fondo="linear-gradient(145deg, #2347DD 0%, #0B1260 52%, #070B3E 100%)"
        >
          <svg width={130} height={130} viewBox="0 0 24 24" aria-hidden="true" style={{ filter: "drop-shadow(0 0 14px rgba(40,200,255,0.75))" }}>
            <defs>
              <linearGradient id="pauta-meta" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#5CF0FF" />
                <stop offset="1" stopColor="#1B9BFF" />
              </linearGradient>
            </defs>
            <path d={MARCAS.meta} fill="url(#pauta-meta)" />
          </svg>
        </Baldosa>
      </Flota>

      {/* TikTok Ads Manager */}
      <Flota frame={frame} x={385} y={515} fase={2.4} amp={9} vaiven={2}>
        <Baldosa
          tam={176}
          claro="#2A1A3E"
          oscuro="#0B0714"
          canto="#C4207A"
          giro={-8}
          rx={16}
          ry={14}
          grosor={16}
          radio={0.24}
          brillo={0.3}
          fondo="linear-gradient(150deg, #2E1D44 0%, #120A1F 55%, #08050F 100%)"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ position: "relative", display: "block", width: 66, height: 66 }}>
              <span style={{ position: "absolute", inset: 0, transform: "translate(-3px,-2px)" }}>
                <Marca d={MARCAS.tiktok} tam={66} relleno="#25F4EE" />
              </span>
              <span style={{ position: "absolute", inset: 0, transform: "translate(3px,2px)" }}>
                <Marca d={MARCAS.tiktok} tam={66} relleno="#FE2C55" />
              </span>
              <span style={{ position: "absolute", inset: 0 }}>
                <Marca d={MARCAS.tiktok} tam={66} />
              </span>
            </span>
            <span style={{ fontFamily: fuente.titulo, fontWeight: 800, fontSize: 30, color: "#fff", lineHeight: 1 }}>TikTok</span>
            <span style={{ fontFamily: fuente.titulo, fontWeight: 500, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.2 }}>Ads Manager</span>
          </div>
        </Baldosa>
      </Flota>

      {/* Claude */}
      <Flota frame={frame} x={941} y={546} fase={4.0} amp={10} vaiven={2}>
        <Baldosa
          tam={204}
          claro="#FFFFFF"
          oscuro="#F1E9DD"
          canto="#E8902C"
          giro={-12}
          rx={12}
          ry={-12}
          grosor={22}
          radio={0.2}
          brillo={0.6}
          fondo="linear-gradient(145deg, #FFFFFF 0%, #FBF6EE 55%, #F0E7DA 100%)"
          borde="rgba(232,144,44,0.5)"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Marca d={MARCAS.claude} tam={86} relleno="#D97757" />
            <span style={{ fontFamily: fuente.serif, fontWeight: 500, fontSize: 44, color: "#1F1E1D", lineHeight: 1 }}>Claude</span>
          </div>
        </Baldosa>
      </Flota>

      {/* "Me gusta" azul */}
      <Flota frame={frame} x={359} y={187} fase={1.0} amp={9} vaiven={4} escala={1 + 0.08 * pulso(frame, 60, 20)}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "radial-gradient(circle at 32% 26%, #6FA8FF 0%, #2F6BFF 45%, #1237C8 100%)",
            boxShadow: "0 14px 24px rgba(20,40,160,0.4), inset 0 3px 0 rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThumbsUp size={54} weight="fill" color="#fff" />
        </div>
      </Flota>

      {/* Corazon rojo */}
      <Flota frame={frame} x={1146} y={400} fase={2.0} amp={10} vaiven={4} escala={1 + 0.1 * pulso(frame, 150, 20)}>
        <Burbuja tam={104} tono="rojo" giro={4} />
      </Flota>

      {/* Grafico de barras */}
      <Flota frame={frame} x={1194} y={535} fase={3.1} amp={9} vaiven={3}>
        <Baldosa tam={86} claro="#6A5CFF" oscuro="#2B1FB0" canto="#1B1280" giro={-4} rx={10} ry={-10} grosor={12} radio={0.22}>
          <svg width={50} height={50} viewBox="0 0 50 50" aria-hidden="true">
            <rect x={5} y={28} width={9} height={17} rx={2.5} fill="#fff" />
            <rect x={20} y={18} width={9} height={27} rx={2.5} fill="#fff" />
            <rect x={35} y={6} width={9} height={39} rx={2.5} fill="#fff" />
          </svg>
        </Baldosa>
      </Flota>

      {/* Megafono */}
      <Flota frame={frame} x={666} y={629} fase={5.2} amp={9} vaiven={5} escala={1 + 0.06 * pulso(frame, 190, 24)}>
        <div style={{ transform: "rotate(-24deg)", filter: "drop-shadow(0 12px 14px rgba(15,40,160,0.4))" }}>
          <Megaphone size={132} weight="fill" color="#1F5CFF" />
        </div>
      </Flota>

      {/* El titulo. */}
      <div style={{ position: "absolute", left: 470, top: 108 }}>
        <div style={titulo(64, color.tintaAzul)}>{linea1}</div>
        <div style={{ marginTop: 14 }}>
          <div style={titulo(114, color.tintaNoche)}>{palabra1}</div>
          <div style={{ ...titulo(114, color.tintaNoche), marginTop: -2 }}>{palabra2}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
