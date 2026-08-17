import Image from "next/image";

/**
 * Logo de DOFI.
 *
 * Dos piezas, generadas desde el original por scripts/prepare-logo.mjs:
 *
 *   logo-dofi-compact.png  delfin + DOFi. Se usa en la nav, donde el logo
 *                          mide ~44px y la linea "AGENCIA CREATIVA" seria
 *                          ilegible.
 *   logo-dofi.png          lockup completo, con el claim dibujado. Se usa
 *                          en el pie, donde hay sitio para leerlo.
 *
 * Para regenerarlos desde un archivo nuevo:
 *   node scripts/prepare-logo.mjs "ruta/al/logo.png"
 */

// Dimensiones reales de cada archivo, para que Next reserve el espacio
// exacto y no haya salto de layout al cargar.
const ASSETS = {
  compact: { src: "/logo-dofi-compact.png", w: 512, h: 465 },
  full: { src: "/logo-dofi.png", w: 640, h: 654 },
} as const;

const HEIGHTS = { sm: 44, md: 76, lg: 120 } as const;

export function Wordmark({
  size = "md",
  withTagline = false,
}: {
  size?: keyof typeof HEIGHTS;
  withTagline?: boolean;
}) {
  // El lockup completo ya trae "AGENCIA CREATIVA" dibujado dentro.
  const asset = withTagline ? ASSETS.full : ASSETS.compact;
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
