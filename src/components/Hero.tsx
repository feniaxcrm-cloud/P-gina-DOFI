import Link from "next/link";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { CapabilityBand } from "./CapabilityBand";

/**
 * Hero DOFI — replanteo split (Sprint "Navbar + Hero reframe").
 *
 * Reemplaza al statement hero centrado anterior. Se tomó de la referencia
 * SOLO la arquitectura — copy izquierda / visual reservado a la derecha /
 * banda de capacidades superpuesta abajo — reinterpretada en paleta,
 * tipografía y componentes 100% DOFI. Nada de la referencia se copió
 * literalmente (ver el reporte, §1).
 *
 * LA ONDA (DofiWave) SE ELIMINÓ POR COMPLETO
 * --------------------------------------------
 * No solo se dejó de usar: el archivo `DofiWave.tsx`, sus tres capas SVG,
 * los `@keyframes`/clases de `globals.css` y toda la documentación
 * asociada se borraron. No queda ninguna referencia en el repo (verificado
 * por grep antes del reporte). No se reubicó ni se dejó estática: se pidió
 * que desapareciera y desapareció.
 *
 * JERARQUIA DE COPY — SIN CAMBIOS DE TEXTO
 * -------------------------------------------
 * Mismas 3 frases + 2 CTA que ya estaban aprobados. Lo único que cambia es
 * la composición: ahora alineados a la izquierda en vez de centrados, dentro
 * de una columna angosta (52/48 en desktop) en vez de ocupar todo el ancho.
 *
 * MOTION DE TEXTO/CTA — SIN CAMBIOS DE TECNICA
 * -----------------------------------------------
 * Mismas clases `hero-anim-*` del sprint de motion anterior (entrada
 * transform-only + flotación continua muy leve, CSS puro, sin JS). Se
 * reutilizan tal cual — este sprint no tocaba esa parte.
 *
 * MEDIA SLOT
 * -----------
 * Área reservada para una imagen futura. Deliberadamente vacía: sin
 * ilustración, sin stock, sin texto de placeholder visible. Solo
 * atmósfera propia (gradiente + dos manchas de luz muy tenues en las
 * esquinas, blur alto, opacidad baja) para que se sienta diseñada y no
 * "rota" mientras no tiene asset. Preparada para recibir después una
 * imagen real con `object-cover` (o `object-contain` según el crop que
 * llegue) sin tener que tocar la estructura.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-base pb-20 pt-[88px] md:pb-[84px] md:pt-[84px]">
      {/* Atmosfera: radial muy tenue, sin brillo nuevo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_60%_at_15%_0%,#1E1145_0%,#160C31_45%,#120A26_100%)]"
      />

      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        {/* Marco del Hero: un solo contenedor bordeado que envuelve ambas
            columnas — la banda de capacidades se superpone a SU borde
            inferior (margen negativo mas abajo), no al de la seccion. */}
        <div className="relative overflow-hidden rounded-[32px] border border-brand-lift/15 bg-surface-raised/25">
          <div className="grid grid-cols-1 items-center gap-10 px-6 py-14 md:px-10 md:py-16 lg:grid-cols-[55fr_45fr] lg:gap-14 lg:px-14 lg:pb-[72px] lg:pt-8">
            {/* ---------- Columna izquierda: copy ---------- */}
            <div className="text-left">
              <h1 className="hero-anim-h1 max-w-[620px] text-[clamp(2.75rem,1.6rem+4.5vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-fg-primary">
                Un Mar de Ideas
              </h1>

              <p className="hero-anim-brand mt-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted sm:text-base">
                DOFI Agencia Creativa
              </p>

              <p className="hero-anim-proposal mt-5 max-w-[480px] text-balance font-sans text-lg leading-relaxed text-fg-primary/90 md:text-xl">
                Convertimos atención en Ventas Inteligentes
              </p>

              <div className="hero-anim-cta mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/contactanos"
                  className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-8 font-display text-button text-fg-on-accent transition-colors duration-200 hover:bg-accent-lift active:scale-[0.98]"
                >
                  Empecemos
                  <ArrowRight
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/#servicios"
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-brand-lift/40 px-7 font-display text-button text-fg-primary transition-colors duration-200 hover:border-brand-lift/70"
                >
                  <PlayCircle size={18} weight="bold" aria-hidden="true" />
                  Conoce lo que hacemos
                </Link>
              </div>
            </div>

            {/* ---------- Columna derecha: media slot ---------- */}
            <div
              className="hero-media-slot relative min-h-[240px] overflow-hidden rounded-[24px] border border-brand-lift/12 bg-surface-base/60 sm:min-h-[300px] lg:min-h-[320px]"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(75,42,147,0.35)_0%,rgba(18,10,38,0.1)_55%,rgba(244,123,32,0.08)_100%)]" />
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-lift/15 blur-[80px]" />
              <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
            </div>
          </div>
        </div>

        {/* ---------- Banda de capacidades, superpuesta ---------- */}
        <div className="relative z-10 -mt-10 md:-mt-14">
          <CapabilityBand />
        </div>
      </div>
    </section>
  );
}
