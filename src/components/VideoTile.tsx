"use client";

import Image from "next/image";
import { useState } from "react";
import { Play, WarningCircle } from "@phosphor-icons/react";
import type { VideoSource } from "@/data/clients";

const ratioClass: Record<VideoSource["ratio"], string> = {
  "16/9": "aspect-video",
  "9/16": "aspect-[9/16]",
  "1/1": "aspect-square",
};

/**
 * Pieza de video con sus tres estados: portada, cargando y error.
 * El error importa: mientras no exista el mp4 real en /public/videos,
 * la tarjeta debe decirlo con claridad en vez de mostrar un cuadro negro.
 */
export function VideoTile({ video }: { video: VideoSource }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">(
    "idle"
  );

  const play = () => setState(video.kind === "file" ? "loading" : "playing");

  return (
    <figure className="group">
      <div
        className={`relative overflow-hidden rounded-[20px] border border-brand-lift/25 bg-deep ${ratioClass[video.ratio]}`}
      >
        {state === "idle" && (
          <>
            <Image
              src={video.poster}
              alt={`Fotograma de ${video.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/25 to-transparent"
            />
            <button
              type="button"
              onClick={play}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Reproducir ${video.title}`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-foam/25 bg-abyss/45 text-foam backdrop-blur-md transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#1A0F3D] active:scale-95">
                <Play size={24} weight="fill" />
              </span>
            </button>
          </>
        )}

        {state === "loading" && (
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(100deg,#241553_20%,#3B1F7A_45%,#241553_70%)]" />
        )}

        {(state === "loading" || state === "playing") &&
          video.kind === "file" && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              onCanPlay={() => setState("playing")}
              onError={() => setState("error")}
            />
          )}

        {state === "playing" && video.kind === "youtube" && (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.src}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        {state === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <WarningCircle size={28} weight="duotone" className="text-accent" />
            <p className="font-sans text-sm text-mist">
              Falta el archivo de video en{" "}
              <code className="text-foam">{video.src}</code>
            </p>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="rounded-full border border-brand-lift/50 px-4 py-2 font-display text-xs font-semibold text-foam transition-colors hover:border-accent/70"
            >
              Volver a la portada
            </button>
          </div>
        )}
      </div>

      <figcaption className="mt-4">
        <p className="font-display text-base font-semibold tracking-tight text-foam">
          {video.title}
        </p>
        <p className="mt-1 font-sans text-sm text-mist-dim">{video.format}</p>
      </figcaption>
    </figure>
  );
}
