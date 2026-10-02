import { Anim } from "@/components/marketing/Anim";
import {
  OrnamentoIcono,
  OrnamentoNodo,
  OrnamentoOlas,
  OrnamentoRuta,
} from "@/components/marketing/OrnamentoNautico";
import type { SeccionPlataformas } from "@/lib/trafico";
import { IconoPlataforma } from "./IconoPlataforma";

/**
 * 5 · ¿Dónde traficamos? (tipo platformsBanner).
 *
 * "El tráfico no tiene un solo destino": una tarjeta por plataforma (Meta,
 * TikTok, Google, tráfico web...) con su marca, la frase que la resume y lo
 * que hacemos en ella. Las plataformas se agregan, quitan y reordenan en el
 * Studio; cada una elige su icono de una lista.
 *
 * Mismo lenguaje que el resto de las secciones claras de DOFI: lienzo
 * calido, tinta morada y los ornamentos nauticos repartidos por los margenes
 * (una ruta cruzando arriba, oleaje abajo, velero y brujula en las
 * esquinas): nunca encima de las tarjetas.
 */
export function TraficoPlataformas({ seccion, id, nivel }: { seccion: SeccionPlataformas; id: string; nivel: "h1" | "h2" }) {
  const { subtitulo, titulo, descripcion, plataformas, animar } = seccion;
  const Titulo = nivel;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="group/nautico relative overflow-hidden bg-[linear-gradient(180deg,#F6F1FC_0%,#FDFBF7_100%)] py-20 md:py-28"
    >
      <OrnamentoRuta ambiente="derivar" duracion={12} className="left-[8%] top-[5%] hidden h-20 w-[60%] md:block lg:h-24" />
      <OrnamentoOlas ambiente="derivar" duracion={10.5} retraso={0.8} className="inset-x-0 bottom-0 h-12 opacity-80 md:h-16 lg:h-20" />
      <OrnamentoIcono
        motivo="velero"
        capa="principal"
        ambiente="flotar"
        duracion={7.5}
        className="-right-8 -top-6 h-32 w-32 rotate-6 sm:-right-10 sm:h-44 sm:w-44 lg:-right-12 lg:h-56 lg:w-56"
      />
      <OrnamentoIcono
        motivo="brujula"
        capa="secundario"
        ambiente="girar"
        duracion={95}
        className="-bottom-8 -left-6 hidden h-24 w-24 md:block lg:h-32 lg:w-32"
      />
      <OrnamentoNodo className="left-[34%] top-[8%] h-3 w-3 sm:h-4 sm:w-4" retraso={1.4} />
      <OrnamentoNodo className="right-[30%] bottom-4 hidden h-3 w-3 md:block" ambiente="pulsar" retraso={0.5} />

      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar} className="max-w-[760px]">
          {subtitulo && (
            <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>
          )}
          <Titulo
            id={`${id}-titulo`}
            className="text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </Titulo>
          {descripcion && (
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
          )}
        </Anim>

        {plataformas.length > 0 && (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-14 xl:grid-cols-4">
            {plataformas.map((p, i) => (
              <li key={p.key} className="min-w-0">
                <Anim animar={animar} delay={0.06 + i * 0.07} y={20} className="h-full">
                  <article className="relative flex h-full flex-col rounded-[28px] border border-brand/10 bg-white p-7 shadow-[0_24px_48px_-32px_rgba(26,15,61,0.45)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_32px_56px_-30px_rgba(75,42,147,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span
                      aria-hidden="true"
                      className="absolute right-6 top-6 font-display text-sm font-bold tracking-[0.1em] text-brand/35"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <IconoPlataforma icono={p.icono} />
                    <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-ink">{p.nombre}</h3>
                    {p.etiqueta && (
                      <p className="mt-2 font-display text-base font-semibold leading-snug text-brand">{p.etiqueta}</p>
                    )}
                    {p.descripcion && (
                      <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-muted">{p.descripcion}</p>
                    )}
                  </article>
                </Anim>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
