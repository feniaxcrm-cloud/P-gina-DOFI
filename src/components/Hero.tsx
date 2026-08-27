import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { CapabilityBand } from "./CapabilityBand";
import type { HeroContent, Capacidad } from "@/lib/sanity";

/**
 * Hero DOFI — lienzo claro, split, editable desde Sanity.
 * (Replanteo "DOFI — REPLANTEO DEFINITIVO NAVBAR + HERO + SANITY".)
 *
 * Reemplaza la superficie oscura del split hero anterior (Sprint "Navbar +
 * Hero reframe") por el lienzo claro que ahora es la base visual del sitio.
 * La ARQUITECTURA (copy izquierda / imagen derecha / banda de capacidades
 * superpuesta abajo) no cambia — solo cambia de que superficie viene y de
 * donde sale el contenido.
 *
 * TODO EL CONTENIDO ES PROP, NO HARDCODE
 * -----------------------------------------
 * `content` llega resuelto desde src/lib/sanity.ts (getPaginaInicio()):
 * si el documento paginaInicio o su campo `hero` no existen todavia en el
 * Studio, o falta la imagen, sanity.ts ya devolvio HERO_FALLBACK (mismo
 * copy que estaba aprobado). Este componente nunca decide el fallback, solo
 * lo pinta — un solo lugar de verdad (spec §38/§70).
 *
 * IMAGEN — HOTSPOT, NO CROP DEL SERVIDOR
 * -----------------------------------------
 * Sin instalar @sanity/image-url (spec §72: no dependencias nuevas), el
 * foco de la imagen se resuelve en el CLIENTE via `object-position` a
 * partir del hotspot {x,y} (0-1) que ya trae el GROQ. Object-fit: cover +
 * object-position dinamico logra lo mismo que un recorte de servidor
 * (sujeto nunca forzado al centro, spec §18) sin depender de la libreria
 * de URLs de Sanity, y ademas se adapta solo si el contenedor cambia de
 * proporcion entre breakpoints — un rect fijo del servidor no lo haria.
 *
 * SIN IMAGEN TODAVIA: el slot no rompe ni queda vacio-y-roto. Se pinta la
 * misma atmosfera (dos manchas de luz + degradado) que ya existia como
 * placeholder, ahora en paleta clara.
 *
 * MOTION DE TEXTO/CTA — SIN CAMBIOS DE TECNICA
 * -----------------------------------------------
 * Mismas clases `hero-anim-*` (entrada transform-only + flotacion continua
 * muy leve, CSS puro). Transform nunca opacity: el H1 no puede nacer
 * invisible (regla de LCP ya vigente en el proyecto).
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
    <section className="relative overflow-hidden bg-canvas pb-20 pt-[88px] md:pb-[84px] md:pt-[84px]">
      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="grid grid-cols-1 items-center gap-10 py-6 lg:grid-cols-[55fr_45fr] lg:gap-14 lg:py-8">
          {/* ---------- Columna izquierda: copy ---------- */}
          <div className="text-left">
            <h1 className="hero-anim-h1 max-w-[620px] text-[clamp(2.75rem,1.6rem+4.5vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
              {content.titulo}
            </h1>

            <p className="hero-anim-brand mt-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink-subtle sm:text-base">
              {content.marca}
            </p>

            <p className="hero-anim-proposal mt-5 max-w-[480px] text-balance font-sans text-lg leading-relaxed text-ink/90 md:text-xl">
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
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-brand/25 px-7 font-display text-button text-ink transition-colors duration-200 hover:border-brand/50 hover:bg-brand/5"
              >
                <PlayCircle size={18} weight="bold" aria-hidden="true" />
                {content.ctaSecundarioTexto}
              </Link>
            </div>
          </div>

          {/* ---------- Columna derecha: imagen ---------- */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-brand/10 bg-canvas-raised sm:aspect-[6/5] lg:aspect-[4/5]">
            {content.imagen ? (
              <>
                <Image
                  src={content.imagen}
                  alt={content.imagenAlt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                  className="object-cover"
                  style={{ objectPosition }}
                />
                {/* Degradado DOFI animado: blanco -> morado -> acento naranja
                    -> transparente, para que la foto siga siendo reconocible
                    (spec §20-25). Capa aparte, nunca mueve la foto en si. */}
                <div
                  aria-hidden="true"
                  className="hero-media-gradient pointer-events-none absolute inset-0 mix-blend-normal opacity-70"
                />
              </>
            ) : (
              // Sin imagen todavia en Sanity: atmosfera propia, no un hueco roto.
              <div aria-hidden="true" className="absolute inset-0">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/12 blur-[80px]" />
                <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
              </div>
            )}
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
