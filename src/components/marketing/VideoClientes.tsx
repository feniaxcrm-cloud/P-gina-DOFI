"use client";

import { useEffect, useRef, useState } from "react";
import { FilmSlate, Pause, Play, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import type { ImagenSanity, VideoSeccion } from "@/lib/marketing-digital";

/**
 * Columna derecha de Clientes: el video de la seccion, cargado en el Studio
 * (cambiarlo o reemplazarlo no toca codigo).
 *
 * LA COLUMNA EXISTE SIEMPRE. Sin video cargado muestra un estado vacio
 * discreto con los colores DOFI -- nunca desaparece y nunca deja al carrusel
 * ocupando todo el ancho. Tampoco se oculta en telefono: ahi va debajo de los
 * logos.
 *
 * TAMAÑO: en escritorio y tablet el marco ocupa toda su columna (el ~45% del
 * ancho) y todo el alto del carrusel de al lado. En telefono, 4:5.
 *
 * AJUSTE (desde el Studio), sin deformar nunca:
 *  - "rellenar": el video cubre el marco (object-cover; puede recortar bordes).
 *  - "completo": se ve entero (object-contain) sobre el fondo de marca.
 *
 * REPRODUCCION: en silencio, en bucle y en linea (muted + loop + playsInline),
 * solo mientras esta en pantalla. Con movimiento reducido no arranca solo.
 * Controles minimos: pausa/reproduccion siempre (un video que se mueve solo
 * tiene que poder detenerse) y sonido solo si el editor lo activa.
 */

const MARCO =
  "relative w-full overflow-hidden rounded-[28px] aspect-[4/5] md:aspect-auto md:h-full md:min-h-[420px] shadow-[0_32px_64px_-36px_rgba(26,15,61,0.6)]";

const BOTON =
  "flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function VideoVacio() {
  return (
    <div
      className={`${MARCO} flex flex-col items-center justify-center gap-4 bg-[radial-gradient(90%_70%_at_80%_100%,rgba(244,123,32,0.22)_0%,rgba(244,123,32,0)_60%),linear-gradient(160deg,#2E1B68_0%,#1A0F3D_55%,#120A26_100%)]`}
    >
      <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 w-full" viewBox="0 0 400 110" preserveAspectRatio="none" fill="none">
        <path d="M0 62 C 70 38, 140 86, 210 62 S 340 38, 400 58" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
        <path d="M0 86 C 80 62, 160 110, 240 86 S 360 62, 400 82" stroke="rgba(244,123,32,0.30)" strokeWidth="1.5" />
      </svg>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm">
        <FilmSlate size={26} weight="duotone" aria-hidden="true" />
      </span>
      <p className="px-8 text-center font-sans text-sm text-white/60">Pronto verás aquí nuestro video.</p>
    </div>
  );
}

export function VideoClientes({
  video,
  portada,
  titulo,
}: {
  video: VideoSeccion | null;
  portada: ImagenSanity | null;
  titulo: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const pausaManual = useRef(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [silenciado, setSilenciado] = useState(true);
  const url = video?.url;

  useEffect(() => {
    const v = ref.current;
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
  }, [url]);

  if (!video) return <VideoVacio />;

  function alternarReproduccion() {
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

  function alternarSonido() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSilenciado(v.muted);
    if (!v.muted && v.paused) {
      pausaManual.current = false;
      v.play().catch(() => {});
    }
  }

  const completo = video.ajuste === "completo";

  return (
    <div className={`${MARCO} ${completo ? "bg-[linear-gradient(160deg,#2E1B68_0%,#120A26_100%)]" : "bg-deep"}`}>
      <video
        ref={ref}
        src={video.url}
        poster={portada?.url}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Video: ${titulo}`}
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        className={`absolute inset-0 h-full w-full ${completo ? "object-contain" : "object-cover"}`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-abyss/55 to-transparent"
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        {video.sonido && (
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
