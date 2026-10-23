"use client";

import { useEffect, useRef, useState } from "react";
import { FilmSlate, Pause, Play } from "@phosphor-icons/react";
import { MarcoIphone } from "@/components/MarcoIphone";
import { Anim } from "@/components/marketing/Anim";
import type { SeccionCelulares, VideoCelular } from "@/lib/asesorias";

/**
 * «Videos en celulares» (Asesorías, pedido del 2026-10-20): tres celulares en
 * una fila, LOS TRES DEL MISMO TAMAÑO (2026-10-23; antes el del centro era más
 * grande) y un poco más grandes que al principio, con un halo de marca detrás.
 * Cada uno tiene su propio video, título y portada desde el Studio.
 *
 * RENDIMIENTO
 *  - Ningún video se pide hasta que la sección está a ~500 px de entrar en
 *    pantalla; entonces solo se pide lo justo para mostrar la portada (o el
 *    primer cuadro si no hay portada). El archivo completo baja al tocar play.
 *  - Se reproducen cuando la persona toca uno, con sonido, y de a UNO: tocar
 *    otro pausa el anterior. Si la sección sale de la pantalla, se pausa.
 *  - Sin autoplay de tres videos a la vez, sin bucles ni temporizadores.
 *
 * TELÉFONO: los tres en una fila que se desliza con el dedo (con imán en
 * cada celular), arrancando en el del centro; nunca desborda la página.
 */

const PANTALLA = { ancho: 9, alto: 16 } as const;

function Celular({
  celular,
  cargar,
  activo,
  onReproducir,
  onDetener,
}: {
  celular: VideoCelular;
  cargar: boolean;
  activo: boolean;
  onReproducir: () => void;
  onDetener: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const { url, titulo, portada } = celular;

  // Si otro celular empezó (o la sección salió de pantalla), este se pausa.
  useEffect(() => {
    const v = ref.current;
    if (v && !activo && !v.paused) v.pause();
  }, [activo]);

  function alternar() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      if (v.ended) v.currentTime = 0;
      onReproducir();
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }

  return (
    <MarcoIphone pantalla={PANTALLA} fondo="#120A26">
      {url && cargar ? (
        <>
          <video
            ref={ref}
            // Sin portada, el #t muestra el primer cuadro en lugar de negro.
            src={portada ? url : `${url}#t=0.1`}
            poster={portada?.url}
            preload={portada ? "none" : "metadata"}
            playsInline
            aria-label={titulo ? `Video: ${titulo}` : "Video de Asesorías"}
            onPlay={() => setReproduciendo(true)}
            onPause={() => {
              setReproduciendo(false);
              onDetener();
            }}
            onEnded={() => setReproduciendo(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={alternar}
            aria-label={reproduciendo ? `Pausar ${titulo || "el video"}` : `Reproducir ${titulo || "el video"}`}
            className="group/celular absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent-lift"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)] transition-[opacity,scale] duration-300 ${reproduciendo ? "scale-90 opacity-0 group-hover/celular:opacity-90 group-focus-visible/celular:opacity-90" : "opacity-100"}`}
            >
              {reproduciendo ? <Pause size={26} weight="fill" aria-hidden="true" /> : <Play size={26} weight="fill" aria-hidden="true" className="translate-x-[2px]" />}
            </span>
          </button>
        </>
      ) : url ? (
        // Todavía lejos de la pantalla: el mismo espacio, sin pedir el video.
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(160deg,#2E1B68_0%,#120A26_100%)]" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(90%_60%_at_80%_100%,rgba(244,123,32,0.22)_0%,rgba(244,123,32,0)_60%),linear-gradient(160deg,#2E1B68_0%,#1A0F3D_55%,#120A26_100%)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80">
            <FilmSlate size={24} weight="duotone" aria-hidden="true" />
          </span>
          <p className="px-6 text-center font-sans text-sm text-white/70">Pronto verás aquí nuestro video.</p>
        </div>
      )}

      {titulo && (
        <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-6 pt-16 text-center font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
          {titulo}
        </p>
      )}
    </MarcoIphone>
  );
}

export function TresCelulares({ seccion, id, nivel }: { seccion: SeccionCelulares; id: string; nivel: "h1" | "h2" }) {
  const { subtitulo, titulo, descripcion, izquierdo, central, derecho, animar } = seccion;
  const Titulo = nivel;
  const raiz = useRef<HTMLElement>(null);
  const fila = useRef<HTMLDivElement>(null);
  const centro = useRef<HTMLDivElement>(null);
  const [cargar, setCargar] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [activo, setActivo] = useState<number | null>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const cerca = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCargar(true);
          cerca.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );
    const visible = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.15 });
    cerca.observe(el);
    visible.observe(el);
    return () => {
      cerca.disconnect();
      visible.disconnect();
    };
  }, []);

  // Teléfono: la fila arranca mostrando el celular del centro.
  useEffect(() => {
    const f = fila.current;
    const c = centro.current;
    if (!f || !c || f.scrollWidth <= f.clientWidth) return;
    f.scrollLeft = c.offsetLeft - (f.clientWidth - c.clientWidth) / 2;
  }, []);

  const celulares = [
    { celular: izquierdo, principal: false },
    { celular: central, principal: true },
    { celular: derecho, principal: false },
  ];

  return (
    <section
      id={id}
      ref={raiz}
      aria-labelledby={`${id}-titulo`}
      className="pantalla relative isolate overflow-clip bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)]"
    >
      {/* Halo de marca detrás del celular principal. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[58%] -z-10 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(244,123,32,0.22),rgba(109,75,201,0.12)_55%,transparent)]"
      />

      <div className="relative mx-auto w-full max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar} className="mx-auto max-w-[720px] text-center">
          {subtitulo && <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>}
          <Titulo id={`${id}-titulo`} className="text-balance font-display text-titulo font-extrabold text-brand">
            {titulo}
          </Titulo>
          {descripcion && <p className="mt-4 font-sans text-lg leading-relaxed text-ink-muted">{descripcion}</p>}
        </Anim>

        <Anim animar={animar} delay={0.08} className="mt-[clamp(1.75rem,4.5svh,3rem)]">
          <div
            ref={fila}
            className="-mx-5 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[16vw] pb-4 [scrollbar-width:none] sm:-mx-6 md:mx-0 md:snap-none md:justify-center md:gap-[clamp(1.25rem,3.5vw,3.5rem)] md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {celulares.map(({ celular, principal }, i) => (
              <div
                key={i}
                ref={principal ? centro : undefined}
                // Los tres iguales: en escritorio, el mayor que entra en la
                // pantalla (alto util menos el titulo) sin pasar de 26vw.
                className="w-[72vw] max-w-[290px] shrink-0 snap-center md:w-[clamp(200px,26vw,calc((var(--alto-util)-150px)*9/16))] md:max-w-none"
              >
                <Celular
                  celular={celular}
                  cargar={cargar}
                  activo={enVista && activo === i}
                  onReproducir={() => setActivo(i)}
                  onDetener={() => setActivo((a) => (a === i ? null : a))}
                />
              </div>
            ))}
          </div>
        </Anim>
      </div>
    </section>
  );
}
