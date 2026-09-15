import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { OrnamentoIcono, OrnamentoNodo, OrnamentoOlas, OrnamentoRuta } from "./OrnamentoNautico";
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
          izquierda, un barco chico que se mece del otro lado, oleaje y ruta
          cruzando el fondo completo, y un nodo de acento -- toda la seccion,
          no solo una esquina. */}
      <OrnamentoIcono
        motivo="timon"
        capa="principal"
        ambiente="flotar"
        duracion={7.5}
        className="-left-10 -top-6 h-36 w-36 -rotate-12 sm:-left-12 sm:h-52 sm:w-52 lg:-left-16 lg:-top-8 lg:h-72 lg:w-72"
      />
      <OrnamentoIcono
        motivo="barco"
        capa="secundario"
        ambiente="flotar"
        duracion={6}
        retraso={1.4}
        className="-right-4 bottom-6 hidden h-24 w-24 rotate-6 sm:block sm:h-32 sm:w-32 lg:right-[4%] lg:h-40 lg:w-40"
      />
      <OrnamentoRuta ambiente="derivar" duracion={12} className="left-[8%] top-[8%] hidden h-24 w-[70%] md:block lg:h-28" />
      <OrnamentoOlas ambiente="derivar" duracion={10} retraso={1} className="inset-x-0 bottom-0 h-14 opacity-80 md:h-20 lg:h-24" />
      <OrnamentoNodo className="right-[16%] top-[14%] h-3 w-3 sm:h-4 sm:w-4" retraso={0.6} />
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
