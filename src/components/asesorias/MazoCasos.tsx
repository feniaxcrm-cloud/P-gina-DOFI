"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ArrowRight, HandTap, Trophy } from "@phosphor-icons/react";
import { ICONOS } from "@/components/marketing/CarruselGiros";
import type { CasoExito } from "@/lib/asesorias";
import type { IconoCategoria } from "@/lib/marketing-digital";

/**
 * Mazo de casos de éxito (Asesorías), hecho sobre el video de referencia:
 *
 *  - Una pila de tarjetas: la del frente se lee; detrás asoman otras dos,
 *    un poco giradas y más chicas.
 *  - "Ver otro caso" (o un clic en la tarjeta, arrastrarla, o las flechas
 *    del teclado): la del frente SALE VOLANDO con un giro, la de atrás pasa
 *    adelante y la que se fue vuelve a aparecer al fondo de la pila.
 *  - Contador "02 / 03" y, si el paso automático está activo, una línea de
 *    progreso.
 *
 * El caso al frente lo decide el padre (CasosGiros, o LogrosAsesorias en la
 * seccion de Logros): es el MISMO estado que cambia la imagen de al lado. Este
 * componente solo pinta y avisa lo que pide el visitante (onPasar).
 *
 * MOVIMIENTO REDUCIDO: sin vuelo ni inclinación; el cambio es un fundido.
 */

type Tema = { tarjeta: string; texto: string; tenue: string; insignia: string; etiqueta: string; numero: string; fondo?: React.CSSProperties };

/** Tres pieles que se alternan por posición del caso en la lista (cada caso
 *  conserva la suya), como en la referencia: papel cuadriculado, color de
 *  marca y crema. */
