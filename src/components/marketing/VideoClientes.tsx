"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import type { FormatoVideo, ImagenSanity } from "@/lib/marketing-digital";

/**
 * Video de la columna derecha de Clientes. El archivo, su formato y su
 * portada se cargan en el Studio: cambiar el video no toca codigo.
 *
 * REPRODUCCION: en silencio, en bucle y en linea (muted + loop + playsInline),
 * y SOLO mientras esta en pantalla: fuera de pantalla se pausa (bateria y
 * datos en movil). Con movimiento reducido no arranca solo: se ve la portada
 * y el visitante decide.
 *
 * CONTROLES MINIMOS: pausa/reproduccion siempre (un video que se mueve solo
 * tiene que poder detenerse) y sonido solo si el editor lo activa.
 *
 * PROPORCION: el marco toma el formato elegido en el Studio y el video lo
 * llena con object-cover: nunca se deforma. En escritorio el vertical se
 * estira al alto del carrusel de al lado (recorte minimo, columnas parejas);
 * cuadrado y horizontal mantienen su proporcion y se centran en alto.
 */

const MARCO: Record<FormatoVideo, string> = {
  vertical: "mx-auto aspect-[9/16] w-full max-w-[360px] lg:aspect-auto lg:h-full lg:max-w-none",
  // Cuadrado y horizontal conservan su proporcion tambien en escritorio y se
  // centran en alto: estirarlos al alto del carrusel recortaba 23% del cuadro.
  cuadrado: "mx-auto aspect-square w-full max-w-[520px] lg:max-w-none",
  horizontal: "aspect-video w-full",
};

const BOTON =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function VideoClientes({
  url,
  formato,
  sonido,
  portada,
  titulo,
}: {
  url: string;
  formato: FormatoVideo;
  sonido: boolean;
  portada: ImagenSanity | null;
  titulo: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const pausaManual = useRef(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [silenciado, setSilenciado] = useState(true);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // La propiedad, no solo el atributo: es la que habilita el autoplay.
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !pausaManual.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function alternarReproduccion() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      pausaManual.current = false;
      v.play().catch(() => {});
    } else {
      pausaManual.current = true;
      v.pause();
    }
  }

  function alternarSonido() {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setSilenciado(v.muted);
    if (!v.muted && v.paused) {
      pausaManual.current = false;
      v.play().catch(() => {});
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-deep shadow-[0_32px_64px_-36px_rgba(26,15,61,0.6)] ${MARCO[formato]}`}
    >
      <video
        ref={video}
        src={url}
        poster={portada?.url}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Video: ${titulo}`}
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-abyss/55 to-transparent"
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        {sonido && (
          <button
            type="button"
            onClick={alternarSonido}
            aria-label={silenciado ? "Activar sonido" : "Silenciar"}
            className={BOTON}
          >
            {silenciado ? <SpeakerSlash size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
          </button>
        )}
        <button
          type="button"
          onClick={alternarReproduccion}
          aria-label={reproduciendo ? "Pausar video" : "Reproducir video"}
          className={BOTON}
        >
          {reproduciendo ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
      </div>
    </div>
  );
}
