"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Aparicion al entrar en pantalla.
 *
 * Isla de cliente reutilizable: permite que las secciones que la usan sigan
 * renderizandose en el servidor en vez de volverse componentes de cliente
 * completos solo para animar.
 *
 * Motivo de la animacion: ordena la lectura por bloques al hacer scroll.
 * Se ejecuta una sola vez por elemento, no en cada pasada.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
