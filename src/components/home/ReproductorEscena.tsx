"use client";

import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { ESCENAS } from "@/remotion/home/escenas";
import { CUADRO_QUIETO, DURACION, FPS, type ClaveEscena } from "@/remotion/home/tema";

/**
 * El <Player> de Remotion de una escena de banner. Este archivo es el que trae
 * Remotion al navegador: EscenaBanner lo carga recien cuando el banner esta
 * por entrar en pantalla (next/dynamic, sin SSR).
 *
 * Corre solo y en bucle, sin controles (lo que se mueve en el sitio es
 * automatico). Se pausa al salir de la pantalla (`activo`). Con movimiento
 * reducido queda quieto en CUADRO_QUIETO.
 */
export default function ReproductorEscena({
  escena,
  lineas,
  activo,
  reducido,
}: {
  escena: ClaveEscena;
  lineas: string[];
  activo: boolean;
  reducido: boolean;
}) {
  const ref = useRef<PlayerRef>(null);
  const def = ESCENAS[escena];

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (reducido) {
      p.pause();
      p.seekTo(CUADRO_QUIETO);
      return;
    }
    if (!activo) {
      p.pause();
      return;
    }
    // Un cuadro despues: recien montado, el Player puede ignorar el play().
    const id = window.requestAnimationFrame(() => ref.current?.play());
    return () => window.cancelAnimationFrame(id);
  }, [activo, reducido]);

  return (
    <Player
      ref={ref}
      component={def.componente}
      inputProps={{ lineas }}
      durationInFrames={DURACION}
      compositionWidth={def.ancho}
      compositionHeight={def.alto}
      fps={FPS}
      initialFrame={CUADRO_QUIETO}
      loop
      autoPlay={false}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      // Sin sonido: silenciado de entrada (si no, el Player espera un clic).
      initiallyMuted
      numberOfSharedAudioTags={0}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