const TEMAS: Tema[] = [
  {
    tarjeta: "border border-brand/10 bg-white",
    texto: "text-ink",
    tenue: "text-ink-muted",
    insignia: "bg-brand text-white",
    etiqueta: "bg-brand/[0.07] text-brand",
    numero: "text-brand/[0.08]",
    fondo: {
      backgroundImage:
        "linear-gradient(rgba(75,42,147,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(75,42,147,0.05) 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    },
  },
  {
    tarjeta: "bg-[linear-gradient(160deg,#6D4BC9_0%,#4B2A93_55%,#2E1B68_100%)]",
    texto: "text-white",
    tenue: "text-foam/80",
    insignia: "bg-accent text-abyss",
    etiqueta: "bg-white/15 text-white",
    numero: "text-white/[0.09]",
  },
  {
    tarjeta: "border border-accent/15 bg-[#FFF5EB]",
    texto: "text-ink",
    tenue: "text-ink-muted",
    insignia: "bg-accent text-white",
    etiqueta: "bg-white text-brand",
    numero: "text-accent/[0.14]",
  },
];

/** Posición de cada tarjeta de la pila: 0 al frente, 1 y 2 asomando detrás
 *  (abajo a la derecha y abajo a la izquierda).
 *
 *  Se animan como `transform` COMPLETO (no x/y/rotate sueltos): así Motion usa
 *  la Web Animations API y el movimiento corre en el compositor. Medido: al
 *  pasar de caso el carrusel cambia de giro y carga sus logos, y eso traba el
 *  hilo principal ~400 ms; con x/rotate sueltos la tarjeta se congelaba a
 *  mitad de vuelo. */
const RANURAS = [
  { transform: "translate(0px, 0px) rotate(0deg) scale(1)", zIndex: 30 },
  { transform: "translate(16px, 16px) rotate(3deg) scale(0.95)", zIndex: 20 },
  { transform: "translate(-14px, 26px) rotate(-3.5deg) scale(0.9)", zIndex: 10 },
];

const CURVA = [0.16, 1, 0.3, 1] as const;

type Fantasma = { id: number; caso: CasoExito; tema: number; numero: number; dir: 1 | -1; desde: { x: number; rotate: number } };

function dos(n: number) {
  return String(n).padStart(2, "0");
}

function Tarjeta({
  caso,
  numero,
  tema,
  iconoGiro,
}: {
  caso: CasoExito;
  numero: number;
  tema: Tema;
  iconoGiro: IconoCategoria | null;
}) {
  const IconoGiro = iconoGiro ? ICONOS[iconoGiro] : null;
  return (
    <div
      className={`flex h-full flex-col rounded-[26px] p-6 shadow-[0_30px_60px_-34px_rgba(26,15,61,0.55)] sm:p-7 ${tema.tarjeta}`}
      style={tema.fondo}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tema.insignia}`}>
          <Trophy size={22} weight="fill" aria-hidden="true" />
        </span>
        {caso.giro && (
          <span
            className={`inline-flex min-w-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[12.5px] font-semibold ${tema.etiqueta}`}
          >
            {IconoGiro && <IconoGiro size={14} weight="duotone" aria-hidden="true" className="shrink-0" />}
            <span className="truncate">{caso.giro}</span>
          </span>
        )}
      </div>

      <h3
        className={`mt-6 text-balance font-display text-[clamp(1.45rem,1.15rem+0.9vw,1.85rem)] font-extrabold leading-[1.1] tracking-[-0.02em] ${tema.texto}`}
      >
        {caso.titulo}
      </h3>
      {caso.texto && <p className={`mt-3 font-sans text-[15px] leading-relaxed ${tema.tenue}`}>{caso.texto}</p>}

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        {caso.cliente ? (
          <p className={`flex min-w-0 items-center gap-3 font-sans text-sm font-semibold ${tema.texto}`}>
            <span aria-hidden="true" className="h-[2px] w-6 shrink-0 rounded-full bg-accent" />
            <span className="truncate">{caso.cliente}</span>
          </p>
        ) : (
          <span />
        )}
        <span aria-hidden="true" className={`font-display text-[60px] font-extrabold leading-[0.8] tracking-[-0.04em] ${tema.numero}`}>
          {dos(numero)}
        </span>
      </div>
    </div>
  );
}

/** La tarjeta del frente: se arrastra (y al soltarla lejos sale volando) y
 *  se inclina apenas siguiendo el cursor, como una tarjeta física. */
function TarjetaFrente({
  children,
  reducido,
  onSoltar,
  onTocar,
}: {
  children: React.ReactNode;
  reducido: boolean;
  onSoltar: (dir: 1 | -1, desde: { x: number; rotate: number }) => void;
  /** Clic (o toque) sin arrastrar: pasar a la siguiente. */
  onTocar: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-14, 0, 14]);
  const inclX = useSpring(0, { stiffness: 220, damping: 22 });
  const inclY = useSpring(0, { stiffness: 220, damping: 22 });
  const arrastrando = useRef(false);
  /** Hubo arrastre en este gesto: el clic que llega al soltar no cuenta. */
  const huboArrastre = useRef(false);

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    if (reducido || e.pointerType !== "mouse" || arrastrando.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    inclY.set(px * 7);
    inclX.set(-py * 6);
  }

  function alSalir() {
    inclX.set(0);
    inclY.set(0);
  }

  function alSoltarArrastre(_: PointerEvent, info: PanInfo) {
    arrastrando.current = false;
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > 90 || Math.abs(velocity.x) > 550) {
      const dir: 1 | -1 = offset.x > 0 ? 1 : -1;
      onSoltar(dir, { x: offset.x, rotate: offset.x * (14 / 260) });
    }
  }

  return (
    <motion.div
      className="h-full cursor-pointer touch-pan-y active:cursor-grabbing"
      style={{ x, rotate, rotateX: inclX, rotateY: inclY, transformPerspective: 900 }}
      drag={reducido ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.55}
      onDragStart={() => {
        arrastrando.current = true;
        huboArrastre.current = true;
        alSalir();
      }}
      onDragEnd={alSoltarArrastre}
      onPointerDown={() => {
        huboArrastre.current = false;
      }}
      onClick={() => {
        if (!huboArrastre.current) onTocar();
      }}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
    >
      {children}
    </motion.div>
  );
}

export function MazoCasos({
  casos,
  indice,
  iconoDeGiro,
  onPasar,
  progreso,
  anunciar,
  textoBoton = "Ver otro caso",
  etiqueta = "Casos de éxito",
  pista,
}: {
  casos: CasoExito[];
  indice: number;
  /** Icono del giro de un caso (el mismo del carrusel), o null. */
  iconoDeGiro: (caso: CasoExito) => IconoCategoria | null;
  /** El visitante pide otro caso: dir 1 = siguiente, -1 = anterior. */
  onPasar: (dir: 1 | -1) => void;
  /** Paso automático en curso: la línea de progreso dura `ms`. */
  progreso: { ms: number } | null;
  /** Anunciar el cambio a lectores de pantalla (solo cuando lo pidió el
   *  visitante: un aviso por cada paso automático sería ruido). */
  anunciar: boolean;
  textoBoton?: string;
  /** Nombre del carrusel para lectores de pantalla. */
  etiqueta?: string;
  /** Ayuda chica junto al contador (Logros: «Toca para ver otro logro»). */
  pista?: string;
}) {
  const reducido = useReducedMotion() ?? false;
  const n = casos.length;
  const [fantasmas, setFantasmas] = useState<Fantasma[]>([]);
  const [volviendo, setVolviendo] = useState<string | null>(null);
  const anterior = useRef(indice);
  const salida = useRef<{ dir: 1 | -1; desde: { x: number; rotate: number } } | null>(null);
  const contador = useRef(0);

  // Avanzó al caso siguiente (botón, arrastre, teclado, paso automático): la
  // tarjeta que estaba al frente sale volando como "fantasma" y la real
  // reaparece al fondo de la pila. Hacia atrás, o con un salto (un giro
  // elegido en el carrusel), no vuela nada: la pila se reacomoda sola. Antes
  // del pintado, para que no se vea un cuadro con la pila ya reordenada.
  useLayoutEffect(() => {
    const previo = anterior.current;
    anterior.current = indice;
    const pedido = salida.current;
    salida.current = null;
    if (previo === indice || n < 2 || previo >= n || reducido) return;
    if (indice !== (previo + 1) % n) return;
    contador.current += 1;
    setFantasmas((f) => [
      ...f.slice(-2),
      {
        id: contador.current,
        caso: casos[previo],
        tema: previo % TEMAS.length,
        numero: previo + 1,
        dir: pedido?.dir ?? 1,
        desde: pedido?.desde ?? { x: 0, rotate: 0 },
      },
    ]);
    setVolviendo(casos[previo].key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice]);

  if (n === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-[26px] border border-dashed border-brand/20 bg-white/60 p-8 text-center">
        <p className="max-w-[300px] font-sans text-[15px] text-ink-muted">Pronto verás aquí nuestros casos de éxito.</p>
      </div>
    );
  }

  function pasar(dir: 1 | -1, salidaDir: 1 | -1, desde?: { x: number; rotate: number }) {
    salida.current = { dir: salidaDir, desde: desde ?? { x: 0, rotate: 0 } };
    onPasar(dir);
  }

  function alTeclear(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      pasar(1, 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      pasar(-1, -1);
    }
  }

  const visibles = Math.min(n, RANURAS.length);
  const pila = Array.from({ length: visibles }, (_, k) => {
    const i = (indice + k) % n;
    return { caso: casos[i], i, k };
  });
  const actual = casos[indice];

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      tabIndex={0}
      onKeyDown={alTeclear}
      className="rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
    >
      <p className="sr-only" aria-live={anunciar ? "polite" : "off"}>
        {indice + 1} de {n}: {actual.titulo}
      </p>

      {/* La pila. Todas las tarjetas comparten la misma celda: la altura es la
          del caso mas largo (capa invisible), asi pasar de caso nunca mueve
          la pagina. El margen deja lugar a las que asoman detras. */}
      <div className="relative grid pb-7 pr-4" style={{ perspective: 1200 }}>
        <div aria-hidden="true" className="invisible grid [grid-area:1/1]">
          {casos.map((c, i) => (
            <div key={c.key} className="[grid-area:1/1]">
              <Tarjeta caso={c} numero={i + 1} tema={TEMAS[i % TEMAS.length]} iconoGiro={iconoDeGiro(c)} />
            </div>
          ))}
        </div>

        {pila
          .slice()
          .reverse()
          .map(({ caso, i, k }) => {
            const { zIndex, ...ranura } = RANURAS[k];
            const regresa = caso.key === volviendo && k === visibles - 1 && n > 1;
            return (
              <motion.div
                key={caso.key}
                aria-hidden={k === 0 ? undefined : "true"}
                className="[grid-area:1/1]"
                style={{ zIndex }}
                initial={{ ...ranura, opacity: 0 }}
                animate={{ ...ranura, opacity: regresa ? [0, 0, 1] : 1 }}
                transition={
                  reducido
                    ? { duration: 0.2 }
                    : regresa
                      ? { default: { duration: 0 }, opacity: { duration: 0.75, times: [0, 0.55, 1], ease: "easeOut" } }
                      : { duration: 0.6, ease: CURVA }
                }
                onAnimationComplete={() => {
                  if (regresa) setVolviendo(null);
                }}
              >
                {k === 0 ? (
                  <TarjetaFrente reducido={reducido} onSoltar={(dir, desde) => pasar(1, dir, desde)} onTocar={() => pasar(1, 1)}>
                    <Tarjeta caso={caso} numero={i + 1} tema={TEMAS[i % TEMAS.length]} iconoGiro={iconoDeGiro(caso)} />
                  </TarjetaFrente>
                ) : (
                  <div className="h-full">
                    <Tarjeta caso={caso} numero={i + 1} tema={TEMAS[i % TEMAS.length]} iconoGiro={iconoDeGiro(caso)} />
                  </div>
                )}
              </motion.div>
            );
          })}

        {/* La que se va: vuela hacia el lado del pedido, girando. */}
        <AnimatePresence>
          {fantasmas.map((f) => (
            <motion.div
              key={f.id}
              aria-hidden="true"
              className="pointer-events-none [grid-area:1/1]"
              style={{ zIndex: 40 }}
              // transform completo: corre en el compositor (ver RANURAS).
              initial={{ transform: `translate(${f.desde.x}px, 0px) rotate(${f.desde.rotate}deg)`, opacity: 1 }}
              animate={{ transform: `translate(${f.desde.x + f.dir * 620}px, -36px) rotate(${f.dir * 18}deg)`, opacity: 0 }}
              transition={{ duration: 0.62, ease: [0.45, 0, 0.75, 0.6] }}
              onAnimationComplete={() => setFantasmas((todos) => todos.filter((t) => t.id !== f.id))}
            >
              <Tarjeta caso={f.caso} numero={f.numero} tema={TEMAS[f.tema]} iconoGiro={iconoDeGiro(f.caso)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center gap-5">
        <button
          type="button"
          onClick={() => pasar(1, 1)}
          className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3.5 font-display text-[15px] font-bold text-white shadow-[0_14px_30px_-16px_rgba(75,42,147,0.8)] transition-colors duration-300 hover:bg-brand-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {textoBoton}
          <ArrowRight
            size={18}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
        <p className="font-display text-lg font-bold tabular-nums text-brand" aria-hidden="true">
          {dos(indice + 1)}
          <span className="text-sm font-semibold text-ink-subtle"> / {dos(n)}</span>
        </p>
        {pista && (
          <p
            aria-hidden="true"
            className="hidden items-center gap-2 rounded-full bg-accent/10 px-3.5 py-2 font-sans text-[13px] font-semibold text-brand sm:inline-flex"
          >
            <HandTap size={16} weight="duotone" className="text-accent" />
            {pista}
          </p>
        )}
      </div>

      {/* Paso automático: cuánto falta para el siguiente caso. */}
      <div aria-hidden="true" className="mt-4 h-[3px] w-full max-w-[220px] overflow-hidden rounded-full bg-brand/10">
        {progreso && (
          <motion.span
            key={`${indice}-${progreso.ms}`}
            className="block h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--color-brand-lift),var(--color-accent))]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: progreso.ms / 1000, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}
