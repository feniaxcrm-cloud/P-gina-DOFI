import { ClientesLogos } from "@/components/marketing/ClientesLogos";
import { MarcoClientes } from "@/components/marketing/MarcoClientes";
import type { SeccionClientesChat } from "@/lib/feniax";
import { OndasFeniax } from "./OndasFeniax";
import { Etiqueta, Puntos } from "./piezas";

/**
 * 5 · Clientes (tipo chatClientsBanner).
 *
 *   Título · descripción
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros        │ Logos del giro     │
 *   │ Fila de logos del giro   │ (en círculos)      │
 *   └──────────────────────────┴────────────────────┘
 *
 * Sin botón al final: "Ver casos de éxito" se quitó de Clientes en todas las
 * páginas (pedido del 2026-10-01).
 *
 * El mismo marco y las mismas columnas que Clientes de Marketing Digital
 * (MarcoClientes + ClientesLogos), con el fondo de FENIAX. Desde el
 * 2026-10-20 la derecha muestra los logos del giro abierto en lugar del
 * teléfono con la demo de WhatsApp (la portada lleva ahora el celular con el
 * video); las conversaciones por giro siguen en Sanity, sin mostrarse.
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
  const { subtitulo, titulo, descripcion, giros, rotacionAutomatica, ajusteLogos, animar } = seccion;

  return (
    <MarcoClientes
      id={id}
      nivel={nivel}
      subtitulo={subtitulo}
      titulo={titulo}
      descripcion={descripcion}
      animar={animar}
      fondo="bg-[linear-gradient(180deg,#FCFAFD_0%,#F5ECF7_100%)]"
      colorTitulo="text-ink"
      etiqueta={(texto) => <Etiqueta>{texto}</Etiqueta>}
      decoracion={
        <>
          <OndasFeniax idGradiente="ondas-clientes" className="inset-x-0 bottom-0 -z-10 h-32 md:h-44" amplitud={50} opacidad={0.25} duracion={58} />
          <Puntos className="-right-24 -top-16 -z-10 h-[340px] w-[440px] opacity-50" />
        </>
      }
    >
      <ClientesLogos giros={giros} rotacion={rotacionAutomatica} animar={animar} ajuste={ajusteLogos} />
    </MarcoClientes>
  );
}
