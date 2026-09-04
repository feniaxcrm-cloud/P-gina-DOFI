import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import type { SeccionContenido } from "@/lib/sanity";

/**
 * Una de las 4 "Secciones de contenido" debajo de las tarjetas del Hero.
 * Arquitectura unica y reutilizable — page.tsx la pinta 4 veces via
 * `seccionesContenido.map(...)`, nunca 4 componentes/archivos separados.
 *
 * Sprint "Mejorar diseño visual de las 4 secciones de contenido": mismo
 * dato, misma logica de alternancia y misma integracion con Sanity que
 * antes (no se toco nada de eso) — lo que cambia es la PRESENTACION:
 * jerarquia tipografica (eyebrow/titulo/descripcion/CTA), un CTA solido
 * mucho mas grande y centrado respecto al bloque de texto, imagenes con
 * mas presencia y un tratamiento sutil, y una entrada animada con stagger
 * + direccion (la imagen entra desde el lado en el que va a quedar).
 *
 * FONDO — VUELVE A SER BLANCO (revierte el sprint de colores fuertes)
 * -----------------------------------------------------------------
 * El sprint anterior probo fondos solidos naranja/blanco/morado/naranja
 * por seccion. Este sprint pide explicitamente volver a un lienzo
 * predominantemente blanco: alterna entre `bg-canvas` y el nuevo
 * `bg-canvas-lilac` (color-mix al 4% de marca sobre canvas, ver
 * globals.css) — una variacion CASI imperceptible, no un bloque de color.
 *
 * ALTERNANCIA DE LADO — SIN CAMBIOS (spec §3: "no cambiar esta logica")
 * -----------------------------------------------------------------
 * `index % 2` sobre la posicion real en `seccionesContenido[]` decide el
 * lado: par -> texto a la izquierda; impar -> imagen a la izquierda.
 * Markup en el DOM siempre imagen -> texto (da el orden mobile correcto
 * sin duplicar la imagen); el reordenamiento visual en desktop es
 * `lg:order-*`, puramente CSS.
 *
 * JERARQUIA DE TEXTO Y STAGGER (spec §6-9, §17-18)
 * -----------------------------------------------------------------
 * Eyebrow (numero de seccion + linea naranja) -> titulo -> descripcion ->
 * CTA, cada uno en su propio <Reveal> con delay creciente (0/0.1/0.2/0.3s)
 * en vez de un unico Reveal envolviendo todo el bloque — asi cada pieza
 * aparece en su momento, no todas a la vez. La imagen usa el mismo
 * <Reveal> pero con `x` distinto de 0 (extendido en Reveal.tsx, ver ese
 * archivo): entra desde la derecha si va a quedar a la derecha, desde la
 * izquierda si va a quedar a la izquierda (spec §19-20).
 *
 * CTA — SOLIDO NARANJA, GRANDE, CENTRADO (spec §10-13, §27, §33)
 * -----------------------------------------------------------------
 * Mismo lenguaje visual que el CTA principal del Hero (bg-accent +
 * text-fg-on-accent + hover:bg-accent-lift + la misma sombra tintada que
 * ya usa MagneticCta para su variante primaria) en vez del boton-pildora
 * con borde que tenia antes. `flex justify-center` en un wrapper propio
 * lo centra respecto al ancho del bloque de texto (que sigue alineado a
 * la izquierda) — no centra toda la seccion.
 *
 * INTERNO VS. EXTERNO — SIN CAMBIOS (spec §30-31)
 * -----------------------------------------------------------------
 * Mismo mecanismo que antes: `ctaEnlace` que empieza con "http(s)://" es
 * externo (`target="_blank" rel="noopener noreferrer"`), cualquier otra
 * cosa usa `next/link`.
 *
 * IMAGEN — HOVER SUTIL + VELO DE MARCA (spec §14-16)
 * -----------------------------------------------------------------
 * `group-hover:scale-[1.02]` SOLO en la imagen interna (el contenedor con
 * `overflow-hidden` no se mueve ni cambia de tamaño), 600ms con la misma
 * curva de easing que ya usa ClientCard para su propio hover de foto.
 * Envuelto en `motion-safe:` para que reduced-motion lo desactive del
 * todo (spec §34), no solo lo acorte. Un degradado de marca casi
 * imperceptible (`from-brand/12`) y un glow naranja muy sutil detras de
 * una esquina son el "tratamiento visual" pedido — nunca tapan la foto.
 *
 * PERFORMANCE (spec §35)
 * -----------------------------------------------------------------
 * Todo lo animado es `transform`/`opacity` (Framer Motion x/y, CSS scale):
 * nunca width/height/margin/padding/top/left. Cero layout shift.
 */
