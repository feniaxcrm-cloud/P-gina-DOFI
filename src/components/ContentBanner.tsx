import Image from "next/image";
import { Reveal } from "./Reveal";
import { BotonCta } from "./BotonCta";
import type {
  PosicionCta,
  PosicionHorizontalCta,
  PosicionVerticalCta,
  SeccionContenido,
} from "@/lib/sanity";

/**
 * Uno de los 4 banners full-width que van debajo de las tarjetas del Hero.
 * Un solo componente reutilizado 4 veces desde page.tsx: no existen
 * Banner01/Banner02/... -- lo unico que cambia entre uno y otro son los
 * datos que llegan de Sanity.
 *
 * LA IMAGEN ES EL DISEÑO (Sprint "Banners full-width")
 * -----------------------------------------------------------------
 * No hay titulo ni descripcion en HTML: el mensaje, la tipografia y los
 * remates viven DENTRO de la pieza grafica que se carga desde Sanity. El
 * unico texto propio del banner es el `alt` (obligatorio en el Studio) y,
 * desde el sprint de CTA, la etiqueta del boton.
 *
 * EL CTA VA ENCIMA, NO ADENTRO (Sprint "CTA sobre los banners")
 * -----------------------------------------------------------------
 * El boton es una capa HTML posicionada sobre la imagen, con z-index
 * propio. Esa es toda la gracia: texto, enlace, color y ubicacion se
 * cambian desde Sanity sin volver a exportar la pieza. El boton en si vive
 * en BotonCta.tsx, compartido con el resto del sitio.
 *
 * ANCHO COMPLETO SIN TRUCOS
 * -----------------------------------------------------------------
 * La seccion no necesita la tecnica full-bleed del Hero: `<main>` no impone
 * ningun ancho maximo, asi que un `<section>` normal ya ocupa el 100% del
 * viewport. Tampoco lleva contenedor centrado ni padding lateral -- la
 * imagen toca los dos bordes de la pantalla, que es justo lo pedido.
 *
 * ALTO Y RECORTE
 * -----------------------------------------------------------------
 * Telefono y tablet: alto fijo por breakpoint (380 -> 520px) con
 * `object-cover`: la imagen cubre el banner sin deformarse nunca. Lo que
 * decide QUE parte queda visible al recortar es el hotspot de Sanity,
 * traducido a `object-position` -- el mismo mecanismo que ya usa el Hero,
 * sin instalar @sanity/image-url.
 *
 * ESCRITORIO: UNA PANTALLA, LA PIEZA ENTERA (pedido del 2026-10-07: "cada
 * seccion cuadre el 100% de la pantalla"). El banner mide el alto de la
 * ventana y la pieza se muestra COMPLETA, con su proporcion real (sale de
 * Sanity): nunca se recorta el texto que trae dibujado. Lo que sobra
 * alrededor lo llena la misma imagen, ampliada y desenfocada (un "ambiente"
 * del color de la pieza), asi no quedan franjas vacias. El boton se ubica
 * sobre la pieza, no sobre el ambiente: sus coordenadas siguen siendo las que
 * se eligieron en el Studio. Sin las medidas (o sin imagen), el banner de
 * siempre.
 *
 * MOVIMIENTO
 * -----------------------------------------------------------------
 * Entrada sutil de la imagen (opacity + 20px de translateY) y del boton
 * (opacity + 12px, 600ms, apenas despues), ambas via <Reveal>, que respeta
 * prefers-reduced-motion por la regla de globals.css. Despues de entrar todo
 * queda quieto: sin parallax, sin flotar, sin pulso. Los unicos movimientos
 * posteriores son de hover, y por lo tanto deliberados.
 */

/**
 * Traduccion de los pasos del selector de Sanity a coordenadas CSS.
 *
 * Todo se expresa como (left/top + translate) en vez de mezclar
 * left/right/bottom, para que las dos posiciones -- mobile y desktop --
 * puedan intercambiarse con un solo juego de variables CSS (ver .banner-cta
 * en globals.css). Los extremos no van pegados al borde: 6% de margen a
 * cada lado, asi el boton nunca queda lamiendo el filo de la pantalla.
 */
const ANCLAS_X: Record<PosicionHorizontalCta, { left: number; tx: string }> = {
  izquierda: { left: 6, tx: "0%" },
  "centro-izquierda": { left: 33, tx: "-50%" },
  centro: { left: 50, tx: "-50%" },
  "centro-derecha": { left: 67, tx: "-50%" },
  derecha: { left: 94, tx: "-100%" },
};

const ANCLAS_Y: Record<PosicionVerticalCta, { top: number; ty: string }> = {
  arriba: { top: 6, ty: "0%" },
  "centro-arriba": { top: 28, ty: "-50%" },
  centro: { top: 50, ty: "-50%" },
  "centro-abajo": { top: 72, ty: "-50%" },
  abajo: { top: 94, ty: "-100%" },
};

