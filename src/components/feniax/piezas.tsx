import { LOGOS_FENIAX } from "@/config/feniax";

/**
 * Piezas chicas de la identidad FENIAX que se repiten entre secciones.
 */

/** Etiqueta sobre los titulos, con el espaciado ancho del "VENTAS
 *  INTELIGENTES" del logotipo y la raya que lo acompaña. */
export function Etiqueta({ children, tono = "claro" }: { children: React.ReactNode; tono?: "claro" | "oscuro" }) {
  return (
    <p
      className={`mb-6 flex items-center gap-3 font-sans text-[12.5px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.32em] ${
        tono === "oscuro" ? "text-accent-lift" : "text-brand"
      }`}
    >
      <span aria-hidden="true" className={`h-px w-8 ${tono === "oscuro" ? "bg-accent-lift/70" : "bg-brand/50"}`} />
      {children}
    </p>
  );
}

/** Separa las ultimas `n` palabras de un titulo para pintarlas con el
 *  degradado de la "IA". "¿Demasiados mensajes, pocas ventas?" con n = 2 ->
 *  ["¿Demasiados mensajes,", "pocas ventas?"]. */
export function partirFinal(titulo: string, n = 1): [string, string] {
  const palabras = titulo.split(" ");
  if (palabras.length <= n) return ["", titulo];
  return [palabras.slice(0, -n).join(" "), palabras.slice(-n).join(" ")];
}

/** Trama de puntos del brandbook (las nubes de particulas de la portada y
 *  de "Tamaños mínimos"), desvanecida hacia los bordes con una mascara. */
export function Puntos({ className = "", color = "color-mix(in srgb, var(--color-accent) 55%, transparent)" }: { className?: string; color?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage: `radial-gradient(${color} 1.1px, transparent 1.6px)`,
        backgroundSize: "14px 14px",
        WebkitMaskImage: "radial-gradient(closest-side, #000 0%, transparent 100%)",
        maskImage: "radial-gradient(closest-side, #000 0%, transparent 100%)",
      }}
    />
  );
}

/** El isotipo como marca de agua grande (como en "Directrices de marca"). */
export function IsotipoAgua({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGOS_FENIAX.isotipo}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`pointer-events-none absolute select-none ${className}`}
    />
  );
}

/** La foto de fondo vive en marketing/ (la comparten FENIAX y Tráfico/Ads). */
export { FotoFondo } from "@/components/marketing/FotoFondo";
