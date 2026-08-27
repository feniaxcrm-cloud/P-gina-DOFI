import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CapabilityBand } from "./CapabilityBand";
import type { HeroContent, Capacidad } from "@/lib/sanity";

/**
 * Hero DOFI — composición única integrada, imagen editable desde Sanity.
 * (Sprint "Corrección Hero final".)
 *
 * REEMPLAZA EL SPLIT ANTERIOR (texto | caja de imagen)
 * -----------------------------------------------------------------
 * El Hero anterior (Sprint "Navbar + Hero + Sanity") era dos columnas: copy
 * a la izquierda, la imagen encerrada en su propia tarjeta bordeada a la
 * derecha (55/45). Ese "media slot" separado desaparece por completo — ni
 * el contenedor, ni el placeholder de atmósfera que pintaba cuando faltaba
 * imagen, ni el degradado `.hero-media-gradient` que corría sobre él (ver
 * globals.css, retirado en este sprint). La imagen ahora ES el fondo visual
 * de todo el Hero: llena el mismo contenedor que ya usa el resto del sitio
 * (`max-w-page`, los mismos márgenes que el Header), sin borde ni radio en
 * escritorio — nunca se lee como una tarjeta, es la escena completa. El
 * copy vive delante, protegido por un scrim + formas geométricas moradas
 * (ver más abajo), nunca dentro de su propia caja.
 *
 * SIN SLIDER — UNA SOLA IMAGEN
 * -----------------------------------------------------------------
 * No hay array de imágenes, no hay estado de "slide activo", no hay
 * flechas ni dots. `content.imagen` es un único asset de Sanity (o `null`
 * si el Studio todavía no lo cargó, ver más abajo).
 *
 * IMAGEN — SANITY, HOTSPOT, NO CROP DEL SERVIDOR (spec §6-7)
 * -----------------------------------------------------------------
 * Mismo mecanismo que ya existía: `object-position` calculado en el
 * cliente a partir del hotspot {x,y} de Sanity, sin instalar
 * @sanity/image-url. Lo único que cambia es CUÁNTO espacio ocupa la imagen
 * (todo el Hero, no 45vw) — por eso el ancho pedido a Sanity sube de 1600 a
 * 2400px (ver src/lib/sanity.ts) para no perder nitidez en pantallas
 * retina al tamaño nuevo, mucho mayor.
 *
 * SIN IMAGEN TODAVÍA: en vez de un hueco roto, se pinta la misma atmósfera
 * de manchas de luz que ya existía como placeholder, ahora ocupando todo
 * el Hero en lugar de una caja lateral.
 *
 * OVERLAYS GEOMÉTRICOS — DECORAN Y PROTEGEN A LA VEZ (spec §10-13, §22)
 * -----------------------------------------------------------------
 * Tres capas con `clip-path: polygon(...)` (paneles diagonales, no
 * rectángulos ni un gradient plano) en morado/lila DOFI, más un scrim
 * degradado fijo (sin animar) que oscurece la mitad izquierda —zona del
 * copy— y se aclara hacia la derecha, para que el texto siga siendo
 * legible SIN DEPENDER de que la foto que llegue desde Sanity tenga
 * contraste propio (spec §22). Los paneles solo animan `transform`
 * (translate + rotate + scale muy sutiles, "compositor-friendly", nunca
 * layout ni clip-path en sí) — la fotografía de abajo nunca se mueve. Ver
 * globals.css (`.hero-shape-*`) para las curvas exactas: 11-16s,
 * ease-in-out, `alternate` (va y vuelve sin salto perceptible al reinicio,
 * spec §14 — no hace falta duplicar contenido como en las marquesinas
 * porque no es un tile, es una forma que respira). En mobile los paneles
 * animados se ocultan (`hidden md:block`, spec §27 "los overlays pueden
 * simplificarse"); el scrim de legibilidad sigue activo siempre.
 *
 * COLOR DEL COPY — CLARO EN MOBILE, OSCURO SOBRE EL SCRIM DESDE `md:`
 * -----------------------------------------------------------------
 * El scrim solo protege al copy cuando la imagen está DETRÁS de él, y eso
 * únicamente pasa desde `md:` (en mobile la imagen es un bloque aparte,
 * más abajo, sobre el lienzo claro normal — ver "RESPONSIVE"). Por eso el
 * H1/marca/propuesta/CTA secundario usan los tokens oscuros (`ink`) como
 * base para mobile, y cambian a los tokens claros (`foam`/`mist`) desde
 * `md:` — verificado con Puppeteer: con los tokens oscuros fijos en las
 * dos resoluciones, "DOFI AGENCIA CREATIVA" (`ink-subtle`) quedaba casi
 * invisible sobre el scrim morado oscuro en desktop.
 *
 * SIN CTA REPETIDO, DOS NUEVOS (spec §16-19)
 * -----------------------------------------------------------------
 * "Empecemos" / "Conoce lo que hacemos" desaparecen. Principal: "Quiero
 * Mejorar mis Ventas" → /contactanos (misma ruta de siempre, sigue siendo
 * la de conversión real). Secundario: "Mira Nuestro Trabajo" → /clientes
 * (la ruta real de portafolio/casos que ya existe — se revisó
 * src/app/ antes de escribir el href, no se inventó /casos ni /portfolio).
 * El icono de flecha se conserva en el principal (ya es parte del
 * lenguaje visual del sitio); el secundario pierde el icono de play — ya
 * no apunta a un contenido audiovisual, apuntar a "ver trabajo" con un
 * ícono de reproducción hubiera sido engañoso.
 *
 * RESPONSIVE — LA IMAGEN CAMBIA DE ESTRATEGIA, NO DE ORIGEN (spec §27)
 * -----------------------------------------------------------------
 * Un solo <Image>, nunca dos instancias (evita duplicar la descarga). En
 * mobile vive en flujo normal, DESPUÉS del grupo de CTA (orden pedido:
 * copy → CTA → imagen → cards) dentro de una caja contenida con radio,
 * como cualquier bloque de media del sitio. Desde `md:` se vuelve
 * `position: absolute; inset: 0` sobre el mismo contenedor relativo,
 * saliendo del flujo por completo y quedando detrás del copy (z-index),
 * sin importar su posición en el DOM — así no hace falta ninguna utilidad
 * `order`, la reubicación es puramente CSS.
 *
 * MOTION DE TEXTO/CTA — SIN CAMBIOS DE TÉCNICA (spec §20-21)
 * -----------------------------------------------------------------
 * Mismas clases `hero-anim-*` (entrada transform-only + flotación continua
 * muy leve). Los dos botones siguen flotando como UN SOLO GRUPO: viven
 * dentro del mismo `.hero-anim-cta`, nunca animados por separado. Transform
 * nunca opacity — el H1 no puede nacer invisible (regla de LCP).
 */
