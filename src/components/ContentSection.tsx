import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import type { SeccionContenido } from "@/lib/sanity";

/**
 * ============================================================
 * PALETA POR SECCIÓN
 * ============================================================
 * Secuencia naranja / blanco / morado / naranja, con solo tokens que ya
 * existian en el design system. Los colores NO se tocan en el sprint "CTA
 * debajo de la imagen con texto" -- solo quedaron los campos que este
 * layout realmente usa (se retiraron los de eyebrow/titulo/descripcion al
 * dejar de pintarse ese bloque, para no dejar configuracion muerta).
 *
 * Contraste del CTA, medido con la formula de luminancia relativa de WCAG:
 *   blanco sobre brand   10.24:1   -> CTA morado en las secciones naranja
 *   ink    sobre accent   6.53:1   -> CTA naranja en blanco y morado
 * El CTA cambia de color cuando el fondo ya es naranja, para que nunca
 * quede naranja sobre naranja.
 */
type Tono = {
  fondo: string;
  /** Forma difusa de fondo, dentro del overflow-hidden de la seccion --
   *  nunca puede empujar el ancho de la pagina. */
  auraSeccion: string;
  cta: string;
  imagenRing: string;
  imagenGlow: string;
  imagenVelo: string;
};

const NARANJA: Tono = {
  fondo: "bg-accent",
  auraSeccion: "bg-brand/20",
  cta: "bg-brand text-white shadow-[0_10px_28px_-16px_rgba(26,15,61,0.7)] hover:bg-brand-lift",
  imagenRing: "ring-1 ring-brand/25",
  imagenGlow: "bg-brand/30",
  imagenVelo: "from-brand/25",
};

const BLANCO: Tono = {
  fondo: "bg-canvas",
  auraSeccion: "bg-accent/12",
  cta: "bg-accent text-fg-on-accent shadow-[0_10px_28px_-16px_rgba(244,123,32,0.65)] hover:bg-accent-lift",
  imagenRing: "ring-1 ring-brand/12",
  imagenGlow: "bg-accent/25",
  imagenVelo: "from-brand/12",
};

const MORADO: Tono = {
  fondo: "bg-brand",
  auraSeccion: "bg-accent/18",
  cta: "bg-accent text-fg-on-accent shadow-[0_10px_28px_-16px_rgba(244,123,32,0.65)] hover:bg-accent-lift",
  imagenRing: "ring-1 ring-white/25",
  imagenGlow: "bg-accent/30",
  imagenVelo: "from-brand-lift/30",
};

const TONOS = [NARANJA, BLANCO, MORADO, NARANJA];

/**
 * Una de las 4 "Secciones de contenido" debajo de las tarjetas del Hero.
 * Un solo componente reutilizado 4 veces via `seccionesContenido.map(...)`.
 *
 * ESTRUCTURA (Sprint "CTA debajo de la imagen con texto")
 * -----------------------------------------------------------------
 * Dos imagenes por seccion, y el CTA pertenece a UNA de ellas:
 *
 *     [ imagen con texto ]   [ imagen normal ]
 *     [       CTA        ]
 *
 * El boton vive DENTRO de la misma columna que la imagen con texto (nunca
 * `grid-column: 1 / -1`, nunca centrado respecto a toda la seccion), asi
 * que se lee como una unidad con ella. La imagen normal es el elemento
 * visual complementario de la otra columna.
 *
 * El mensaje de la seccion ahora vive DENTRO de la imagen con texto, por
 * eso ya no se pinta el bloque tipografico (numero + titulo + descripcion)
 * que tenia antes. `titulo` y `descripcion` siguen existiendo en Sanity
 * (son la fuente del contenido) y el titulo se conserva como <h2> visible
 * solo para lectores de pantalla y buscadores: la pagina no puede quedarse
 * sin estructura de encabezados solo porque el texto pase a ser una imagen.
 *
 * ALTERNANCIA (spec §6)
 * -----------------------------------------------------------------
 * Secciones 01 y 03: imagen con texto a la IZQUIERDA. Secciones 02 y 04: a
 * la DERECHA. El CTA siempre la sigue, este del lado que este.
 *
 * En el DOM el orden es SIEMPRE imagen-con-texto -> CTA -> imagen-normal.
 * Eso da exactamente el orden pedido en mobile (spec §7) sin duplicar
 * ninguna imagen; en desktop el lado se invierte solo con `lg:order-*`,
 * puramente CSS.
 *
 * SIN OVERFLOW
 * -----------------------------------------------------------------
 * `overflow-hidden` en la seccion (contiene el translateX inicial de las
 * imagenes, que antes del viewport se sale del contenedor y el navegador
 * lo cuenta para scrollWidth) + `min-w-0` en los dos items del grid.
 */
