"use client";

import { useRef } from "react";
import { motion, type Variants } from "motion/react";
import {
  ArrowsClockwise,
  ChartBar,
  ChartLineUp,
  Compass,
  Fire,
  Funnel,
  HandCoins,
  MagnifyingGlass,
  MapTrifold,
  PaintBrush,
  PlugsConnected,
  Robot,
  RocketLaunch,
  Sailboat,
  ShareNetwork,
  Tag,
  Target,
  TrendUp,
  UsersThree,
} from "@phosphor-icons/react";
import type { PasoMetodo } from "@/lib/marketing-digital";
import { useRecorridoVivo } from "./useRecorridoVivo";

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
 *
 * RECORRIDO VIVO (`vivo`, hoy solo el Metodo de FENIAX): despues de la
 * entrada, un punto luminoso viaja de parada en parada. Cada parada se
 * enciende cuando el punto llega (sube, brilla, su titulo toma el color de
 * marca y su icono hace una microanimacion propia: la lupa busca, el enchufe
 * conecta, el robot piensa...), la linea va quedando "recorrida" y en el
 * destino se enciende el fuego del fenix; luego vuelve a empezar. Corre solo
 * mientras es visible, sin boton de pausa (corre solo) y con movimiento
 * reducido no corre. Ver useRecorridoVivo.ts.
 */

/** Juegos de iconos por marca. Se elige con una clave (no se pasan los
 *  componentes) porque este es un componente de cliente y una funcion no
 *  viaja del servidor al cliente como prop.
 *  - dofi: el viaje nautico (exploracion, ruta, lanzamiento, navegacion,
 *    resultados) y ventas en el destino.
 *  - feniax: el sistema comercial (diagnostico, canales conectados, IA,
 *    seguimiento automatico, reportes) y el fuego del fenix en el destino:
 *    las ventas "renacen".
 *  - trafico: los siete frentes que se analizan antes de invertir (objetivo,
 *    audiencia, oferta, canal, creatividad, conversion, datos) y la
 *    tendencia al alza en el destino: medir, analizar, optimizar. */
const JUEGOS = {
  dofi: { pasos: [Compass, MapTrifold, RocketLaunch, Sailboat, ChartLineUp], destino: HandCoins },
  feniax: { pasos: [MagnifyingGlass, PlugsConnected, Robot, ArrowsClockwise, ChartLineUp], destino: Fire },
  trafico: { pasos: [Target, UsersThree, Tag, ShareNetwork, PaintBrush, Funnel, ChartBar], destino: TrendUp },
} as const;

export type JuegoIconos = keyof typeof JUEGOS;

/** Microanimacion del icono cuando su parada esta activa (una vez, ~1 s).
 *  FENIAX: cada paso hace "lo que dice" (buscar, conectar, pensar, girar,
 *  crecer) y el destino parpadea como una llama. */
