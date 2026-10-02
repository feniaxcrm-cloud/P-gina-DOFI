import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { PiezaCompleta } from "@/components/marketing/PiezaCompleta";
import { RutaMetodo } from "@/components/marketing/RutaMetodo";
import type { SeccionMetodo } from "@/lib/marketing-digital";
import { OndasFeniax } from "./OndasFeniax";
import { Etiqueta, IsotipoAgua, Puntos } from "./piezas";

/**
 * 4 · Método FENIAX (tipo methodBanner, el mismo recorrido de pasos que el
 * Método DOFI). Reutiliza RutaMetodo tal cual -- la línea que se dibuja, las
 * paradas en zigzag y el destino -- con el juego de íconos de FENIAX
 * (diagnóstico, canales, IA, seguimiento, reportes y el fuego del fénix en el
 * destino) y los colores del tema (.tema-feniax).
 */
export function FeniaxMetodo({ seccion, id, nivel }: { seccion: SeccionMetodo; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, pasos, mostrarPasos, cta, animar } = seccion;
  const Titulo = nivel;
  const altPieza = [titulo, ...pasos.map((p) => p.titulo), destacado].filter(Boolean).join(". ");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#FCFAFD_0%,#F6EEF8_55%,#FCFAFD_100%)] py-20 md:py-28"
    >
      <OndasFeniax idGradiente="ondas-metodo" className="inset-x-0 top-0 -z-10 h-36 md:h-44" amplitud={55} opacidad={0.25} duracion={60} />
      <IsotipoAgua className="-bottom-16 -left-20 -z-10 w-[300px] opacity-[0.05] md:w-[420px]" />
      <Puntos className="-right-28 bottom-0 -z-10 h-[320px] w-[420px] opacity-45" />

      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[820px] text-center">
          {subtitulo && (
            <Anim animar={animar} y={12} className="flex justify-center">
              <Etiqueta>{subtitulo}</Etiqueta>
            </Anim>
          )}
          <Anim animar={animar} y={18} delay={0.04}>
            <Titulo
              id={`${id}-titulo`}
              className="text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
            >
              {titulo}
            </Titulo>
          </Anim>
          {descripcion && (
            <Anim animar={animar} y={14} delay={0.12}>
              <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
            </Anim>
          )}
        </div>
      </div>

      {imagen && (
        <div className="mt-14 md:mt-16">
          <Anim animar={animar} y={20}>
            <PiezaCompleta imagen={imagen} imagenMovil={imagenMovil} alt={imagen.alt || altPieza} />
          </Anim>
        </div>
      )}

      {mostrarPasos && (pasos.length > 0 || destacado) && (
        <div className="mx-auto mt-16 max-w-page px-5 sm:px-6 md:mt-20 md:px-10 lg:px-12">
          <RutaMetodo pasos={pasos} destino={destacado} animar={animar} iconos="feniax" vivo />
        </div>
      )}

      {cta && (
        <div className="mx-auto mt-16 flex max-w-page justify-center px-5 sm:px-6 md:mt-20 md:px-10 lg:px-12">
          <Anim animar={animar} y={14} delay={0.1}>
            <BotonCta texto={cta.texto} enlace={cta.enlace} color="feniax-morado" />
          </Anim>
        </div>
      )}
    </section>
  );
}
