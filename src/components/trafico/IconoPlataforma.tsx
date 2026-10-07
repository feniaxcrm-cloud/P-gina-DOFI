import {
  siFacebook,
  siGoogleads,
  siInstagram,
  siMeta,
  siTiktok,
  siWhatsapp,
  siYoutube,
} from "simple-icons";
import { Globe, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import type { IconoPlataforma as Clave } from "@/lib/trafico";

/**
 * El icono de una plataforma de tráfico, dentro de un circulo con su color.
 *
 * Las marcas salen de simple-icons (el mismo paquete que ya usa Tools.tsx),
 * con su color oficial: es uso nominativo, para decir en que plataforma
 * trabajamos. LinkedIn no esta en simple-icons y se dibuja con el icono de
 * Phosphor; "web" (el trafico propio) usa el morado de DOFI. WhatsApp usa el
 * verde del boton flotante (--color-whatsapp): el #25D366 de la app deja el
 * icono blanco por debajo de 3:1.
 */

const MARCAS = {
  meta: siMeta,
  tiktok: siTiktok,
  google: siGoogleads,
  youtube: siYoutube,
  instagram: siInstagram,
  facebook: siFacebook,
  whatsapp: siWhatsapp,
} as const;

export function IconoPlataforma({ icono, tamano = 56, className = "" }: { icono: Clave; tamano?: number; className?: string }) {
  const marca = icono in MARCAS ? MARCAS[icono as keyof typeof MARCAS] : null;
  const fondo =
    icono === "whatsapp"
      ? "var(--color-whatsapp)"
      : marca
        ? `#${marca.hex}`
        : icono === "linkedin"
          ? "#0A66C2"
          : "var(--color-brand)";
  const interior = Math.round(tamano * 0.5);

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-2xl text-white ${className}`}
      style={{ width: tamano, height: tamano, background: fondo }}
    >
      {marca ? (
        <svg width={interior} height={interior} viewBox="0 0 24 24" fill="currentColor">
          <path d={marca.path} />
        </svg>
      ) : icono === "linkedin" ? (
        <LinkedinLogo size={interior} weight="fill" />
      ) : (
        <Globe size={interior} weight="duotone" />
      )}
    </span>
  );
}
