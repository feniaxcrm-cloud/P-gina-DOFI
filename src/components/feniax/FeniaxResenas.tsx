import { ArrowUpRight, GoogleLogo } from "@phosphor-icons/react/dist/ssr";
import { Anim } from "@/components/marketing/Anim";
import { ResenasCarrusel } from "@/components/marketing/ResenasCarrusel";
import type { SeccionResenas } from "@/lib/marketing-digital";
import { OndasFeniax } from "./OndasFeniax";
import { IsotipoAgua, Puntos } from "./piezas";

/**
 * 6 · Reseñas de Google (tipo reviewsBanner). Mismas reglas que en Marketing
 * Digital: las reseñas llegan ya resueltas (Google primero, Sanity de
 * respaldo, nunca mezcladas), siempre tarjetas y nunca un botón. Cambia solo
 * el fondo: marca FENIAX en vez de los ornamentos náuticos de DOFI. Las
 * tarjetas toman los colores del tema (.tema-feniax) sin tocarlas.
 */
export function FeniaxResenas({ seccion, id, nivel }: { seccion: SeccionResenas; id: string; nivel: "h1" | "h2" }) {
  const { subtitulo, titulo, descripcion, enlaceGoogle, animar, resenas } = seccion;
  const Titulo = nivel;
  const hayResenas = resenas.length > 0;

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden pantalla bg-canvas">
      <IsotipoAgua className="-right-20 -top-14 -z-10 w-[280px] opacity-[0.05] md:w-[380px]" />
      <OndasFeniax idGradiente="ondas-resenas" className="inset-x-0 bottom-0 -z-10 h-28 md:h-40" amplitud={45} opacidad={0.22} duracion={62} />
      <Puntos className="-left-28 bottom-6 -z-10 h-[300px] w-[380px] opacity-40" color="color-mix(in srgb, var(--color-brand) 35%, transparent)" />

      <div className="mx-auto w-full max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Anim animar={animar} className="max-w-[720px]">
            <p className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              <GoogleLogo size={16} weight="bold" aria-hidden="true" className="text-brand" />
              {subtitulo || "Google"}
            </p>
            <Titulo
              id={`${id}-titulo`}
              className="mt-4 text-balance font-display text-titulo font-extrabold text-ink"
            >
              {titulo}
            </Titulo>
            {descripcion && (
              <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
            )}
          </Anim>

          {hayResenas && enlaceGoogle && (
            <Anim animar={animar} delay={0.08}>
              <a
                href={enlaceGoogle}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand transition-colors duration-300 hover:text-accent"
              >
                Ver todas en Google
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Anim>
          )}
        </div>

        {hayResenas ? (
          <Anim animar={animar} delay={0.1} className="mt-[clamp(1.75rem,5svh,3rem)]">
            <ResenasCarrusel resenas={resenas} />
          </Anim>
        ) : (
          <Anim animar={animar} delay={0.1} className="mt-12">
            <p className="max-w-[560px] font-sans text-lg leading-relaxed text-ink-muted">
              Muy pronto vas a poder leer aquí las reseñas reales de quienes ya trabajaron con nosotros.
            </p>
          </Anim>
        )}
      </div>
    </section>
  );
}
