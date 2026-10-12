import { useId } from "react";
import { DURACION } from "./tema";

/**
 * Piezas con las que se redibujan, con codigo, los elementos de las piezas
 * graficas del Home: baldosas 3D de las apps, esferas, burbujas de "me gusta",
 * cubos y puntos de luz. Son las mismas formas y los mismos colores de las
 * imagenes originales (ver tema.ts), ahora con movimiento.
 *
 * TODO ES PERIODICO: las ondas (`onda`) dan 1, 2 o 3 vueltas exactas en
 * DURACION cuadros, asi el bucle no tiene costura. Nada depende de azar.
 */

export type Punto = { x: number; y: number };

/** Seno que da `k` vueltas exactas por bucle. */
export function onda(frame: number, fase = 0, k = 1) {
  return Math.sin((frame / DURACION) * Math.PI * 2 * k + fase);
}

/** 0 -> 1 -> 0 en una ventana del bucle (para "pops" y destellos puntuales). */
export function pulso(frame: number, centro: number, ancho: number) {
  const d = Math.abs(((frame - centro + DURACION * 1.5) % DURACION) - DURACION / 2);
  return Math.max(0, 1 - d / ancho);
}

/** Punto de una curva cubica. */
export function enCurva([a, b, c, d]: readonly [Punto, Punto, Punto, Punto], t: number): Punto {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}

// ------------------------------------------------------------------ flotar

