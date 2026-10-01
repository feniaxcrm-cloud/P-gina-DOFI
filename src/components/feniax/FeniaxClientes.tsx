import { Anim } from "@/components/marketing/Anim";
import { FilaMarquesina } from "@/components/marketing/ClientesCasos";
import type { SeccionClientesChat } from "@/lib/feniax";
import { ClientesWhatsApp } from "./ClientesWhatsApp";
import { OndasFeniax } from "./OndasFeniax";
import { Etiqueta, Puntos } from "./piezas";

/**
 * 5 · Clientes (tipo chatClientsBanner).
 *
 *   Título
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros + logos │ Demo de WhatsApp   │
 *   └──────────────────────────┴────────────────────┘
 *   Marquesina de logos
 *
 * Sin botón al final: "Ver casos de éxito" se quitó de Clientes en todas las
 * páginas (pedido del 2026-10-01).
 *
 * La misma composición que Clientes de Marketing Digital; donde allá va el
 * video, acá va el teléfono con la IA atendiendo a un cliente del giro
 * abierto (ver ClientesWhatsApp.tsx y src/lib/chat-demo.ts).
 */
export function FeniaxClientes({
  seccion,
  id,
  nivel,
}: {
  seccion: SeccionClientesChat;
  id: string;
  nivel: "h1" | "h2";
}) {
  const { subtitulo, titulo, descripcion, giros, rotacionAutomatica, temaChat, animar, clientes } = seccion;
  const Titulo = nivel;
  const filaA = clientes.filter((_, i) => i % 2 === 0);
  const filaB = clientes.filter((_, i) => i % 2 === 1);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="relative isolate overflow-clip bg-[linear-gradient(180deg,#FCFAFD_0%,#F5ECF7_100%)] py-20 md:py-28"
    >
      <OndasFeniax idGradiente="ondas-clientes" className="inset-x-0 bottom-0 -z-10 h-32 md:h-44" amplitud={50} opacidad={0.25} duracion={58} />
      <Puntos className="-right-24 -top-16 -z-10 h-[340px] w-[440px] opacity-50" />

      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar}>
          {subtitulo && <Etiqueta>{subtitulo}</Etiqueta>}
          <Titulo
            id={`${id}-titulo`}
            className="text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </Titulo>
          {descripcion && (
            <p className="mt-6 max-w-[760px] font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
          )}
        </Anim>

        <Anim animar={animar} delay={0.08} className="mt-12 md:mt-16">
          <ClientesWhatsApp giros={giros} rotacion={rotacionAutomatica} tema={temaChat} animar={animar} />
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
