"use client";

import { motion } from "motion/react";

/**
 * Aparicion al entrar en pantalla.
 *
 * Isla de cliente reutilizable: permite que las secciones que la usan sigan
 * renderizandose en el servidor en vez de volverse componentes de cliente
 * completos solo para animar.
 *
 * Motivo de la animacion: ordena la lectura por bloques al hacer scroll.
 * Se ejecuta una sola vez por elemento, no en cada pasada.
 *
 * `y`: desplazamiento vertical inicial, 24px por defecto -- identico al
 * comportamiento de siempre, asi que ningun llamador existente cambia.
 * `ContentBanner.tsx` pasa 20 para una entrada un poco mas corta.
 *
 * FIX DE ACCESIBILIDAD (bug preexistente de este componente, beneficia a
 * todos sus usuarios: Tools/Socio/Clients/ContentBanner):
 * -----------------------------------------------------------------
 * `useReducedMotion()` de motion/react usa `useState(prefersReducedMotion
 * .current)` (valor plano, no un initializer perezoso) y ese modulo
 * detecta el media query recien en el cliente (`isBrowser` -- en SSR,
 * `window` no existe, asi que el server SIEMPRE renderiza asumiendo
 * reduce=false). Intentar ramificar el ARBOL (motion.div vs. <div> plano)
 * segun ese valor detectado solo en el cliente genera un mismatch de
 * hidratacion real -- confirmado con Puppeteer: incluso 800ms despues de
 * cargar, con matchMedia(...).matches en true, el motion.div seguia
 * pintado con opacity:0/transform inicial.
 *
 * La solucion no depende de la reactividad (ni del timing) de ese hook:
 * `motion.div` SIEMPRE se renderiza igual (mismo arbol en servidor y
 * cliente, cero mismatch), y un `data-reveal` + regla CSS con
 * `!important` en globals.css fuerza opacity:1/transform:none bajo
 * `prefers-reduced-motion: reduce` -- el navegador evalua ese media query
 * en tiempo real, sin ninguna de las complicaciones de SSR/hidratacion de
 * React. Mismo mecanismo (CSS puro) que ya se verifico funcionando para
 * el glow de las tarjetas de capacidades. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  duration = 0.75,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  /** Duracion en segundos. 0,75 por defecto -- el valor de siempre, asi que
   *  ningun llamador existente cambia. El CTA de los banners pasa 0,6. */
  duration?: number;
}) {
  return (
    <motion.div
      data-reveal="true"
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
