import { CurrencyDollar, Eye, Heart, LinkBreak } from "@phosphor-icons/react/dist/ssr";

/**
 * "El problema", dibujado: la composicion de la portada de Tráfico/Ads.
 *
 * "Muchos likes, muchas vistas… pero ¿y las ventas?" -- tres tarjetas con el
 * formato de un panel de metricas: me gusta y visualizaciones, que suben, y
 * ventas, que no. La ultima no tiene numero: tiene un signo de pregunta que
 * late y una etiqueta de "sin conexión".
 *
 * ES UNA ILUSTRACION, no datos: las cifras de las dos primeras son redondas a
 * proposito y la tercera ni siquiera tiene cifra. Por eso va aria-hidden y el
 * lector de pantalla recibe una frase equivalente (sr-only). Las demostraciones
 * con cifras de verdad estan mas abajo (Clientes), y ahi dicen que son de
 * ejemplo.
 *
 * Solo CSS: las tarjetas flotan despacio (con desfase) y las lineas se
 * dibujan al cargar (.trafico-flotar y .trafico-trazo, globals.css). Con
 * movimiento reducido quedan quietas y completas.
 */

function Linea({ d, retraso }: { d: string; retraso: string }) {
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" fill="none" aria-hidden="true">
      <path
        d={d}
        pathLength={1}
        stroke="var(--color-positive)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="trafico-trazo"
        style={{ "--trazo-retraso": retraso } as React.CSSProperties}
      />
    </svg>
  );
}

const CAJA =
  "rounded-[26px] border p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-5";

export function HeroProblema({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto h-[500px] w-full max-w-[440px] sm:h-[560px] ${className}`}>
      <p className="sr-only">
        Ilustración: los me gusta y las visualizaciones suben, pero las ventas no aparecen: no están conectadas.
      </p>

      <div aria-hidden="true" className="absolute inset-0">
        {/* Me gusta */}
        <div
          className="trafico-flotar absolute left-0 top-0 w-[72%] sm:w-[64%]"
          style={{ "--flotar-duracion": "7s", "--flotar-retraso": "0s" } as React.CSSProperties}
        >
          <div className={`${CAJA} border-white/15 bg-white/[0.08]`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent-lift">
                <Heart size={20} weight="fill" />
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-mist">Me gusta</span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="font-display text-4xl font-extrabold leading-none text-foam">18,4 mil</span>
              <span className="rounded-full bg-positive/15 px-2.5 py-1 font-sans text-xs font-semibold text-positive">▲ 24%</span>
            </div>
            <div className="mt-3">
              <Linea d="M2 31 C 12 29, 16 24, 26 25 S 42 18, 52 19 S 66 12, 78 10 S 98 6, 118 3" retraso="0.5s" />
            </div>
          </div>
        </div>

        {/* Visualizaciones */}
        <div
          className="trafico-flotar absolute right-0 top-[31%] w-[78%] sm:w-[68%]"
          style={{ "--flotar-duracion": "8.5s", "--flotar-retraso": "-2.4s" } as React.CSSProperties}
        >
          <div className={`${CAJA} border-white/15 bg-white/[0.08]`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-lift">
                <Eye size={20} weight="fill" />
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-mist">Visualizaciones</span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="font-display text-4xl font-extrabold leading-none text-foam">412 mil</span>
              <span className="rounded-full bg-positive/15 px-2.5 py-1 font-sans text-xs font-semibold text-positive">▲ 38%</span>
            </div>
            <div className="mt-3">
              <Linea d="M2 33 C 14 32, 22 28, 34 26 S 52 20, 62 14 S 84 8, 96 7 S 110 3, 118 2" retraso="0.9s" />
            </div>
          </div>
        </div>

        {/* Ventas: el dato que falta */}
        <div
          className="trafico-flotar absolute left-[4%] top-[64%] w-[76%] sm:left-[7%] sm:w-[66%]"
          style={{ "--flotar-duracion": "7.5s", "--flotar-retraso": "-4.6s" } as React.CSSProperties}
        >
          <div className={`${CAJA} border-dashed border-accent/60 bg-accent/[0.07]`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent-lift">
                <CurrencyDollar size={20} weight="bold" />
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-mist">Ventas</span>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-accent/50 px-2.5 py-1 font-sans text-xs font-semibold text-accent-lift">
                <LinkBreak size={14} weight="bold" />
                sin conexión
              </span>
            </div>
            <div className="mt-4">
              <span className="trafico-pregunta font-display text-4xl font-extrabold leading-none text-accent-lift">¿?</span>
            </div>
            <div className="mt-3">
              <svg viewBox="0 0 120 36" className="h-9 w-full" fill="none">
                <path d="M2 24 L118 24" stroke="var(--color-accent)" strokeOpacity={0.7} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
