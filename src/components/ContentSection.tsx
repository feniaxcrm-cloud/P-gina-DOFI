import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import type { SeccionContenido } from "@/lib/sanity";

/**
 * Fondo de cada una de las 4 secciones, en este orden fijo (pedido
 * explicito: 01 naranja, 02 blanco, 03 morado, 04 naranja -- spec "Cambiar
 * colores de las secciones"). Ya NO alterna solo segun el indice como en
 * el sprint anterior (canvas/canvas-raised): ahora son 4 tonos concretos,
 * uno por posicion.
 *
 * Los tonos de texto/CTA de cada fila estan calculados para pasar
 * contraste AA sobre SU fondo especifico, no reutilizados a ciegas:
 *   - accent (naranja, #F47B20): texto oscuro. `ink` sobre accent mide
 *     6.53:1 (es el mismo par que ya usa --color-fg-on-accent en
 *     globals.css); `ink/80` para el cuerpo mide 4.87:1 (AA). `ink-muted`
 *     por si solo NO pasa sobre accent (2.76:1) -- por eso el cuerpo usa
 *     ink al 80% de opacidad en vez de ese token.
 *   - canvas (blanco): igual que antes, `ink`/`ink-muted` (17.2:1 / 7.3:1,
 *     ya medidos en globals.css).
 *   - brand (morado, #4B2A93): texto claro, mismo par que ya usa el Hero
 *     sobre su scrim morado (`foam`/`foam/90`) -- foam mide 9.13:1, foam/90
 *     mide 7.70:1 sobre brand.
 * (Valores calculados con la formula de luminancia relativa de WCAG, no
 * estimados a ojo.)
 */
type Tono = {
  fondo: string;
  titulo: string;
  cuerpo: string;
  cta: string;
  /** El respaldo "sin imagen todavia" (ver ContentImage) necesita
   *  contrastar con CUALQUIERA de los 2 tipos de fondo posibles: claro
   *  (naranja/morado, ambos saturados) o canvas (blanco). Un solo tono de
   *  respaldo no sirve para los dos -- ver `esFondoSaturado` abajo. */
  esFondoSaturado: boolean;
};

const TONOS: Tono[] = [
  // 01 — naranja DOFI
  {
    fondo: "bg-accent",
    titulo: "text-ink",
    cuerpo: "text-ink/80",
    cta: "border-ink/30 text-ink hover:border-ink/55 hover:bg-ink/10",
    esFondoSaturado: true,
  },
  // 02 — blanco
  {
    fondo: "bg-canvas",
    titulo: "text-ink",
    cuerpo: "text-ink-muted",
    cta: "border-brand/25 text-ink hover:border-brand/50 hover:bg-brand/5",
    esFondoSaturado: false,
  },
  // 03 — morado DOFI
  {
    fondo: "bg-brand",
    titulo: "text-foam",
    cuerpo: "text-foam/90",
    cta: "border-white/35 text-foam hover:border-white/60 hover:bg-white/10",
    esFondoSaturado: true,
  },
  // 04 — naranja DOFI
  {
    fondo: "bg-accent",
    titulo: "text-ink",
    cuerpo: "text-ink/80",
    cta: "border-ink/30 text-ink hover:border-ink/55 hover:bg-ink/10",
    esFondoSaturado: true,
  },
];

