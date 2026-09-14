"use client";

import { motion, type Variants } from "motion/react";
import { ChartLineUp, Compass, HandCoins, MapTrifold, RocketLaunch, Sailboat } from "@phosphor-icons/react";
import type { PasoMetodo } from "@/lib/marketing-digital";

/**
 * El Metodo DOFI como RECORRIDO, no como grilla de tarjetas:
 *
 *   01 -> 02 -> 03 -> 04 -> 05 -> VENTAS INTELIGENTES GARANTIZADAS
 *
 * ESCRITORIO (xl, 1280px+): las paradas van en zigzag sobre una linea
 * punteada curva que se dibuja al entrar. Las pares arriba, las impares 72px
 * mas abajo -- se lee como una travesia, no como columnas.
 *
 * MOVIL Y TABLET: el mismo recorrido en vertical, con un tramo punteado entre
 * cada parada que crece cuando la parada aparece.
 *
 * EL DESTINO (el sexto elemento) no es un sexto servicio: sin numero, nodo
 * mas grande en degradado morado -> naranja con resplandor, y el texto en el
 * mismo degradado.
 *
 * ENTRADA SINCRONIZADA (orden del brief: linea -> pasos -> destino)
 * -----------------------------------------------------------------
 * Un solo disparador (el contenedor) para la linea y las paradas. La linea
 * se dibuja a velocidad CONSTANTE y cada parada aparece justo cuando la
 * linea llega a su centro: el escalonado sale de la misma duracion
 * (DIBUJO / n). Antes la linea tenia aceleracion y las paradas iban por su
 * lado: 01-03 se encendian antes de que la linea arrancara.
 *
 * El recorte de la linea va en un hijo y la deteccion en el contenedor, sin
 * recorte: Chrome mide la visibilidad de un elemento con su propio clip-path
 * aplicado y, recortado al 100%, nunca llegaria al umbral (ver Trazo.tsx).
 *
 * Movimiento reducido: paradas y tramos llevan data-reveal y la linea
 * data-trazo, asi que globals.css deja todo visible y quieto.
 *
 * ICONOS por posicion, segun el brief: exploracion, ruta, lanzamiento,
 * navegacion, resultados; y ventas para el destino.
 */

const ICONOS = [Compass, MapTrifold, RocketLaunch, Sailboat, ChartLineUp] as const;

const NODO = 64;
const NODO_DESTINO = 88;
const BAJADA = 72;
const VB_ANCHO = 1200;
const VB_ALTO = 140;

/** Segundos: cuando arranca la linea, cuanto tarda en cruzar, y cuanto antes
 *  de que la linea llegue empieza a aparecer cada parada. */
const INICIO = 0.15;
const DIBUJO = 1.5;
const ADELANTO = 0.05;

/** Curva que pasa por el centro de cada nodo. Las paradas reparten el ancho
 *  en partes iguales, asi que el centro de la i-esima esta en (i+0.5)/n del
 *  ancho; en alto, la mitad del nodo mas su bajada si es impar. Tramos
 *  cubicos con tangente horizontal en cada nodo: la linea "entra" y "sale"
 *  plana de cada parada. */
function trazarRuta(n: number, conDestino: boolean) {
  const puntos = Array.from({ length: n }, (_, i) => {
    const alto = conDestino && i === n - 1 ? NODO_DESTINO : NODO;
    return { x: ((i + 0.5) / n) * VB_ANCHO, y: (i % 2 === 1 ? BAJADA : 0) + alto / 2 };
  });
  let d = `M ${puntos[0].x} ${puntos[0].y}`;
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1];
    const b = puntos[i];
    const mx = (a.x + b.x) / 2;
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
}

const linea: Variants = {
  oculto: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: DIBUJO, delay: INICIO, ease: "linear" },
  },
};

