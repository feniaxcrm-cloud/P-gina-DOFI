"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Parallax ligero para las fotos de fondo (banners 1 y 7 de Marketing
 * Digital): la imagen se desplaza unos pocos pixeles mas lento que el
 * scroll, lo justo para dar profundidad sin marear.
 *
 * COMO NO DEJA HUECOS
 * -----------------------------------------------------------------
 * La capa movil es 48px mas alta arriba y abajo que el contenedor
 * (-top-12/-bottom-12) y se desplaza como mucho `intensidad` px (40 por
 * defecto). Como 40 < 48, nunca asoma un borde vacio por encima ni por
 * debajo de la foto.
 *
 * MOVIMIENTO REDUCIDO
 * -----------------------------------------------------------------
 * No se ramifica el arbol segun useReducedMotion(): ese hook lee el valor en
 * SSR como false y no es confiable para esto (ver la nota de Reveal.tsx).
 * En su lugar la capa lleva data-parallax, y globals.css le fuerza
 * transform:none con !important bajo prefers-reduced-motion. El navegador
 * evalua esa media query en tiempo real, sin tocar React.
 *
 * Solo se usa en FOTOS. Las piezas graficas terminadas nunca llevan
 * parallax: moverlas seria mostrarlas distinto de como fueron diseñadas.
 */
export function Parallax({
  children,
  className,
  intensidad = 40,
}: {
  children: React.ReactNode;
  className?: string;
  intensidad?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-intensidad, intensidad]);

  return (
    <div ref={ref} className={className}>
      <motion.div data-parallax="true" style={{ y }} className="absolute inset-x-0 -bottom-12 -top-12">
        {children}
      </motion.div>
    </div>
  );
}
