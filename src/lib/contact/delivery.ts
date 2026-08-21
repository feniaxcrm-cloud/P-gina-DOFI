/**
 * Entrega del lead a su destino real.
 *
 * QUE ESTABA ROTO
 * ---------------
 * `POST /api/contacto` validaba los datos, hacia `console.log(...)` y
 * respondia `{ ok: true }`. En Cloudflare Workers ese log se pierde: el lead
 * no llegaba a ningun correo, ninguna bandeja ni ningun CRM, y el usuario
 * leia "Mensaje recibido. Te contactamos muy pronto".
 *
 * QUE HACE AHORA
 * --------------
 * Una abstraccion delgada con un unico proveedor: un webhook HTTP. Es lo
 * mas fino que puede ser y sirve igual para Kommo, n8n, Make o un servicio
 * de correo: todos aceptan un POST con JSON.
 *
 * NO SE INVENTA NINGUN DESTINO. Si CONTACT_WEBHOOK_URL no esta configurada,
 * deliverLead() devuelve `not_configured` y la API responde 503. El
 * formulario dira que no se pudo enviar y ofrecera WhatsApp. Es preferible
 * un error honesto a un "recibido" que miente.
 *
 * Sin SDK ni dependencias: fetch nativo, disponible en el runtime de
 * Workers.
 */

import type { ContactInput, Utm } from "./validation";

export type Lead = ContactInput & {
  /** De donde vino el lead. Hoy siempre el formulario del sitio. */
  source: string;
  /** Parametros de campaña, si la visita traia alguno. */
  utm: Utm;
  /** ISO 8601, generado en el servidor. */
  submittedAt: string;
  /** Identificador corto para poder cruzar el log con el destino sin
   *  registrar datos personales. */
  id: string;
};

export type DeliveryResult =
  | { ok: true; provider: string }
  | {
      ok: false;
      /** not_configured -> falta la variable de entorno (503)
       *  provider_error  -> el destino respondio mal o no respondio (502)
       *  timeout         -> el destino no contesto a tiempo (504) */
      reason: "not_configured" | "provider_error" | "timeout";
      status: number;
      /** Detalle tecnico para el log del servidor. Nunca se envia al
       *  navegador ni contiene datos del usuario. */
      detail: string;
    };

/** Cuanto se espera al destino antes de darlo por caido. */
const TIMEOUT_MS = 8000;

/** Identificador corto y sin dependencias (no hay uuid en todos los
 *  runtimes con la misma forma). Sirve solo para correlacionar logs. */
function nuevoId(): string {
  return `ld_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function crearLead(
  input: ContactInput,
  utm: Utm,
  source = "web:formulario-contacto"
): Lead {
  return {
    ...input,
    source,
    utm,
    submittedAt: new Date().toISOString(),
    id: nuevoId(),
  };
}

/** ¿Hay un destino configurado? La API lo consulta para decidir si el
 *  servicio esta disponible antes siquiera de procesar. */
export function isDeliveryConfigured(): boolean {
  return Boolean(process.env.CONTACT_WEBHOOK_URL?.trim());
}

/**
 * Envia el lead al webhook configurado.
 *
 * Acepta cualquier 2xx como entrega correcta. Cualquier otra cosa —error
 * de red, timeout, 4xx o 5xx del destino— es un fallo, y el fallo se
 * propaga: esta funcion nunca devuelve `ok: true` sin confirmacion del
 * destino.
 */
export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const url = process.env.CONTACT_WEBHOOK_URL?.trim();

  if (!url) {
    return {
      ok: false,
      reason: "not_configured",
      status: 503,
      detail: "CONTACT_WEBHOOK_URL no esta definida",
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Cabecera de autenticacion opcional, para webhooks que la exijan
  // (n8n, Make, un endpoint propio). Si no existe, se envia sin ella.
  const token = process.env.CONTACT_WEBHOOK_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!respuesta.ok) {
      return {
        ok: false,
        reason: "provider_error",
        status: 502,
        detail: `el webhook respondio ${respuesta.status}`,
      };
    }

    return { ok: true, provider: "webhook" };
  } catch (error) {
    const esTimeout =
      error instanceof DOMException && error.name === "TimeoutError";

    return {
      ok: false,
      reason: esTimeout ? "timeout" : "provider_error",
      status: esTimeout ? 504 : 502,
      detail: esTimeout
        ? `sin respuesta en ${TIMEOUT_MS}ms`
        : `fallo de red: ${error instanceof Error ? error.name : "desconocido"}`,
    };
  }
}
