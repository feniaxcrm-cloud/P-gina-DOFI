"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Compass, ChatCircle, VideoCamera, Calendar } from "@phosphor-icons/react";

/**
 * Banda de capacidades — reemplaza a las 4 tarjetas sueltas del sprint de
 * motion anterior (HeroCards.tsx). Mismo copy exacto, mismo comportamiento
 * (aparecen una vez, después quedan físicamente estáticas, glow de borde
 * que sigue al cursor) pero reempaquetado como UN solo contenedor con
 * divisores internos — "banda", no 4 tarjetas separadas — para que lea
 * como la pieza superpuesta al Hero que pide la referencia, en superficie
 * `surface-raised` con borde lila, nunca tarjetas blancas.
 */
const CAPACIDADES = [
  {
    titulo: "Planificación Estratégica",
    descripcion: "Definimos objetivos, enfoque y ruta de acción.",
    Icono: Compass,
  },
  {
    titulo: "Conversación",
    descripcion: "Creamos interacción que genera confianza e interés.",
    Icono: ChatCircle,
  },
  {
    titulo: "Producción Audiovisual",
    descripcion: "Producimos piezas visuales que captan atención.",
    Icono: VideoCamera,
  },
  {
    titulo: "Publicación de Contenido",
    descripcion: "Publicamos con constancia, orden y propósito.",
    Icono: Calendar,
  },
] as const;

/** Ver Hero DOFI V1 (sprint de motion anterior) para el detalle completo de
 *  la técnica: --mouse-x/--mouse-y se escriben directo sobre el nodo DOM
 *  en pointermove (sin setState), el glow es un pseudo-elemento CSS
 *  (.card-glow::before en globals.css) recortado a un anillo del grosor
 *  del borde. Sin cambios de técnica en este sprint, solo de empaquetado
 *  visual (banda unica con divisores en vez de 4 tarjetas con gap). */
function useGlowSeguidor(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alMover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", alMover);
    return () => el.removeEventListener("pointermove", alMover);
  }, [ref]);
}

function Modulo({
  titulo,
  descripcion,
  Icono,
}: {
  titulo: string;
  descripcion: string;
  Icono: typeof Compass;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGlowSeguidor(ref);

  return (
    <div ref={ref} className="card-glow relative p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-brand-lift/25 bg-brand-lift/10">
        <Icono size={32} weight="bold" aria-hidden="true" className="text-brand-lift" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold tracking-tight text-fg-primary md:text-lg">
        {titulo}
      </h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-fg-muted">
        {descripcion}
      </p>
    </div>
  );
}

export function CapabilityBand() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="overflow-hidden rounded-[20px] border border-brand-lift/15 bg-surface-raised/95 backdrop-blur-sm"
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* divide-x/divide-y de Tailwind ya inserta el borde SOLO entre
          elementos (selector interno `& > * + *`), asi que alcanza con
          declararlo una vez en el contenedor — no hace falta logica por
          hijo para saltarse el primero/ultimo. */}
      <div className="grid grid-cols-1 divide-y divide-brand-lift/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {CAPACIDADES.map((c, i) => (
          <motion.div
            key={c.titulo}
            variants={{
              oculto: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: reduce ? 0 : 0.55,
                  delay: reduce ? 0 : i * 0.075,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            <Modulo titulo={c.titulo} descripcion={c.descripcion} Icono={c.Icono} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
