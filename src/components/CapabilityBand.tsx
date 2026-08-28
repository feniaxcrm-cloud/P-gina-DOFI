"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ShareNetwork, Megaphone, ChartLineUp, Lifebuoy } from "@phosphor-icons/react";
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
 * HOVER — CAMBIO CROMATICO, NO GLOW DE CURSOR (spec §40-44)
 * -----------------------------------------------------------------
 * Reemplaza por completo la tecnica anterior (--mouse-x/--mouse-y +
 * spotlight radial que seguia el puntero, ver globals.css). La tarjeta ya
 * no necesita listeners de pointermove ni refs: es un simple hover CSS
 * (`.capacidad-card` + `::before`, ver globals.css) que cross-fadea de
 * blanco a degradado DOFI. CERO transform: la tarjeta nunca se mueve,
 * inclina, rota ni escala (regla dura del sprint).
 */
function Tarjeta({ titulo, descripcion, icono, enlace }: Capacidad) {
  const Icono = ICONOS[icono];

  const contenido = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-brand/20 bg-brand/8 transition-colors duration-300 group-hover:border-white/30 group-hover:bg-white/15">
        <Icono
          size={32}
          weight="bold"
          aria-hidden="true"
          className="text-brand transition-colors duration-300 group-hover:text-white"
        />
      </div>
      <h3 className="mt-4 font-display text-base font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-white md:text-lg">
        {titulo}
      </h3>
      <p className="mt-2 max-w-[34ch] font-sans text-sm leading-relaxed text-ink-muted transition-colors duration-300 group-hover:text-white/90">
        {descripcion}
      </p>
    </>
  );

  const className =
    "capacidad-card group relative flex flex-col rounded-[20px] border border-brand/10 p-6 shadow-[0_1px_2px_rgba(26,15,61,0.06)]";

  // Semantica: solo se vuelve link/tarjeta interactiva si trae enlace real
  // (spec §67). Sin enlace, no lleva cursor:pointer ni rol de boton.
  if (enlace) {
    return (
      <Link href={enlace} className={className}>
        {contenido}
      </Link>
    );
  }
  return <div className={className}>{contenido}</div>;
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