export function ContentSection({
  titulo,
  descripcion,
  imagen,
  imagenAlt,
  hotspot,
  ctaTexto,
  ctaEnlace,
  index,
}: SeccionContenido & { index: number }) {
  const textoIzquierda = index % 2 === 0;
  const fondoLila = index % 2 === 1;
  const esExterno = /^https?:\/\//i.test(ctaEnlace);
  // Imagen a la derecha -> entra desde la derecha (x positivo, se asienta
  // en 0). Imagen a la izquierda -> entra desde la izquierda (x negativo).
  const imagenX = textoIzquierda ? 28 : -28;

  const cta = esExterno ? (
    <a href={ctaEnlace} target="_blank" rel="noopener noreferrer" className={CTA_CLASSNAME}>
      {ctaTexto}
      <ArrowRight size={20} weight="bold" aria-hidden="true" className={CTA_ICON_CLASSNAME} />
    </a>
  ) : (
    <Link href={ctaEnlace} className={CTA_CLASSNAME}>
      {ctaTexto}
      <ArrowRight size={20} weight="bold" aria-hidden="true" className={CTA_ICON_CLASSNAME} />
    </Link>
  );

  return (
    // overflow-hidden (mismo patron que ya usa Hero.tsx para sus propios
    // overlays animados): la imagen entra con un translateX inicial (ver
    // Reveal x={imagenX} mas abajo) que, ANTES de que la seccion entre en
    // viewport, geometricamente se sale un poco del contenedor -- un
    // navegador real cuenta ese overshoot (aunque sea opacity:0) para
    // scrollWidth. Confirmado con Puppeteer: sin este overflow-hidden
    // habia scroll horizontal real en mobile y en 1024px, causado por esto
    // y no por ningun otro elemento (se investigo elemento por elemento,
    // no se asumio).
    <section className={`relative overflow-hidden py-24 md:py-36 ${fondoLila ? "bg-canvas-lilac" : "bg-canvas"}`}>
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------- Imagen: primera en el DOM (orden mobile fijo) ----------
              min-w-0 en los dos items del grid (spec §35, sin overflow): sin
              esto, un titulo largo real (spec §32, contenido real de Sanity,
              no el placeholder corto de antes) fuerza la columna a crecer
              mas alla del viewport -- es el bug clasico de "grid blowout"
              (los items de grid tienen min-width:auto por defecto, que no
              respeta el minmax(0,1fr) de la propia pista). Medido con
              Puppeteer en 1024/390/360px antes de este fix: 77px/20px/20px
              de overflow horizontal real, no una suposicion. */}
          <div className={`min-w-0 ${textoIzquierda ? "lg:order-2" : "lg:order-1"}`}>
            <Reveal x={imagenX} y={20} delay={0.05}>
              <ContentImage imagen={imagen} imagenAlt={imagenAlt} hotspot={hotspot} titulo={titulo} />
            </Reveal>
          </div>

          {/* ---------- Texto ---------- */}
          <div className={`min-w-0 ${textoIzquierda ? "lg:order-1" : "lg:order-2"}`}>
            <div className="max-w-[38rem]">
              <Reveal y={20} delay={0}>
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm font-bold tracking-[0.3em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px w-12 bg-accent/60" />
                </div>
              </Reveal>

              <Reveal y={20} delay={0.1}>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
                  {titulo}
                </h2>
              </Reveal>

              <Reveal y={20} delay={0.2}>
                <p className="mt-6 max-w-[46ch] font-sans text-lg leading-relaxed text-ink-muted">
                  {descripcion}
                </p>
              </Reveal>

              <Reveal y={20} delay={0.3}>
                <div className="mt-10 flex justify-center">{cta}</div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// `transition` (no `transition-all`): el subconjunto por defecto de
// Tailwind cubre color/background-color/transform/box-shadow -- exactamente
// lo que cambia en hover -- y deja afuera width/height/margin/padding/
// top/left a proposito (spec §35, nunca animar esas propiedades).
const CTA_CLASSNAME =
  "group relative inline-flex h-16 items-center justify-center gap-2.5 rounded-full bg-accent px-10 font-display text-base font-semibold text-fg-on-accent shadow-[0_8px_24px_-14px_rgba(244,123,32,0.5)] transition duration-300 hover:-translate-y-0.5 hover:bg-accent-lift active:translate-y-0 active:scale-[0.98]";
const CTA_ICON_CLASSNAME = "transition-transform duration-300 group-hover:translate-x-1";

function ContentImage({
  imagen,
  imagenAlt,
  hotspot,
  titulo,
}: Pick<SeccionContenido, "imagen" | "imagenAlt" | "hotspot"> & { titulo: string }) {
  // Mismo mecanismo que el Hero: object-position calculado en el cliente
  // desde el hotspot {x,y} de Sanity (0-1), sin instalar @sanity/image-url.
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <div className="group relative">
      {/* overflow-hidden en este mismo div (no solo en un envoltorio
          decorativo separado): el micro-glow de abajo vive DENTRO de este
          contenedor a proposito, para que sea fisicamente imposible que
          desborde la pagina sin importar el offset -- se intento
          -right-6 y -right-3 por fuera de este contenedor (spec §24) y
          los dos causaban overflow horizontal real, medido con Puppeteer
          en mobile (20px) y en 1024px (77px, combinado con otro bug ya
          corregido, min-w-0 en los items del grid mas abajo). Metiendolo
          adentro del overflow-hidden se acaba la categoria entera de bug. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        {/* Micro glow decorativo (spec §24): sutil, detras de la foto,
            recortado por el overflow-hidden del contenedor -- nunca puede
            empujar el ancho de la pagina. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/25 blur-2xl"
        />
        {imagen ? (
          <>
            <Image
              src={imagen}
              alt={imagenAlt || titulo}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              loading="lazy"
              className="object-cover motion-safe:transition-transform motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.02]"
              style={{ objectPosition }}
            />
            {/* Velo de marca casi imperceptible (spec §15): nunca tapa la
                foto, solo la integra a la identidad DOFI. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/12 via-transparent to-transparent"
            />
          </>
        ) : (
          // Sin imagen todavia en Sanity: atmosfera de respaldo (nunca una
          // caja gris), sobre el lienzo blanco/lila de estas secciones.
          <div aria-hidden="true" className="absolute inset-0 border border-brand/10 bg-brand/5">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/12 blur-[80px]" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
          </div>
        )}
      </div>
    </div>
  );
}
