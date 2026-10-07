"use client";

import { useEffect, useRef, useState } from "react";
import { FilmSlate, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
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
 * TAMAÑO: en escritorio el marco ocupa toda su columna (el ~45% del ancho) y
 * el alto completo del cuerpo de la sección, que mide una pantalla (ver
 * MarcoClientes): siempre se ve entero. En telefono y tablet, 4:5.
 *
 * AJUSTE (desde el Studio), sin deformar nunca:
 *  - "rellenar": el video cubre el marco (object-cover; puede recortar bordes).
 *  - "completo": se ve entero (object-contain) sobre el fondo de marca.
 *
 * REPRODUCCION: en silencio, en bucle y en linea (muted + loop + playsInline),
 * solo mientras esta en pantalla. Con movimiento reducido no arranca solo.
 * Sin boton de play/pausa: corre solo (pedido del 2026-10-07). El unico
 * control es el del sonido, y solo si el editor lo activa.
 */

const MARCO =
  "relative w-full overflow-hidden rounded-[28px] aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full shadow-[0_32px_64px_-36px_rgba(26,15,61,0.6)]";

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
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [url]);

  if (!video) return <VideoVacio />;

  function alternarSonido() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSilenciado(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
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
      </div>
    </div>
  );
}
