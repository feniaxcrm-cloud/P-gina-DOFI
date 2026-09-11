import { ArrowUpRight, GoogleLogo } from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { ResenasCarrusel } from "./ResenasCarrusel";
import type { ResenasData } from "@/lib/marketing-digital";

/**
 * 6 · Reseñas de Google.
 *
 * SOLO RESEÑAS REALES
 * -----------------------------------------------------------------
 * Se cargan a mano en el Studio (menu "Reseñas"), copiadas del perfil de
 * Google de DOFI. No hay reseñas de ejemplo en el codigo ni un puntaje
 * promedio calculado: inventar cualquiera de las dos es publicidad
 * engañosa, y Google sanciona perfiles por eso.
 *
 * SIN RESEÑAS CARGADAS
 * -----------------------------------------------------------------
 * La seccion no se esconde ni muestra tarjetas vacias: invita a leerlas en
 * el perfil real de Google (el mismo lugar que abre el mapa del pie).
 */
export function ResenasGoogle({ data }: { data: ResenasData }) {
  const { titulo, descripcion, enlaceGoogle, animar, resenas } = data;
  const hayResenas = resenas.length > 0;

  return (
    <section
      id="resenas"
      aria-labelledby="resenas-titulo"
      className="relative overflow-hidden bg-canvas py-20 md:py-28"
    >
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Anim animar={animar} className="max-w-[720px]">
            <p className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              <GoogleLogo size={16} weight="bold" aria-hidden="true" className="text-brand" />
              Google
            </p>
            <h2
              id="resenas-titulo"
              className="mt-4 text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
            >
              {titulo}
            </h2>
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
          <ResenasCarrusel resenas={resenas} animar={animar} />
        ) : (
          enlaceGoogle && (
            <Anim animar={animar} delay={0.1} className="mt-12">
              <div className="flex flex-col items-start gap-6 rounded-[28px] border border-brand/10 bg-white p-8 shadow-[0_24px_50px_-32px_rgba(26,15,61,0.35)] md:flex-row md:items-center md:justify-between md:p-10">
                <p className="max-w-[560px] font-sans text-lg leading-relaxed text-ink-muted">
                  Lee lo que dicen quienes ya trabajaron con nosotros, directamente en nuestro perfil de
                  Google.
                </p>
                <BotonCta texto="Ver reseñas en Google" enlace={enlaceGoogle} />
              </div>
            </Anim>
          )
        )}
      </div>
    </section>
  );
}
