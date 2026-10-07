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
 *
 * EN ESCRITORIO EL TELÉFONO SE MIDE POR EL ALTO: la sección mide una pantalla
 * (MarcoClientes) y el teléfono toma el alto de su columna; su ancho sale de
 * su proporción (9:16). Antes iba "sticky" al lado de una grilla de logos
 * más alta que la pantalla.
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
  const clave = giro?.key ?? "generica";
  const onTermina = rotacion && !elegido && n > 1 ? () => setActivo((a) => (a + 1) % n) : undefined;

  const etiqueta = (
    <p className="flex shrink-0 items-center justify-center gap-2 font-sans text-sm font-semibold text-ink-subtle">
      <ChatCircleDots size={18} weight="duotone" aria-hidden="true" className="text-accent" />
      <span>
        Demo en WhatsApp{giro ? <> · <span className="text-ink">{giro.nombre}</span></> : null}
      </span>
    </p>
  );

  return (
    // 3fr / 2fr: el teléfono no necesita más ancho que el que le da su alto.
    // Por debajo de lg la demo va DENTRO del carrusel, entre los giros y sus
    // logos (prop `intermedio`); la columna derecha se oculta. Las dos
    // instancias no cargan Remotion a la vez: la oculta (display: none) nunca
    // entra en pantalla.
    <div className="grid grid-cols-1 gap-12 lg:h-full lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
      <div className="min-w-0 lg:h-full lg:min-h-0">
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
          intermedio={
            <div className="mb-2 mt-10 lg:hidden">
              <div className="mb-4">{etiqueta}</div>
              <DemoWhatsApp
                chat={chat}
                tema={tema}
                clave={clave}
                onTermina={onTermina}
                className="mx-auto w-full max-w-[300px]"
              />
            </div>
          }
        />
      </div>

      <div className="hidden min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-3">
        {etiqueta}
        <DemoWhatsApp chat={chat} tema={tema} clave={clave} onTermina={onTermina} ajustarAlto className="min-h-0 flex-1" />
      </div>
    </div>
  );
}
