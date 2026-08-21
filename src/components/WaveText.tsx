"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Tipografia cinetica del hero.
 *
 * Dos capas de movimiento, deliberadamente separadas:
 *
 *  1. ENTRADA (Motion): cada letra sube en cascada. Comunica que la pagina
 *     acaba de cargar y ordena la lectura de izquierda a derecha.
 *
 *     La cascada es SOLO de transform, sin opacity. Antes cada letra nacia
 *     invisible y aparecia con un desfase de hasta ~1,3s contando el delay
 *     por indice mas la duracion; como el H1 es el bloque de texto mas
 *     grande del hero, ese retraso entraba directo en la LCP. Con transform
 *     puro el texto se pinta en el primer frame y la cascada se conserva:
 *     el efecto sigue viendose, la metrica deja de pagarlo.
 *  2. ONDA CONTINUA (CSS): cada letra oscila en vertical con un desfase
 *     proporcional a su indice, asi la onda viaja a traves de la palabra en
 *     vez de hacer que todas floten a la vez. Es la metafora del mar.
 *
 * La onda va en CSS y no en JS a proposito: es una animacion perpetua, y el
 * compositor del navegador la resuelve sin ocupar el hilo principal.
 *
 * Accesibilidad: el contenedor lleva el texto completo como aria-label y las
 * letras quedan ocultas al lector de pantalla, que si no leeria "U-n m-a-r".
 */
export function WaveText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  let index = 0;

  return (
    <span aria-label={text} className={`inline-block ${className}`}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {[...word].map((char, c) => {
            const i = index++;
            return (
              <motion.span
                key={`${char}-${c}`}
                aria-hidden="true"
                className="inline-block"
                initial={reduce ? false : { y: "0.5em" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: delay + i * 0.035,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span
                  className="wave-letter inline-block"
                  style={{ animationDelay: `${-i * 0.13}s` }}
                >
                  {char}
                </span>
              </motion.span>
            );
          })}
          {w < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
