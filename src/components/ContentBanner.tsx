import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import type {
  CtaBanner,
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
 * desde este sprint, la etiqueta del boton.
 *
 * EL CTA VA ENCIMA, NO ADENTRO (Sprint "CTA sobre los banners")
 * -----------------------------------------------------------------
 * El boton es una capa HTML posicionada sobre la imagen, con z-index
 * propio. Esa es toda la gracia: texto, enlace y ubicacion se cambian desde
 * Sanity sin volver a exportar la pieza. La jerarquia se mantiene -- primero
 * se lee el mensaje de la imagen, despues el boton.
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
 * Alto fijo por breakpoint (380px en mobile -> 600px en desktop) con
 * `object-cover`: la imagen cubre el banner sin deformarse nunca. Lo que
 * decide QUE parte queda visible al recortar es el hotspot de Sanity,
 * traducido a `object-position` -- el mismo mecanismo que ya usa el Hero,
 * sin instalar @sanity/image-url.
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
const ANCLAS_X: Record<PosicionHorizontalCta, { left: string; tx: string }> = {
  izquierda: { left: "6%", tx: "0%" },
  "centro-izquierda": { left: "33%", tx: "-50%" },
  centro: { left: "50%", tx: "-50%" },
  "centro-derecha": { left: "67%", tx: "-50%" },
  derecha: { left: "94%", tx: "-100%" },
};

const ANCLAS_Y: Record<PosicionVerticalCta, { top: string; ty: string }> = {
  arriba: { top: "6%", ty: "0%" },
  centro: { top: "50%", ty: "-50%" },
  abajo: { top: "94%", ty: "-100%" },
};

/** Las 8 variables que consume .banner-cta: 4 para mobile y 4 para desktop.
 *  El cambio entre unas y otras lo hace una media query en CSS, no React --
 *  asi el boton es UN solo enlace en el DOM (no uno oculto por breakpoint,
 *  que duplicaria el enlace para lectores de pantalla y buscadores). */
function variablesDePosicion(mobile: PosicionCta, desktop: PosicionCta): React.CSSProperties {
  const mx = ANCLAS_X[mobile.horizontal];
  const my = ANCLAS_Y[mobile.vertical];
  const dx = ANCLAS_X[desktop.horizontal];
  const dy = ANCLAS_Y[desktop.vertical];

  return {
    "--cta-left": mx.left,
    "--cta-top": my.top,
    "--cta-tx": mx.tx,
    "--cta-ty": my.ty,
    "--cta-left-md": dx.left,
    "--cta-top-md": dy.top,
    "--cta-tx-md": dx.tx,
    "--cta-ty-md": dy.ty,
  } as React.CSSProperties;
}

/** Naranja DOFI + texto oscuro (6,53:1, pasa AA de sobra) + flecha. Mismo
 *  lenguaje que el CTA principal del Hero, un escalon mas grande porque acá
 *  compite con una pieza grafica a pantalla completa.
 *
 *  La sombra hace dos trabajos: el halo naranja lo integra a la marca, y la
 *  sombra oscura chica lo despega del fondo. Hace falta porque los 4 banners
 *  tienen fondos distintos -- naranja, blanco, azul casi negro y morado --
 *  y sin ese borde de sombra el boton se pierde justo sobre el banner 01,
 *  que es del mismo naranja. No se usa ningun rectangulo ni velo detras: el
 *  banner no se oscurece en ningun momento.
 *
 *  El foco tiene regla propia (.banner-cta-boton en globals.css): el
 *  contorno naranja global seria invisible sobre un boton naranja. */
function BotonCta({ cta }: { cta: CtaBanner }) {
  const clases =
    "banner-cta-boton group/cta inline-flex min-h-[52px] items-center justify-center gap-2.5 " +
    "rounded-full bg-accent px-7 py-3 text-center font-display text-[15px] font-semibold leading-tight " +
    "text-fg-on-accent shadow-[0_10px_30px_-8px_rgba(244,123,32,0.55),0_2px_10px_rgba(18,10,38,0.28)] " +
    "transition-[background-color,box-shadow,scale] duration-300 ease-out " +
    "hover:bg-accent-lift hover:shadow-[0_14px_38px_-8px_rgba(244,123,32,0.7),0_3px_12px_rgba(18,10,38,0.32)] " +
    "motion-safe:hover:scale-[1.03] active:scale-[0.99] " +
    "md:min-h-[60px] md:gap-3 md:px-9 md:text-[17px]";

  const contenido = (
    <>
      {cta.texto}
      <ArrowRight
        size={18}
        weight="bold"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
      />
    </>
  );

  // Enlace externo: pestaña nueva + rel de seguridad. Interno: <Link> de
  // Next, que hace la navegacion del lado del cliente y precarga la ruta.
  return cta.esExterno ? (
    <a href={cta.enlace} target="_blank" rel="noopener noreferrer" className={clases}>
      {contenido}
    </a>
  ) : (
    <Link href={cta.enlace} className={clases}>
      {contenido}
    </Link>
  );
}

export function ContentBanner({
  backgroundImage,
  backgroundImageAlt,
  hotspot,
  cta,
}: SeccionContenido) {
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <section className="relative w-full">
      <Reveal y={20}>
        <div className="group relative h-[380px] w-full overflow-hidden sm:h-[440px] md:h-[520px] lg:h-[600px]">
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
                <BotonCta cta={cta} />
              </Reveal>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
