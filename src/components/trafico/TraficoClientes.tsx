import { ClientesLogos } from "@/components/marketing/ClientesLogos";
import { MarcoClientes } from "@/components/marketing/MarcoClientes";
import type { SeccionClientesMetricas } from "@/lib/trafico";

/**
 * 7 · Clientes (tipo metricsClientsBanner).
 *
 *   Título · descripción
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros        │ Logos del giro     │
 *   │ Fila de logos del giro   │ (en círculos)      │
 *   └──────────────────────────┴────────────────────┘
 *
 * El mismo marco y las mismas columnas que Clientes de Marketing Digital
 * (MarcoClientes + ClientesLogos). Desde el 2026-10-20 la derecha muestra los
 * logos del giro abierto en lugar del panel de Meta Ads de ejemplo (pedido
 * del propietario); las métricas de cada giro siguen en Sanity, sin mostrarse.
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
  const { subtitulo, titulo, descripcion, giros, rotacionAutomatica, ajusteLogos, animar } = seccion;

  return (
    <MarcoClientes id={id} nivel={nivel} subtitulo={subtitulo} titulo={titulo} descripcion={descripcion} animar={animar}>
      <ClientesLogos giros={giros} rotacion={rotacionAutomatica} animar={animar} ajuste={ajusteLogos} />
    </MarcoClientes>
  );
}
