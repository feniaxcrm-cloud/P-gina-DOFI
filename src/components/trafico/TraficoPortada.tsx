import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { AtmosferaMar } from "@/components/marketing/AtmosferaMar";
import { FotoFondo } from "@/components/marketing/FotoFondo";
import { parrafosDe } from "@/components/marketing/PiezaGrafica";
import type { SeccionEquipo } from "@/lib/marketing-digital";
import { HeroProblema } from "./HeroProblema";

/**
 * 1 · Portada de Tráfico/Ads: "El problema" (tipo teamBanner, el mismo que
 * abre Marketing Digital: subtítulo, título, descripción, destacado y botón).
 *
 * Mismo fondo que usa BannerFoto cuando no hay foto (AtmosferaMar: el mar de
 * ideas de DOFI, morado profundo con oleaje) y mismo texto blanco sobre
 * oscuro. A la derecha, la composicion del problema (HeroProblema): me gusta
 * y visualizaciones que suben, ventas que no.
 *
 * SI SE SUBE UNA FOTO en el Studio, la foto pasa al fondo con su velo (como
 * en Marketing Digital) y la composicion se retira: la foto ya tiene la suya.
 *
 * La descripcion admite parrafos (linea en blanco entre uno y otro): el
 * primero plantea el problema y el segundo dice que hace DOFI.
 */
export function TraficoPortada({ seccion, id, nivel }: { seccion: SeccionEquipo; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;
  const Titulo = nivel;
  const parrafos = parrafosDe(descripcion);
  // La seccion que abre la pagina arranca debajo del header fijo (64-68px).
  const relleno = nivel === "h1" ? "pb-16 pt-32 md:pb-20 md:pt-36" : "py-20 md:py-24";

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-abyss text-foam">
      <div className="absolute inset-0 -z-10">
        {imagen ? (
          <>
            <FotoFondo imagen={imagen} imagenMovil={imagenMovil} prioridad={nivel === "h1"} />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-abyss/85 via-abyss/55 to-abyss/20" />
          </>
        ) : (
          <AtmosferaMar variante="equipo" />
        )}
      </div>

      <div
        className={`relative mx-auto grid w-full max-w-page grid-cols-1 items-center gap-14 px-5 sm:px-6 md:px-10 lg:gap-8 lg:px-12 ${
          imagen ? "" : "lg:grid-cols-12"
        } ${relleno}`}
      >
        <div className={`min-w-0 ${imagen ? "max-w-[720px]" : "lg:col-span-7"}`}>
          {subtitulo && (
            <Anim animar={animar} y={12} duration={0.6}>
              <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
                {subtitulo}
              </p>
            </Anim>
          )}

          <Anim animar={animar} y={16} delay={0.08} duration={0.6}>
            <Titulo
              id={`${id}-titulo`}
              className="max-w-[19ch] text-balance font-display text-[clamp(2rem,1.3rem+3.2vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] [text-shadow:0_2px_24px_rgba(18,10,38,0.35)]"
            >
              {titulo}
            </Titulo>
          </Anim>

          {parrafos.length > 0 && (
            <div className="mt-6 flex max-w-[600px] flex-col gap-4">
              {parrafos.map((p, i) => (
                <Anim key={i} animar={animar} y={14} delay={0.16 + i * 0.08} duration={0.6}>
                  <p className="font-sans text-base leading-relaxed text-foam/85 md:text-lg">{p}</p>
                </Anim>
              ))}
            </div>
          )}

          {destacado && (
            <Anim animar={animar} y={14} delay={0.34} duration={0.6}>
              <p className="mt-7 flex max-w-[600px] items-start gap-3 font-display text-lg font-semibold leading-snug tracking-tight text-accent-lift md:text-xl">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-10 shrink-0 bg-accent-lift/70" />
                {destacado}
              </p>
            </Anim>
          )}

          {cta && (
            <Anim animar={animar} y={14} delay={0.42} duration={0.6}>
              <div className="mt-9">
                <BotonCta texto={cta.texto} enlace={cta.enlace} />
              </div>
            </Anim>
          )}
        </div>

        {!imagen && (
          <div className="min-w-0 lg:col-span-5">
            <Anim animar={animar} y={24} delay={0.2} duration={0.8}>
              <HeroProblema />
            </Anim>
          </div>
        )}
      </div>
    </section>
  );
}
