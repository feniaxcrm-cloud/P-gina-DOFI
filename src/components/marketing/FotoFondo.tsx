import { getImageProps } from "next/image";
import type { ImagenSanity } from "@/lib/marketing-digital";

/** Foto de fondo cargada en el Studio (Portada y Cierre). Igual que en los
 *  banners de Marketing Digital: version movil opcional, cada una con su
 *  punto focal (.foto-dirigida en globals.css), srcset responsivo. */
export function FotoFondo({
  imagen,
  imagenMovil,
  prioridad = false,
}: {
  imagen: ImagenSanity;
  imagenMovil: ImagenSanity | null;
  prioridad?: boolean;
}) {
  const pos = (h: ImagenSanity["hotspot"]) => (h ? `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` : "50% 50%");
  const {
    props: { srcSet, style, ...resto },
  } = getImageProps({ src: imagen.url, alt: imagen.alt, fill: true, sizes: "100vw", priority: prioridad });
  const srcMovil = imagenMovil
    ? getImageProps({ src: imagenMovil.url, alt: imagen.alt, fill: true, sizes: "100vw" }).props.srcSet
    : undefined;
  return (
    <picture>
      {srcMovil && <source media="(max-width: 767px)" srcSet={srcMovil} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...resto}
        alt={imagen.alt}
        srcSet={srcSet}
        className="foto-dirigida object-cover"
        style={
          {
            ...style,
            "--pos-m": pos(imagenMovil?.hotspot ?? imagen.hotspot),
            "--pos-d": pos(imagen.hotspot),
          } as React.CSSProperties
        }
      />
    </picture>
  );
}
