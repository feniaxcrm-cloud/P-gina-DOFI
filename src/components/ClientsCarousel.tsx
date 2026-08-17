"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { clients } from "@/data/clients";
import { ClientCard } from "./ClientCard";

/**
 * Carrusel de clientes por PAGINAS.
 *
 * Muestra un grupo completo (3 tarjetas en desktop, 2 en tablet, 1 en movil),
 * y cada 5 segundos salta al siguiente grupo entero. Nunca deja tarjetas a
 * medias: cada pagina se desliza completa.
 *
 * Como son 7 marcas y 7 no es multiplo de 3, la ultima pagina se rellena
 * dando la vuelta a las primeras (modulo N), asi siempre hay un grupo lleno
 * sin huecos.
 *
 * Bucle sin tiron: se agrega al final una copia de la primera pagina; al
 * llegar a ella, terminada la transicion, se salta al inicio sin animacion.
 *
 * El translateX es en porcentaje del ancho de la pista: cada pagina ocupa
 * el 100% de la ventana, y la pista tiene (paginas + 1) grupos.
 *
 * Se pausa al pasar el cursor o al enfocar con teclado. Con movimiento
 * reducido no auto-avanza y no desliza.
 */
const N = clients.length;
const INTERVAL = 5000;

function usePerView() {
  const [pv, setPv] = useState(3);
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");
    const update = () => setPv(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);
  return pv;
}

export function ClientsCarousel() {
  const reduce = useReducedMotion();
  const perView = usePerView();
  const pages = Math.ceil(N / perView);

  const [page, setPage] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  // Grupos de la pista: una pagina por grupo (relleno con modulo) mas una
  // copia de la primera pagina al final para el bucle sin tiron.
  const groups = useMemo(() => {
    const gs: { key: string; row: typeof clients }[] = [];
    for (let pg = 0; pg < pages; pg++) {
      const row = Array.from(
        { length: perView },
        (_, s) => clients[(pg * perView + s) % N]
      );
      gs.push({ key: `p${pg}`, row });
    }
    gs.push({ key: "clone", row: gs[0].row });
    return gs;
  }, [pages, perView]);

  // Si cambia el numero de paginas (rotacion / resize), no dejar el indice fuera.
  useEffect(() => {
    setPage((p) => (p >= pages ? 0 : p));
  }, [pages]);

  const next = useCallback(() => setPage((p) => p + 1), []);

  const prev = useCallback(() => {
    setPage((p) => {
      if (p > 0) return p - 1;
      // Desde el inicio: salta sin animacion a la copia final (identica a la
      // pagina 0) y en el siguiente frame anima hacia la ultima pagina real.
      setAnimate(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setPage(pages - 1);
        })
      );
      return pages;
    });
  }, [pages]);

  // Auto-avance
  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [reduce, paused, next]);

  // Reactiva la animacion tras un salto instantaneo
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true))
    );
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // Al terminar la transicion de la pista, si llegamos a la copia, salta al 0.
  const onRest = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (page >= pages) {
      setAnimate(false);
      setPage(0);
    }
  };

  const activePage = ((page % pages) + pages) % pages;
  const totalGroups = pages + 1;

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  return (
    <div
      className="mt-16"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Clientes de DOFI"
      {...pauseHandlers}
    >
      <div className="overflow-hidden">
        <div
          onTransitionEnd={onRest}
          className="flex"
          style={{
            width: `${totalGroups * 100}%`,
            transform: `translateX(-${(page * 100) / totalGroups}%)`,
            transition:
              animate && !reduce
                ? "transform 650ms cubic-bezier(0.16,1,0.3,1)"
                : "none",
          }}
        >
          {groups.map((g, gi) => (
            <div
              key={g.key + gi}
              aria-hidden={gi === pages || undefined}
              // Cada grupo ocupa exactamente una ventana: 1/totalGrupos de la
              // pista. Dentro, las tarjetas se reparten segun perView.
              style={{ width: `${100 / totalGroups}%` }}
              className="flex shrink-0 grow-0"
            >
              {g.row.map((client, s) => (
                <div
                  key={`${client.slug}-${s}`}
                  className="shrink-0 grow-0 basis-full px-2.5 sm:basis-1/2 lg:basis-1/3"
                >
                  <ClientCard client={client} clone={gi === pages} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-10 flex items-center justify-between gap-6">
        {/* Un punto por pagina */}
        <ul className="flex flex-wrap items-center gap-2.5">
          {Array.from({ length: pages }, (_, k) => {
            const on = k === activePage;
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => {
                    setAnimate(true);
                    setPage(k);
                  }}
                  aria-label={`Ir al grupo ${k + 1}`}
                  aria-current={on || undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    on
                      ? "w-7 bg-accent"
                      : "w-2 bg-brand-lift/40 hover:bg-brand-lift/70"
                  }`}
                />
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Grupo anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-lift/40 text-foam transition-colors duration-300 hover:border-accent/70 hover:text-accent"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Grupo siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-lift/40 text-foam transition-colors duration-300 hover:border-accent/70 hover:text-accent"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
