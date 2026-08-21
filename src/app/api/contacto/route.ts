import { NextResponse } from "next/server";
import { validarContacto, sanearUtm } from "@/lib/contact/validation";
import {
  crearLead,
  deliverLead,
  isDeliveryConfigured,
} from "@/lib/contact/delivery";

/**
 * Endpoint de contacto.
 *
 * ANTES: validaba, hacia console.log(...) y respondia siempre { ok: true }.
 * En Cloudflare Workers ese log se pierde, asi que el lead no llegaba a
 * ningun lado mientras el usuario leia "Mensaje recibido".
 *
 * AHORA: el exito depende de que el destino confirme la entrega.
 *
 *   200  lead entregado y confirmado por el destino
 *   400  JSON invalido o datos que no pasan la validacion
 *   502  el destino respondio con error
 *   503  no hay destino configurado (falta CONTACT_WEBHOOK_URL)
 *   504  el destino no respondio a tiempo
 *
 * Configuracion: define CONTACT_WEBHOOK_URL (y, si el destino lo exige,
 * CONTACT_WEBHOOK_TOKEN) en el entorno del Worker. Ver .env.example.
 *
 * RATE LIMITING: no implementado. Hacerlo bien en Workers necesita estado
 * compartido (KV o Durable Object), que hoy no esta aprovisionado; un
 * contador en memoria seria inutil porque cada isolate arranca vacio. El
 * contrato ya reserva 429 para cuando exista.
 */

/** Escribe una linea de log SIN datos personales.
 *  Nunca nombre, correo, telefono ni el texto del mensaje: solo el
 *  identificador del lead, el resultado y el origen de campaña. */
function registrar(
  evento: string,
  campos: Record<string, string | number | undefined>
) {
  const partes = Object.entries(campos)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${v}`);

  console.log([evento, ...partes].join(" "));
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("no es un objeto");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  const { valid, errors, data } = validarContacto(body);

  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", errors },
      { status: 400 }
    );
  }

  // Se comprueba antes de armar el lead para no procesar de mas cuando el
  // servicio ni siquiera esta disponible.
  if (!isDeliveryConfigured()) {
    registrar("lead_delivery_unavailable", {
      reason: "not_configured",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: false, error: "delivery_not_configured" },
      { status: 503 }
    );
  }

  const lead = crearLead(data, sanearUtm(body.utm));
  const resultado = await deliverLead(lead);

  if (!resultado.ok) {
    registrar("lead_delivery_failed", {
      id: lead.id,
      reason: resultado.reason,
      detail: resultado.detail,
      status: resultado.status,
      utm_source: lead.utm.utm_source,
      timestamp: lead.submittedAt,
    });

    return NextResponse.json(
      { ok: false, error: resultado.reason },
      { status: resultado.status }
    );
  }

  registrar("lead_delivery_success", {
    id: lead.id,
    provider: resultado.provider,
    utm_source: lead.utm.utm_source,
    utm_campaign: lead.utm.utm_campaign,
    timestamp: lead.submittedAt,
  });

  return NextResponse.json({ ok: true, id: lead.id }, { status: 200 });
}
