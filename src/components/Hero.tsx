import Link from "next/link";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { DofiWave } from "./DofiWave";
import { HeroCards } from "./HeroCards";

/**
 * Hero DOFI V1 — statement hero centrado, inspirado en la referencia
 * entregada (fondo oscuro, titular gigante centrado, mucho espacio
 * negativo, una cinta de luz que atraviesa la composicion) y reinterpretado
 * dentro de la identidad DOFI. Reemplaza al Hero V1 anterior (split 7/5,
 * Smart Sales System): ese sistema pasa a vivir en su propia seccion mas
 * adelante, no en el Hero.
 *
 * JERARQUIA DE COPY (fija, aprobada)
 * -----------------------------------
 *   1. "Un Mar de Ideas"                                  <h1>  — emocion
 *   2. "DOFI Agencia Creativa"                             <p>  — identidad
 *   3. "Convertimos atención en Ventas Inteligentes"       <p>  — venta
 *   4. CTA primario + secundario                                — conversion
 *
 * Un solo <h1> en toda la pagina. La propuesta comercial es un <p>
 * destacado, no un <h2>: no abre una subseccion propia, es parte del mismo
 * bloque de mensaje del Hero.
 *
 * LCP / PINTADO INMEDIATO
 * ------------------------
 * Componente de SERVIDOR, sin "use client". Ningun texto ni CTA lleva
 * opacity inicial, delay ni animacion de entrada letra a letra (nada de
 * WaveText): todo el mensaje se pinta en el primer frame. Es la regla que
 * dejo el Sprint 0.1 (la LCP la rompia un delay de 0,95s) y que este Hero
 * no puede reintroducir. La unica animacion de la seccion es la cinta de
 * luz (DofiWave), que es CSS puro via transform y no bloquea nada.
 *
 * CTA — DESTINOS
 * ---------------
 * Primario "Empecemos" -> /contactanos: ruta real (creada en el sprint de
 * Navbar), no se inventa una nueva solo para el Hero.
 * Secundario "Conoce lo que hacemos" -> /#servicios: no existe todavia una
 * pagina /servicios independiente, asi que apunta a la seccion real que ya
 * representa los servicios en la Home (Services.tsx, id="servicios").
 * Documentado como pedia el sprint.
 *
 * TEXTO VS ONDA
 * --------------
 * DofiWave vive en una capa absoluta DETRAS del texto (z-0), concentrada en
 * la mitad inferior de la ZONA DE STATEMENT (no de todo el Hero — ver nota
 * de estructura abajo). Entre la onda y el bloque de texto hay un velo
 * (scrim) radial de surface-base que se desvanece hacia los bordes:
 * garantiza el contraste AA del texto sin importar por donde pase la curva
 * en cada viewport, en vez de perseguir manualmente su trayectoria.
 *
 * ESTRUCTURA EN DOS ZONAS (Sprint "Motion final")
 * -------------------------------------------------
 * El Hero original (statement: H1/marca/propuesta/CTA + onda) medía
 * 820-840px de alto y esa medida sigue intacta — vive ahora en su propio
 * contenedor interno con esa misma altura minima. Las 4 tarjetas
 * (HeroCards) se agregan como una segunda zona DEBAJO, dentro de la misma
 * <section>: por eso la onda (posicionada en % relativo a SU contenedor,
 * no al <section> entero) no se estira hacia las tarjetas al crecer la
 * altura total.
 *
 * MOTION DE TEXTO/CTA — entrada + flotacion (Sprint "Motion final")
 * ---------------------------------------------------------------------
 * H1, marca, propuesta y grupo de CTA llevan cada uno una clase
 * `hero-anim-*` (ver globals.css): una entrada de una sola pasada
 * (translateY, escalonada 0/100/190/270ms) seguida de una flotacion
 * continua e infinita muy leve (2-4px, duraciones distintas por elemento
 * para que no se sientan como un bloque rigido). Sigue sin haber
 * `opacity: 0` en ningun momento — todo el texto critico existe desde el
 * primer paint, la animacion es transform puro de principio a fin. Las
 * tarjetas NO llevan esta flotacion: solo su propia entrada (una vez) mas
 * el glow de borde que reacciona al cursor — ver HeroCards.tsx.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-base">
      {/* ---------- Zona 1: statement (H1, marca, propuesta, CTA, onda) ---------- */}
      <div className="relative flex min-h-[820px] items-center overflow-hidden pb-16 pt-[168px] md:min-h-[840px] md:pb-20 md:pt-[184px]">
        {/* Atmosfera: radial muy tenue, sin brillo nuevo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_10%,#1E1145_0%,#160C31_45%,#120A26_100%)]"
        />

        <DofiWave />

        {/* Velo protector del texto: independiente de por donde pase la onda,
            garantiza que "Un Mar de Ideas" y el resto nunca pierdan contraste. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[75%] bg-[radial-gradient(65%_100%_at_50%_15%,rgba(18,10,38,0.92)_0%,rgba(18,10,38,0.55)_60%,rgba(18,10,38,0)_100%)]"
        />

        {/* Marco interior — no es una tarjeta: solo un filete sutil que da
            estructura y precision, tal como pedia la referencia. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-[32px] border border-brand-lift/15 md:inset-6"
        />

        <div className="relative mx-auto w-full max-w-page px-5 text-center sm:px-6 md:px-10 lg:px-12 xl:px-14">
          <h1 className="hero-anim-h1 mx-auto max-w-[1000px] text-[clamp(3rem,1.2rem+6vw,6rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-fg-primary">
            Un Mar de Ideas
          </h1>

          <p className="hero-anim-brand mt-7 font-display text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted sm:text-base">
            DOFI Agencia Creativa
          </p>

          <p className="hero-anim-proposal mx-auto mt-7 max-w-[700px] text-balance font-sans text-xl leading-relaxed text-fg-primary/90 md:text-2xl">
            Convertimos atención en Ventas Inteligentes
          </p>

          <div className="hero-anim-cta mx-auto mt-9 flex w-full max-w-[420px] flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
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
      </div>

      {/* ---------- Zona 2: las 4 tarjetas ---------- */}
      <div className="relative px-5 pb-20 pt-4 sm:px-6 md:px-10 md:pb-28 lg:px-12 xl:px-14">
        <div className="mx-auto max-w-page">
          <HeroCards />
        </div>
      </div>
    </section>
  );
}
