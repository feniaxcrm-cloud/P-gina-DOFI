"use client";

import { useState } from "react";
import { PLANTILLAS, type ChatDemo } from "@/lib/chat-demo";
import { DemoWhatsApp } from "./DemoWhatsApp";

/** Una conversación de ejemplo: la de un giro (la que se carga en Sanity,
 *  en «Clientes», campo chat de cada giro). */
export type ConversacionHero = { clave: string; chat: ChatDemo };

/**
 * El celular con los EJEMPLOS DE CONVERSACIONES en la portada de FENIAX /
 * ChatBots-CRM (pedido del 2026-10-20: el celular con el video TikTok no iba;
 * vuelve la demo de WhatsApp con la IA atendiendo a un cliente).
 *
 * Reproduce, una tras otra, las conversaciones de los giros de «Clientes»
 * (restaurante, tienda, clínica...): cuando una termina, arranca la del giro
 * siguiente. Si «Pasar solo al siguiente giro» está apagado en el Studio, se
 * repite la primera. Sin giros cargados, muestra la conversación genérica de
 * servicios, igual que lo hacía Clientes.
 *
 * Los textos no se inventan acá: salen de Sanity (o de las plantillas por
 * giro de src/lib/chat-demo.ts). Tema oscuro, el de la portada.
 */
export function HeroConversaciones({
  conversaciones,
  rotacion,
}: {
  conversaciones: ConversacionHero[];
  rotacion: boolean;
}) {
  const [activo, setActivo] = useState(0);
  const n = conversaciones.length;
  const actual = n > 0 ? conversaciones[Math.min(activo, n - 1)] : null;
  const chat = actual?.chat ?? PLANTILLAS.servicios;
  const clave = actual?.clave ?? "generica";
  const onTermina = rotacion && n > 1 ? () => setActivo((a) => (a + 1) % n) : undefined;

  return (
    <div className="relative">
      {/* Resplandor detrás del celular: el naranja de la «IA». */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(237,109,25,0.45)_0%,rgba(121,40,131,0.35)_45%,transparent_72%)] blur-2xl"
      />
      {/* Por ancho, a la medida del alto útil de la pantalla: el celular es
          9:16 (390x712 más 18 px de bisel) y no se pasa del alto del hero. */}
      <DemoWhatsApp
        chat={chat}
        tema="oscuro"
        clave={clave}
        onTermina={onTermina}
        className="mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[min(340px,calc((var(--alto-util)*0.86-18px)*390/712+18px))]"
      />
    </div>
  );
}
