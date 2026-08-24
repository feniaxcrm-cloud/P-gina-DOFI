import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Webhook de Sanity: se llama al publicar/editar/borrar una Cuenta, un
 * Contenido o un Servicio para que la web muestre el cambio de inmediato,
 * sin esperar el ISR de 60s de src/lib/sanity.ts ni hacer un redeploy.
 *
 * Configuralo en manage.sanity.io -> tu proyecto -> API -> Webhooks,
 * apuntando a esta URL con ?secret=<SANITY_REVALIDATE_SECRET> (mismo valor
 * que la variable de entorno de este Worker), disparado en
 * Create/Update/Delete de "cuenta", "contenido" y "servicio".
 *
 * Invalida todo el arbol de rutas ("/", "layout") en vez de una ruta
 * puntual: el carrusel y el muro de logos de la home tambien dependen de
 * las cuentas, no solo /clientes/[slug]. Para un sitio de este tamaño es
 * mas simple y confiable que mantener tags por cada fetch.
 */
export async function POST(request: Request) {
  const secretEsperado = process.env.SANITY_REVALIDATE_SECRET;
  const secretRecibido = new URL(request.url).searchParams.get("secret");

  if (!secretEsperado || secretRecibido !== secretEsperado) {
    return NextResponse.json(
      { revalidated: false, error: "Secreto invalido o no configurado" },
      { status: 401 }
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
