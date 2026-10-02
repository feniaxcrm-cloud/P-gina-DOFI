import { Anim } from "@/components/marketing/Anim";
import { FilaMarquesina } from "@/components/marketing/ClientesCasos";
import {
  OrnamentoIcono,
  OrnamentoNodo,
  OrnamentoOlas,
  OrnamentoRuta,
} from "@/components/marketing/OrnamentoNautico";
import type { SeccionClientesMetricas } from "@/lib/trafico";
import { ClientesMetricas } from "./ClientesMetricas";

/**
 * 7 · Clientes (tipo metricsClientsBanner).
 *
 *   Título y descripción
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros + logos │ Panel de Meta Ads  │
 *   └──────────────────────────┴────────────────────┘
 *   Marquesina continua de clientes
 *
 * La misma composicion y los mismos fondos que Clientes de Marketing Digital;
 * donde allá va el video, acá va el panel de métricas de Meta del giro
 * abierto (ClientesMetricas): CPR, CTR, CPA, alcance, visualizaciones y
 * frecuencia, con las cifras de ese tipo de negocio, durante 30 dias.
 *
 * Sin boton al final: "Ver casos de éxito" se quito de Clientes en todas las
 * paginas (pedido del 2026-10-01). Los logos, las fotos y las empresas de
 * cada giro se cargan en el Studio, dentro del giro.
 */
export function TraficoClientes({
  seccion,
  id,
  nivel,
}: {
  seccion: SeccionClientesMetricas;
  id: string;
  nivel: "h1" | "h2";
}) {
  const { subtitulo, titulo, descripcion, giros, rotacionAutomatica, animar, clientes } = seccion;
  const Titulo = nivel;
  const filaA = clientes.filter((_, i) => i % 2 === 0);
  const filaB = clientes.filter((_, i) => i % 2 === 1);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      // overflow-clip y no hidden: hidden convierte la seccion en contenedor
      // de scroll y el panel (sticky) dejaria de acompañar la pagina.
      className="group/nautico relative overflow-clip bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)] py-20 md:py-28"
    >
      <OrnamentoRuta ambiente="derivar" duracion={12} retraso={1.5} className="right-[6%] top-[10%] hidden h-20 w-[55%] md:block lg:h-24" />
      <OrnamentoOlas ambiente="derivar" duracion={11} retraso={0.6} className="inset-x-0 bottom-0 h-12 opacity-70 md:h-16 lg:h-20" />
      <OrnamentoIcono
        motivo="velero"
        capa="principal"
        ambiente="flotar"
        duracion={7}
        className="-right-8 -top-6 h-32 w-32 rotate-6 sm:-right-10 sm:h-44 sm:w-44 lg:-right-12 lg:h-56 lg:w-56"
      />
      <OrnamentoIcono
        motivo="brujula"
        capa="secundario"
        ambiente="girar"
        duracion={100}
        className="-left-6 bottom-6 hidden h-24 w-24 md:block lg:h-32 lg:w-32"
      />
      <OrnamentoIcono
        motivo="timon"
        capa="secundario"
        ambiente="flotar"
        duracion={8}
        retraso={0.5}
        className="-left-10 -top-8 hidden h-28 w-28 rotate-[8deg] lg:block lg:h-36 lg:w-36"
      />
      <OrnamentoNodo className="left-[30%] top-[6%] h-3 w-3 sm:h-4 sm:w-4" retraso={2} />
      <OrnamentoNodo className="right-[24%] top-3 hidden h-3 w-3 sm:block" ambiente="pulsar" retraso={1} />

      <div className="relative mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar}>
          {subtitulo && (
            <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>
          )}
          <Titulo
            id={`${id}-titulo`}
            className="text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-brand"
          >
            {titulo}
          </Titulo>
          {descripcion && (
            <p className="mt-6 max-w-[760px] font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
          )}
        </Anim>

        <Anim animar={animar} delay={0.08} className="mt-12 md:mt-16">
          <ClientesMetricas giros={giros} rotacion={rotacionAutomatica} animar={animar} />
        </Anim>

        {clientes.length > 0 && (
          <Anim animar={animar} delay={0.12} className="mt-14 flex min-w-0 flex-col gap-4">
            {filaA.length > 0 && <FilaMarquesina clientes={filaA} reverso={false} />}
            {filaB.length > 0 && <FilaMarquesina clientes={filaB} reverso />}
          </Anim>
        )}
      </div>
    </section>
  );
}
