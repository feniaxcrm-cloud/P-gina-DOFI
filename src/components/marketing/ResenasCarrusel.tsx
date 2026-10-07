"use client";

import { useState } from "react";
import { ArrowUpRight, Star } from "@phosphor-icons/react";
import type { Resena } from "@/lib/marketing-digital";

/**
 * Reseñas que SE DESLIZAN SOLAS (pedido del 2026-10-07: "en todas las
 * paginas"). Una franja continua, como la fila de logos de un giro en
 * Clientes cuando no entra: mismo mecanismo (.wall-track: la tira duplicada
 * viaja de 0 a -50% y el bucle no tiene costura), mismos bordes desvanecidos.
 *
 * NUNCA IMPIDE LEER
 *  - Se detiene con el cursor encima o con el foco de teclado adentro, y en
 *    telefono mientras el dedo esta apoyado.
 *  - Velocidad baja y constante en px/s: la duracion sale de la cantidad de
 *    tarjetas, asi 3 o 30 reseñas se mueven igual de lento.
 *  - Con movimiento reducido no se mueve: la franja pasa a desplazamiento
 *    manual y se ve cada reseña una sola vez (reglas de .wall-track en
 *    globals.css).
 *
 * POCAS RESEÑAS: la lista se repite hasta llenar una pantalla ancha, para que
 * la franja nunca muestre un hueco. Solo la primera aparicion de cada reseña
 * existe para lectores de pantalla y teclado; las repeticiones van
 * aria-hidden y sin enlaces enfocables.
 */

/** Ancho de una tarjeta en escritorio (420) mas la separacion (20). */
const PASO_PX = 440;
const PX_POR_SEGUNDO = 32;
/** Tarjetas minimas por vuelta: llenan una pantalla de 2560 px sin hueco. */
const MINIMO_POR_VUELTA = 7;

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={17}
          weight={i <= n ? "fill" : "regular"}
          aria-hidden="true"
          className={i <= n ? "text-accent" : "text-ink-subtle/40"}
        />
      ))}
    </div>
  );
}

function Tarjeta({ r, repeticion }: { r: Resena; repeticion: boolean }) {
  const metadato = [r.empresa, r.fecha].filter(Boolean).join(" · ");
  return (
    <article className="relative flex h-full flex-col rounded-[24px] border border-brand/10 bg-white p-6 shadow-[0_22px_44px_-28px_rgba(26,15,61,0.4)] md:p-7">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-3 font-display text-7xl font-extrabold leading-none text-brand/8"
      >
        ”
      </span>
      <Estrellas n={r.estrellas} />
      {/* Siete lineas como tope: todas las tarjetas miden parecido y la franja
          entra en una pantalla. La reseña completa esta en Google (enlace). */}
      <p className="mt-4 line-clamp-[7] flex-1 font-sans text-[15px] leading-relaxed text-ink md:text-base">{r.comentario}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-brand/10 pt-5">
        {r.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.foto} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand"
          >
            {iniciales(r.nombre)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-semibold text-ink">{r.nombre}</p>
          {metadato && <p className="truncate font-sans text-sm text-ink-subtle">{metadato}</p>}
        </div>
        {r.enlace && (
          <a
            href={r.enlace}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={repeticion ? -1 : undefined}
            aria-label={`Ver la reseña de ${r.nombre} en Google`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-subtle transition-colors duration-300 hover:bg-brand/8 hover:text-brand"
          >
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

export function ResenasCarrusel({ resenas }: { resenas: Resena[] }) {
  const [tocando, setTocando] = useState(false);

  const repeticiones = Math.max(1, Math.ceil(MINIMO_POR_VUELTA / resenas.length));
  const vuelta = Array.from({ length: repeticiones }, () => resenas).flat();
  const duracion = `${Math.round((vuelta.length * PASO_PX) / PX_POR_SEGUNDO)}s`;
  // La vuelta dos veces: el recorrido de 0 a -50% cierra el bucle sin salto.
  const tira = [...vuelta, ...vuelta];

  function soltar() {
    setTocando(false);
  }

  return (
    <div className="wall-viewport mascara-bordes -mx-5 sm:-mx-6 md:-mx-10 lg:-mx-12">
      <ul
        aria-label="Reseñas de clientes"
        data-pausado={tocando || undefined}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") setTocando(true);
        }}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onPointerLeave={soltar}
        // Sin gap ni padding horizontal: la separacion va DENTRO de cada item
        // (pr-5), asi las dos mitades de la tira miden exacto lo mismo y el
        // salto de -50% cae justo en la costura.
        className="wall-track flex w-max items-stretch py-3"
        style={{ animationDuration: duracion }}
      >
        {tira.map((r, i) => {
          // Solo la primera aparicion de cada reseña es "real"; el resto
          // completa la franja.
          const repeticion = i >= resenas.length;
          return (
            <li key={`${r.id}-${i}`} aria-hidden={repeticion || undefined} className="w-[calc(min(82vw,420px)+1.25rem)] shrink-0 pr-5">
              <Tarjeta r={r} repeticion={repeticion} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
