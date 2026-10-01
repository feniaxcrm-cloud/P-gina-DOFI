import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { PiezaCompleta } from "@/components/marketing/PiezaCompleta";
import { parrafosDe } from "@/components/marketing/PiezaGrafica";
import type { SeccionNavegacion } from "@/lib/marketing-digital";
import { OndasFeniax } from "./OndasFeniax";
import { Etiqueta, Puntos, partirFinal } from "./piezas";
import { VideoFlujo } from "./VideoFlujo";

/**
 * 3 · Bloque editorial oscuro (tipo navigationBanner, el "¿Cómo navegamos
 * contigo?" de Marketing Digital).
 *
 * En FENIAX es el dolor y la solución: "¿Demasiados mensajes, pocas
 * ventas?" (la pregunta de las piezas de campaña del brandbook), con las dos
 * últimas palabras del título en el degradado de la "IA". A la derecha, el
 * video "Así trabaja FENIAX" (HyperFrames, VideoFlujo.tsx): donde DOFI tiene
 * la brújula, FENIAX muestra su sistema funcionando.
 *
 * Con una imagen cargada en el Studio, la imagen reemplaza al video en esa
 * columna (completa, sin recortes).
 */
export function FeniaxEditorial({
  seccion,
  id,
  nivel,
}: {
  seccion: SeccionNavegacion;
  id: string;
  nivel: "h1" | "h2";
}) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;
  const Titulo = nivel;
  const [inicio, final] = partirFinal(titulo, 2);
  const parrafos = parrafosDe(descripcion);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-abyss text-foam">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_92%_8%,rgba(121,40,131,0.75)_0%,transparent_70%),radial-gradient(45%_50%_at_6%_100%,rgba(237,109,25,0.22)_0%,transparent_70%),linear-gradient(180deg,#1C0E27_0%,#160A20_100%)]"
      />
      <OndasFeniax idGradiente="ondas-editorial" className="inset-x-0 bottom-0 -z-10 h-44 md:h-56" amplitud={70} opacidad={0.45} duracion={50} />
      <Puntos className="-left-24 top-6 -z-10 h-[320px] w-[400px] opacity-45" />

      <div className="relative mx-auto max-w-page px-5 pb-32 pt-24 sm:px-6 md:px-10 md:pb-40 md:pt-32 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            {subtitulo && (
              <Anim animar={animar} y={12}>
                <Etiqueta tono="oscuro">{subtitulo}</Etiqueta>
              </Anim>
            )}

            <Anim animar={animar} y={20} delay={0.06}>
              <Titulo
                id={`${id}-titulo`}
                className="text-balance font-display text-[clamp(2.6rem,1.5rem+4vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.03em]"
              >
                {inicio && <>{inicio} </>}
                <span className="texto-ia">{final}</span>
              </Titulo>
            </Anim>

            {parrafos.length > 0 && (
              <div className={`mt-10 grid max-w-[680px] gap-8 ${parrafos.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {parrafos.map((p, i) => (
                  <Anim key={i} animar={animar} y={14} delay={0.16 + i * 0.08}>
                    <p className="font-sans text-base leading-relaxed text-foam/80 md:text-lg">{p}</p>
                  </Anim>
                ))}
              </div>
            )}

            {destacado && (
              <Anim animar={animar} y={14} delay={0.3}>
                <p className="mt-10 flex items-center gap-4 font-display text-2xl font-bold tracking-tight text-foam">
                  <span aria-hidden="true" className="h-px w-12 bg-[linear-gradient(90deg,#ED6D19,#E5352A)]" />
                  {destacado}
                </p>
              </Anim>
            )}

            {cta && (
              <Anim animar={animar} y={14} delay={0.36}>
                <div className="mt-10">
                  <BotonCta texto={cta.texto} enlace={cta.enlace} color="feniax" />
                </div>
              </Anim>
            )}
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Anim animar={animar} y={24} delay={0.1}>
              {imagen ? (
                <PiezaCompleta imagen={imagen} imagenMovil={imagenMovil} alt={imagen.alt || titulo} />
              ) : (
                <VideoFlujo className="mx-auto w-full max-w-[460px]" />
              )}
            </Anim>
          </div>
        </div>
      </div>
    </section>
  );
}
