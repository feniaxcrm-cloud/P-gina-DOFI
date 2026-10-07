import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { LOGOS_FENIAX } from "@/config/feniax";
import type { SeccionCierre } from "@/lib/marketing-digital";
import { OndasFeniax } from "./OndasFeniax";
import { FotoFondo, Puntos, partirFinal } from "./piezas";

/**
 * 7 · Cierre (tipo ctaBanner): la pregunta final y el botón protagonista.
 *
 * Sin foto: el isotipo grande, con un brillo que respira, sobre el fondo de
 * la portada del brandbook -- el fénix como última imagen de la página. Con
 * foto cargada en el Studio: la foto de fondo con el velo de marca, como el
 * cierre de Marketing Digital.
 */
const ALINEA = {
  izquierda: "items-start text-left",
  centro: "items-center text-center",
  derecha: "items-start text-left md:items-end md:text-right",
} as const;

export function FeniaxCierre({ seccion, id, nivel }: { seccion: SeccionCierre; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, alineacion, animar } = seccion;
  const Titulo = nivel;
  const [inicio, final] = partirFinal(titulo, 2);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="pantalla relative isolate overflow-hidden bg-abyss text-foam max-md:min-h-[560px] max-md:pb-36"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {imagen ? (
          <>
            <FotoFondo imagen={imagen} imagenMovil={imagenMovil} />
            <div className="absolute inset-0 bg-abyss/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(237,109,25,0.28)_0%,rgba(121,40,131,0.35)_40%,transparent_75%),linear-gradient(180deg,#2A1638_0%,#160A20_100%)]" />
        )}
        <OndasFeniax idGradiente="ondas-cierre" className="inset-x-0 -bottom-6 h-32 md:h-40" amplitud={85} opacidad={0.5} duracion={44} />
        <Puntos className="-right-20 top-0 h-[360px] w-[460px] opacity-60" />
      </div>

      <div className={`relative mx-auto flex w-full max-w-page flex-col justify-center px-5 sm:px-6 md:px-10 lg:px-12 ${ALINEA[alineacion]}`}>
        {!imagen && (
          <Anim animar={animar} y={16}>
            <span aria-hidden="true" className="relative mb-[clamp(1.5rem,5svh,2.5rem)] flex h-28 w-28 items-center justify-center md:h-[min(8rem,15svh)] md:w-[min(8rem,15svh)]">
              <span className="feniax-pulso absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(237,109,25,0.55)_0%,rgba(229,53,42,0.2)_45%,transparent_70%)] blur-md" />
              <span className="absolute inset-2 rounded-full border border-white/10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGOS_FENIAX.isotipo} alt="" className="relative h-auto w-16 md:w-[72px]" />
            </span>
          </Anim>
        )}

        {subtitulo && (
          <Anim animar={animar} y={12} delay={0.04}>
            <p className="mb-5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.32em] text-accent-lift">{subtitulo}</p>
          </Anim>
        )}

        <Anim animar={animar} y={16} delay={0.08}>
          <Titulo
            id={`${id}-titulo`}
            className="max-w-[20ch] text-balance font-display text-[clamp(2.25rem,min(1.3rem+2.8vw,7.6svh),3.875rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
          >
            {inicio && <>{inicio} </>}
            <span className="texto-ia">{final}</span>
          </Titulo>
        </Anim>

        {descripcion && (
          <Anim animar={animar} y={14} delay={0.16}>
            <p className="mt-6 max-w-[560px] font-sans text-lg leading-relaxed text-foam/80 md:text-xl">{descripcion}</p>
          </Anim>
        )}

        {destacado && (
          <Anim animar={animar} y={14} delay={0.22}>
            <p className="mt-6 font-display text-lg font-semibold tracking-tight text-accent-lift md:text-xl">{destacado}</p>
          </Anim>
        )}

        {cta && (
          <Anim animar={animar} y={14} delay={0.28}>
            <div className="mt-[clamp(1.5rem,4.5svh,2.5rem)]">
              <BotonCta texto={cta.texto} enlace={cta.enlace} color="feniax" tamano="grande" />
            </div>
          </Anim>
        )}
      </div>
    </section>
  );
}
