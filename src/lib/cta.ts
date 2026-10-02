/**
 * Llamadas a la accion del sitio (pedido del 2026-10-02):
 *
 *  1. Todos los botones de conversion de las paginas (menos Inicio) dicen lo
 *     mismo: «Quiero mejorar mis ventas» (TEXTO_CTA).
 *  2. Los botones de los banners finales llevan al FORMULARIO (/contactanos),
 *     con el servicio de esa pagina ya marcado (enlaceFormulario).
 *  3. Al enviar el formulario se abre WhatsApp con un mensaje armado con lo que
 *     la persona escribio (mensajeFormulario).
 *  4. El boton flotante de WhatsApp lleva un mensaje fijo (MENSAJE_FLOTANTE).
 *
 * Datos planos, sin dependencias de React ni de Next: los usan componentes de
 * servidor y de cliente, los respaldos de cada pagina y los scripts de
 * Sanity.
 */

export const TEXTO_CTA = "Quiero mejorar mis ventas";

/** Los servicios que ofrece el formulario, en este orden. `clave` es lo que
 *  viaja en el enlace (?servicio=) y `nombre` lo que ve la persona y lo que
 *  se escribe en el mensaje de WhatsApp. */
export const SERVICIOS = [
  { clave: "marketing-360", nombre: "Marketing 360" },
  { clave: "pauta", nombre: "Pauta" },
  { clave: "crm", nombre: "CRM" },
  { clave: "asesorias", nombre: "Asesorías 1a1" },
] as const;

export type ClaveServicio = (typeof SERVICIOS)[number]["clave"];

export const RUTA_FORMULARIO = "/contactanos";

/** Enlace al formulario; con `servicio`, ese servicio llega ya marcado. */
export function enlaceFormulario(servicio?: ClaveServicio): string {
  return servicio ? `${RUTA_FORMULARIO}?servicio=${servicio}` : RUTA_FORMULARIO;
}

/** Las claves validas que vienen en la URL (?servicio=pauta,crm), sin
 *  repetidas y en el orden del formulario. Lo desconocido se ignora. */
export function serviciosDeUrl(valor: string | string[] | undefined): ClaveServicio[] {
  const crudo = (Array.isArray(valor) ? valor.join(",") : (valor ?? "")).split(",").map((s) => s.trim().toLowerCase());
  return SERVICIOS.filter((s) => crudo.includes(s.clave)).map((s) => s.clave);
}

/** «Marketing 360», «Marketing 360 y Pauta», «Marketing 360, Pauta y CRM». */
export function listaEnEspanol(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

/**
 * El mensaje de WhatsApp del formulario, con la redaccion pedida:
 *   Hola como estan mi nombre es <nombre> pertenezco a la empresa <negocio> y
 *   le escribo por el servicio de <servicios>
 * Si la persona escribio el detalle de lo que necesita, va en una linea aparte
 * al final: el formulario lo pide y, sin esto, se perderia.
 */
export function mensajeFormulario({
  nombre,
  negocio,
  servicios,
  detalle,
}: {
  nombre: string;
  negocio: string;
  servicios: string[];
  detalle?: string;
}): string {
  const base = `Hola como estan mi nombre es ${nombre.trim()} pertenezco a la empresa ${negocio.trim()} y le escribo por el servicio de ${listaEnEspanol(servicios)}`;
  const extra = detalle?.trim();
  return extra ? `${base}\n\nDetalle: ${extra}` : base;
}

/** El boton flotante de WhatsApp (todas las paginas). */
export const MENSAJE_FLOTANTE = "Hola DOFI me gustaría contratar sus servicios.";
