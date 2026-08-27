"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

const steps = [
  {
    verb: "Escuchamos",
    body: "Una sesión para entender el negocio, no solo el pedido. Qué se vende, a quién y con qué margen.",
  },
  {
    verb: "Creamos",
    body: "Concepto y línea gráfica. Sale una idea con dirección, no cinco propuestas sueltas.",
  },
  {
    verb: "Producimos",
    body: "Rodaje, edición y adaptaciones por formato. Todo listo para pautar.",
  },
  {
    verb: "Conectamos",
    body: "FENIAX monta el CRM y el bot. Cada mensaje que llega queda registrado y asignado.",
  },
  {
    verb: "Medimos",
    body: "Reporte mensual con costo por lead y cierre real. Lo que no funciona se corrige.",
  },
];

/**
 * Recorrido de trabajo.
 * Motivo de la animacion: la linea que se llena con el scroll comunica avance
 * y ordena la lectura secuencial de las etapas.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      id="proceso"
      className="relative bg-[linear-gradient(180deg,var(--color-canvas)_0%,var(--color-canvas-raised)_100%)] py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <h2 className="max-w-[22ch] font-display text-4xl font-extrabold leading-[1.05] tracking-tighter text-ink md:text-5xl">
          Cómo entra una marca al agua
        </h2>

        <div ref={ref} className="relative mt-16 pl-10 md:pl-20">
          {/* Riel */}
          <div
            aria-hidden="true"
            className="absolute left-[3px] top-2 h-[calc(100%-3rem)] w-px bg-brand-lift/25 md:left-[13px]"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : fill }}
            className="absolute left-[3px] top-2 h-[calc(100%-3rem)] w-px origin-top bg-accent md:left-[13px]"
          />

          <ol className="flex flex-col gap-14 md:gap-20">
            {steps.map((s, i) => (
              <motion.li
                key={s.verb}
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Flexbox en vez de "top" fijo: el punto queda centrado con
                    el titulo via items-center, sin depender de un offset en
                    pixeles calculado a ojo. El -ml- reproduce la misma
                    posicion horizontal de antes (el punto cae sobre el riel,
                    fuera del padding del contenedor). */}
                <div className="-ml-10 flex items-center gap-6 md:-ml-20 md:gap-10">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent md:h-2 md:w-2"
                  />
                  <h3 className="font-display text-3xl font-extrabold tracking-tighter text-ink md:text-4xl">
                    {s.verb}
                  </h3>
                </div>
                <p className="mt-3 max-w-[52ch] font-sans text-lg leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
