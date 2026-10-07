"use client";

import { useEffect, useRef } from "react";

/**
 * Un motion graphic en bucle (renderizado con HyperFrames: ver video/ en la
 * raiz del proyecto). Lo usan el hero y "Así trabaja FENIAX" (/chatbots-crm) y
 * el recorrido del ecosistema de Tráfico/Ads.
 *
 * Se reproduce en silencio y en bucle SOLO mientras esta en pantalla; con
 * movimiento reducido no arranca (se ve el poster, que es un cuadro del mismo
 * video con la composicion completa). Sin botones de reproduccion: corre solo
 * (pedido del 2026-10-07).
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

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

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
    </div>
  );
}
