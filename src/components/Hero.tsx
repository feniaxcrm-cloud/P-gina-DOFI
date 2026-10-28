import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "./BotonCta";
import { CapabilityBand } from "./CapabilityBand";
import type { HeroContent, Capacidad } from "@/lib/sanity";

/**
 * Hero del Home — versión premium (pedido del 2026-10-07: "que se vea más
 * premium; si necesita algo, Remotion").
 *
 *   ┌───────────────────────────────────────────────┬─────────────────────┐
 *   │ ● DOFI AGENCIA CREATIVA                       │                     │
 *   │ Un Mar de                                     │   la foto del       │
 *   │ Ideas  (la última palabra con la marea de      │   Studio, quieta    │
 *   │         color y un brillo que la recorre)     │                     │
 *   │ Convertimos atención en Ventas Inteligentes   │                     │
 *   │ [Quiero Mejorar mis Ventas →] [Mira…]         │                     │
 *   ├───────────┬───────────┬───────────┬───────────┴─────────────────────┤
 *   │ capacidad │ capacidad │ capacidad │ capacidad   (vidrio, una fila)  │
 *   └───────────┴───────────┴───────────┴─────────────────────────────────┘
 *
 * UNA PANTALLA: el hero entero (con las tarjetas) mide el alto de la ventana
 * (.pantalla y --alto-util, globals.css). Es un MINIMO, no un alto fijo
 * (2026-10-28): en pantallas bajas -- una laptop de 1366x768 con la barra de
 * favoritos, o el navegador con zoom -- el texto no entraba y los botones
 * caian encima de las tarjetas. Ahora el hero crece lo que haga falta y,
 * para que casi siempre siga entrando en una pantalla, en ventanas de hasta
 * 760 px de alto el texto y los botones se compactan un poco.
 *
 * FOTO SIN PRECARGA (2026-10-28): hay dos copias en el HTML (fondo en
 * escritorio, arriba en el telefono) y las dos llevaban `priority`: el
 * navegador bajaba las dos en cualquier pantalla. Ahora cargan diferidas
 * (con prioridad alta): cada pantalla baja solo la que muestra, porque la
 * otra esta oculta. El LCP del hero es el titulo, no la foto.
 *
 * FONDO: el mar de DOFI de noche -- el morado profundo de la marca con dos
 * resplandores (violeta y naranja) que se mueven muy despacio y el oleaje de
 * líneas. La FOTO DEL STUDIO (Hero → imagen) sigue mandando: si hay una, se
 * funde con el fondo en duotono morado a la derecha (textura, nunca compite
 * con el texto). Sin foto, el fondo de marca solo.
 *
 * TELÉFONO (pedido del 2026-10-16): la foto no va de fondo detrás del texto
 * -- en un teléfono vertical el recorte dejaba a la persona cortada en el
 * borde derecho. Va ARRIBA, a todo el ancho, completa (16:9, la proporción de
 * la pieza) y centrada en el punto focal del Studio; se funde con el fondo
 * hacia abajo y el texto sigue debajo. En escritorio y tablet, igual que
 * siempre: de fondo a la derecha.
 *
 * SIN ANIMACIÓN SOBRE LA FOTO (pedido del 2026-10-15): se quitaron las
 * tarjetas animadas «Atraer · Convertir · Escalar» (Remotion) que iban encima
 * de la foto. La foto queda quieta, con el mismo tamaño, posición y
 * tratamiento de antes; el resto del hero (resplandores, oleaje, entrada del
 * texto) no cambia.
 *
 * MOVIMIENTO DEL TEXTO: las mismas clases hero-anim-* (entrada solo con
 * transform y una flotación mínima): el H1 nunca nace invisible (regla de
 * LCP). Con movimiento reducido todo queda quieto.
 *
 * TODO EL TEXTO SALE DEL STUDIO (paginaInicio → hero) con su respaldo en
 * src/lib/sanity.ts, igual que antes: título, marca, mensaje y los dos
 * botones. La última palabra del título es la que lleva el color.
 */