/** Ancla + ajuste fino, ya resueltos a porcentajes listos para CSS. El
 *  ajuste se suma al ancla en vez de reemplazarla: el desplegable sigue
 *  marcando la zona, y el numero solo la corre un poco. */
function resolverPosicion(pos: PosicionCta) {
  const x = ANCLAS_X[pos.horizontal];
  const y = ANCLAS_Y[pos.vertical];
  return {
    left: `${x.left + pos.desplazamientoX}%`,
    top: `${y.top + pos.desplazamientoY}%`,
    tx: x.tx,
    ty: y.ty,
  };
}

/** Las 8 variables que consume .banner-cta: 4 para mobile y 4 para desktop.
 *  El cambio entre unas y otras lo hace una media query en CSS, no React --
 *  asi el boton es UN solo enlace en el DOM (no uno oculto por breakpoint,
 *  que duplicaria el enlace para lectores de pantalla y buscadores). */
function variablesDePosicion(mobile: PosicionCta, desktop: PosicionCta): React.CSSProperties {
  const m = resolverPosicion(mobile);
  const d = resolverPosicion(desktop);

  return {
    "--cta-left": m.left,
    "--cta-top": m.top,
    "--cta-tx": m.tx,
    "--cta-ty": m.ty,
    "--cta-left-md": d.left,
    "--cta-top-md": d.top,
    "--cta-tx-md": d.tx,
    "--cta-ty-md": d.ty,
  } as React.CSSProperties;
}

export function ContentBanner({
  backgroundImage,
  backgroundImageAlt,
  hotspot,
  ancho,
  alto,
  cta,
}: SeccionContenido) {
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";
  // Pantalla completa con la pieza entera: solo si se sabe su proporcion.
  const completa = Boolean(backgroundImage && ancho && alto);
  const proporcion = completa ? `${ancho} / ${alto}` : undefined;

  return (
    <section
      className={`relative w-full overflow-hidden ${
        completa ? "lg:flex lg:h-[100svh] lg:items-center lg:justify-center lg:bg-abyss lg:pt-[var(--alto-nav)] lg:snap-start" : ""
      }`}
    >
      {completa && backgroundImage && (
        // El ambiente: la misma imagen (misma URL, el navegador no la baja dos
        // veces), ampliada y muy desenfocada, solo en escritorio.
        <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            className="scale-125 object-cover opacity-90 blur-[60px] saturate-[1.15]"
          />
          <div className="absolute inset-0 bg-abyss/25" />
        </div>
      )}
      <Reveal y={20} className={completa ? "relative w-full lg:w-auto" : undefined}>
        <div
          className={`group relative h-[380px] w-full overflow-hidden sm:h-[440px] md:h-[520px] ${
            completa
              ? "lg:h-auto lg:w-[min(100vw,calc((100svh-var(--alto-nav))*var(--proporcion)))] lg:[aspect-ratio:var(--proporcion)] lg:shadow-[0_40px_90px_-40px_rgba(8,4,20,0.8)]"
              : "lg:h-[600px]"
          }`}
          style={proporcion ? ({ "--proporcion": proporcion } as React.CSSProperties) : undefined}
        >
          {backgroundImage ? (
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover motion-safe:transition-transform motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.01]"
              style={{ objectPosition }}
            />
          ) : (
            // Sin imagen todavia en Sanity: atmosfera de marca en vez de un
            // hueco. aria-hidden porque no comunica nada -- es el estado
            // "falta cargar la pieza", no contenido.
            <div aria-hidden="true" className="absolute inset-0 bg-canvas-raised">
              <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand/12 blur-[110px]" />
              <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-accent/12 blur-[110px]" />
            </div>
          )}

          {cta && (
            // max-w-[88%] deja el mismo 6% de margen que usan los anclajes
            // laterales: aunque el texto del boton se alargue desde Sanity,
            // no puede desbordar el banner ni quedar cortado por el
            // overflow-hidden.
            <div
              className="banner-cta z-10 max-w-[88%]"
              // El anclaje horizontal de mobile viaja tambien como atributo
              // porque en pantallas de menos de 560px los dos intermedios no
              // entran y globals.css los lleva al borde mas cercano. Es una
              // correccion geometrica, no una decision de diseño: ver la
              // nota de .banner-cta ahi.
              data-cta-h={cta.mobile.horizontal}
              style={variablesDePosicion(cta.mobile, cta.desktop)}
            >
              <Reveal y={12} delay={0.2} duration={0.6}>
                <BotonCta
                  texto={cta.texto}
                  enlace={cta.enlace}
                  color={cta.color}
                  esExterno={cta.esExterno}
                />
              </Reveal>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
