import { MarcoClientes } from "@/components/marketing/MarcoClientes";
import type { SeccionClientesMetricas } from "@/lib/trafico";
import { ClientesMetricas } from "./ClientesMetricas";

/**
 * 7 · Clientes (tipo metricsClientsBanner).
 *
 *   Título · descripción
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros        │ Panel de Meta Ads  │
 *   │ Fila de logos del giro   │                    │
 *   └──────────────────────────┴────────────────────┘
 *
 * El mismo marco que Clientes de Marketing Digital (MarcoClientes: entra
 * entero en una pantalla); donde allá va el video, acá va el panel de
 * métricas de Meta del giro abierto (ClientesMetricas): CPR, CTR, CPA,
 * alcance, visualizaciones y frecuencia, con las cifras de ese tipo de
 * negocio, durante 30 días.
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
  const { subtitulo, titulo, descripcion, giros, rotacionAutomatica, animar } = seccion;

  return (
    <MarcoClientes id={id} nivel={nivel} subtitulo={subtitulo} titulo={titulo} descripcion={descripcion} animar={animar}>
      <ClientesMetricas giros={giros} rotacion={rotacionAutomatica} animar={animar} />
    </MarcoClientes>
  );
}
