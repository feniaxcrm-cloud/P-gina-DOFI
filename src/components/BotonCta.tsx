import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ColorCta } from "@/lib/sanity";

/**
 * Boton de llamado a la accion de DOFI: pastilla con flecha, aro y sombra.
 *
 * Nacio dentro de ContentBanner.tsx (los CTA de los 4 banners de la home) y
 * se saco a su propio archivo cuando la pagina de Marketing Digital necesito
 * el mismo boton. Una sola definicion para todo el sitio: si el boton
 * cambia, cambia en todos lados -- no dos copias que se desincronizan.
 *
 * COLOR COMO DATO
 * -----------------------------------------------------------------
 * Colores y sombra viven en globals.css (.banner-cta-boton) alimentados por
 * variables, porque el color puede ser un DATO (en los banners de la home se
 * elige en Sanity) y una clase de Tailwind armada en tiempo de ejecucion no
 * sobrevive al purgado de CSS.
 *
 * Las cuatro paletas pasan WCAG AA con margen: naranja 6,53:1, morado
 * 10,2:1, blanco 17,8:1, oscuro 19,1:1.
 *
 * El `aro` no es decorativo: es lo que garantiza que el boton no se funda
 * con lo que tenga detras aunque debajo caiga una zona del mismo tono que el
 * relleno. No se usa ningun rectangulo ni velo detras.
 *
 * TAMAÑO: "normal" es el de siempre (los banners de la home no cambian).
 * "grande" existe para el cierre de Marketing Digital, donde el brief pide
 * que el boton sea el protagonista de la seccion.
 *
 * El foco tiene regla propia (globals.css): el contorno naranja global
 * seria invisible sobre un boton naranja.
 */
export const PALETAS_CTA: Record<ColorCta, { bg: string; bgHover: string; fg: string; aro: string }> = {
  naranja: { bg: "#F47B20", bgHover: "#FF9440", fg: "#1A0F3D", aro: "#FFFFFF" },
  morado: { bg: "#4B2A93", bgHover: "#6D4BC9", fg: "#FFFFFF", aro: "#FFFFFF" },
  blanco: { bg: "#FFFFFF", bgHover: "#F4F0FE", fg: "#1A0F3D", aro: "#4B2A93" },
  oscuro: { bg: "#120A26", bgHover: "#241553", fg: "#FFFFFF", aro: "#F47B20" },
};

export function BotonCta({
  texto,
  enlace,
  color = "naranja",
  esExterno,
  tamano = "normal",
}: {
  texto: string;
  enlace: string;
  color?: ColorCta;
  /** Si no se indica, se deduce del enlace: una ruta del sitio empieza con
   *  "/"; todo lo demas (https://, mailto:, tel:) sale del sitio. */
  esExterno?: boolean;
  tamano?: "normal" | "grande";
}) {
  const externo = esExterno ?? !enlace.startsWith("/");
  const paleta = PALETAS_CTA[color];
  const clases =
    "banner-cta-boton group/cta inline-flex items-center justify-center rounded-full text-center font-display font-bold leading-tight " +
    "transition-[background-color,box-shadow,scale] duration-300 ease-out " +
    "motion-safe:hover:scale-[1.04] active:scale-[0.99] " +
    (tamano === "grande"
      ? "min-h-[60px] gap-3 px-9 py-3.5 text-[17px] md:min-h-[76px] md:px-12 md:text-[21px]"
      : "min-h-[56px] gap-2.5 px-8 py-3 text-[16px] md:min-h-[64px] md:gap-3 md:px-10 md:text-[18px]");

  const estilo = {
    "--cta-bg": paleta.bg,
    "--cta-bg-hover": paleta.bgHover,
    "--cta-fg": paleta.fg,
    "--cta-aro": paleta.aro,
  } as React.CSSProperties;

  const contenido = (
    <>
      {texto}
      <ArrowRight
        size={tamano === "grande" ? 22 : 20}
        weight="bold"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
      />
    </>
  );

  // Enlace externo: pestaña nueva + rel de seguridad. Interno: <Link> de
  // Next, que hace la navegacion del lado del cliente y precarga la ruta.
  return externo ? (
    <a href={enlace} target="_blank" rel="noopener noreferrer" className={clases} style={estilo}>
      {contenido}
    </a>
  ) : (
    <Link href={enlace} className={clases} style={estilo}>
      {contenido}
    </Link>
  );
}
