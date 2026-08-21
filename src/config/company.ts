/**
 * Datos corporativos de DOFI. FUENTE UNICA DE VERDAD.
 *
 * Antes de este archivo, el telefono, el correo, la ciudad, el horario y las
 * redes vivian sueltos dentro de Footer.tsx, y el numero de WhatsApp estaba
 * escrito por separado en Contact.tsx y en el respaldo de sanity.ts. Esa
 * duplicacion ya habia producido un error real en produccion: el CTA de
 * WhatsApp apuntaba a 593999999999 (un numero inventado) mientras el pie
 * mostraba el numero bueno.
 *
 * REGLA: ningun componente vuelve a escribir un dato corporativo a mano.
 * Todo sale de aqui.
 *
 * SOBREESCRITURA POR ENTORNO
 * --------------------------
 * Los campos que pueden cambiar sin tocar codigo aceptan una variable de
 * entorno. Llevan prefijo NEXT_PUBLIC_ porque se leen tambien desde
 * componentes de cliente (Contact.tsx), y Next solo inyecta en el bundle del
 * navegador las variables con ese prefijo. Deben escribirse como literal
 * completo (process.env.NEXT_PUBLIC_X) para que la sustitucion en tiempo de
 * build funcione; por eso no se accede con indice dinamico.
 */

/** Devuelve el valor solo si trae contenido real. Una variable declarada
 *  pero vacia ("") cuenta como no configurada. */
function opcional(valor: string | undefined): string | undefined {
  const limpio = valor?.trim();
  return limpio ? limpio : undefined;
}

/** Igual que opcional(), pero con un valor por defecto de codigo. */
function conDefecto(valor: string | undefined, defecto: string): string {
  return opcional(valor) ?? defecto;
}

// --- Telefono / WhatsApp -----------------------------------------------
// Un solo numero, en formato E.164 sin simbolos. El formato para mostrar y
// el enlace de wa.me se derivan de aqui (ver src/lib/whatsapp.ts).
const WHATSAPP = conDefecto(
  process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
  "593984472869"
);

const TELEFONO_VISIBLE = conDefecto(
  process.env.NEXT_PUBLIC_COMPANY_PHONE,
  "+593 98 447 2869"
);

// --- Redes --------------------------------------------------------------
// SIN valor por defecto A PROPOSITO. Antes apuntaban a instagram.com,
// tiktok.com y linkedin.com — las portadas de las plataformas, no los
// perfiles de DOFI. Un enlace que no lleva al perfil real resta credibilidad,
// asi que mientras no exista la URL verificada el icono NO se pinta
// (ver Footer.tsx). Para activarlos, define las variables de entorno.
const social = {
  instagram: opcional(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  tiktok: opcional(process.env.NEXT_PUBLIC_TIKTOK_URL),
  linkedin: opcional(process.env.NEXT_PUBLIC_LINKEDIN_URL),
} as const;

export type SocialKey = keyof typeof social;

export const company = {
  name: "DOFI Agencia Creativa",
  shortName: "DOFI",
  /** Razon social. Hoy igual al nombre comercial; separado para poder
   *  diferenciarlos en el marcado Schema.org sin tocar componentes. */
  legalName: "DOFI Agencia Creativa",
  tagline: "Un Mar de Ideas",

  phone: {
    /** Como se muestra en pantalla */
    display: TELEFONO_VISIBLE,
    /** Solo digitos, para href tel: y para wa.me */
    e164: WHATSAPP,
  },

  whatsapp: {
    /** Solo digitos, sin "+". Lo consume createWhatsAppUrl(). */
    number: WHATSAPP,
    /** Mensaje neutro por defecto. NO es copy comercial definitivo: eso se
     *  define en el sprint de mensaje. */
    defaultMessage:
      "Hola DOFI, me interesa conocer cómo pueden ayudar a mi empresa.",
  },

  /** PENDIENTE: correo corporativo propio. El actual es una cuenta gratuita.
   *  No es un blocker tecnico, pero resta en percepcion para una agencia que
   *  vende sistemas empresariales. Al migrar, basta con definir
   *  NEXT_PUBLIC_COMPANY_EMAIL. */
  email: conDefecto(
    process.env.NEXT_PUBLIC_COMPANY_EMAIL,
    "dofiagenciacreativa@gmail.com"
  ),

  location: {
    city: "Cuenca",
    region: "Azuay",
    country: "Ecuador",
    countryCode: "EC",
    /** Direccion de calle. PENDIENTE de confirmar por el propietario; hasta
     *  entonces se omite en vez de inventarse. */
    address: opcional(process.env.NEXT_PUBLIC_COMPANY_ADDRESS),
    /** "Cuenca, Ecuador" */
    get label() {
      return `${this.city}, ${this.country}`;
    },
  },

  hours: [
    "Lunes a viernes: 08:30 - 17:30",
    "Sábado y domingo: cerrado",
  ] as const,

  social,

  /** Marca hermana que monta los sistemas (CRM, automatizacion, bots). */
  partner: {
    name: "FENIAX",
  },
} as const;

/** Redes efectivamente configuradas, en orden de presentacion. Las que no
 *  tienen URL real quedan fuera de la lista y no se renderizan. */
export const socialLinks: { key: SocialKey; label: string; href: string }[] = (
  [
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "linkedin", label: "LinkedIn" },
  ] as const
).flatMap(({ key, label }) => {
  const href = company.social[key];
  return href ? [{ key, label, href }] : [];
});
