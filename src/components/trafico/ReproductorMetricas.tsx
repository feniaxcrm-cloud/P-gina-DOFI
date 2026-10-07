"use client";

import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { PanelMeta, type PropsPanelMeta } from "@/remotion/trafico/PanelMeta";
import { CUADRO_FINAL, FPS, PANEL, TOTAL_CUADROS } from "@/remotion/trafico/tema";
import type { MetricasDemo } from "@/lib/metricas-demo";

/**
 * El <Player> de Remotion con el panel de Meta Ads adentro. Este archivo es
 * el que trae Remotion al navegador: DemoMetricas.tsx lo carga recien cuando
 * el panel se acerca a la pantalla (next/dynamic, sin SSR).
 *
 * CORRE SOLO, SIN BOTONES (pedido del 2026-10-07): la campaña recorre sus 30
 * dias en cuanto el panel entra en pantalla. El dia y su avance ya se leen
 * dentro del propio panel («Día 16 de 30» y la barra de la cabecera), asi que
 * debajo no queda ningun control. Al llegar al dia 30 se queda un momento
 * (para leer las cifras finales) y avisa con `onTermina` (la seccion pasa al
 * giro siguiente); sin `onTermina`, vuelve a empezar.
 *
 * Con el cursor encima se detiene, para leer una cifra con calma, y sigue al
 * sacarlo. `activo` lo maneja el contenedor: false cuando el panel sale de la
 * pantalla (se pausa). `reducido` (movimiento reducido): no arranca y queda
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

export default function ReproductorMetricas({ datos, semilla, activo, reducido, onTermina, clave }: Props) {
  const ref = useRef<PlayerRef>(null);
  const encima = useRef(false);
  const alTerminar = useRef(onTermina);
  alTerminar.current = onTermina;

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const alFinal = () => {
      if (alTerminar.current) {
        alTerminar.current();
      } else {
        p.seekTo(0);
        p.play();
      }
    };
    p.addEventListener("ended", alFinal);
    return () => p.removeEventListener("ended", alFinal);
  }, []);

  // Giro nuevo: vuelve al dia 1 y, si corresponde, arranca.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (reducido) {
      p.pause();
      p.seekTo(CUADRO_FINAL);
      return;
    }
    p.seekTo(0);
    if (activo && !encima.current) p.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  // Entra o sale de la pantalla.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (!activo || reducido) p.pause();
    else if (!encima.current) p.play();
  }, [activo, reducido]);

  function alEntrar(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    encima.current = true;
    ref.current?.pause();
  }

  function alSalir(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    encima.current = false;
    const p = ref.current;
    if (!p || !activo || reducido) return;
    if (p.getCurrentFrame() >= TOTAL_CUADROS - 2) p.seekTo(0);
    p.play();
  }

  const inputProps: PropsPanelMeta = { datos, semilla };

  // aria-hidden: el contenido del panel cambia 30 veces por segundo y no se
  // puede leer; las cifras finales las da el texto de DemoMetricas
  // (figcaption), que SI lo lee un lector de pantalla.
  return (
    <div
      aria-hidden="true"
      onPointerEnter={alEntrar}
      onPointerLeave={alSalir}
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
        // Sin sonido: silenciado de entrada. Sin esto el Player espera a que el
        // navegador habilite el audio (recien con un clic del visitante) y la
        // animacion no arranca sola.
        initiallyMuted
        numberOfSharedAudioTags={0}
        moveToBeginningWhenEnded={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