/**
 * Una de las 4 "Secciones de contenido" debajo de las tarjetas del Hero
 * (Sprint "Crear 4 secciones de contenido debajo del Hero"). Arquitectura
 * unica y reutilizable — page.tsx la pinta 4 veces via
 * `seccionesContenido.map(...)`, nunca 4 componentes/archivos separados
 * (spec §14/§36).
 *
 * ALTERNANCIA DE LADO — SOLO EN EL FRONTEND (spec §5/§10)
 * -----------------------------------------------------------------
 * El lado (texto/imagen) no es un dato de Sanity: se calcula acá con
 * `index % 2` sobre la posicion real del item en el arreglo
 * `seccionesContenido[]` (el orden que ya define 01/02/03/04 en el
 * Studio). Par -> texto a la izquierda; impar -> imagen a la izquierda.
 * El FONDO ya no sale de ese mismo calculo (ver TONOS arriba): son 4
 * colores fijos pedidos explicitamente, no una alternancia automatica.
 *
 * ORDEN EN EL DOM VS. ORDEN VISUAL
 * -----------------------------------------------------------------
 * El markup SIEMPRE va imagen -> texto. En mobile (sin `lg:`) eso ya da
 * exactamente la composicion pedida (spec §22: imagen, titulo,
 * descripcion, CTA, la MISMA en las 4 secciones — no se intenta preservar
 * la alternancia en una sola columna, no tendria sentido "izquierda/
 * derecha" apiladas). Desde `lg:` cada columna recibe `lg:order-1` o
 * `lg:order-2` segun `textoIzquierda`, reordenando puramente por CSS sin
 * tocar el DOM — mismo patron que ya usa el Hero para su imagen
 * full-bleed.
 *
 * CTA — INTERNO VS. EXTERNO (spec §13-14)
 * -----------------------------------------------------------------
 * Si `ctaEnlace` empieza con "http://"/"https://" se trata como externo:
 * `<a target="_blank" rel="noopener noreferrer">`, la pagina de DOFI
 * nunca se navega fuera. Cualquier otra cosa (ruta interna tipo
 * "/contactanos", o un ancla "#seccion") usa `next/link` para la
 * navegacion interna normal del proyecto.
 *
 * IMAGEN — HOTSPOT + RESPALDO SIN IMAGEN (mismo mecanismo que el Hero)
 * -----------------------------------------------------------------
 * `object-position` calculado en el cliente desde el hotspot {x,y} de
 * Sanity. Si `imagen` es null (documento incompleto), se pinta la misma
 * atmosfera de manchas de luz que ya usa el Hero como respaldo — nunca una
 * caja gris (spec §16, "no usar una caja gris como placeholder
 * definitivo").
 *
 * REVEAL — REUTILIZA <Reveal>, NO UNA ANIMACION NUEVA (spec §19-21)
 * -----------------------------------------------------------------
 * Mismo componente que ya usan Tools/Socio/Services: opacity 0->1 +
 * translateY 24->0, una sola vez al entrar en viewport, respeta
 * prefers-reduced-motion solo (ver Reveal.tsx). Texto e imagen son dos
 * islas de Reveal separadas con un leve stagger para que no lleguen
 * pegadas.
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
  const esExterno = /^https?:\/\//i.test(ctaEnlace);
  const tono = TONOS[index % TONOS.length];
  const ctaClassName = `group inline-flex h-[52px] items-center justify-center gap-2 rounded-full border px-7 font-display text-button transition-colors duration-200 ${tono.cta}`;

  return (
    <section className={`relative py-20 md:py-28 ${tono.fondo}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ---------- Imagen: primera en el DOM (orden mobile fijo) ---------- */}
          <Reveal
            delay={0.05}
            className={textoIzquierda ? "lg:order-2" : "lg:order-1"}
          >
            <ContentImage
              imagen={imagen}
              imagenAlt={imagenAlt}
              hotspot={hotspot}
              titulo={titulo}
              esFondoSaturado={tono.esFondoSaturado}
            />
          </Reveal>

          {/* ---------- Texto ---------- */}
          <Reveal className={textoIzquierda ? "lg:order-1" : "lg:order-2"}>
            <div className="max-w-[38rem]">
              <h2 className={`font-display text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl ${tono.titulo}`}>
                {titulo}
              </h2>
              <p className={`mt-5 max-w-[46ch] font-sans text-lg leading-relaxed ${tono.cuerpo}`}>
                {descripcion}
              </p>
              <div className="mt-8">
                {esExterno ? (
                  <a href={ctaEnlace} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
                    {ctaTexto}
                    <ArrowRight
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <Link href={ctaEnlace} className={ctaClassName}>
                    {ctaTexto}
                    <ArrowRight
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContentImage({
  imagen,
  imagenAlt,
  hotspot,
  titulo,
  esFondoSaturado,
}: Pick<SeccionContenido, "imagen" | "imagenAlt" | "hotspot"> & {
  titulo: string;
  esFondoSaturado: boolean;
}) {
  // Mismo mecanismo que el Hero: object-position calculado en el cliente
  // desde el hotspot {x,y} de Sanity (0-1), sin instalar @sanity/image-url.
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
      {imagen ? (
        <Image
          src={imagen}
          alt={imagenAlt || titulo}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          loading="lazy"
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : esFondoSaturado ? (
        // Sin imagen todavia, sobre un fondo de seccion saturado (naranja o
        // morado, spec "Cambiar colores de las secciones"): un respaldo
        // oscuro/purpura como el de mas abajo se volveria casi invisible
        // contra esos mismos colores. Este usa un velo blanco translucido
        // en su lugar -- mismo principio (nunca una caja gris, spec §16),
        // adaptado a que ahora el fondo puede ser saturado.
        <div aria-hidden="true" className="absolute inset-0 border border-white/25 bg-white/10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-[80px]" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-[90px]" />
        </div>
      ) : (
        // Sin imagen todavia, sobre la seccion blanca: misma atmosfera de
        // respaldo que el Hero, nunca una caja gris (spec §16).
        <div aria-hidden="true" className="absolute inset-0 border border-brand/10 bg-brand/5">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/12 blur-[80px]" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
        </div>
      )}
    </div>
  );
}
