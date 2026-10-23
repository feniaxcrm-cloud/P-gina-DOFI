import { defineField } from "sanity";

/**
 * «Logo circular» (2026-10-23): la versión REDONDA del logo, la que se ve en
 * «Clientes y casos de éxito». La genera scripts/logos-circulares.mts a partir
 * del logo (sin tocar el original) y se puede reemplazar a mano. Va en la
 * Cuenta y en las empresas con logo propio de cada giro.
 */
export function campoLogoCircular(extra: { group?: string } = {}) {
  return defineField({
    name: "logoCircular",
    title: "Logo circular",
    type: "image",
    ...extra,
    description:
      "La versión REDONDA del logo para «Clientes y casos de éxito» (PNG o WebP cuadrado, con el exterior del círculo transparente). Se genera sola a partir del logo; reemplázala si quieres otra composición. Si cambias el logo, borra esta para que se regenere (mientras tanto la web recorta el logo en círculo).",
  });
}
