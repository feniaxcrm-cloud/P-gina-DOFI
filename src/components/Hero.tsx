import Link from "next/link";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { SmartSalesSystem } from "./SmartSalesSystem";

/**
 * Hero V1 — primer componente del Design System V1.
 *
 * QUE RESUELVE
 * ------------
 * El hero anterior era una portada: "Un mar de ideas" y un delfin de
 * 430px. No decia que se vende, ni a quien, ni que resultado promete, no
 * tenia ni un CTA, y el contenido ocupaba el 36% de la pantalla. Este dice
 * las cinco cosas en el primer viewport y deja la accion a la vista.
 *
 * RETICULA: 7 / 5 desde xl
 * ------------------------
 * Se compararon las dos candidatas con el H1 REAL medido en el navegador,
 * no a ojo:
 *
 *   7/5 (columna de 760px) -> 3 lineas estables de 72 a 80px
 *   8/4 (columna de 872px) -> 2 lineas SOLO a 76px, y a 78px ya rompe a 3
 *
 * El 8/4 daba una composicion mas contundente (dos lineas de 853 y 859px),
 * pero ocupando el 98,5% del ancho: cualquier variacion de renderizado de
 * fuente la rompia a tres lineas, y el salto de 76 a 78px es un acantilado.
 * El 7/5 da tres lineas en todo el rango, con 44px de holgura, y ademas
 * deja 536px para el sistema en vez de 424px, que es lo que necesita para
 * que los tres modulos respiren. Gano 7/5 por estabilidad, no por estetica.
 *
 * Por debajo de xl el hero es de UNA columna: a 1024 la columna de texto
 * del 7/5 se queda en 531px y el titular se iria a cuatro lineas.
 *
 * SIN COLUMNA VACIA
 * -----------------
 * El Design System la contemplaba (7 + 1 vacia + 4). No se usa: con el
 * sistema ocupando 536px el aire ya lo dan el gutter y los margenes. Una
 * columna vacia aqui seria un gesto sin funcion.
 *
 * PINTADO INMEDIATO
 * -----------------
 * Componente de SERVIDOR. Ni el eyebrow, ni el H1, ni el lead, ni los CTA
 * llevan animacion de entrada, ni opacity inicial, ni delay: el mensaje
 * comercial se pinta en el primer frame. Es la leccion del Sprint 0.1, en
 * el que la LCP la determinaba un delay de 0,95s sobre un parrafo.
 */
export function Hero() {
  return (
    /* pt-36 en xl y no pt-32: la barra de navegacion es fija y mide 68px, asi
       que del padding declarado solo se percibe lo que sobra. Con 128 el
       eyebrow quedaba a 60px del borde inferior de la barra; con 144 quedan
       76, que es la separacion que pide la escala. */
    <section
      id="top"
      className="relative overflow-hidden bg-surface-base pt-24 pb-16 md:pt-28 md:pb-20 xl:pt-36 xl:pb-24"
    >
      {/* Atmosfera. Se conserva el radial tenue que ya existia, sin añadir
          ningun brillo nuevo: el protagonismo es del texto y del sistema. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1E1145_0%,#160C31_45%,#120A26_100%)]"
      />

      {/* Contenedor en DOS capas a proposito: el padding va fuera y el
          max-width dentro. Si el max-width lleva el padding encima, los
          1320px del sistema dejan de ser el ancho de CONTENIDO y pasan a
          incluir los margenes: a 1440 la columna de texto se quedaba en
          691px y el titular se iba a cuatro lineas. Asi, a 1440 el
          contenido mide 1320 exactos y el margen optico son 60px. */}
      <div className="relative px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="mx-auto grid w-full max-w-page grid-cols-1 gap-10 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-6">
        {/* ---------- Columna de mensaje ---------- */}
        <div className="flex flex-col justify-center">
          {/* El tracking baja a 0,10em por debajo de sm: a 0,14em la linea
              mide 344px y el contenido de un 360 son 320, asi que partia en
              dos. El acento naranja es solo el punto: el eyebrow en naranja
              solido competiria con el CTA, que es el unico foco de color. */}
          <p className="flex items-center gap-2.5 font-display text-eyebrow uppercase tracking-[0.10em] text-fg-subtle sm:tracking-[0.14em]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            Marketing · Tecnología · Estrategia
          </p>

          <h1 className="mt-6 font-display text-h1 text-fg-primary xl:mt-6 xl:text-h1-wide">
            Convertimos atención en ventas inteligentes.
          </h1>

          <p className="mt-6 max-w-copy font-sans text-[17px] leading-relaxed text-fg-muted md:text-body-lg xl:mt-10">
            Unimos estrategia, contenido, Meta Ads, TikTok Ads, producción
            audiovisual, CRM y automatización para convertir atención en
            oportunidades comerciales y darles seguimiento.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#contacto"
              className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-8 font-display text-button text-fg-on-accent transition-colors duration-200 hover:bg-accent-lift active:scale-[0.98]"
            >
              Solicitar diagnóstico
              <ArrowRight
                size={18}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="#proceso"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-brand-lift/40 px-7 font-display text-button text-fg-primary transition-colors duration-200 hover:border-brand-lift/70"
            >
              <PlayCircle size={18} weight="bold" aria-hidden="true" />
              Ver cómo funciona
            </Link>
          </div>
        </div>

        {/* ---------- Columna del sistema ----------
            En movil va DESPUES de los CTA: la accion tiene que aparecer
            antes que la explicacion. En escritorio ocupa su columna y se
            centra con el bloque de mensaje. */}
        <div className="flex items-center">
          <SmartSalesSystem />
        </div>
        </div>
      </div>
    </section>
  );
}
