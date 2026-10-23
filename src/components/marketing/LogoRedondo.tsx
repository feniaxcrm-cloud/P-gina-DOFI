import type { EmpresaGiro } from "@/lib/marketing-digital";

/**
 * El logo de una empresa, REDONDO (pedido del 2026-10-23: «los propios
 * logotipos deben tener una forma circular», no un logo cuadrado metido en un
 * círculo). Lo usan la columna de logos y la fila que se desliza de «Clientes
 * y casos de éxito» (las cuatro páginas).
 *
 * 1. Con «Logo circular» (generado por scripts/logos-circulares.mts o subido
 *    en el Studio): esa imagen, que ya es el logo redondo.
 * 2. Sin él, el logo recortado en círculo (como una foto de perfil).
 * 3. Sin logo, las iniciales sobre el morado de marca.
 *
 * El tamaño lo da el contenedor (`className`, con alto y ancho iguales).
 */
function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter((p) => /^[\p{L}\d]/u.test(p))
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function LogoRedondo({
  empresa,
  oculta = false,
  className = "",
}: {
  empresa: EmpresaGiro;
  /** Copia de la marquesina: sin texto alternativo (no se lee dos veces). */
  oculta?: boolean;
  className?: string;
}) {
  const alt = oculta ? "" : empresa.nombre;
  const marco = `relative block shrink-0 overflow-hidden rounded-full shadow-[0_12px_26px_-16px_rgba(26,15,61,0.55)] ${className}`;

  if (empresa.logoCircular) {
    return (
      <span className={marco}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={empresa.logoCircular} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </span>
    );
  }
  if (empresa.logo) {
    return (
      <span className={`${marco} bg-white`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={empresa.logo.url} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span
      role={oculta ? undefined : "img"}
      aria-label={oculta ? undefined : empresa.nombre}
      className={`${marco} flex items-center justify-center bg-[linear-gradient(150deg,var(--color-brand-lift)_0%,var(--color-brand)_100%)] font-display font-bold text-white [container-type:size]`}
    >
      <span aria-hidden="true" className="text-[30cqw] leading-none">
        {iniciales(empresa.nombre)}
      </span>
    </span>
  );
}
