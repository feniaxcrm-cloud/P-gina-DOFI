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
 * `x`/`y` (Sprint "Mejorar diseño visual de las 4 secciones de contenido",
 * §17-20): desplazamiento inicial configurable -- por defecto `y: 24, x: 0`,
 * IDENTICO al comportamiento de siempre, asi que ningun llamador existente
 * (Tools/Socio/Services/etc.) cambia. `ContentSection.tsx` es el unico que
 * pasa `x` distinto de 0, para que la imagen entre desde el lado que le
 * corresponde segun la alternancia.
 *
 * FIX DE ACCESIBILIDAD (mismo sprint, bug preexistente, no introducido por
 * el sprint de las 4 secciones -- el fix beneficia tambien a Tools/Socio/
 * Services, que ya usaban <Reveal>):
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
  x = 0,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      data-reveal="true"
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
