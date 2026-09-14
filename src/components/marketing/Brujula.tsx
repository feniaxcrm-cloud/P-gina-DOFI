"use client";

import { motion } from "motion/react";
import { Trazo } from "./Trazo";

/**
 * Brujula de la seccion "¿Cómo navegamos contigo?": el elemento grafico de
 * la composicion editorial. SVG puro en los colores DOFI -- sin imagenes ni
 * peticiones de red.
 *
 * Tres capas:
 *  1. Orbita punteada naranja con un punto (la embarcacion): se dibuja al
 *     entrar (Trazo).
 *  2. La rosa de los vientos, quieta: aro con marcas cada 5°, puntos
 *     cardinales en español (N, E, S, O) y la estrella de 8 puntas.
 *  3. La aguja: gira UNA vez al entrar y se asienta apuntando al noreste.
 *     Nada gira de forma permanente.
 *
 * Decorativa (aria-hidden): el mensaje lo dan el titulo y los textos.
 */

const MARCAS = Array.from({ length: 72 }, (_, i) => i * 5);
const CARDINALES: [string, number][] = [
  ["N", 0],
  ["E", 90],
  ["S", 180],
  ["O", 270],
];
const RUMBO_FINAL = 38;

/** Redondeado a 2 decimales A PROPOSITO: Math.cos/Math.sin no dan el mismo
 *  ultimo decimal en Node y en el navegador (71.30453355601168 contra
 *  71.3045335560117), y esa diferencia rompia la hidratacion de React. */
function polar(radio: number, grados: number) {
  const rad = ((grados - 90) * Math.PI) / 180;
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return { x: r2(200 + radio * Math.cos(rad)), y: r2(200 + radio * Math.sin(rad)) };
}

function Aguja() {
  return (
    <>
      <polygon points="200,58 209,200 191,200" fill="#F47B20" />
      <polygon points="200,342 209,200 191,200" fill="rgba(255,255,255,0.32)" />
      <circle cx="200" cy="200" r="5" fill="#FF9440" />
    </>
  );
}

export function Brujula({ animar, className }: { animar: boolean; className?: string }) {
  const barco = polar(192, 45);

  return (
    <div aria-hidden="true" className={`relative aspect-square ${className ?? ""}`}>
      <Trazo animar={animar} delay={0.3} duracion={1.6} className="absolute inset-0">
        <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
          <circle
            cx="200"
            cy="200"
            r="192"
            stroke="rgba(244,123,32,0.55)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="0.5 10"
          />
          <circle cx={barco.x} cy={barco.y} r="15" fill="rgba(244,123,32,0.18)" />
          <circle cx={barco.x} cy={barco.y} r="6" fill="#F47B20" />
        </svg>
      </Trazo>

      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="200" cy="200" r="168" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
        {MARCAS.map((g) => {
          const mayor = g % 45 === 0;
          const a = polar(168, g);
          const b = polar(mayor ? 152 : 161, g);
          return (
            <line
              key={g}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={mayor ? "rgba(255,148,64,0.85)" : "rgba(255,255,255,0.22)"}
              strokeWidth={mayor ? 2 : 1}
            />
          );
        })}
        <circle cx="200" cy="200" r="126" stroke="rgba(255,255,255,0.10)" strokeDasharray="2 6" />
        {CARDINALES.map(([letra, g]) => {
          const p = polar(138, g);
          return (
            <text
              key={letra}
              x={p.x}
              y={p.y}
              fill="rgba(255,255,255,0.62)"
              fontSize="15"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {letra}
            </text>
          );
        })}
        {[45, 135, 225, 315].map((g) => (
          <g key={g} transform={`rotate(${g} 200 200)`}>
            <polygon points="200,128 190,200 200,200" fill="rgba(255,255,255,0.14)" />
            <polygon points="200,128 210,200 200,200" fill="rgba(255,255,255,0.06)" />
          </g>
        ))}
        {[0, 90, 180, 270].map((g) => (
          <g key={g} transform={`rotate(${g} 200 200)`}>
            <polygon points="200,90 184,200 200,200" fill="rgba(109,75,201,0.7)" />
            <polygon points="200,90 216,200 200,200" fill="rgba(109,75,201,0.3)" />
          </g>
        ))}
        <circle cx="200" cy="200" r="11" fill="#1A0F3D" stroke="rgba(255,255,255,0.4)" />
      </svg>

      {animar ? (
        <motion.svg
          data-aguja="true"
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          initial={{ rotate: -70 }}
          whileInView={{ rotate: RUMBO_FINAL }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Aguja />
        </motion.svg>
      ) : (
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          style={{ transform: `rotate(${RUMBO_FINAL}deg)` }}
        >
          <Aguja />
        </svg>
      )}
    </div>
  );
}