const MOVIMIENTO_ACTIVO: Partial<Record<JuegoIconos, Array<Record<string, number[]>>>> = {
  feniax: [
    { x: [0, 5, -4, 0], y: [0, -4, 3, 0], rotate: [0, 10, -8, 0] }, // lupa: busca
    { scale: [1, 1.22, 0.95, 1.12, 1] }, // enchufe: conecta
    { y: [0, -4, 0, -3, 0], rotate: [0, -8, 8, -4, 0] }, // robot: piensa
    { rotate: [0, 360] }, // flechas: se repite solo
    { y: [0, -4, 0], scale: [1, 1.18, 1] }, // grafica: crece
  ],
};
const MOVIMIENTO_DESTINO: Partial<Record<JuegoIconos, Record<string, number[]>>> = {
  feniax: { scale: [1, 1.18, 0.94, 1.12, 1], y: [0, -3, 0, -2, 0] }, // fuego: parpadea
};
const MOVIMIENTO_GENERICO = { scale: [1, 1.15, 1] };
const MOVIMIENTO_REPOSO = { x: 0, y: 0, scale: 1, rotate: 0 };

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
  iconos = "dofi",
  vivo = false,
}: {
  pasos: PasoMetodo[];
  destino: string;
  animar: boolean;
  iconos?: JuegoIconos;
  /** Recorrido con un punto que viaja y enciende cada parada (ver arriba). */
  vivo?: boolean;
}) {
  const { pasos: ICONOS, destino: IconoDestino } = JUEGOS[iconos];
  const n = pasos.length + (destino ? 1 : 0);

  const raiz = useRef<HTMLDivElement>(null);
  const nodos = useRef<(HTMLElement | null)[]>([]);
  const orbe = useRef<HTMLSpanElement>(null);
  const relleno = useRef<HTMLDivElement>(null);
  const tramos = useRef<(HTMLElement | null)[]>([]);
  const corre = vivo && animar && n > 1;
  const { activo } = useRecorridoVivo({
    habilitado: corre,
    n,
    contenedor: raiz,
    nodos,
    orbe,
    relleno,
    tramos,
  });

  if (n === 0) return null;
  // Con 8 paradas o mas (Trafico: 7 pasos + destino) cada una mide ~150 px en
  // escritorio: el destino baja de 25 a 19 px para que "Optimizar." entre.
  const denso = n >= 8;

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
      ref={raiz}
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
                style={{ stroke: "color-mix(in srgb, var(--color-brand) 42%, transparent)" }}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="0.5 11"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </motion.div>
        </div>
      )}

      {corre && (
        <>
          {/* Linea recorrida (escritorio): la misma curva, llena, recortada hasta donde llego el punto. */}
          <div
            ref={relleno}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-[140px] xl:block"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <svg className="h-full w-full" viewBox={`0 0 ${VB_ANCHO} ${VB_ALTO}`} preserveAspectRatio="none" fill="none">
              <path
                d={trazarRuta(n, Boolean(destino))}
                style={{ stroke: "var(--color-accent)" }}
                strokeWidth="3.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <span
            ref={orbe}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 -ml-[10px] -mt-[10px] h-5 w-5 rounded-full bg-gradient-to-br from-brand-lift to-accent ring-4 ring-white"
            style={{ opacity: 0 }}
          />
        </>
      )}

      <motion.ol variants={lista} className="relative flex flex-col gap-10 xl:flex-row xl:gap-0">
        {pasos.map((paso, i) => {
          const Icono = ICONOS[i % ICONOS.length];
          const ultimo = i === n - 1;
          return (
            <motion.li
              key={`${paso.titulo}-${i}`}
              data-reveal="true"
              data-activo={corre && activo === i ? "true" : undefined}
              variants={parada}
              className={`group/p relative flex gap-5 xl:w-[var(--ancho-parada)] xl:flex-col xl:items-center xl:gap-0 xl:px-3 xl:text-center ${
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
              {corre && !ultimo && (
                // Tramo recorrido (vista vertical): se llena de arriba hacia abajo.
                <span
                  aria-hidden="true"
                  ref={(el) => {
                    tramos.current[i] = el;
                  }}
                  className="absolute -bottom-10 left-[31px] top-16 w-0 origin-top border-l-2 border-solid border-accent xl:hidden"
                  style={{ transform: "scaleY(0)" }}
                />
              )}
              <span
                ref={(el) => {
                  nodos.current[i] = el;
                }}
                className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-white text-brand shadow-[0_12px_30px_-14px_color-mix(in_srgb,var(--color-brand)_50%,transparent)] transition-[scale,border-color] duration-500 group-data-[activo=true]/p:scale-110 group-data-[activo=true]/p:border-accent"
              >
                {corre && activo === i && <Pulso />}
                <motion.span
                  className="flex"
                  animate={corre && activo === i ? (MOVIMIENTO_ACTIVO[iconos]?.[i] ?? MOVIMIENTO_GENERICO) : MOVIMIENTO_REPOSO}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <Icono size={26} weight="duotone" aria-hidden="true" />
                </motion.span>
                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 font-display text-[11px] font-bold text-fg-on-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <div className="pt-1.5 xl:mt-5 xl:pt-0">
                <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink transition-colors duration-500 group-data-[activo=true]/p:text-brand">
                  {paso.titulo}
                </h3>
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
            data-activo={corre && activo === n - 1 ? "true" : undefined}
            variants={parada}
            className={`group/p relative flex items-center gap-5 xl:w-[var(--ancho-parada)] xl:flex-col xl:gap-0 xl:px-3 xl:text-center ${
              (n - 1) % 2 === 1 ? "xl:pt-[72px]" : ""
            }`}
          >
            <span
              ref={(el) => {
                nodos.current[n - 1] = el;
              }}
              className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand via-brand-lift to-accent text-white shadow-[0_0_0_6px_rgba(244,123,32,0.14),0_20px_44px_-14px_rgba(244,123,32,0.65)] transition-[scale,box-shadow] duration-500 group-data-[activo=true]/p:scale-110 group-data-[activo=true]/p:shadow-[0_0_0_10px_rgba(244,123,32,0.2),0_24px_50px_-12px_rgba(244,123,32,0.8)] xl:h-[88px] xl:w-[88px]"
            >
              {corre && activo === n - 1 && <Pulso />}
              <motion.span
                className="flex"
                animate={corre && activo === n - 1 ? (MOVIMIENTO_DESTINO[iconos] ?? MOVIMIENTO_GENERICO) : MOVIMIENTO_REPOSO}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              >
                <IconoDestino size={34} weight="fill" aria-hidden="true" />
              </motion.span>
            </span>
            <p className={`text-balance bg-gradient-to-r from-brand via-brand-lift to-accent bg-clip-text font-display text-2xl font-extrabold leading-tight tracking-[-0.01em] text-transparent xl:mt-5 ${denso ? "xl:text-[1.2rem]" : "xl:text-[1.6rem]"}`}>
              {destino}
            </p>
          </motion.li>
        )}
      </motion.ol>
    </motion.div>
  );
}

/** Aro que se abre desde la parada cuando el punto llega a ella. */
function Pulso() {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ scale: 1.8, opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  );
}
