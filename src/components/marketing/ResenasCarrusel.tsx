"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, CaretLeft, CaretRight, Star } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";
import type { Resena } from "@/lib/marketing-digital";

/**
 * Carrusel de reseñas: una fila horizontal con scroll-snap y dos flechas.
 *
 * AUTOPLAY OPCIONAL, APAGADO POR DEFECTO
 * -----------------------------------------------------------------
 * Configurable desde el Studio (sección Reseñas). Cuando está activo nunca
 * debe impedir la lectura: se pausa al pasar el cursor o enfocar con
 * teclado (la pista ya era enfocable), no corre con movimiento reducido, y
 * no arranca si todas las reseñas entran en pantalla sin desbordar. Fuera de
 * eso, se sigue recorriendo igual que siempre con las flechas, el dedo
 * (snap nativo) o el teclado.
 *
 * Las flechas se desactivan en cada extremo y desaparecen si todas las
 * reseñas entran en pantalla.
 */

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
          size={18}
          weight={i <= n ? "fill" : "regular"}
          aria-hidden="true"
          className={i <= n ? "text-accent" : "text-ink-subtle/40"}
        />
      ))}
    </div>
  );
}

function Tarjeta({ r }: { r: Resena }) {
  const metadato = [r.empresa, r.fecha].filter(Boolean).join(" · ");
  return (
    <article className="relative flex h-full flex-col rounded-[24px] border border-brand/10 bg-white p-7 shadow-[0_22px_44px_-28px_rgba(26,15,61,0.4)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-3 font-display text-7xl font-extrabold leading-none text-brand/8"
      >
        ”
      </span>
      <Estrellas n={r.estrellas} />
      <p className="mt-5 flex-1 font-sans text-[15px] leading-relaxed text-ink md:text-base">{r.comentario}</p>
      <div className="mt-7 flex items-center gap-3 border-t border-brand/10 pt-5">
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

export function ResenasCarrusel({
  resenas,
  animar,
  autoplay = false,
  velocidadSegundos = 6,
}: {
  resenas: Resena[];
  animar: boolean;
  autoplay?: boolean;
  velocidadSegundos?: number;
}) {
  const pista = useRef<HTMLUListElement>(null);
  const reducido = useReducedMotion();
  const [enInicio, setEnInicio] = useState(true);
  const [enFin, setEnFin] = useState(false);
  const [pausado, setPausado] = useState(false);

  const actualizar = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setEnInicio(el.scrollLeft < 8);
    setEnFin(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    actualizar();
    const el = pista.current;
    el?.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      el?.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, [actualizar]);

  const mover = (sentido: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sentido * el.clientWidth * 0.85, behavior: reducido ? "auto" : "smooth" });
  };

  const hayDesborde = !(enInicio && enFin);

  useEffect(() => {
    if (!autoplay || reducido || pausado || !hayDesborde) return;
    const id = setInterval(() => {
      const el = pista.current;
      if (!el) return;
      const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: alFinal ? 0 : el.scrollLeft + el.clientWidth * 0.85, behavior: "smooth" });
    }, velocidadSegundos * 1000);
    return () => clearInterval(id);
  }, [autoplay, reducido, pausado, hayDesborde, velocidadSegundos]);

  return (
    <div className="mt-12">
      <ul
        ref={pista}
        tabIndex={0}
        aria-label="Reseñas de clientes"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        onFocus={() => setPausado(true)}
        onBlur={() => setPausado(false)}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:-mx-10 md:scroll-px-10 md:px-10 lg:-mx-12 lg:scroll-px-12 lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {resenas.map((r, i) => (
          <li key={r.id} className="w-[86%] shrink-0 snap-start sm:w-[420px]">
            {animar ? (
              <Reveal className="h-full" delay={Math.min(i, 3) * 0.06} y={16}>
                <Tarjeta r={r} />
              </Reveal>
            ) : (
              <Tarjeta r={r} />
            )}
          </li>
        ))}
      </ul>

      {hayDesborde && (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => mover(-1)}
            disabled={enInicio}
            aria-label="Reseñas anteriores"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-white text-brand transition-colors duration-300 hover:border-brand/50 hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <CaretLeft size={20} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => mover(1)}
            disabled={enFin}
            aria-label="Reseñas siguientes"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-white text-brand transition-colors duration-300 hover:border-brand/50 hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <CaretRight size={20} weight="bold" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
