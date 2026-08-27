import Image from "next/image";

/**
 * Logo de DOFI.
 *
 * Tres piezas, generadas desde el original por scripts/prepare-logo.mjs
 * (compact/full) y scripts/make-logo-on-light.mjs (compact-on-light):
 *
 *   logo-dofi-compact.png           delfin + DOFi en blanco+naranja, para
 *                                    fondo oscuro. Se usa en la nav, donde
 *                                    el logo mide ~44px y la linea "AGENCIA
 *                                    CREATIVA" seria ilegible.
 *   logo-dofi-compact-on-light.png  misma pieza, delfin+DOFi recoloreado a
 *                                    --color-deep (el blanco original era
 *                                    invisible sobre el nav claro nuevo —
 *                                    verificado compositando el PNG real
 *                                    antes de generar esta variante). El
 *                                    naranja no se toca.
 *   logo-dofi.png                   lockup completo, con el claim
 *                                    dibujado, blanco+naranja. Se usa en el
 *                                    pie (que sigue oscuro).
 *
 * Para regenerar la compacta desde un archivo nuevo, correr ambos scripts
 * en orden: prepare-logo.mjs primero, make-logo-on-light.mjs despues (lee
 * el resultado del primero).
 */

// Dimensiones reales de cada archivo, para que Next reserve el espacio
// exacto y no haya salto de layout al cargar.
const ASSETS = {
  compact: { src: "/logo-dofi-compact.png", w: 512, h: 465 },
  compactOnLight: { src: "/logo-dofi-compact-on-light.png", w: 512, h: 464 },
  full: { src: "/logo-dofi.png", w: 640, h: 654 },
} as const;

const HEIGHTS = { sm: 44, md: 76, lg: 120 } as const;

export function Wordmark({
  size = "md",
  withTagline = false,
  tone = "dark",
}: {
  size?: keyof typeof HEIGHTS;
  withTagline?: boolean;
  /** "dark" = superficie oscura (asset original). "light" = superficie
   *  clara (nav rediseñado): usa la variante recoloreada. Sin efecto si
   *  withTagline, que hoy solo existe en superficies oscuras (pie). */
  tone?: "dark" | "light";
}) {
  // El lockup completo ya trae "AGENCIA CREATIVA" dibujado dentro.
  const asset = withTagline
    ? ASSETS.full
    : tone === "light"
      ? ASSETS.compactOnLight
      : ASSETS.compact;
  const height = HEIGHTS[size];
  const width = Math.round((asset.w / asset.h) * height);

  return (
    <Image
      src={asset.src}
      alt="DOFI Agencia Creativa"
      width={width}
      height={height}
      priority={size === "sm"}
      className="h-auto w-auto"
      style={{ height, width }}
    />
  );
}
