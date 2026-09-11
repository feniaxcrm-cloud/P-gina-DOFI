import { getImageProps } from "next/image";
import type { ImagenSanity } from "@/lib/marketing-digital";

/**
 * Una pieza grafica terminada, mostrada ENTERA y tal como fue diseñada.
 *
 * POR QUE NO SE RECORTA
 * -----------------------------------------------------------------
 * El pedido fue explicito: estas imagenes no se modifican -- ni textos, ni
 * colores, ni composicion. Un `object-cover` recorta, y recortar ya es
 * cambiar la composicion. Asi que la pieza ocupa el 100% del ancho y su
 * alto sale de su propia proporcion (ancho/alto reales, traidos de
 * Sanity). En ninguna pantalla se pierde un borde.
 *
 * MOBILE
 * -----------------------------------------------------------------
 * Una pieza apaisada (2,7:1, por ejemplo) a 390px de ancho queda baja pero
 * completa. Si el diseñador entrega una version para telefono, se sube en
 * "Versión para móvil" y el <picture> la sirve por debajo de 768px. Es la
 * direccion de arte estandar: el navegador elige el archivo, sin JS, y cada
 * <source> declara sus dimensiones para que no haya salto de layout.
 */
export function PiezaCompleta({
  imagen,
  imagenMovil,
  alt,
  sizes = "100vw",
}: {
  imagen: ImagenSanity;
  imagenMovil?: ImagenSanity | null;
  alt: string;
  sizes?: string;
}) {
  const {
    props: { srcSet: srcEscritorio, style, ...resto },
  } = getImageProps({ src: imagen.url, alt, width: imagen.ancho, height: imagen.alto, sizes });

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...resto}
      alt={alt}
      srcSet={srcEscritorio}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full"
      style={{ ...style, width: "100%", height: "auto" }}
    />
  );

  if (!imagenMovil) return img;

  const {
    props: { srcSet: srcMovil },
  } = getImageProps({
    src: imagenMovil.url,
    alt,
    width: imagenMovil.ancho,
    height: imagenMovil.alto,
    sizes,
  });

  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet={srcMovil}
        width={imagenMovil.ancho}
        height={imagenMovil.alto}
      />
      {img}
    </picture>
  );
}
