"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ChatDemo } from "@/lib/chat-demo";
import type { TemaChat } from "@/remotion/feniax/tema";
import { MarcoTelefono } from "./MarcoTelefono";

/**
 * Demo de WhatsApp en un telefono (seccion Clientes de FENIAX; la portada
 * ya no la usa: lleva el motion del CRM).
 *
 * CARGA DIFERIDA: Remotion (ReproductorChat) se descarga recien cuando el
 * telefono esta a ~400px de entrar en pantalla. Hasta entonces se ve el
 * mismo marco con el fondo del chat, del mismo tamaño exacto.
 *
 * ACCESIBILIDAD: la conversacion completa va tambien como texto (lista
 * oculta a la vista, leida por lectores de pantalla), porque un video no se
 * puede leer. Con movimiento reducido no se reproduce sola: queda en el
 * cuadro con la conversacion entera y el aviso del CRM. Sin controles: corre
 * sola y se detiene con el cursor encima (ver ReproductorChat).
 */

const ReproductorChat = dynamic(() => import("./ReproductorChat"), { ssr: false });

export function DemoWhatsApp({
  chat,
  tema,
  clave,
  onTermina,
  ajustarAlto = false,
  className = "",
}: {
  chat: ChatDemo;
  tema: TemaChat;
  /** Identifica la conversacion: al cambiar, la demo vuelve a empezar. */
  clave: string;
  onTermina?: () => void;
  /** Escritorio: el telefono llena el ALTO de su contenedor (que debe
   *  tenerlo definido) y su ancho sale de su proporcion, sin pasarse del
   *  ancho. Sin esta opcion, el telefono ocupa el ancho. */
  ajustarAlto?: boolean;
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
    <figure ref={raiz} className={`relative ${ajustarAlto ? "flex flex-col" : ""} ${className}`}>
      {/* Ajustado al alto: la caja mide el espacio libre (container-type:
          size) y el telefono toma el mayor tamaño que entra en ella. Su alto
          es el de la pantalla (ancho x 712/390) mas los 18 px del bisel. */}
      <div className={ajustarAlto ? "min-h-0 flex-1 [container-type:size]" : ""}>
        <div className={ajustarAlto ? "mx-auto w-[min(100cqw,calc((100cqh-18px)*390/712+18px))]" : ""}>
          {cerca ? (
            <ReproductorChat
              chat={chat}
              tema={tema}
              activo={enVista}
              reducido={reducido}
              onTermina={onTermina}
              clave={clave}
            />
          ) : (
            <div aria-hidden="true">
              <MarcoTelefono tema={tema} />
            </div>
          )}
        </div>
      </div>

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