/** Coloca algo por su CENTRO, con flotacion y vaiven periodicos. */
export function Flota({
  frame,
  x,
  y,
  fase = 0,
  amp = 10,
  vaiven = 3,
  k = 1,
  escala = 1,
  z = 0,
  children,
}: {
  frame: number;
  x: number;
  y: number;
  fase?: number;
  amp?: number;
  vaiven?: number;
  k?: number;
  escala?: number;
  z?: number;
  children: React.ReactNode;
}) {
  const dy = onda(frame, fase, k) * amp;
  const giro = onda(frame, fase + 1.3, k) * vaiven;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: z,
        transform: `translate(-50%, -50%) translateY(${dy}px) rotate(${giro}deg) scale(${escala})`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- baldosa 3D

/**
 * Baldosa de app en 3D: una cara con brillo y, detras, capas del color del
 * canto que le dan grosor. `rx`/`ry`/`giro` la inclinan como en las piezas
 * originales. Los hijos (el logo) quedan centrados sobre la cara.
 */
export function Baldosa({
  tam,
  claro,
  oscuro,
  canto,
  radio = 0.27,
  rx = 12,
  ry = -14,
  giro = 0,
  grosor = 12,
  brillo = 0.5,
  borde,
  fondo,
  children,
}: {
  tam: number;
  claro: string;
  oscuro: string;
  canto: string;
  /** Fondo CSS completo de la cara (si no, un degradado de `claro` a `oscuro`). */
  fondo?: string;
  radio?: number;
  rx?: number;
  ry?: number;
  giro?: number;
  grosor?: number;
  brillo?: number;
  borde?: string;
  children?: React.ReactNode;
}) {
  const r = tam * radio;
  const capas = [0.25, 0.5, 0.75, 1];
  return (
    <div
      style={{
        position: "relative",
        width: tam,
        height: tam,
        transform: `perspective(${tam * 5}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${giro}deg)`,
        transformStyle: "preserve-3d",
        filter: "drop-shadow(0 22px 22px rgba(10, 6, 40, 0.38))",
      }}
    >
      {capas.map((c) => (
        <div
          key={c}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: r,
            background: canto,
            transform: `translateZ(${-grosor * c}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: fondo ?? `linear-gradient(150deg, ${claro} 0%, ${oscuro} 100%)`,
          boxShadow: `inset 0 ${tam * 0.016}px 0 rgba(255,255,255,${brillo}), inset 0 -${tam * 0.07}px ${tam * 0.12}px rgba(0,0,0,0.22), inset 0 0 0 ${tam * 0.012}px ${borde ?? "rgba(255,255,255,0.22)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* El brillo de la esquina: la cara se lee como vidrio. */}
        <div
          style={{
            position: "absolute",
            left: "-10%",
            top: "-14%",
            width: "85%",
            height: "62%",
            borderRadius: "50%",
            background: `radial-gradient(closest-side, rgba(255,255,255,${brillo * 0.7}), rgba(255,255,255,0))`,
          }}
        />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      </div>
    </div>
  );
}

/** Logo de una marca (trazo de simple-icons, 24x24) a un tamaño dado. */
export function Marca({ d, tam, relleno = "#fff" }: { d: string; tam: number; relleno?: string }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d={d} fill={relleno} />
    </svg>
  );
}

// ------------------------------------------------------------------ esfera

const ESFERAS = {
  azul: ["#6C8CFF", "#1B2FC8", "#070E4F"],
  oro: ["#FFE79A", "#E0A21B", "#7D4B05"],
  violeta: ["#C79BFF", "#6A2CD6", "#25096B"],
} as const;

/** Esfera brillante (como las de la pieza de Pauta), por su centro. */
export function Esfera({ x, y, r, tono, frame, fase = 0, amp = 8, k = 1 }: { x: number; y: number; r: number; tono: keyof typeof ESFERAS; frame: number; fase?: number; amp?: number; k?: number }) {
  const [a, b, c] = ESFERAS[tono];
  const dy = onda(frame, fase, k) * amp;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r + dy,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, ${a} 0%, ${b} 42%, ${c} 100%)`,
        boxShadow: `0 ${r * 0.5}px ${r * 0.8}px rgba(20,10,70,0.35), inset -${r * 0.15}px -${r * 0.2}px ${r * 0.4}px rgba(0,0,30,0.35)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "18%",
          top: "12%",
          width: "34%",
          height: "22%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))",
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------- burbuja de like

/** Burbuja de "me gusta" con corazon, por su centro. `tono` cambia de naranja
 *  (Redes) a rojo (Pauta). */
export function Burbuja({ tam, tono = "naranja", giro = 0 }: { tam: number; tono?: "naranja" | "rojo"; giro?: number }) {
  const id = useId().replace(/:/g, "");
  const [a, b] = tono === "naranja" ? ["#FF7A45", "#E33A1E"] : ["#FF5A6E", "#D4162F"];
  return (
    <svg
      width={tam}
      height={tam * 0.93}
      viewBox="0 0 140 130"
      aria-hidden="true"
      style={{ display: "block", transform: `rotate(${giro}deg)`, filter: "drop-shadow(0 14px 14px rgba(40,10,60,0.35))" }}
    >
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M24 6 H116 a18 18 0 0 1 18 18 V74 a18 18 0 0 1 -18 18 H66 L40 122 V92 H24 a18 18 0 0 1 -18 -18 V24 a18 18 0 0 1 18 -18Z"
        fill={`url(#${id}-c)`}
      />
      <path
        d="M24 6 H116 a18 18 0 0 1 18 18 V44 C100 34 60 36 6 50 V24 a18 18 0 0 1 18 -18Z"
        fill={`url(#${id}-b)`}
      />
      <path
        d="M70 76 C48 60 40 50 46 40 C51 32 62 33 70 42 C78 33 89 32 94 40 C100 50 92 60 70 76Z"
        fill="#fff"
      />
    </svg>
  );
}

// -------------------------------------------------------------------- cubo

/** Cubo naranja flotante (los de la pieza de Redes), por su centro. `desenfoque`
 *  los manda al fondo (profundidad de campo). */
export function Cubo({ tam, giro = 0, desenfoque = 0, tono = 0 }: { tam: number; giro?: number; desenfoque?: number; tono?: number }) {
  const pares = [
    ["#FF8A4C", "#E2441E"],
    ["#FF6F3A", "#C92E14"],
    ["#FF9A5C", "#E8501F"],
  ];
  const [a, b] = pares[tono % pares.length];
  return (
    <div
      style={{
        width: tam,
        height: tam,
        borderRadius: tam * 0.2,
        background: `linear-gradient(140deg, ${a} 0%, ${b} 100%)`,
        boxShadow: `inset 0 ${tam * 0.04}px 0 rgba(255,255,255,0.45), inset -${tam * 0.1}px -${tam * 0.12}px ${tam * 0.2}px rgba(120,10,10,0.35), 0 ${tam * 0.3}px ${tam * 0.4}px rgba(50,10,90,0.3)`,
        transform: `rotate(${giro}deg)`,
        filter: desenfoque > 0 ? `blur(${desenfoque}px)` : undefined,
      }}
    />
  );
}

// ------------------------------------------------------------------- luces

/** Un punto de luz con halo (las chispas de las estelas), por su centro. */
export function Chispa({ x, y, r = 5, opacidad = 1, tono = "#fff" }: { x: number; y: number; r?: number; opacidad?: number; tono?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: tono,
        opacity: opacidad,
        boxShadow: `0 0 ${r * 3}px ${r}px ${tono}`,
      }}
    />
  );
}
