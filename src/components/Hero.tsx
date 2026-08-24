"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { WaveText } from "./WaveText";
import { OceanCurrent } from "./OceanCurrent";

/**
 * Hero manifiesto.
 *
 * Composicion: el eslogan a la izquierda y la marca flotando a la derecha.
 *
 * Se usa la MARCA SOLA (el delfin), no el lockup completo, porque el lockup
 * lleva dibujado "DOFi" y "AGENCIA CREATIVA", y esa firma ya aparece bajo el
 * titular. Con el lockup, las mismas palabras saldrian dos veces en la misma
 * pantalla. Para cambiarlo, apuntar src a /logo-dofi.png y borrar el <p> de
 * la firma.
 *
 * La flotacion comparte duracion y curva con la onda de las letras, asi las
 * dos animaciones leen como el mismo oleaje.
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#2A1760_0%,#170D33_50%,#120A26_100%)]"
      />
      <OceanCurrent className="absolute inset-0 h-full w-full opacity-40" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-abyss to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-5 pt-24 pb-12 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-0 lg:pb-0">
        {/* Marca. En movil va arriba del titular; en desktop, a su derecha. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="order-first w-[48vw] max-w-[220px] lg:order-last lg:w-[28vw] lg:max-w-[430px]"
        >
          <Image
            src="/logo-dofi-mark.png"
            alt=""
            width={512}
            height={285}
            priority
            aria-hidden="true"
            className="logo-float h-auto w-full"
          />
        </motion.div>

        <div>
          <h1 className="font-display font-extrabold leading-[0.92] tracking-tighter text-foam">
            <span className="block text-[clamp(3.2rem,10vw,9rem)]">
              <WaveText text="Un mar" />
            </span>
            <span className="block text-[clamp(3.2rem,10vw,9rem)]">
              <WaveText text="de ideas" delay={0.18} />
            </span>
          </h1>

          {/* LCP: este parrafo es el elemento mas grande que el navegador
              alcanza a pintar en movil, y con opacity 0 + delay 0.95s +
              duration 1s la metrica medida era de 4,37s en 4G lento, con el
              contenido listo desde 1,8s. La rompia la animacion, no la red.

              Solo se desplaza (transform). El texto se pinta en el primer
              frame y la entrada se mantiene. Es el arreglo del Sprint 0.1:
              se conserva aunque el diseño del hero haya vuelto atras. */}
          <motion.p
            initial={reduce ? false : { y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 font-display text-xs font-light uppercase tracking-[0.32em] text-mist sm:text-sm sm:tracking-[0.55em]"
          >
            DOFI Agencia Creativa
          </motion.p>
        </div>
      </div>
    </section>
  );
}