function partirUltima(titulo: string): [string, string] {
  const limpio = titulo.trim();
  const i = limpio.lastIndexOf(" ");
  return i < 0 ? ["", limpio] : [limpio.slice(0, i), limpio.slice(i + 1)];
}

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
  const [inicio, ultima] = partirUltima(content.titulo);

  return (
    <section className="pantalla relative isolate overflow-hidden bg-abyss text-foam">
      {/* ---------- Fondo ---------- */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_12%_0%,#2E1B68_0%,#1A0F3D_46%,#120A26_100%)]" />

        {content.imagen && (
          <div className="absolute inset-y-0 right-0 hidden w-[62%] [mask-image:linear-gradient(90deg,transparent_0%,#000_45%)] md:block">
            <Image
              src={content.imagen}
              alt=""
              fill
              sizes="(min-width: 768px) 62vw, 100vw"
              fetchPriority="high"
              className="object-cover opacity-[0.32] mix-blend-luminosity"
              style={{ objectPosition }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(75,42,147,0.55)_0%,rgba(18,10,38,0.35)_60%,rgba(244,123,32,0.18)_100%)] mix-blend-color" />
          </div>
        )}

        <span className="hero-aurora hero-aurora-1" />
        <span className="hero-aurora hero-aurora-2" />
        <span className="hero-aurora hero-aurora-3" />

        <svg className="absolute inset-x-0 bottom-0 h-[46%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none">
          <path d="M0 250 C 240 190, 480 310, 720 250 S 1200 190, 1440 240" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <path d="M0 292 C 260 232, 520 352, 760 292 S 1220 232, 1440 282" stroke="rgba(244,123,32,0.30)" strokeWidth="1.5" />
          <path d="M0 334 C 280 284, 540 384, 800 334 S 1240 284, 1440 324" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <path d="M0 376 C 300 336, 560 416, 840 376 S 1260 336, 1440 368" stroke="rgba(109,75,201,0.45)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* En escritorio el contenedor mide al menos el alto util: la banda de
          abajo toma lo suyo y la fila de arriba (texto) el resto. Si el texto
          no entra, el contenedor crece: nunca se monta sobre la banda. */}
      <div className="relative mx-auto flex w-full max-w-page flex-col px-5 sm:px-6 md:px-10 lg:min-h-[max(500px,var(--alto-util))] lg:px-12 xl:px-14">
        {/* ---------- Foto en el teléfono: arriba, completa y centrada ---------- */}
        {content.imagen && (
          <div
            aria-hidden="true"
            className="relative -mx-5 -mt-[clamp(1.25rem,4svh,3rem)] mb-6 aspect-[16/9] overflow-hidden [mask-image:linear-gradient(180deg,#000_55%,transparent_100%)] sm:-mx-6 md:hidden"
          >
            <Image
              src={content.imagen}
              alt=""
              fill
              sizes="100vw"
              fetchPriority="high"
              className="object-cover opacity-60 mix-blend-luminosity"
              style={{ objectPosition }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(75,42,147,0.55)_0%,rgba(18,10,38,0.35)_60%,rgba(244,123,32,0.18)_100%)] mix-blend-color" />
          </div>
        )}

        <div className="grid grid-cols-1 items-center gap-10 lg:flex-1 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Texto ---------- */}
          <div className="relative z-10 min-w-0 lg:col-span-7">
            <p className="hero-anim-brand inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 lg:[@media(max-height:760px)]:py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-foam/90 backdrop-blur-sm sm:text-[13px]">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="hero-latido absolute inset-0 rounded-full bg-accent-lift" />
                <span className="relative h-2 w-2 rounded-full bg-accent-lift" />
              </span>
              {content.marca}
            </p>

            {/* La ultima palabra va sola en su linea ("Un Mar de / Ideas"): es la
                que lleva la marea de color. */}
            <h1 className="hero-anim-h1 mt-[clamp(1rem,3svh,1.75rem)] font-display text-[clamp(2.9rem,min(1.6rem+4.6vw,10svh),6rem)] font-extrabold leading-[0.96] tracking-[-0.035em]">
              {inicio && (
                <>
                  {inicio}
                  <br />
                </>
              )}
              <span className="texto-marea">{ultima}</span>
            </h1>

            <p className="hero-anim-proposal mt-[clamp(0.9rem,2.8svh,1.75rem)] max-w-[460px] text-balance font-sans text-lg leading-relaxed text-foam/85 md:text-xl lg:[@media(max-height:760px)]:text-lg">
              {content.mensaje}
            </p>

            {/* En ventanas bajas los dos botones bajan de 64 a 56 px de alto. */}
            <div className="hero-anim-cta mt-[clamp(1.25rem,4svh,2.5rem)] flex flex-col gap-4 sm:flex-row sm:items-center lg:[@media(max-height:760px)]:[&>a]:min-h-[56px]">
              <BotonCta texto={content.ctaPrincipalTexto} enlace={content.ctaPrincipalEnlace} />
              <Link
                href={content.ctaSecundarioEnlace}
                className="group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 font-display text-button text-foam backdrop-blur-sm transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.12] md:min-h-[64px]"
              >
                {content.ctaSecundarioTexto}
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ---------- Banda de capacidades ---------- */}
        <div className="relative z-10 mt-[clamp(1.25rem,3.4svh,2.5rem)] shrink-0">
          <CapabilityBand capacidades={capacidades} />
        </div>
      </div>
    </section>
  );
}
