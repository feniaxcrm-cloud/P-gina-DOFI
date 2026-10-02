"use client";

import { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Pause, Play } from "@phosphor-icons/react";
import { ChatWhatsApp, type PropsChatWhatsApp } from "@/remotion/feniax/ChatWhatsApp";
import { calcularLinea } from "@/remotion/feniax/linea";
import { FPS, PANTALLA, type TemaChat } from "@/remotion/feniax/tema";
import type { ChatDemo } from "@/lib/chat-demo";
import { MarcoTelefono } from "./MarcoTelefono";

/**
 * El <Player> de Remotion con la demo de WhatsApp adentro. Este archivo es el
 * que trae Remotion al navegador, por eso DemoWhatsApp.tsx lo carga recien
 * cuando el telefono se acerca a la pantalla (next/dynamic, sin SSR): la
 * pagina no paga esos KB en la carga inicial.
 *
 * Se comporta como un video -- play/pausa, barra de progreso que se puede
 * tocar para adelantar o volver, y tiempo. Al terminar avisa con `onTermina`
 * (la seccion pasa al siguiente giro); sin `onTermina`, vuelve a empezar.
 *
 * `activo` lo maneja el contenedor: false cuando el telefono sale de la
 * pantalla (se pausa) o cuando el visitante pidio menos movimiento (no
 * arranca solo; queda quieto en el cuadro con la conversacion completa).
 */

type Props = {
  chat: ChatDemo;
  tema: TemaChat;
  activo: boolean;
  reducido: boolean;
  onTermina?: () => void;
  /** Cambia cuando cambia la conversacion (otro giro): reinicia desde 0. */
  clave: string;
};

const BOTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

function mmss(cuadros: number) {
  const s = Math.max(0, Math.floor(cuadros / FPS));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function ReproductorChat({ chat, tema, activo, reducido, onTermina, clave }: Props) {
  const ref = useRef<PlayerRef>(null);
  const barra = useRef<HTMLDivElement>(null);
  const tiempo = useRef<HTMLSpanElement>(null);
  const pausaManual = useRef(false);
  const alTerminar = useRef(onTermina);
  alTerminar.current = onTermina;
  const [reproduciendo, setReproduciendo] = useState(false);

  const linea = calcularLinea(chat, FPS);
  const total = linea.total;
  // Con movimiento reducido, el cuadro quieto es el de la conversacion
  // completa con el aviso del CRM: se entiende todo sin reproducir nada.
  const cuadroQuieto = Math.max(0, linea.salida - 1);

  // Primero los oyentes: el play() de los efectos de abajo dispara "play"
  // en el acto, y un oyente que llega despues se lo pierde.
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
    // La barra y el tiempo se actualizan por referencia (30 veces por
    // segundo): sin re-render de React en cada cuadro.
    const alCuadro = (e: { detail: { frame: number } }) => {
      const f = e.detail.frame;
      if (barra.current) barra.current.style.transform = `scaleX(${Math.min(1, f / Math.max(1, total - 1))})`;
      if (tiempo.current) tiempo.current.textContent = `${mmss(f)} / ${mmss(total)}`;
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
  }, [total]);

  // Conversacion nueva: vuelve al principio y, si corresponde, arranca.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    pausaManual.current = false;
    if (reducido) {
      p.pause();
      p.seekTo(cuadroQuieto);
      return;
    }
    p.seekTo(0);
    if (activo) p.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  // Entra/sale de la pantalla.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (!activo || reducido) p.pause();
    else if (!pausaManual.current) p.play();
  }, [activo, reducido]);


  function alternar() {
    const p = ref.current;
    if (!p) return;
    if (p.isPlaying()) {
      pausaManual.current = true;
      p.pause();
    } else {
      pausaManual.current = false;
      if (p.getCurrentFrame() >= total - 1) p.seekTo(0);
      p.play();
    }
  }

  function buscar(e: React.PointerEvent<HTMLDivElement>) {
    const p = ref.current;
    if (!p) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    p.seekTo(Math.round(x * (total - 1)));
  }

  function alTeclearBarra(e: React.KeyboardEvent<HTMLDivElement>) {
    const p = ref.current;
    if (!p) return;
    const paso = FPS * 2;
    if (e.key === "ArrowRight") p.seekTo(Math.min(total - 1, p.getCurrentFrame() + paso));
    else if (e.key === "ArrowLeft") p.seekTo(Math.max(0, p.getCurrentFrame() - paso));
    else if (e.key === "Home") p.seekTo(0);
    else if (e.key === "End") p.seekTo(total - 1);
    else return;
    e.preventDefault();
  }

  const inputProps: PropsChatWhatsApp = { chat, tema };

  return (
    <div className="w-full">
      <MarcoTelefono tema={tema}>
        <Player
          ref={ref}
          component={ChatWhatsApp}
          inputProps={inputProps}
          durationInFrames={total}
          compositionWidth={PANTALLA.ancho}
          compositionHeight={PANTALLA.alto}
          fps={FPS}
          initialFrame={reducido ? cuadroQuieto : 0}
          autoPlay={false}
          loop={false}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          moveToBeginningWhenEnded={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </MarcoTelefono>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={alternar}
          aria-label={reproduciendo ? "Pausar la demostración" : "Reproducir la demostración"}
          className={`${BOTON} bg-brand text-white hover:bg-brand-lift`}
        >
          {reproduciendo ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Avance de la demostración"
          aria-valuemin={0}
          aria-valuemax={Math.round(total / FPS)}
          aria-valuetext="Usa las flechas para adelantar o retroceder"
          onPointerDown={buscar}
          onKeyDown={alTeclearBarra}
          className="group relative flex h-11 flex-1 cursor-pointer items-center outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-brand/15">
            <span
              ref={barra}
              className="absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,var(--color-accent),#E5352A)]"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
        </div>
        <span ref={tiempo} className="w-[88px] shrink-0 text-right font-sans text-sm tabular-nums text-ink-subtle">
          {`0:00 / ${mmss(total)}`}
        </span>
      </div>
    </div>
  );
}
