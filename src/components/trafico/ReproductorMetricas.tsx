"use client";

import { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Pause, Play } from "@phosphor-icons/react";
import { cuadroDeDia, diaEn, PanelMeta, type PropsPanelMeta } from "@/remotion/trafico/PanelMeta";
import { CUADRO_FINAL, FPS, PANEL, TOTAL_CUADROS } from "@/remotion/trafico/tema";
import { DIAS } from "@/remotion/trafico/series";
import type { MetricasDemo } from "@/lib/metricas-demo";

/**
 * El <Player> de Remotion con el panel de Meta Ads adentro. Este archivo es
 * el que trae Remotion al navegador: DemoMetricas.tsx lo carga recien cuando
 * el panel se acerca a la pantalla (next/dynamic, sin SSR).
 *
 * SE COMPORTA COMO UN VIDEO DE 30 DIAS: play/pausa y una barra que se puede
 * tocar o ARRASTRAR -- mover la barra es mover el dia de la campaña, y todas
 * las cifras y el grafico se recalculan a ese dia. Al llegar al dia 30 se
 * queda un momento (para leer las cifras finales) y avisa con `onTermina`
 * (la seccion pasa al giro siguiente); sin `onTermina`, vuelve a empezar.
 *
 * `activo` lo maneja el contenedor: false cuando el panel sale de la pantalla
 * (se pausa). `reducido` (movimiento reducido): no arranca solo y queda
 * quieto en el dia 30, con todas las cifras a la vista.
 */

type Props = {
  datos: MetricasDemo;
  /** Fija el "ruido" de las series: el mismo giro se ve siempre igual. */
  semilla: string;
  activo: boolean;
  reducido: boolean;
  onTermina?: () => void;
  /** Cambia cuando cambia el giro: reinicia desde el dia 1. */
  clave: string;
};

const BOTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors duration-300 hover:bg-brand-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export default function ReproductorMetricas({ datos, semilla, activo, reducido, onTermina, clave }: Props) {
  const ref = useRef<PlayerRef>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const control = useRef<HTMLDivElement>(null);
  const etiqueta = useRef<HTMLSpanElement>(null);
  const pausaManual = useRef(false);
  const arrastrando = useRef<{ reanudar: boolean } | null>(null);
  const alTerminar = useRef(onTermina);
  alTerminar.current = onTermina;
  const [reproduciendo, setReproduciendo] = useState(false);

  // Primero los oyentes: el play() de los efectos de abajo dispara "play" en
  // el acto, y un oyente que llega despues se lo pierde.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const alPlay = () => setReproduciendo(true);
    const alPausa = () => setReproduciendo(false);
    const alFinal = () => {
      setReproduciendo(false);
      if (alTerminar.current) {
        alTerminar.current();
      } else {
        p.seekTo(0);
        p.play();
      }
    };
    // La barra y la etiqueta se actualizan por referencia (30 veces por
    // segundo): sin re-render de React en cada cuadro.
    const alCuadro = (e: { detail: { frame: number } }) => {
      const dia = diaEn(e.detail.frame);
      if (barra.current) barra.current.style.transform = `scaleX(${(dia - 1) / (DIAS - 1)})`;
      if (etiqueta.current) etiqueta.current.textContent = `Día ${Math.floor(dia)} de ${DIAS}`;
      control.current?.setAttribute("aria-valuenow", String(Math.floor(dia)));
      control.current?.setAttribute("aria-valuetext", `Día ${Math.floor(dia)} de ${DIAS}`);
    };
    p.addEventListener("play", alPlay);
    p.addEventListener("pause", alPausa);
    p.addEventListener("ended", alFinal);
    p.addEventListener("frameupdate", alCuadro);
    setReproduciendo(p.isPlaying());
    return () => {
      p.removeEventListener("play", alPlay);
      p.removeEventListener("pause", alPausa);
      p.removeEventListener("ended", alFinal);
      p.removeEventListener("frameupdate", alCuadro);
    };
  }, []);

  // Giro nuevo: vuelve al dia 1 y, si corresponde, arranca.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    pausaManual.current = false;
    if (reducido) {
      p.pause();
      p.seekTo(CUADRO_FINAL);
      return;
    }
    p.seekTo(0);
    if (activo) p.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  // Entra o sale de la pantalla.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (!activo || reducido) p.pause();
    else if (!pausaManual.current && !arrastrando.current) p.play();
  }, [activo, reducido]);

  function alternar() {
    const p = ref.current;
    if (!p) return;
    if (p.isPlaying()) {
      pausaManual.current = true;
      p.pause();
    } else {
      pausaManual.current = false;
      if (p.getCurrentFrame() >= TOTAL_CUADROS - 2) p.seekTo(0);
      p.play();
    }
  }

  /** Lleva la campaña al dia que corresponde a la posicion del puntero. */
  function irAlDia(e: React.PointerEvent<HTMLDivElement>) {
    const p = ref.current;
    if (!p) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    p.seekTo(cuadroDeDia(1 + x * (DIAS - 1)));
  }

  function alPresionar(e: React.PointerEvent<HTMLDivElement>) {
    const p = ref.current;
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Mientras se arrastra, el panel queda quieto en el dia que se toca.
    arrastrando.current = { reanudar: p.isPlaying() };
    p.pause();
    irAlDia(e);
  }

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    if (arrastrando.current) irAlDia(e);
  }

  function alSoltar(e: React.PointerEvent<HTMLDivElement>) {
    const estado = arrastrando.current;
    if (!estado) return;
    arrastrando.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (estado.reanudar && !pausaManual.current) ref.current?.play();
  }

  function alTeclear(e: React.KeyboardEvent<HTMLDivElement>) {
    const p = ref.current;
    if (!p) return;
    const dia = diaEn(p.getCurrentFrame());
    let destino: number;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") destino = Math.min(DIAS, Math.floor(dia) + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") destino = Math.max(1, Math.ceil(dia) - 1);
    else if (e.key === "Home") destino = 1;
    else if (e.key === "End") destino = DIAS;
    else return;
    e.preventDefault();
    p.pause();
    pausaManual.current = true;
    p.seekTo(cuadroDeDia(destino));
  }

  const inputProps: PropsPanelMeta = { datos, semilla };

  return (
    <div className="w-full">
      {/* aria-hidden: el contenido del panel cambia 30 veces por segundo y no
          se puede leer; las cifras finales las da el texto de DemoMetricas
          (figcaption), que SI lo lee un lector de pantalla. */}
      <div
        aria-hidden="true"
        className="relative w-full overflow-hidden rounded-[28px] shadow-[0_32px_64px_-30px_rgba(26,15,61,0.65)]"
        style={{ aspectRatio: `${PANEL.ancho} / ${PANEL.alto}` }}
      >
        <Player
          ref={ref}
          component={PanelMeta}
          inputProps={inputProps}
          durationInFrames={TOTAL_CUADROS}
          compositionWidth={PANEL.ancho}
          compositionHeight={PANEL.alto}
          fps={FPS}
          initialFrame={reducido ? CUADRO_FINAL : 0}
          autoPlay={false}
          loop={false}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          moveToBeginningWhenEnded={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={alternar}
          aria-label={reproduciendo ? "Pausar la campaña de ejemplo" : "Reproducir la campaña de ejemplo"}
          className={BOTON}
        >
          {reproduciendo ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
        <div
          ref={control}
          role="slider"
          tabIndex={0}
          aria-label="Día de la campaña de ejemplo"
          aria-valuemin={1}
          aria-valuemax={DIAS}
          aria-valuenow={reducido ? DIAS : 1}
          aria-valuetext={reducido ? `Día ${DIAS} de ${DIAS}` : `Día 1 de ${DIAS}`}
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onKeyDown={alTeclear}
          style={{ touchAction: "none" }}
          className="relative flex h-11 flex-1 cursor-pointer items-center outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-brand/15">
            <span
              ref={barra}
              className="absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,var(--color-brand-lift),var(--color-accent))]"
              style={{ transform: `scaleX(${reducido ? 1 : 0})` }}
            />
          </span>
        </div>
        <span ref={etiqueta} className="w-[84px] shrink-0 text-right font-sans text-sm tabular-nums text-ink-subtle">
          {reducido ? `Día ${DIAS} de ${DIAS}` : `Día 1 de ${DIAS}`}
        </span>
      </div>
    </div>
  );
}
