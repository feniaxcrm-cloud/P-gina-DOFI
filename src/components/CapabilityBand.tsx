"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ShareNetwork, Megaphone, ChartLineUp, Lifebuoy } from "@phosphor-icons/react";
import { useCallback, useRef, useState, type PointerEvent } from "react";
import type { Capacidad } from "@/lib/sanity";

/**
 * Banda de capacidades — 4 tarjetas editables desde Sanity (Replanteo
 * Navbar + Hero + Sanity, §30-53). Contenido e iconos reemplazados en
 * "Corrección del Hero + actualización de tarjetas" §13-17.
 *
 * ICONOS: SELECTOR CONTROLADO, NO SVG ARBITRARIO (spec §35-37 del sprint
 * original; eleccion de icono por tarjeta en el §15-16 de este sprint)
 * -----------------------------------------------------------------
 * Sanity solo guarda una clave de string (`icono`); este mapa la traduce a
 * un componente Phosphor real. Ningun contenido de Sanity decide el SVG
 * que se renderiza — asi el stroke, tamaño y familia quedan consistentes
 * pase lo que pase en el Studio. Misma familia/peso que antes (weight
 * "bold", 32px) — solo cambia que icono representa cada tarjeta:
 *   social  (Redes Sociales)          -> ShareNetwork
 *   ads     (Pauta en TikTok y Meta)  -> Megaphone
 *   growth  (+3M Vendidos en Redes)   -> ChartLineUp
 *   rescue  (Rescatando Emprendedores)-> Lifebuoy
 */
const ICONOS = {
  social: ShareNetwork,
  ads: Megaphone,
  growth: ChartLineUp,
  rescue: Lifebuoy,
} as const;

/**
 * Detecta una sola vez, al montar, si el dispositivo soporta hover real
 * con puntero preciso (`hover: hover` + `pointer: fine`). Se usa para NO
 * adjuntar el listener de pointermove en absoluto en touch/tablet (spec
 * §13-14: "no ejecutar listeners innecesarios", no solo ocultar por CSS).
 * El inicializador de useState corre de nuevo en el cliente durante la
 * hidratacion (no se serializa desde el server), asi que `window` ya
 * existe para cuando importa -- no hace falta un useEffect aparte.
 */
function useHoverCapable() {
  const [hoverCapable] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
  return hoverCapable;
}

/**
 * HOVER — BORDE ILUMINADO QUE SIGUE EL CURSOR (spec "Nueva animacion
 * hover para las 4 cards")
 * -----------------------------------------------------------------
 * Reemplaza el cambio cromatico de toda la superficie (version anterior)
 * por un glow de borde que trackea al cursor. CERO transform en la
 * tarjeta: nunca se mueve, inclina, rota ni escala (regla dura del
 * sprint) -- lo unico que cambia es la posicion del glow, pintado por un
 * pseudo-elemento enmascarado (ver `.capacidad-card::before` en
 * globals.css). Fuera de hover la tarjeta se ve exactamente igual que
 * antes: sin glow permanente, sin cambio de color en icono/texto.
 *
 * Posicion del cursor -> CSS custom properties escritas DIRECTO al DOM
 * (`el.style.setProperty`), nunca setState de React (spec §7/§17: cero
 * renders extra por movimiento de mouse), y acotadas a un
 * requestAnimationFrame para no saturar el hilo principal si el navegador
 * dispara pointermove mas rapido de lo que se pinta.
 */
function Tarjeta({ titulo, descripcion, icono, enlace }: Capacidad) {
  const Icono = ICONOS[icono];
  const reduce = useReducedMotion();
  const hoverCapable = useHoverCapable();

  const cardRef = useRef<HTMLAnchorElement | HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const nextPos = useRef<{ x: number; y: number } | null>(null);

  const flushPosition = useCallback(() => {
    rafRef.current = null;
    const el = cardRef.current;
    const pos = nextPos.current;
    if (!el || !pos) return;
    el.style.setProperty("--mouse-x", `${pos.x}px`);
    el.style.setProperty("--mouse-y", `${pos.y}px`);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLAnchorElement | HTMLDivElement>) => {
      // Guarda extra ademas del gateo por device (abajo): un dedo
      // arrastrando SI dispara pointermove con pointerType "touch", esto
      // lo ignora sin tocar el DOM.
      if (event.pointerType !== "mouse") return;
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      nextPos.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushPosition);
      }
    },
    [flushPosition]
  );

  // Callback ref compartido entre <Link> (ancla) y <div>: ver comentario
  // de tipos en el render de abajo.
  const setRef = useCallback((node: HTMLAnchorElement | HTMLDivElement | null) => {
    cardRef.current = node;
  }, []);

  const contenido = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-brand/20 bg-brand/8">
        <Icono size={32} weight="bold" aria-hidden="true" className="text-brand" />
      </div>
      {/* min-h-[2lh]: reserva el alto de 2 lineas de titulo SIEMPRE, tenga
          una o dos ("Rescatando Emprendedores" es la unica que envuelve
          hoy) -- asi las 4 descripciones arrancan a la misma altura sin
          importar cuantas lineas ocupe cada titulo (spec §31-34). `lh` es
          una unidad CSS real (line-height del propio elemento): se adapta
          sola al leading que termine aplicando, no es un pixelaje a mano. */}
      <h3 className="mt-4 min-h-[2lh] font-display text-base font-bold leading-snug tracking-tight text-ink md:text-lg">
        {titulo}
      </h3>
      <p className="mt-2 max-w-[34ch] font-sans text-sm leading-relaxed text-ink-muted">
        {descripcion}
      </p>
    </>
  );

  const className =
    "capacidad-card relative flex h-full flex-col rounded-[20px] border border-brand/10 p-6 shadow-[0_1px_2px_rgba(26,15,61,0.06)]";

  // El listener solo se pasa si el dispositivo tiene hover real y el
  // usuario no pidio reduced-motion -- en touch/tablet no se adjunta
  // ningun onPointerMove (spec §13/§14/§16).
  const pointerProps =
    hoverCapable && !reduce ? { onPointerMove: handlePointerMove } : {};

  // Semantica: solo se vuelve link/tarjeta interactiva si trae enlace real
  // (spec §67 del sprint original). Sin enlace, no lleva cursor:pointer ni
  // rol de boton.
  if (enlace) {
    return (
      <Link href={enlace} ref={setRef} className={className} {...pointerProps}>
        {contenido}
      </Link>
    );
  }
  return (
    <div ref={setRef} className={className} {...pointerProps}>
      {contenido}
    </div>
  );
}

export function CapabilityBand({ capacidades }: { capacidades: Capacidad[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {capacidades.map((c, i) => (
        <motion.div
          key={c.titulo}
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: reduce ? 0 : 0.55,
              delay: reduce ? 0 : i * 0.075,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Tarjeta {...c} />
        </motion.div>
      ))}
    </div>
  );
}
