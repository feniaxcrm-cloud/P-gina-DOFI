"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ChatDemo } from "@/lib/chat-demo";
import type { TemaChat } from "@/remotion/feniax/tema";
import { MarcoTelefono } from "./MarcoTelefono";

/**
 * Demo de WhatsApp en un telefono (portada y seccion Clientes de FENIAX).
 *
 * CARGA DIFERIDA: Remotion (ReproductorChat) se descarga recien cuando el
 * telefono esta a ~400px de entrar en pantalla. Hasta entonces se ve el
 * mismo marco con el fondo del chat, del mismo tamaño exacto.
 *
 * ACCESIBILIDAD: la conversacion completa va tambien como texto (lista
 * oculta a la vista, leida por lectores de pantalla), porque un video no se
 * puede leer. Con movimiento reducido no se reproduce sola: queda en el
 * cuadro con la conversacion entera y el aviso del CRM.
 */

const ReproductorChat = dynamic(() => import("./ReproductorChat"), { ssr: false });

export function DemoWhatsApp({
  chat,
  tema,
  modo,
  clave,
  onTermina,
  className = "",
}: {
  chat: ChatDemo;
  tema: TemaChat;
  modo: "fondo" | "video";
  /** Identifica la conversacion: al cambiar, la demo vuelve a empezar. */
  clave: string;
  onTermina?: () => void;
  className?: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const [cerca, setCerca] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const lejos = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true);
          lejos.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    const visible = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.3 });
    lejos.observe(el);
    visible.observe(el);
    return () => {
      lejos.disconnect();
      visible.disconnect();
    };
  }, []);

  return (
    <figure ref={raiz} className={`relative ${className}`}>
      {cerca ? (
        <ReproductorChat
          chat={chat}
          tema={tema}
          modo={modo}
          activo={enVista}
          reducido={reducido}
          onTermina={onTermina}
          clave={clave}
        />
      ) : (
        <div aria-hidden="true">
          <MarcoTelefono tema={tema} />
          {modo === "video" && <div className="mt-4 h-11" />}
        </div>
      )}

      <figcaption className="sr-only">
        <p>
          Demostración de una conversación de WhatsApp con {chat.negocio}, atendida por inteligencia artificial.
        </p>
        <ol>
          {chat.mensajes.map((m, i) => (
            <li key={i}>
              {m.de === "cliente" ? "Cliente" : chat.negocio}: {m.texto}
              {m.imagen ? " (envía una foto)" : ""}
            </li>
          ))}
        </ol>
        {chat.aviso && (
          <p>
            Registrado en el CRM: {chat.aviso.titulo}. {chat.aviso.texto}.
          </p>
        )}
      </figcaption>
    </figure>
  );
}
