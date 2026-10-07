"use client";

import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { VentasInteligentes } from "@/remotion/hero/VentasInteligentes";
import { CUADRO_QUIETO, FPS, LIENZO, TOTAL_CUADROS } from "@/remotion/hero/tema";

/**
 * El <Player> de Remotion con la animacion del hero. Este archivo es el que
 * trae Remotion al navegador: EscenaHero lo carga recien despues de pintar la
 * pagina (next/dynamic, sin SSR), asi el titulo -- el elemento mas grande de
 * la primera pantalla -- nunca espera por el.
 *
 * Corre solo y en bucle, sin controles (pedido del 2026-10-07: lo que se
 * mueve en el sitio es automatico). Se pausa cuando sale de la pantalla
 * (`activo`). Con movimiento reducido queda quieto en CUADRO_QUIETO: las tres
 * etapas completas a la vista.
 */
export default function ReproductorHero({ activo, reducido }: { activo: boolean; reducido: boolean }) {
  const ref = useRef<PlayerRef>(null);

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
      component={VentasInteligentes}
      durationInFrames={TOTAL_CUADROS}
      compositionWidth={LIENZO.ancho}
      compositionHeight={LIENZO.alto}
      fps={FPS}
      initialFrame={reducido ? CUADRO_QUIETO : 0}
      loop
      autoPlay={false}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      // Sin sonido: silenciado de entrada. Sin esto el Player espera a que el
      // navegador habilite el audio (recien con un clic del visitante) y la
      // animacion no arranca sola.
      initiallyMuted
      numberOfSharedAudioTags={0}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