const parada: Variants = {
  oculto: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const tramo: Variants = {
  oculto: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};

export function RutaMetodo({
  pasos,
  destino,
  animar,
}: {
  pasos: PasoMetodo[];
  destino: string;
  animar: boolean;
}) {
  const n = pasos.length + (destino ? 1 : 0);
  if (n === 0) return null;

  // La linea llega al centro de la parada i en INICIO + DIBUJO * (i + 0.5) / n.
  const escalon = DIBUJO / n;
  const lista: Variants = {
    oculto: {},
    visible: { transition: { staggerChildren: escalon, delayChildren: Math.max(0, INICIO + escalon / 2 - ADELANTO) } },
  };

  const estilo = { "--ancho-parada": `${100 / n}%` } as React.CSSProperties;

  // Debajo de xl el recorrido es vertical: se centra como bloque angosto bajo
  // el titulo centrado, en vez de quedar pegado a la izquierda en tablet.
  return (
    <motion.div
      className="relative mx-auto max-w-[560px] xl:max-w-none"
      style={estilo}
      initial={animar ? "oculto" : false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {n > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[140px] xl:block">
          <motion.div data-trazo="true" variants={linea} className="h-full w-full">
            <svg
              aria-hidden="true"
              className="h-full w-full"
              viewBox={`0 0 ${VB_ANCHO} ${VB_ALTO}`}
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d={trazarRuta(n, Boolean(destino))}
                stroke="rgba(75,42,147,0.42)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="0.5 11"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </motion.div>
        </div>
      )}

      <motion.ol variants={lista} className="relative flex flex-col gap-10 xl:flex-row xl:gap-0">
        {pasos.map((paso, i) => {
          const Icono = ICONOS[i % ICONOS.length];
          const ultimo = i === n - 1;
          return (
            <motion.li
              key={`${paso.titulo}-${i}`}
              data-reveal="true"
              variants={parada}
              className={`relative flex gap-5 xl:w-[var(--ancho-parada)] xl:flex-col xl:items-center xl:gap-0 xl:px-3 xl:text-center ${
                i % 2 === 1 ? "xl:pt-[72px]" : ""
              }`}
            >
              {!ultimo && (
                <motion.span
                  aria-hidden="true"
                  data-reveal="true"
                  variants={tramo}
                  className="absolute -bottom-10 left-[31px] top-16 w-0 origin-top border-l-2 border-dashed border-brand/30 xl:hidden"
                />
              )}
              <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-white text-brand shadow-[0_12px_30px_-14px_rgba(75,42,147,0.5)]">
                <Icono size={26} weight="duotone" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 font-display text-[11px] font-bold text-fg-on-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <div className="pt-1.5 xl:mt-5 xl:pt-0">
                <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink">{paso.titulo}</h3>
                {paso.descripcion && (
                  <p className="mt-1.5 font-sans text-[15px] leading-relaxed text-ink-muted">{paso.descripcion}</p>
                )}
              </div>
            </motion.li>
          );
        })}

        {destino && (
          <motion.li
            data-reveal="true"
            variants={parada}
            className={`relative flex items-center gap-5 xl:w-[var(--ancho-parada)] xl:flex-col xl:gap-0 xl:px-3 xl:text-center ${
              (n - 1) % 2 === 1 ? "xl:pt-[72px]" : ""
            }`}
          >
            <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand via-brand-lift to-accent text-white shadow-[0_0_0_6px_rgba(244,123,32,0.14),0_20px_44px_-14px_rgba(244,123,32,0.65)] xl:h-[88px] xl:w-[88px]">
              <HandCoins size={34} weight="fill" aria-hidden="true" />
            </span>
            <p className="text-balance bg-gradient-to-r from-brand via-brand-lift to-accent bg-clip-text font-display text-2xl font-extrabold leading-tight tracking-[-0.01em] text-transparent xl:mt-5 xl:text-[1.6rem]">
              {destino}
            </p>
          </motion.li>
        )}
      </motion.ol>
    </motion.div>
  );
}
