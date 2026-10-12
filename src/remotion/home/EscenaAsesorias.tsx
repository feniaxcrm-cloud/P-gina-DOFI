import { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Flota, onda, pulso } from "./piezas";
import { DURACION } from "./tema";

/**
 * Banner 4 · «RESCATANDO EMPRENDEDORES» (lado derecho, 1197 x 757; el origen
 * es el x = 880 del escenario).
 *
 * Lo que habia dibujado en la pieza original, ahora con codigo y movimiento:
 *  - el logo de Rescatando Emprendedores (la marca, tal cual: es el archivo
 *    del logo de la portada de Asesorias) con un destello que lo cruza;
 *  - las luces diagonales de neon que atraviesan el banner;
 *  - la mascota de DOFI, repetida como sello en el fondo (unas casi
 *    invisibles, otras brillantes) y una grande, con su resplandor naranja,
 *    en la esquina de abajo.
 *
 * Mismo morado profundo, mismo violeta de neon y mismo naranja que la pieza.
 * Bucle de DURACION cuadros.
 */

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const LOGO = { url: "/asesorias/rescatando-emprendedores.webp", ancho: 2000, alto: 667 };

/** La mascota (cabeza con lentes oscuros y sonrisa) dentro de un sello redondo. */
function Mascota({ r, opacidad, brillo = 0.5 }: { r: number; opacidad: number; brillo?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={r * 2} height={r * 2} viewBox="0 0 200 200" aria-hidden="true" style={{ opacity: opacidad, display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-fondo`} cx="50%" cy="38%" r="70%">
          <stop offset="0" stopColor="#5A22B8" />
          <stop offset="1" stopColor="#2A0C6B" />
        </radialGradient>
        <linearGradient id={`${id}-aro`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF9A4A" />
          <stop offset="1" stopColor="#E8446E" />
        </linearGradient>
        <linearGradient id={`${id}-piel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC79B" />
          <stop offset="1" stopColor="#F28F5E" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill={`url(#${id}-fondo)`} stroke={`url(#${id}-aro)`} strokeWidth={9} />
      <circle cx="100" cy="100" r="94" fill="none" stroke="#FF9A4A" strokeOpacity={brillo} strokeWidth={16} style={{ filter: "blur(8px)" }} />
      {/* orejas y cara */}
      <circle cx="46" cy="112" r="13" fill="#F28F5E" />
      <circle cx="154" cy="112" r="13" fill="#F28F5E" />
      <ellipse cx="100" cy="112" rx="56" ry="60" fill={`url(#${id}-piel)`} />
      {/* pelo */}
      <path
        d="M44 98 C38 56 68 30 102 34 C140 28 166 58 156 98 C150 78 140 68 126 64 C128 76 116 82 108 70 C104 82 90 78 90 66 C72 72 58 80 52 106 Z"
        fill="#241462"
      />
      <path d="M84 40 L96 6 L112 38 Z" fill="#241462" />
      <path d="M112 38 L132 10 L136 42 Z" fill="#241462" />
      <path d="M60 52 L52 22 L82 42 Z" fill="#241462" />
      {/* lentes */}
      <rect x="50" y="94" width="44" height="30" rx="12" fill="#0E0A26" />
      <rect x="106" y="94" width="44" height="30" rx="12" fill="#0E0A26" />
      <rect x="92" y="102" width="16" height="6" rx="3" fill="#0E0A26" />
      <rect x="57" y="99" width="16" height="6" rx="3" fill="#fff" opacity="0.35" />
      <rect x="113" y="99" width="16" height="6" rx="3" fill="#fff" opacity="0.35" />
      {/* sonrisa */}
      <path d="M62 138 Q100 176 138 138 Z" fill="#fff" stroke="#4A1D2A" strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M66 148 H134" stroke="#4A1D2A" strokeWidth={2.4} opacity={0.5} />
      <circle cx="58" cy="132" r="8" fill="#FF6E8C" opacity="0.4" />
      <circle cx="142" cy="132" r="8" fill="#FF6E8C" opacity="0.4" />
    </svg>
  );
}

const SELLOS = [
  { x: 150, y: 73, r: 45, o: 0.5, f: 0.2 },
  { x: 389, y: 42, r: 40, o: 0.32, f: 1.2 },
  { x: 700, y: 60, r: 34, o: 0.26, f: 2.2 },
  { x: 997, y: 120, r: 52, o: 0.55, f: 3.0 },
  { x: 181, y: 364, r: 118, o: 0.2, f: 4.1 },
  { x: 467, y: 447, r: 46, o: 0.3, f: 5.0 },
  { x: 1122, y: 322, r: 52, o: 0.5, f: 0.7 },
  { x: 846, y: 458, r: 70, o: 0.85, f: 1.8 },
  { x: 77, y: 650, r: 48, o: 0.3, f: 2.9 },
  { x: 420, y: 634, r: 40, o: 0.28, f: 3.8 },
  { x: 1054, y: 640, r: 134, o: 0.9, f: 4.7 },
] as const;

const LUCES = [
  { d: "M 1280 -30 C 1000 120 700 190 330 340", ancho: 3.4, o: 0.9, ini: 0.0 },
  { d: "M 1280 40 C 1020 150 800 230 520 360", ancho: 1.6, o: 0.6, ini: 0.3 },
  { d: "M 740 -30 C 840 60 1020 130 1240 320", ancho: 2.4, o: 0.7, ini: 0.55 },
  { d: "M -40 600 C 260 540 700 640 1240 590", ancho: 3, o: 0.85, ini: 0.1 },
  { d: "M -40 640 C 300 590 720 670 1240 630", ancho: 1.4, o: 0.5, ini: 0.7 },
  { d: "M 200 760 C 400 640 520 560 760 500", ancho: 1.6, o: 0.4, ini: 0.45 },
];

export function EscenaAsesorias({ lineas }: { lineas: string[] }) {
  const frame = useCurrentFrame();
  const destello = interpolate(frame, [40, 110], [-40, 140], sujetar);
  const alt = lineas.join(" ");
  // El logo: ancho y posicion de la pieza original.
  const anchoLogo = 760;
  const altoLogo = (anchoLogo * LOGO.alto) / LOGO.ancho;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Resplandores. */}
      <div
        style={{
          position: "absolute",
          left: 760 + onda(frame, 0, 1) * 20,
          top: 440,
          width: 620,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,120,60,0.40), rgba(255,120,60,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 700 + onda(frame, 2, 1) * 30,
          top: -60,
          width: 700,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(150,90,255,0.40), rgba(150,90,255,0))",
        }}
      />

      {/* Mascotas: sellos de fondo. */}
      {SELLOS.map((s, i) => (
        <Flota key={i} frame={frame} x={s.x} y={s.y} fase={s.f} amp={s.r > 100 ? 10 : 7} vaiven={s.r > 100 ? 1.5 : 4} escala={1 + 0.05 * pulso(frame, 30 + i * 20, 24)}>
          <Mascota r={s.r} opacidad={s.o} brillo={s.o > 0.6 ? 0.7 : 0.25} />
        </Flota>
      ))}

      {/* Luces de neon. */}
      <svg width={1197} height={757} viewBox="0 0 1197 757" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <defs>
          <linearGradient id="ases-luz" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#B79CFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#E6D8FF" />
            <stop offset="1" stopColor="#8F6BFF" stopOpacity="0" />
          </linearGradient>
          <filter id="ases-brillo" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {LUCES.map((l, i) => (
          <g key={i}>
            <path d={l.d} fill="none" stroke="#8A5BFF" strokeWidth={l.ancho * 4} opacity={0.35 * l.o} filter="url(#ases-brillo)" />
            <path d={l.d} fill="none" stroke="url(#ases-luz)" strokeWidth={l.ancho} opacity={l.o} strokeLinecap="round" />
            <path
              d={l.d}
              fill="none"
              stroke="#fff"
              strokeWidth={l.ancho * 0.9}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.1 0.9"
              strokeDashoffset={-(((frame / DURACION + l.ini) % 1) * 1)}
              opacity={0.9}
            />
          </g>
        ))}
      </svg>

      {/* El logo, con su destello. */}
      <Flota frame={frame} x={578} y={266} fase={0.4} amp={8} vaiven={0.8}>
        <div style={{ position: "relative", width: anchoLogo, height: altoLogo, filter: "drop-shadow(0 18px 30px rgba(20,6,60,0.55))" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO.url} alt={alt} width={LOGO.ancho} height={LOGO.alto} style={{ width: "100%", height: "100%", display: "block" }} />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${LOGO.url})`,
              maskImage: `url(${LOGO.url})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%)",
              backgroundSize: "260% 100%",
              backgroundPosition: `${destello}% 0`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </Flota>
    </AbsoluteFill>
  );
}