export function Hero({
  content,
  capacidades,
}: {
  content: HeroContent;
  capacidades: Capacidad[];
}) {
  const objectPosition = content.hotspot
    ? `${Math.round(content.hotspot.x * 100)}% ${Math.round(content.hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <section className="relative overflow-hidden bg-canvas pb-20 pt-[80px] md:pb-[84px] lg:pt-[84px]">
      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="relative flex flex-col md:min-h-[460px] md:justify-center lg:min-h-[520px]">
          {/* ---------- Copy: delante de la imagen, alineado a la izquierda ---------- */}
          <div className="relative z-20 max-w-[560px] text-left">
            <h1 className="hero-anim-h1 max-w-[520px] text-[clamp(2.75rem,1.6rem+4.5vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink md:text-foam">
              {content.titulo}
            </h1>

            <p className="hero-anim-brand mt-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink-subtle sm:text-base md:text-mist">
              {content.marca}
            </p>

            <p className="hero-anim-proposal mt-5 max-w-[440px] text-balance font-sans text-lg leading-relaxed text-ink/90 md:text-xl md:text-foam/90">
              {content.mensaje}
            </p>

            <div className="hero-anim-cta mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={content.ctaPrincipalEnlace}
                className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-8 font-display text-button text-fg-on-accent transition-colors duration-200 hover:bg-accent-lift active:scale-[0.98]"
              >
                {content.ctaPrincipalTexto}
                <ArrowRight
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href={content.ctaSecundarioEnlace}
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-brand/25 px-7 font-display text-button text-ink transition-colors duration-200 hover:border-brand/50 hover:bg-brand/5 md:border-white/35 md:text-foam md:hover:border-white/60 md:hover:bg-white/10"
              >
                {content.ctaSecundarioTexto}
              </Link>
            </div>
          </div>

          {/* ---------- Imagen: bloque contenido en mobile, fondo integrado desde md: ---------- */}
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[20px] md:absolute md:inset-0 md:mt-0 md:aspect-auto md:rounded-none">
            {content.imagen ? (
              <Image
                src={content.imagen}
                alt={content.imagenAlt}
                fill
                sizes="(min-width: 768px) 1320px, 100vw"
                priority
                className="object-cover"
                style={{ objectPosition }}
              />
            ) : (
              // Sin imagen todavia en Sanity: atmosfera propia, no un hueco roto.
              <div aria-hidden="true" className="absolute inset-0 bg-canvas-raised">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/12 blur-[80px]" />
                <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
              </div>
            )}

            {/* Scrim de legibilidad: fijo, nunca animado, mas fuerte a la
                izquierda (zona del copy en desktop) y se aclara hacia la
                derecha. Protege el texto sin depender del contraste propio
                de la foto (spec §22). */}
            <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0" />

            {/* Overlays geometricos animados: solo desde md: (spec §27,
                "los overlays pueden simplificarse" en mobile). La imagen en
                si nunca se mueve — solo estas capas. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
            >
              <span className="hero-shape hero-shape-1" />
              <span className="hero-shape hero-shape-2" />
              <span className="hero-shape hero-shape-3" />
            </div>
          </div>
        </div>

        {/* ---------- Banda de capacidades, superpuesta ---------- */}
        <div className="relative z-10 -mt-10 md:-mt-14">
          <CapabilityBand capacidades={capacidades} />
        </div>
      </div>
    </section>
  );
}
