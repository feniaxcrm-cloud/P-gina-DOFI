import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import type { SeccionPortadaAsesorias } from "@/lib/asesorias";

/**
 * Portada de Asesorías (tipo splitHeroBanner).
 *
 *   ┌──────────────────────────────┬──────────────────────────┐
 *   │ Asesorías 1 a 1              │                          │
 *   │ [logo Rescatando             │   la imagen, apoyada     │
 *   │  Emprendedores]              │   en el borde de abajo   │
 *   │ La frase                     │                          │
 *   │ [Quiero mejorar mis ventas]  │                          │
 *   └──────────────────────────────┴──────────────────────────┘
 *
 * Fondo morado profundo con brillos naranja y violeta y unas líneas de luz
 * en diagonal: el mismo mundo que el banner de «Rescatando Emprendedores» del
 * Home. La imagen (un recorte con fondo transparente) se apoya en el borde
 * inferior, como si la gente estuviera parada en la sección; en teléfono va
 * debajo del texto.
 *
 * El logo y la imagen se muestran completos (sin recortes ni punto focal):
 * son piezas terminadas.
 */
export function AsesoriasPortada({
  seccion,
  id,
  nivel,
  prioridad = false,
}: {
  seccion: SeccionPortadaAsesorias;
  id: string;
  nivel: "h1" | "h2";
  /** Pide la imagen con prioridad: solo para la sección que se ve sin scroll. */
  prioridad?: boolean;
}) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar, logo } = seccion;
  const Titulo = nivel;
  // La sección que abre la página arranca debajo del header fijo.
  const relleno = nivel === "h1" ? "pt-32 md:pt-36" : "pt-20 md:pt-24";

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-abyss text-foam">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(95%_85%_at_78%_18%,#3A2280_0%,#1A0F3D_52%,#120A26_100%)]"
      />
      <div aria-hidden="true" className="absolute -right-28 top-[18%] -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-lift/30 blur-[150px]" />
      <div aria-hidden="true" className="absolute -bottom-40 left-[38%] -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[150px]" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id={`${id}-luz`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9B7BFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#B49BFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#9B7BFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-luz-naranja`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FF9440" stopOpacity="0" />
            <stop offset="0.55" stopColor="#FF9440" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FF9440" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-80 640 C 380 520, 760 330, 1520 70" stroke={`url(#${id}-luz)`} strokeWidth="1.6" />
        <path d="M-80 700 C 420 600, 820 420, 1520 170" stroke={`url(#${id}-luz)`} strokeWidth="1" opacity="0.6" />
        <path d="M120 760 C 560 640, 980 500, 1520 330" stroke={`url(#${id}-luz-naranja)`} strokeWidth="1.4" />
      </svg>

      <div
        className={`relative mx-auto grid max-w-page grid-cols-1 items-end gap-8 px-5 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-6 lg:px-12 ${relleno}`}
      >
        <div className="min-w-0 pb-4 lg:col-span-6 lg:self-center lg:pb-16 xl:col-span-5">
          {subtitulo && (
            <Anim animar={animar} y={12} duration={0.6}>
              <p className="mb-6 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
                {subtitulo}
              </p>
            </Anim>
          )}

          <Anim animar={animar} y={16} delay={0.06} duration={0.6}>
            <Titulo
              id={`${id}-titulo`}
              className="text-balance font-display text-[clamp(2.6rem,1.7rem+3.4vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.03em] [text-shadow:0_2px_24px_rgba(18,10,38,0.35)]"
            >
              {titulo}
            </Titulo>
          </Anim>

          {logo && (
            <Anim animar={animar} y={14} delay={0.14} duration={0.7}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.url}
                alt={logo.alt}
                width={logo.ancho}
                height={logo.alto}
                decoding="async"
                className="mt-6 block h-auto w-full max-w-[440px] drop-shadow-[0_18px_40px_rgba(18,10,38,0.55)] md:mt-8"
              />
            </Anim>
          )}

          {descripcion && (
            <Anim animar={animar} y={14} delay={0.22} duration={0.6}>
              <p className="mt-6 max-w-[520px] font-sans text-lg leading-relaxed text-foam/85 md:mt-8 md:text-xl">
                {descripcion}
              </p>
            </Anim>
          )}

          {destacado && (
            <Anim animar={animar} y={14} delay={0.28} duration={0.6}>
              <p className="mt-6 flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-accent-lift md:text-xl">
                <span aria-hidden="true" className="h-px w-10 bg-accent-lift/70" />
                {destacado}
              </p>
            </Anim>
          )}

          {cta && (
            <Anim animar={animar} y={14} delay={0.32} duration={0.6}>
              <div className="mt-9">
                <BotonCta texto={cta.texto} enlace={cta.enlace} />
              </div>
            </Anim>
          )}
        </div>

        {imagen && (
          <div className="relative min-w-0 lg:col-span-6 xl:col-span-7">
            {/* Halo detrás de la gente: la despega del fondo sin recuadro. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[8%] bottom-0 top-[18%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(109,75,201,0.55),rgba(244,123,32,0.12)_62%,transparent)] blur-2xl"
            />
            <Anim animar={animar} y={24} delay={0.1} duration={0.8}>
              <picture>
                {imagenMovil && <source media="(max-width: 767px)" srcSet={imagenMovil.url} />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagen.url}
                  alt={imagen.alt}
                  width={imagen.ancho}
                  height={imagen.alto}
                  decoding="async"
                  fetchPriority={prioridad ? "high" : undefined}
                  className="mx-auto block h-auto w-full max-w-[760px] object-contain"
                />
              </picture>
            </Anim>
          </div>
        )}
      </div>
    </section>
  );
}
