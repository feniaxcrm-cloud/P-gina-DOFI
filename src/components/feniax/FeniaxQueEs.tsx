import {
  ArrowsOutCardinal,
  Fire,
  Handshake,
  Lightbulb,
  Lightning,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { ModoPieza, parrafosDe } from "@/components/marketing/PiezaGrafica";
import { VALORES_FENIAX, type ClaveValor } from "@/config/feniax";
import type { SeccionQueEs } from "@/lib/marketing-digital";
import { OndasFeniax } from "./OndasFeniax";
import { Etiqueta, IsotipoAgua, Puntos } from "./piezas";

/**
 * 2 · ¿Qué es FENIAX? (tipo aboutBanner, mismos campos que "¿Qué es DOFI?").
 *
 * Fondo claro, como en Marketing Digital, pero con la marca FENIAX: el
 * isotipo gigante como marca de agua (la página "Directrices de marca" del
 * brandbook), la cinta de líneas muy tenue y, a la derecha, los 6 valores de
 * marca del brandbook -- los círculos naranjas de la página "Valores de
 * marca", con un ícono cada uno.
 *
 * Los valores salen de src/config/feniax.ts (identidad, no copy de página).
 * Con una pieza gráfica cargada en el Studio, la sección pasa a "modo pieza"
 * igual que en Marketing Digital.
 */

const ICONOS_VALOR: Record<ClaveValor, Icon> = {
  innovacion: Lightbulb,
  eficiencia: Lightning,
  resurgimiento: Fire,
  adaptabilidad: ArrowsOutCardinal,
  confianza: ShieldCheck,
  compromiso: Handshake,
};

export function FeniaxQueEs({ seccion, id, nivel }: { seccion: SeccionQueEs; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;

  if (imagen) {
    return (
      <ModoPieza
        id={id}
        nivel={nivel}
        titulo={titulo}
        imagen={imagen}
        imagenMovil={imagenMovil}
        altPorDefecto={[descripcion, destacado].filter(Boolean).join(" ")}
        cta={cta}
        animar={animar}
      />
    );
  }

  const Titulo = nivel;
  const parrafos = parrafosDe(descripcion);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-canvas pb-36 pt-20 md:pb-44 md:pt-28">
      <IsotipoAgua className="-right-24 -top-10 -z-10 w-[420px] opacity-[0.06] md:w-[560px] lg:-right-16 lg:w-[640px]" />
      <OndasFeniax idGradiente="ondas-que-es" className="inset-x-0 bottom-0 -z-10 h-28 md:h-36" amplitud={60} opacidad={0.28} duracion={55} />
      <Puntos className="-left-32 top-10 -z-10 h-[300px] w-[380px] opacity-50" color="color-mix(in srgb, var(--color-brand) 35%, transparent)" />

      <div className="relative mx-auto grid max-w-page grid-cols-1 gap-14 px-5 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <Anim animar={animar} className="min-w-0 lg:col-span-6">
          {subtitulo && <Etiqueta>{subtitulo}</Etiqueta>}
          <Titulo
            id={`${id}-titulo`}
            className="text-balance font-display text-[clamp(2.5rem,1.6rem+3.4vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </Titulo>
          <span aria-hidden="true" className="mt-7 block h-1.5 w-20 rounded-full bg-[linear-gradient(90deg,#792883,#ED6D19,#E5352A)]" />

          <div className="mt-9 flex flex-col gap-5">
            {parrafos.map((p, i) => (
              <p key={i} className="font-sans text-lg leading-relaxed text-ink-muted md:text-xl">
                {p}
              </p>
            ))}
          </div>
          {destacado && (
            <p className="mt-8 font-display text-2xl font-bold leading-snug tracking-tight text-brand md:text-[1.75rem]">
              {destacado}
            </p>
          )}
          {cta && (
            <div className="mt-9">
              <BotonCta texto={cta.texto} enlace={cta.enlace} color="feniax-morado" />
            </div>
          )}
        </Anim>

        <div className="min-w-0 lg:col-span-6 lg:pl-6">
          <Anim animar={animar} delay={0.08}>
            <h3 className="mb-7 font-sans text-[12.5px] font-semibold uppercase tracking-[0.32em] text-ink-subtle">
              Valores de marca
            </h3>
          </Anim>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            {VALORES_FENIAX.map((v, i) => {
              const Icono = ICONOS_VALOR[v.clave];
              return (
                <li key={v.clave}>
                  <Anim animar={animar} delay={0.1 + i * 0.05} y={14} className="flex items-start gap-4">
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(160deg,#F38A3F_0%,#ED6D19_45%,#E5352A_100%)] text-white shadow-[0_14px_28px_-14px_rgba(229,53,42,0.75)]">
                      <Icono size={24} weight="duotone" aria-hidden="true" />
                    </span>
                    <span className="pt-1">
                      <span className="block font-display text-lg font-bold leading-snug tracking-tight text-ink">{v.nombre}</span>
                      <span className="mt-1 block font-sans text-[15px] leading-relaxed text-ink-muted">{v.lema}</span>
                    </span>
                  </Anim>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
