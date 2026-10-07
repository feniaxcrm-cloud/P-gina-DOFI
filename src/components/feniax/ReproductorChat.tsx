"use client";

import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
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
 * CORRE SOLO, SIN BOTONES (pedido del 2026-10-07): la conversacion arranca en
 * cuanto el telefono entra en pantalla, sin play/pausa ni barra debajo. Con el
 * cursor encima se detiene, para leer un mensaje con calma, y sigue al
 * sacarlo. Al terminar avisa con `onTermina` (la seccion pasa al siguiente
 * giro); sin `onTermina`, vuelve a empezar.
 *
 * `activo` lo maneja el contenedor: false cuando el telefono sale de la
 * pantalla (se pausa). `reducido` (movimiento reducido): no arranca solo;
 * queda quieto en el cuadro con la conversacion completa.
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

export default function ReproductorChat({ chat, tema, activo, reducido, onTermina, clave }: Props) {
  const ref = useRef<PlayerRef>(null);
  const encima = useRef(false);
  const alTerminar = useRef(onTermina);
  alTerminar.current = onTermina;

  const linea = calcularLinea(chat, FPS);
  const total = linea.total;
  // Con movimiento reducido, el cuadro quieto es el de la conversacion
  // completa con el aviso del CRM: se entiende todo sin reproducir nada.
  const cuadroQuieto = Math.max(0, linea.salida - 1);

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

  // Conversacion nueva: vuelve al principio y, si corresponde, arranca.
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (reducido) {
      p.pause();
      p.seekTo(cuadroQuieto);
      return;
    }
    p.seekTo(0);
    if (activo && !encima.current) p.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  // Entra/sale de la pantalla.
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
    if (p.getCurrentFrame() >= total - 1) p.seekTo(0);
    p.play();
  }

  const inputProps: PropsChatWhatsApp = { chat, tema };

  return (
    <div className="w-full" onPointerEnter={alEntrar} onPointerLeave={alSalir}>
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
          // Sin sonido: silenciado de entrada. Sin esto el Player espera a que el
          // navegador habilite el audio (recien con un clic del visitante) y la
          // animacion no arranca sola.
          initiallyMuted
          numberOfSharedAudioTags={0}
          moveToBeginningWhenEnded={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </MarcoTelefono>
    </div>
  );
}
