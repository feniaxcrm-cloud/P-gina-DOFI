"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Megaphone, Funnel, Sparkle, ArrowUpRight } from "@phosphor-icons/react";

const icons = { megaphone: Megaphone, funnel: Funnel, sparkle: Sparkle };

export type ServiceIcon = keyof typeof icons;

export type Service = {
  name: string;
  body: string;
  /** Lo que incluye. Metadato fino bajo la descripcion. Opcional: el
   *  esquema de Sanity (seccionHacemos.tarjetas) no trae este campo. */
  includes?: string;
  icon: ServiceIcon;
};

/**
 * Fila interactiva de la lista de servicios.
 *
 * Es la unica isla de cliente de la seccion: el resto se renderiza en el
 * servidor. La microanimacion tiene tres capas coordinadas, todas de
 * transform y color, ninguna de layout:
 *   1. la superficie se revela desde el lado por el que entra el cursor,
 *   2. el contenido gana sangria,
 *   3. icono y flecha pasan al acento.
 *
 * En movil no hay hover, asi que nada de esto oculta informacion: en reposo
 * la fila ya muestra todo.
 */
export function ServiceRow({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { name, body, includes } = service;
  const Icon = icons[service.icon];

  const onEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty(
      "--origin",
      e.clientX - r.left < r.width / 2 ? "left" : "right"
    );
  };

  return (
    <motion.li
      ref={ref}
      onMouseEnter={onEnter}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative border-b border-brand-lift/20"
    >
      <span
        aria-hidden="true"
        className="service-sweep absolute inset-0 bg-[linear-gradient(100deg,#231352_0%,#1A0F3D_60%,#120A26_100%)]"
      />

      <div className="relative grid grid-cols-1 items-start gap-6 px-2 py-12 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:px-6 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,22rem)_auto] md:items-center md:gap-10 md:py-16">
        <Icon
          size={30}
          weight="duotone"
          className="text-mist transition-colors duration-500 group-hover:text-accent"
        />

        <h3 className="font-display text-3xl font-extrabold tracking-tighter text-foam md:text-5xl">
          {name}
        </h3>

        <div>
          <p className="font-sans text-base leading-relaxed text-mist">{body}</p>
          {includes && (
            <p className="mt-3 font-sans text-sm leading-relaxed text-mist-dim">
              {includes}
            </p>
          )}
        </div>

        <ArrowUpRight
          size={26}
          weight="bold"
          aria-hidden="true"
          className="hidden text-mist-dim transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent md:block"
        />
      </div>
    </motion.li>
  );
}
