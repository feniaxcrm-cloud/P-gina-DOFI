"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";

/**
 * "Así trabaja FENIAX": el video del bloque editorial. Es un motion graphic
 * renderizado con HyperFrames (fuente en video/flujo-feniax/, ver su
 * README): los mensajes de WhatsApp, Instagram, Facebook y la web entran,
 * la IA los responde y cada uno avanza por el embudo del CRM hasta la venta.
 *
 * Se reproduce en silencio y en bucle SOLO mientras está en pantalla; con
 * movimiento reducido no arranca (se ve el póster, que es un cuadro del
 * mismo video con el embudo completo). Siempre tiene botón de pausa.
 */
export function VideoFlujo({ className = "" }: { className?: string }) {
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

  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-deep shadow-[0_40px_80px_-36px_rgba(0,0,0,0.8)] ${className}`}>
      <video
        ref={ref}
        src="/feniax/flujo-feniax.mp4"
        poster="/feniax/flujo-feniax.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-label="Animación: los mensajes de WhatsApp, Instagram, Facebook y la web llegan a FENIAX, la IA los responde y cada cliente avanza por el embudo del CRM hasta la venta."
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        className="block aspect-square h-auto w-full object-cover"
      />
      <button
        type="button"
        onClick={alternar}
        aria-label={reproduciendo ? "Pausar animación" : "Reproducir animación"}
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {reproduciendo ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
      </button>
    </div>
  );
}
