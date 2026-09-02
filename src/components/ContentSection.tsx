import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import type { SeccionContenido } from "@/lib/sanity";

/**
 * Una de las 4 "Secciones de contenido" debajo de las tarjetas del Hero
 * (Sprint "Crear 4 secciones de contenido debajo del Hero"). Arquitectura
 * unica y reutilizable — page.tsx la pinta 4 veces via
 * `seccionesContenido.map(...)`, nunca 4 componentes/archivos separados
 * (spec §14/§36).
 *
 * ALTERNANCIA — SOLO EN EL FRONTEND (spec §5/§10)
 * -----------------------------------------------------------------
 * El lado (texto/imagen) no es un dato de Sanity: se calcula acá con
 * `index % 2` sobre la posicion real del item en el arreglo
 * `seccionesContenido[]` (el orden que ya define 01/02/03/04 en el
 * Studio). Par -> texto a la izquierda; impar -> imagen a la izquierda.
 * Ese mismo indice tambien alterna el fondo (canvas / canvas-raised) para
 * dar un respiro visual entre secciones sin salir de los tokens
 * existentes (spec §3 "ritmo visual", §18 "usar el Design System, no
 * valores arbitrarios").
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
  const fondoElevado = index % 2 === 1;
  const esExterno = /^https?:\/\//i.test(ctaEnlace);

  return (
    <section
      className={`relative py-20 md:py-28 ${fondoElevado ? "bg-canvas-raised" : "bg-canvas"}`}
    >
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
            />
          </Reveal>

          {/* ---------- Texto ---------- */}
          <Reveal className={textoIzquierda ? "lg:order-1" : "lg:order-2"}>
            <div className="max-w-[38rem]">
              <h2 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-5xl">
                {titulo}
              </h2>
              <p className="mt-5 max-w-[46ch] font-sans text-lg leading-relaxed text-ink-muted">
                {descripcion}
              </p>
              <div className="mt-8">
                {esExterno ? (
                  <a
                    href={ctaEnlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-brand/25 px-7 font-display text-button text-ink transition-colors duration-200 hover:border-brand/50 hover:bg-brand/5"
                  >
                    {ctaTexto}
                    <ArrowRight
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <Link
                    href={ctaEnlace}
                    className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-brand/25 px-7 font-display text-button text-ink transition-colors duration-200 hover:border-brand/50 hover:bg-brand/5"
                  >
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
}: Pick<SeccionContenido, "imagen" | "imagenAlt" | "hotspot"> & { titulo: string }) {
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
      ) : (
        // Sin imagen todavia en Sanity: misma atmosfera de respaldo que el
        // Hero, nunca una caja gris (spec §16). bg-brand/5 + borde propio en
        // vez de bg-canvas-raised: esta seccion alterna su PROPIO fondo
        // entre canvas/canvas-raised (ver arriba), asi que un respaldo fijo
        // en uno de esos dos tonos se volveria invisible contra la mitad de
        // los casos -- este tono queda siempre distinguible del fondo.
        <div aria-hidden="true" className="absolute inset-0 border border-brand/10 bg-brand/5">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/12 blur-[80px]" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
        </div>
      )}
    </div>
  );
}
