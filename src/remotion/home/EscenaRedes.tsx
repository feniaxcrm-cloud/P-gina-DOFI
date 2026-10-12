import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Baldosa, Burbuja, Chispa, Cubo, Flota, Marca, enCurva, onda, pulso, type Punto } from "./piezas";
import { MARCAS } from "./iconos";
import { DURACION, color, fuente } from "./tema";

/**
 * Banner 1 · «Redes Sociales que SÍ VENDEN» (lado izquierdo, 1010 x 757).
 *
 * Lo que habia dibujado en la pieza original, ahora con codigo y movimiento:
 *  - el titulo (blanco y naranja) con un destello que lo recorre;
 *  - la flecha dorada que sube con su estela de luz y los puntos que viajan
 *    por ella;
 *  - las cinco apps (Facebook, Instagram, TikTok, WhatsApp y Messenger) como
 *    baldosas 3D que flotan;
 *  - las burbujas de "me gusta" y los cubos naranjas (los del fondo, borrosos:
 *    profundidad de campo).
 *
 * Mismo morado y mismo naranja que la pieza (el fondo lo pone el banner). El
 * bucle es de DURACION cuadros: todo lo que se mueve da vueltas exactas.
 */

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// La ruta de la flecha: dos curvas cubicas que se empalman, de abajo a la izquierda a la punta.
const RUTA: readonly [readonly [Punto, Punto, Punto, Punto], readonly [Punto, Punto, Punto, Punto]] = [
  [
    { x: 40, y: 690 },
    { x: 300, y: 712 },
    { x: 480, y: 610 },
    { x: 612, y: 502 },
  ],
  [
    { x: 612, y: 502 },
    { x: 744, y: 394 },
    { x: 820, y: 312 },
    { x: 906, y: 240 },
  ],
];
const D_RUTA = `M ${RUTA[0][0].x} ${RUTA[0][0].y} C ${RUTA[0][1].x} ${RUTA[0][1].y} ${RUTA[0][2].x} ${RUTA[0][2].y} ${RUTA[0][3].x} ${RUTA[0][3].y} C ${RUTA[1][1].x} ${RUTA[1][1].y} ${RUTA[1][2].x} ${RUTA[1][2].y} ${RUTA[1][3].x} ${RUTA[1][3].y}`;

/** Un punto de la ruta completa, t de 0 a 1. */
function enRuta(t: number): Punto {
  const u = Math.min(0.9999, Math.max(0, t)) * 2;
  return u < 1 ? enCurva(RUTA[0], u) : enCurva(RUTA[1], u - 1);
}

const TILES = {
  facebook: { x: 265, y: 466, tam: 150, giro: -16, rx: 8, ry: -16, fase: 0.2 },
  instagram: { x: 439, y: 376, tam: 148, giro: -9, rx: 10, ry: -12, fase: 1.6 },
  tiktok: { x: 643, y: 462, tam: 150, giro: 12, rx: 8, ry: 14, fase: 2.9 },
  whatsapp: { x: 504, y: 588, tam: 152, giro: -6, rx: 6, ry: 12, fase: 4.1 },
  messenger: { x: 300, y: 630, tam: 138, giro: -12, rx: 8, ry: -10, fase: 5.3 },
} as const;

const CUBOS = [
  { x: 52, y: 452, tam: 62, giro: 22, blur: 1.5, tono: 0, fase: 0.4 },
  { x: 715, y: 348, tam: 50, giro: -18, blur: 0, tono: 1, fase: 1.4 },
  { x: 850, y: 448, tam: 56, giro: 28, blur: 0, tono: 2, fase: 2.4 },
  { x: 678, y: 612, tam: 52, giro: -24, blur: 0, tono: 1, fase: 3.1 },
  { x: 99, y: 586, tam: 124, giro: 14, blur: 7, tono: 0, fase: 4.0 },
  { x: 160, y: 700, tam: 62, giro: -20, blur: 1.5, tono: 2, fase: 5.0 },
  { x: 489, y: 732, tam: 92, giro: 10, blur: 6, tono: 1, fase: 0.9 },
  { x: 640, y: 740, tam: 112, giro: -12, blur: 8, tono: 0, fase: 2.0 },
  { x: 930, y: 590, tam: 70, giro: 16, blur: 4, tono: 2, fase: 3.6 },
];

