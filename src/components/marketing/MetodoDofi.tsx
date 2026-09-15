import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { OrnamentoIcono, OrnamentoRuta } from "./OrnamentoNautico";
import { PiezaCompleta } from "./PiezaCompleta";
import { RutaMetodo } from "./RutaMetodo";
import type { SeccionMetodo } from "@/lib/marketing-digital";

/**
 * 4 · Método DOFI (methodBanner).
 *
 * Orden de aparicion pedido: titulo -> descripcion -> la linea del recorrido
 * se dibuja -> pasos 01 a 05 -> "Ventas Inteligentes Garantizadas" -> CTA.
 * El recorrido y su animacion viven en RutaMetodo; aca esta el encabezado,
 * la pieza grafica opcional y el boton, que se queda debajo del metodo.
 *
 * El destino del recorrido es el campo "Texto destacado" de la seccion.
 *
 * "Mostrar los pasos como texto" apagado oculta el recorrido completo: es
 * para cuando la pieza grafica ya trae el metodo dibujado, y un recorrido
 * con solo el destino no tendria sentido.
 */
export function MetodoDofi({ seccion, id, nivel }: { seccion: SeccionMetodo; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, pasos, mostrarPasos, cta, animar } = seccion;
  const Titulo = nivel;
  const altPieza = [titulo, ...pasos.map((p) => p.titulo), destacado].filter(Boolean).join(". ");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="group/nautico relative overflow-hidden bg-[linear-gradient(180deg,#FDFBF7_0%,#F6F1FC_55%,#FDFBF7_100%)] py-20 md:py-28"
    >
      {/* El Metodo es el tramo del viaje: timon guiando desde arriba a la
          izquierda, y una ruta punteada chica cerca del boton, abajo. */}
      <OrnamentoIcono
        motivo="timon"
        deriva="asentar"
        className="-left-8 top-2 h-32 w-32 -rotate-12 text-brand/[0.08] sm:-left-10 sm:h-48 sm:w-48 lg:-left-14 lg:top-4 lg:h-64 lg:w-64"
      />
      <OrnamentoRuta className="bottom-6 right-[6%] hidden h-16 w-36 text-accent/[0.22] md:block lg:h-20 lg:w-48" />
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-[820px] text-center">
          {subtitulo && (
            <Anim animar={animar} y={12}>
              <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>
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
          <RutaMetodo pasos={pasos} destino={destacado} animar={animar} />
        </div>
      )}

      {cta && (
        <div className="mx-auto mt-16 flex max-w-page justify-center px-5 sm:px-6 md:mt-20 md:px-10 lg:px-12">
          <Anim animar={animar} y={14} delay={0.1}>
            <BotonCta texto={cta.texto} enlace={cta.enlace} />
          </Anim>
        </div>
      )}
    </section>
  );
}