export function ContentSection({
  titulo,
  imagen,
  imagenAlt,
  hotspot,
  imagenSecundaria,
  imagenSecundariaAlt,
  hotspotSecundaria,
  ctaTexto,
  ctaEnlace,
  index,
}: SeccionContenido & { index: number }) {
  const conTextoIzquierda = index % 2 === 0;
  const tono = TONOS[index % TONOS.length];
  const esExterno = /^https?:\/\//i.test(ctaEnlace);

  // Cada imagen entra desde el lado en el que va a quedar (animacion que ya
  // existia, solo se reparte entre las dos imagenes).
  const xConTexto = conTextoIzquierda ? -28 : 28;
  const xNormal = conTextoIzquierda ? 28 : -28;

  // w-full en mobile (area tactil), auto desde sm:. whitespace-nowrap +
  // px chico para que un CTA largo no se parta en dos lineas a 360px.
  const ctaClassName = `group relative inline-flex h-16 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 font-display text-base font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:w-auto sm:px-10 ${tono.cta}`;
  const cta = esExterno ? (
    <a href={ctaEnlace} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
      {ctaTexto}
      <ArrowRight size={20} weight="bold" aria-hidden="true" className={CTA_ICONO} />
    </a>
  ) : (
    <Link href={ctaEnlace} className={ctaClassName}>
      {ctaTexto}
      <ArrowRight size={20} weight="bold" aria-hidden="true" className={CTA_ICONO} />
    </Link>
  );

  return (
    <section className={`relative overflow-hidden py-24 md:py-36 ${tono.fondo}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 h-[28rem] w-[28rem] rounded-full blur-[120px] ${tono.auraSeccion} ${conTextoIzquierda ? "-right-32" : "-left-32"}`}
      />

      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        {/* El mensaje es visual (vive en la imagen con texto), pero la
            seccion no puede quedarse sin encabezado para lectores de
            pantalla ni para buscadores. */}
        <h2 className="sr-only">{titulo}</h2>

        {/* items-start: los topes de las dos imagenes quedan alineados y el
            CTA cuelga debajo de la suya, en vez de descentrar todo. */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------- Columna A: imagen CON TEXTO + su CTA ---------- */}
          <div className={`min-w-0 ${conTextoIzquierda ? "lg:order-1" : "lg:order-2"}`}>
            <Reveal x={xConTexto} y={20} delay={0.05}>
              <ContentImage
                imagen={imagen}
                alt={imagenAlt || titulo}
                hotspot={hotspot}
                tono={tono}
              />
            </Reveal>

            <Reveal y={20} delay={0.28}>
              <div className="mt-8 flex justify-center">{cta}</div>
            </Reveal>
          </div>

          {/* ---------- Columna B: imagen NORMAL (de apoyo) ---------- */}
          <div className={`min-w-0 ${conTextoIzquierda ? "lg:order-2" : "lg:order-1"}`}>
            <Reveal x={xNormal} y={20} delay={0.15}>
              <ContentImage
                imagen={imagenSecundaria}
                alt={imagenSecundariaAlt}
                hotspot={hotspotSecundaria}
                tono={tono}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// `transition` (no `transition-all`): el subconjunto por defecto de Tailwind
// cubre color/background-color/transform/box-shadow -- justo lo que cambia
// en hover -- y deja afuera width/height/margin/padding/top/left.
const CTA_ICONO = "transition-transform duration-300 group-hover:translate-x-1";

function ContentImage({
  imagen,
  alt,
  hotspot,
  tono,
}: {
  imagen: string | null;
  alt: string;
  hotspot: { x: number; y: number } | null;
  tono: Tono;
}) {
  // Mismo mecanismo que el Hero: object-position calculado desde el hotspot
  // {x,y} de Sanity (0-1), sin instalar @sanity/image-url.
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <div className="group relative">
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[20px] ${tono.imagenRing}`}>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${tono.imagenGlow}`}
        />
        {imagen ? (
          <>
            <Image
              src={imagen}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              loading="lazy"
              className="object-cover motion-safe:transition-transform motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.02]"
              style={{ objectPosition }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${tono.imagenVelo}`}
            />
          </>
        ) : (
          // Sin imagen todavia en Sanity (la de apoyo es opcional): atmosfera
          // de respaldo, nunca un hueco ni una caja gris. Velo claro para que
          // se distinga de los 3 fondos posibles (naranja, blanco o morado).
          <div aria-hidden="true" className="absolute inset-0 border border-white/25 bg-white/10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-[80px]" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-[90px]" />
          </div>
        )}
      </div>
    </div>
  );
}
