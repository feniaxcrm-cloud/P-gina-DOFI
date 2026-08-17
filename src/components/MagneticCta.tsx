"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

/**
 * CTA con atraccion magnetica al cursor.
 * Motivo de la animacion: retroalimentacion tactil sobre la accion principal
 * de la pagina. Los valores viven en motion values, nunca en estado de React.
 */
export function MagneticCta({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-7 py-3.5 font-display text-sm font-semibold tracking-wide transition-colors duration-300 active:scale-[0.98]";

  // Sin halo de color: el naranja pesa lo suficiente por si mismo y el glow
  // era lo que hacia ver la pagina saturada. Solo una sombra tintada suave.
  const skin =
    variant === "primary"
      ? "bg-accent text-[#1A0F3D] hover:bg-accent-lift shadow-[0_8px_24px_-14px_rgba(244,123,32,0.5)]"
      : "border border-brand-lift/40 bg-transparent text-foam hover:border-mist/60";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`${base} ${skin} ${className}`}
    >
      {children}
    </motion.a>
  );
}
