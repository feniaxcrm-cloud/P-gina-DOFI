/**
 * Validacion del formulario de contacto. COMPARTIDA cliente y servidor.
 *
 * Antes existian dos copias con reglas parecidas pero no identicas
 * (Contact.tsx y api/contacto/route.ts). Dos copias significan que tarde o
 * temprano divergen y el usuario ve "ok" en el navegador mientras el
 * servidor rechaza. Aqui hay una sola regla.
 *
 * Sin dependencias: es una funcion pura, sirve igual en el navegador y en el
 * runtime de Cloudflare Workers.
 */

/** Campos que el formulario envia. `empresa` es opcional. */
export type ContactInput = {
  nombre: string;
  email: string;
  mensaje: string;
  empresa?: string;
  /** Reservado: hoy el formulario no pide telefono. Se acepta si algun dia
   *  se agrega el campo, sin tener que tocar la validacion ni la entrega. */
  telefono?: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITES = {
  nombreMin: 2,
  nombreMax: 120,
  emailMax: 200,
  empresaMax: 160,
  mensajeMin: 12,
  mensajeMax: 4000,
  telefonoMax: 40,
} as const;

/** Suficientemente estricto para atajar erratas, sin rechazar direcciones
 *  validas poco comunes. La validacion real de un correo es entregarlo. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

/**
 * Normaliza y valida en un solo paso.
 *
 * Devuelve los errores por campo y, si no hay ninguno, los datos ya
 * recortados y listos para entregar. El servidor usa el `data` que sale de
 * aqui, nunca el cuerpo crudo de la peticion.
 */
export function validarContacto(raw: Record<string, unknown>): {
  errors: ContactErrors;
  valid: boolean;
  data: ContactInput;
} {
  const data: ContactInput = {
    nombre: texto(raw.nombre).slice(0, LIMITES.nombreMax),
    email: texto(raw.email).slice(0, LIMITES.emailMax),
    mensaje: texto(raw.mensaje).slice(0, LIMITES.mensajeMax),
    empresa: texto(raw.empresa).slice(0, LIMITES.empresaMax) || undefined,
    telefono: texto(raw.telefono).slice(0, LIMITES.telefonoMax) || undefined,
  };

  const errors: ContactErrors = {};

  if (data.nombre.length < LIMITES.nombreMin) {
    errors.nombre = "Escribe tu nombre completo.";
  }
  if (!EMAIL.test(data.email)) {
    errors.email = "Revisa el correo, no parece válido.";
  }
  if (data.mensaje.length < LIMITES.mensajeMin) {
    errors.mensaje = "Cuéntanos un poco más, mínimo una frase.";
  }

  return { errors, valid: Object.keys(errors).length === 0, data };
}

// --- Atribucion ---------------------------------------------------------

/** Parametros de campaña que interesan para atribuir el lead a su origen.
 *  Se leen de la URL, no se piden al usuario: ningun campo nuevo visible. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

/** Extrae los parametros de atribucion de un query string.
 *  Recorta a 200 caracteres por valor: nadie necesita mas y evita que una
 *  URL manipulada infle el payload. */
export function extraerUtm(search: string): Utm {
  const params = new URLSearchParams(search);
  const utm: Utm = {};

  for (const key of UTM_KEYS) {
    const valor = params.get(key)?.trim();
    if (valor) utm[key] = valor.slice(0, 200);
  }

  return utm;
}

/** Deja pasar solo las claves conocidas cuando el objeto llega desde el
 *  cliente. Nunca se reenvia al proveedor lo que mande el navegador tal cual. */
export function sanearUtm(raw: unknown): Utm {
  if (!raw || typeof raw !== "object") return {};

  const entrada = raw as Record<string, unknown>;
  const utm: Utm = {};

  for (const key of UTM_KEYS) {
    const valor = entrada[key];
    if (typeof valor === "string" && valor.trim()) {
      utm[key] = valor.trim().slice(0, 200);
    }
  }

  return utm;
}
