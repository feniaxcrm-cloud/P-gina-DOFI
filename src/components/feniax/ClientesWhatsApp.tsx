"use client";

import { useState } from "react";
import { ChatCircleDots } from "@phosphor-icons/react";
import { CarruselGiros } from "@/components/marketing/CarruselGiros";
import { PLANTILLAS } from "@/lib/chat-demo";
import type { GiroConChat } from "@/lib/feniax";
import type { TemaChat } from "@/remotion/feniax/tema";
import { DemoWhatsApp } from "./DemoWhatsApp";

/**
 * Las dos columnas de Clientes en FENIAX: el carrusel de giros (el mismo de
 * Marketing Digital, en modo controlado) y, donde allá va el video, el
 * teléfono con la demo de WhatsApp del giro abierto.
 *
 * UN SOLO ESTADO para las dos columnas: abrir "Gastronomía" en el carrusel
 * cambia la conversación del teléfono a la del restaurante, y la demo vuelve
 * a empezar.
 *
 * RECORRIDO AUTOMÁTICO (si "Pasar solo al siguiente giro" está activo):
 * cuando una conversación termina, se abre el giro siguiente. En cuanto el
 * visitante elige un giro, se queda en ese (su demo se repite). El carrusel
 * no rota por su cuenta: el ritmo lo marca la conversación, no un reloj.
 */
export function ClientesWhatsApp({
  giros,
  rotacion,
  tema,
  animar,
}: {
  giros: GiroConChat[];
  rotacion: boolean;
  tema: TemaChat;
  animar: boolean;
}) {
  const [activo, setActivo] = useState(0);
  const [elegido, setElegido] = useState(false);
  const n = giros.length;
  const giro = n > 0 ? giros[Math.min(activo, n - 1)] : null;
  // Sin giros (ni propios ni de Marketing Digital), el telefono igual
  // muestra una demo: la generica.
  const chat = giro?.chat ?? PLANTILLAS.servicios;

  const demo = (
    <>
      <p className="mb-5 flex items-center justify-center gap-2 font-sans text-sm font-semibold text-ink-subtle">
        <ChatCircleDots size={18} weight="duotone" aria-hidden="true" className="text-accent" />
        <span>
          Demo en WhatsApp{giro ? <> · <span className="text-ink">{giro.nombre}</span></> : null}
        </span>
      </p>
      <DemoWhatsApp
        chat={chat}
        tema={tema}
        clave={giro?.key ?? "generica"}
        onTermina={rotacion && !elegido && n > 1 ? () => setActivo((a) => (a + 1) % n) : undefined}
        className="mx-auto w-full max-w-[300px] lg:max-w-[320px]"
      />
    </>
  );

  return (
    // 11fr / 9fr = 55% carrusel, 45% telefono: la misma reticula que
    // Clientes de Marketing Digital. En telefono la demo va DENTRO del
    // carrusel, entre los giros y sus logos (prop `intermedio`); la columna
    // derecha se oculta. Las dos instancias no cargan Remotion a la vez: la
    // oculta (display: none) nunca entra en pantalla.
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:gap-8 lg:gap-12">
      <div className="min-w-0">
        <CarruselGiros
          giros={giros}
          rotacion={false}
          animar={animar}
          activo={activo}
          seleccionPorCursor={false}
          onCambio={(i, porVisitante) => {
            setActivo(i);
            if (porVisitante) setElegido(true);
          }}
          intermedio={<div className="mb-4 mt-10 md:hidden">{demo}</div>}
        />
      </div>

      {/* En escritorio el telefono acompaña el scroll mientras se recorren
          los logos del giro (la columna de la izquierda es mas alta). */}
      <div className="hidden min-w-0 md:sticky md:top-24 md:block md:self-start">{demo}</div>
    </div>
  );
}
