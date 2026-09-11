import { ChartLineUp, Compass, Notebook, Sailboat, Wind } from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { PiezaCompleta } from "./PiezaCompleta";
import type { MetodoData } from "@/lib/marketing-digital";

/**
 * 4 · Método DOFI en 5 pasos.
 *
 * Las dos piezas graficas del metodo (si estan cargadas) se muestran
 * completas y sin tocar, igual que en PiezaGrafica. Debajo, los pasos como
 * una travesia: nodos unidos por una linea de oleaje en escritorio, y una
 * linea vertical en mobile. No son tarjetas -- es un recorrido, que es lo
 * que cuenta el metodo.
 *
 * Los pasos se pueden ocultar desde el Studio ("Mostrar los pasos como
 * texto") por si las piezas ya los traen dibujados: asi nunca se leen dos
 * veces.
 *
 * ICONOS: fijos por posicion (brujula, bitacora, velero, viento, grafico),
 * siguiendo la metafora nautica de cada paso. Si se agregan mas de cinco
 * pasos, se repiten en ciclo.
 */
const ICONOS_PASO = [Compass, Notebook, Sailboat, Wind, ChartLineUp] as const;

export function MetodoDofi({ data }: { data: MetodoData }) {
  const { imagenes, titulo, introduccion, pasos, mostrarPasos, mensajeFinal, cta, animar } = data;

  return (
    <section
      id="metodo"
      aria-labelledby="metodo-titulo"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#FDFBF7_0%,#F6F1FC_55%,#FDFBF7_100%)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar} className="mx-auto max-w-[820px] text-center">
          <h2
            id="metodo-titulo"
            className="text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </h2>
          {introduccion && (
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{introduccion}</p>
          )}
        </Anim>
      </div>

      {imagenes.length > 0 && (
        <div className="mt-14 flex flex-col gap-6 md:mt-16">
          {imagenes.map((img, i) => (
            <Anim key={img.url} animar={animar} delay={i * 0.08} y={20}>
              <PiezaCompleta imagen={img} alt={img.alt} />
            </Anim>
          ))}
        </div>
      )}

      {mostrarPasos && (
        <div className="mx-auto mt-16 max-w-page px-5 sm:px-6 md:mt-20 md:px-10 lg:px-12">
          <ol className="relative grid gap-12 md:grid-cols-5 md:gap-6">
            {/* Linea de travesia que une los nodos (solo escritorio). Va del
                centro del primero (10%) al del ultimo (90%).
                w-[80%] y NO right-[10%]: un SVG absoluto sin ancho declarado
                toma el ancho intrinseco de su viewBox (1000x60 a 60px de alto
                = 1000px) e ignora `right`. Medido a 768px: la linea seguia de
                largo despues del paso 5 hasta el borde de la pantalla. */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-[10%] top-[34px] hidden h-[60px] w-[80%] -translate-y-1/2 md:block"
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 30 C 62 6, 188 54, 250 30 S 438 6, 500 30 S 688 54, 750 30 S 938 6, 1000 30"
                stroke="rgba(75,42,147,0.35)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
            </svg>

            {pasos.map((paso, i) => {
              const Icono = ICONOS_PASO[i % ICONOS_PASO.length];
              const ultimo = i === pasos.length - 1;
              return (
                <li key={`${paso.titulo}-${i}`} className="relative">
                  {/* Linea vertical entre nodos (solo mobile). */}
                  {!ultimo && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-48px] left-[33px] top-[68px] border-l-2 border-dashed border-brand/25 md:hidden"
                    />
                  )}
                  <Anim
                    animar={animar}
                    delay={i * 0.08}
                    className="flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
                  >
                    <span className="relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border border-brand/15 bg-white text-brand shadow-[0_12px_30px_-14px_rgba(75,42,147,0.5)]">
                      <Icono size={28} weight="duotone" aria-hidden="true" />
                      <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 font-display text-[11px] font-bold text-fg-on-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <div className="pt-1 md:mt-6 md:pt-0">
                      <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink">
                        {paso.titulo}
                      </h3>
                      {paso.descripcion && (
                        <p className="mt-2 font-sans text-[15px] leading-relaxed text-ink-muted">
                          {paso.descripcion}
                        </p>
                      )}
                    </div>
                  </Anim>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {(mensajeFinal || cta) && (
        <div className="mx-auto mt-20 max-w-page px-5 sm:px-6 md:mt-24 md:px-10 lg:px-12">
          <Anim animar={animar} className="flex flex-col items-center text-center">
            {mensajeFinal && (
              <p className="text-balance bg-gradient-to-r from-brand via-brand-lift to-accent bg-clip-text font-display text-[clamp(2rem,1.2rem+3vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-transparent">
                {mensajeFinal}
              </p>
            )}
            {cta && (
              <div className={mensajeFinal ? "mt-10" : ""}>
                <BotonCta texto={cta.texto} enlace={cta.enlace} />
              </div>
            )}
          </Anim>
        </div>
      )}
    </section>
  );
}
