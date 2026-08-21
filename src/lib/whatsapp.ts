/**
 * Generacion de enlaces de WhatsApp.
 *
 * Motivo: antes cada componente escribia su propio `https://wa.me/...` a
 * mano, y asi es como convivieron dos numeros distintos en la misma pagina
 * (uno real en el pie, uno inventado en el CTA de contacto). Con este helper
 * el numero sale siempre de la configuracion corporativa y el formato de la
 * URL se construye en un solo sitio.
 */

import { company } from "@/config/company";

/**
 * Deja el numero como lo espera wa.me: solo digitos.
 * Quita "+", espacios, guiones, puntos y parentesis.
 *
 *   "+593 98 447 2869"  ->  "593984472869"
 *   "(593) 98-447-2869" ->  "593984472869"
 */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D+/g, "");
}

export type WhatsAppUrlOptions = {
  /** Numero en cualquier formato. Por defecto, el de la empresa. */
  phone?: string;
  /** Texto pre-cargado en el chat. Por defecto, el mensaje neutro. */
  message?: string;
};

/**
 * Construye una URL de WhatsApp valida.
 *
 * El mensaje se codifica con encodeURIComponent, asi que acentos, saltos de
 * linea y simbolos viajan intactos.
 *
 * Si el numero queda vacio despues de normalizar (configuracion rota),
 * devuelve la URL de wa.me sin numero en vez de generar un enlace a un
 * destino equivocado.
 */
export function createWhatsAppUrl(options: WhatsAppUrlOptions = {}): string {
  const numero = normalizePhone(options.phone ?? company.whatsapp.number);
  const mensaje = options.message ?? company.whatsapp.defaultMessage;

  if (!numero) return "https://wa.me/";

  const base = `https://wa.me/${numero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** Enlace de WhatsApp de la empresa con el mensaje por defecto.
 *  Es el que consumen los CTA de la pagina. */
export const whatsappUrl = createWhatsAppUrl();

/** Enlace "tel:" a partir del mismo numero. */
export const telUrl = `tel:+${normalizePhone(company.phone.e164)}`;
