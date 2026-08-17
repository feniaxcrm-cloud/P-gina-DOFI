import { NextResponse } from "next/server";

/**
 * Endpoint de contacto.
 *
 * Hoy solo valida y registra en el log del servidor. Para produccion, conecta
 * aqui una de estas salidas y quita el console.log:
 *   - Kommo (crear lead + contacto) via el API de la cuenta
 *   - Resend / Nodemailer para correo
 *   - Un webhook de n8n
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const email = String(body.email ?? "").trim();
  const mensaje = String(body.mensaje ?? "").trim();

  if (
    nombre.length < 2 ||
    mensaje.length < 12 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 422 });
  }

  console.log("[contacto]", {
    nombre,
    email,
    empresa: String(body.empresa ?? ""),
    mensaje,
  });

  return NextResponse.json({ ok: true });
}
