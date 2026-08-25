"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Las 4 tarjetas del Hero — creadas en el sprint "Motion final" porque el
 * brief de motion las daba por existentes y no lo estaban. Copy exacto tal
 * como lo dio el propietario, sin inventar nada.
 *
 * REGLA DEL SPRINT: aparecen una vez y despues quedan FISICAMENTE
 * estaticas. Solo el glow de borde reacciona al cursor — la tarjeta en si
 * nunca se mueve, inclina, rota ni escala.
 */
const TARJETAS = [
  {
    titulo: "Planificación Estratégica",
    descripcion: "Definimos objetivos, enfoque y ruta de acción.",
  },
  {
    titulo: "Conversación",
    descripcion: "Creamos interacción que genera confianza e interés.",
  },
  {
    titulo: "Producción Audiovisual",
    descripcion: "Producimos piezas visuales que captan atención.",
  },
  {
    titulo: "Publicación de Contenido",
    descripcion: "Publicamos con constancia, orden y propósito.",
  },
] as const;

/**
 * Glow de borde que sigue al cursor.
 *
 * Tecnica: --mouse-x/--mouse-y se escriben DIRECTO sobre el elemento via
 * `style.setProperty` dentro del listener de `pointermove` — nunca por
 * `setState`, para no forzar un rerender de React en cada movimiento (regla
 * del sprint, punto 17/23). El brillo en si es un pseudo-elemento CSS
 * (`.card-glow::before`, ver globals.css) posicionado con esas variables y
 * recortado a un anillo del grosor del borde con `mask-composite: exclude`
 * — no es un box-shadow parejo alrededor de toda la tarjeta.
 *
 * `@media (hover: hover) and (pointer: fine)` en el propio CSS es lo que
 * apaga el efecto en touch: en mobile el borde se queda en su estado
 * normal, sin intentar simular el seguimiento del dedo.
 */
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

function Tarjeta({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGlowSeguidor(ref);

  return (
    <div
      ref={ref}
      className="card-glow relative overflow-hidden rounded-[20px] border border-brand-lift/25 bg-surface/40 p-6"
    >
      <h3 className="font-display text-lg font-bold tracking-tight text-fg-primary">
        {titulo}
      </h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-fg-muted">
        {descripcion}
      </p>
    </div>
  );
}

export function HeroCards() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {TARJETAS.map((t, i) => (
        <motion.div
          key={t.titulo}
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
          <Tarjeta titulo={t.titulo} descripcion={t.descripcion} />
        </motion.div>
      ))}
    </motion.div>
  );
}
