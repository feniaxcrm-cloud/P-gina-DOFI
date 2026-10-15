"use client";

import Link from "next/link";
import { WhatsappLogo } from "@phosphor-icons/react";
import { ID_FORMULARIO, RUTA_FORMULARIO } from "@/lib/cta";

/**
 * Boton flotante de WhatsApp (todas las paginas, desde el layout raiz).
 *
 * LLEVA AL FORMULARIO, NO A UN CHAT (pedido del 2026-10-15): el clic abre
 * /contactanos#formulario, donde la persona deja sus datos y recien ahi se
 * abre WhatsApp con el mensaje armado. Si ya esta en /contactanos, baja con
 * un desplazamiento suave hasta el formulario (sin recargar) y deja el cursor
 * en el primer campo; con movimiento reducido el salto es directo.
 *
 * DISCRETO: un circulo de 52 px en la esquina inferior derecha, sin texto ni
 * animacion permanente (nada que compita con el contenido); solo crece un
 * poco al pasar el cursor. Respeta la zona segura de los telefonos con barra
 * inferior. Es un enlace normal: teclado, lectores de pantalla (aria-label) y
 * foco visible.
 */
const DESTINO = `${RUTA_FORMULARIO}#${ID_FORMULARIO}`;

function irAlFormulario(e: React.MouseEvent<HTMLAnchorElement>) {
  const formulario = document.getElementById(ID_FORMULARIO);
  // En otra pagina no existe: el enlace navega a /contactanos#formulario.
  if (!formulario) return;
  e.preventDefault();
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  formulario.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
  formulario.querySelector<HTMLInputElement>("input, textarea")?.focus({ preventScroll: true });
}

export function BotonWhatsApp() {
  return (
    <Link
      href={DESTINO}
      onClick={irAlFormulario}
      aria-label="Ir al formulario de contacto"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] ring-1 ring-white/40 transition-transform duration-300 ease-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-whatsapp motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
    </Link>
  );
}
