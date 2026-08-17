"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * Retrato de Daniel Vallejo con revelado al entrar en pantalla.
 *
 * Isla de cliente para que la seccion El Socio siga renderizandose en el
 * servidor. Dos capas breves y coordinadas:
 *   1. la tarjeta sube y aparece,
 *   2. la foto dentro hace un zoom que se asienta (1.12 -> 1).
 * El efecto dura menos de un segundo y ordena la mirada hacia el retrato.
 *
 * `overflow-hidden` en la tarjeta recorta el zoom de la foto; no afecta al
 * position:sticky del contenedor padre, que vive un nivel mas arriba.
 */
export function SocioPortrait() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-brand-lift/25 lg:aspect-[5/7]"
    >
      <motion.div
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/media/socio-retrato.jpg"
          alt="Retrato de Daniel Vallejo"
          fill
          sizes="(max-width: 1024px) 100vw, 26rem"
          className="object-cover"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent"
      />
    </motion.div>
  );
}