export function EscenaRedes({ lineas }: { lineas: string[] }) {
  const frame = useCurrentFrame();
  const [linea1, linea2] = [lineas[0] ?? "", lineas[1] ?? ""];

  // El destello del titulo cruza una vez por vuelta.
  const destello = interpolate(frame, [20, 80], [-40, 140], sujetar);
  // El resplandor de la punta de la flecha respira.
  const punta = 0.75 + 0.25 * onda(frame, 0, 2);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: fuente.titulo }}>
      {/* Nubes de luz que se mueven despacio (dan profundidad al morado). */}
      <div
        style={{
          position: "absolute",
          left: 320 + onda(frame, 0, 1) * 40,
          top: 120 + onda(frame, 1, 1) * 24,
          width: 560,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(190,90,255,0.30), rgba(190,90,255,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -80 + onda(frame, 2, 1) * 30,
          top: 420 + onda(frame, 3, 1) * 20,
          width: 520,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,90,170,0.22), rgba(255,90,170,0))",
        }}
      />

      {/* Cubos del fondo (los borrosos). */}
      {CUBOS.filter((c) => c.blur > 0).map((c, i) => (
        <Flota key={`f${i}`} frame={frame} x={c.x} y={c.y} fase={c.fase} amp={14} vaiven={6} k={1}>
          <Cubo tam={c.tam} giro={c.giro} desenfoque={c.blur} tono={c.tono} />
        </Flota>
      ))}

      {/* La estela de la flecha. */}
      <svg width={1010} height={757} viewBox="0 0 1010 757" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <defs>
          <linearGradient id="redes-estela" gradientUnits="userSpaceOnUse" x1="40" y1="690" x2="906" y2="240">
            <stop offset="0" stopColor="#FF4FA3" stopOpacity="0" />
            <stop offset="0.35" stopColor="#FF4FA3" stopOpacity="0.85" />
            <stop offset="0.7" stopColor="#FF9A2E" />
            <stop offset="1" stopColor="#FFF1B0" />
          </linearGradient>
          <linearGradient id="redes-hilo" gradientUnits="userSpaceOnUse" x1="40" y1="690" x2="906" y2="240">
            <stop offset="0" stopColor="#C77BFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#E7A0FF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFD38A" />
          </linearGradient>
          <linearGradient id="redes-punta" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF4C2" />
            <stop offset="0.5" stopColor="#FFB23A" />
            <stop offset="1" stopColor="#FF7A12" />
          </linearGradient>
          <filter id="redes-brillo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {/* halo ancho */}
        <path d={D_RUTA} fill="none" stroke="url(#redes-estela)" strokeWidth={56} strokeLinecap="round" opacity={0.6} filter="url(#redes-brillo)" />
        {/* cuerpo de la estela: varias capas que se afinan */}
        <path d={D_RUTA} fill="none" stroke="url(#redes-estela)" strokeWidth={26} strokeLinecap="round" />
        <path d={D_RUTA} fill="none" stroke="#FFF6D6" strokeWidth={6.5} strokeLinecap="round" opacity={0.95} strokeDasharray="1 0" />
        {/* hilos de luz que se enroscan alrededor de las apps */}
        {[
          "M 70 640 C 300 668 470 566 596 470 C 708 386 804 300 890 252",
          "M 120 560 C 230 430 420 470 560 540 C 690 604 790 470 840 340",
          "M 200 700 C 420 700 640 600 720 440 C 770 340 840 290 900 258",
          "M 330 560 C 380 470 560 500 700 430 C 790 386 840 330 880 280",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#redes-hilo)"
            strokeWidth={3.4 - i * 0.4}
            strokeLinecap="round"
            strokeDasharray="220 40 80 30"
            strokeDashoffset={-(frame / DURACION) * 370 * (i % 2 === 0 ? 1 : 2)}
            opacity={1 - i * 0.1}
          />
        ))}
        {/* la punta de la flecha */}
        <g transform="translate(906 240) rotate(-40)" opacity={0.7 + 0.3 * punta}>
          <path d="M 0 0 L -80 -40 L -56 0 L -80 40 Z" fill="url(#redes-punta)" filter="url(#redes-brillo)" transform="scale(1.5)" />
          <path d="M 0 0 L -80 -40 L -56 0 L -80 40 Z" fill="url(#redes-punta)" transform="scale(1.3)" />
        </g>
      </svg>

      {/* Puntos de luz que viajan por la estela. */}
      {Array.from({ length: 9 }, (_, i) => {
        const t = (((frame / DURACION) * (i % 3 === 0 ? 1 : 1) + i / 9) % 1 + 1) % 1;
        const p = enRuta(t);
        const vis = Math.min(1, t / 0.12, (1 - t) / 0.1);
        return <Chispa key={i} x={p.x + Math.sin(i * 2.1) * 10} y={p.y + Math.cos(i * 1.7) * 10} r={i % 2 ? 4.5 : 3.2} opacidad={vis} />;
      })}

      {/* Las apps. */}
      <Flota frame={frame} x={TILES.facebook.x} y={TILES.facebook.y} fase={TILES.facebook.fase} amp={11} vaiven={2.5}>
        <Baldosa tam={TILES.facebook.tam} claro="#4A98FF" oscuro="#0A55E8" canto="#0B3DAE" giro={TILES.facebook.giro} rx={TILES.facebook.rx} ry={TILES.facebook.ry}>
          <span style={{ fontFamily: fuente.titulo, fontWeight: 800, fontSize: 118, lineHeight: 1, color: "#fff", transform: "translate(6px, 8px)" }}>f</span>
        </Baldosa>
      </Flota>
      <Flota frame={frame} x={TILES.instagram.x} y={TILES.instagram.y} fase={TILES.instagram.fase} amp={12} vaiven={2.5}>
        <Baldosa
          tam={TILES.instagram.tam}
          claro="#FDDC6B"
          oscuro="#962FBF"
          canto="#6B1FA0"
          giro={TILES.instagram.giro}
          rx={TILES.instagram.rx}
          ry={TILES.instagram.ry}
          fondo="linear-gradient(40deg, #FEDA75 0%, #FA7E1E 26%, #D62976 54%, #962FBF 78%, #4F5BD5 100%)"
        >
          <Marca d={MARCAS.instagram} tam={TILES.instagram.tam * 0.6} />
        </Baldosa>
      </Flota>
      <Flota frame={frame} x={TILES.tiktok.x} y={TILES.tiktok.y} fase={TILES.tiktok.fase} amp={10} vaiven={2.5}>
        <Baldosa tam={TILES.tiktok.tam} claro="#2B2B35" oscuro="#000000" canto="#0A0A12" giro={TILES.tiktok.giro} rx={TILES.tiktok.rx} ry={TILES.tiktok.ry}>
          <span style={{ position: "relative", display: "block", width: TILES.tiktok.tam * 0.56, height: TILES.tiktok.tam * 0.56 }}>
            <span style={{ position: "absolute", inset: 0, transform: "translate(-4px,-3px)" }}>
              <Marca d={MARCAS.tiktok} tam={TILES.tiktok.tam * 0.56} relleno="#25F4EE" />
            </span>
            <span style={{ position: "absolute", inset: 0, transform: "translate(4px,3px)" }}>
              <Marca d={MARCAS.tiktok} tam={TILES.tiktok.tam * 0.56} relleno="#FE2C55" />
            </span>
            <span style={{ position: "absolute", inset: 0 }}>
              <Marca d={MARCAS.tiktok} tam={TILES.tiktok.tam * 0.56} />
            </span>
          </span>
        </Baldosa>
      </Flota>
      <Flota frame={frame} x={TILES.whatsapp.x} y={TILES.whatsapp.y} fase={TILES.whatsapp.fase} amp={12} vaiven={2.5}>
        <Baldosa tam={TILES.whatsapp.tam} claro="#4DE784" oscuro="#12A84A" canto="#0B7D36" giro={TILES.whatsapp.giro} rx={TILES.whatsapp.rx} ry={TILES.whatsapp.ry}>
          <Marca d={MARCAS.whatsapp} tam={TILES.whatsapp.tam * 0.66} />
        </Baldosa>
      </Flota>
      <Flota frame={frame} x={TILES.messenger.x} y={TILES.messenger.y} fase={TILES.messenger.fase} amp={9} vaiven={2.5}>
        <Baldosa tam={TILES.messenger.tam} claro="#FFFFFF" oscuro="#E4D9FB" canto="#B9AAE6" giro={TILES.messenger.giro} rx={TILES.messenger.rx} ry={TILES.messenger.ry} brillo={0.7}>
          <svg width={TILES.messenger.tam * 0.62} height={TILES.messenger.tam * 0.62} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id="redes-messenger" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#FF5A8C" />
                <stop offset="0.45" stopColor="#A33BFF" />
                <stop offset="1" stopColor="#1E8CFF" />
              </linearGradient>
            </defs>
            <path d={MARCAS.messenger} fill="url(#redes-messenger)" />
          </svg>
        </Baldosa>
      </Flota>

      {/* Burbujas de "me gusta". */}
      <Flota frame={frame} x={146} y={364} fase={0.8} amp={10} vaiven={4} escala={1 + 0.1 * pulso(frame, 40, 22)}>
        <Burbuja tam={88} giro={-12} />
      </Flota>
      <Flota frame={frame} x={822} y={592} fase={3.4} amp={12} vaiven={4} escala={1 + 0.1 * pulso(frame, 150, 22)}>
        <Burbuja tam={140} giro={8} />
      </Flota>

      {/* Cubos nitidos (los del frente). */}
      {CUBOS.filter((c) => c.blur === 0).map((c, i) => (
        <Flota key={`n${i}`} frame={frame} x={c.x} y={c.y} fase={c.fase} amp={9} vaiven={8} k={2}>
          <Cubo tam={c.tam} giro={c.giro} tono={c.tono} />
        </Flota>
      ))}

      {/* El titulo. */}
      <div style={{ position: "absolute", left: 118, top: 72, color: color.blanco }}>
        <div style={{ fontSize: 74, fontWeight: 600, letterSpacing: "-0.012em", lineHeight: 1.12, textShadow: "0 4px 24px rgba(40,0,90,0.35)" }}>{linea1}</div>
        <div
          style={{
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.02,
            backgroundImage: `linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.9) 50%, transparent 62%), ${color.naranjaTitulo}`,
            backgroundSize: "250% 100%, 100% 100%",
            backgroundPosition: `${destello}% 0, 0 0`,
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 6px 20px rgba(255,130,20,0.35))",
          }}
        >
          {linea2}
        </div>
      </div>
    </AbsoluteFill>
  );
}
