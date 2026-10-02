"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";

/**
 * Un motion graphic en bucle (renderizado con HyperFrames: ver video/ en la
 * raiz del proyecto). Lo usan el hero y "Así trabaja FENIAX" (/chatbots-crm) y
 * el recorrido del ecosistema de Tráfico/Ads.
 *
 * Se reproduce en silencio y en bucle SOLO mientras esta en pantalla; con
 * movimiento reducido no arranca (se ve el poster, que es un cuadro del mismo
 * video con la composicion completa). Siempre tiene boton de pausa: un
 * movimiento continuo tiene que poder detenerse.
 *
 * VARIANTES
 *  - "tarjeta" (por defecto): el video dentro de una tarjeta cuadrada con
 *    borde y sombra.
 *  - "flotante": sin tarjeta; el video termina con bordes difuminados y se
 *    funde con el fondo de la seccion (el video se renderiza con el mismo
 *    fondo morado). Para el hero, donde una tarjeta con borde se leeria como
 *    "un video pegado".
 *
 * `prioridad` (hero): descarga el video de entrada en vez de esperar a que
 * llegue a pantalla, y el poster no se difiere.
 */
export function VideoBucle({
  src,
  poster,
  descripcion,
  variante = "tarjeta",
  prioridad = false,
  className = "",
}: {
  src: string;
  poster: string;
  /** Lo que muestra la animacion, para lectores de pantalla. */
  descripcion: string;
  variante?: "tarjeta" | "flotante";
  prioridad?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const pausaManual = useRef(false);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !pausaManual.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function alternar() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      pausaManual.current = false;
      v.play().catch(() => {});
    } else {
      pausaManual.current = true;
      v.pause();
    }
  }

  const flotante = variante === "flotante";

  return (
    <div
      className={`relative ${
        flotante ? "" : "overflow-hidden rounded-[28px] border border-white/10 bg-deep shadow-[0_40px_80px_-36px_rgba(0,0,0,0.8)]"
      } ${className}`}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={prioridad ? "auto" : "none"}
        aria-label={descripcion}
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        className="block aspect-square h-auto w-full object-cover"
        style={
          flotante
            ? {
                // Cuatro bordes que se desvanecen: el cuadrado del video no se nota.
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
                maskComposite: "intersect",
              }
            : undefined
        }
      />
      <button
        type="button"
        onClick={alternar}
        aria-label={reproduciendo ? "Pausar animación" : "Reproducir animación"}
        className={`absolute flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          flotante ? "bottom-[5%] right-[5%]" : "bottom-4 right-4"
        }`}
      >
        {reproduciendo ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
      </button>
    </div>
  );
}
