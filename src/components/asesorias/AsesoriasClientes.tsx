import { MarcoClientes } from "@/components/marketing/MarcoClientes";
import type { SeccionCasos } from "@/lib/asesorias";
import { CasosGiros } from "./CasosGiros";

/**
 * Clientes y casos de éxito (tipo casesClientsBanner).
 *
 *   Título
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros        │ Mazo de casos      │
 *   │ Fila de logos del giro   │                    │
 *   └──────────────────────────┴────────────────────┘
 *
 * El mismo marco que Clientes de Marketing Digital y Tráfico (MarcoClientes:
 * entra entero en una pantalla): donde allá va el video, acá va el mazo de
 * casos, y el panel abierto del carrusel muestra la imagen del caso al frente
 * (CasosGiros).
 */
export function AsesoriasClientes({ seccion, id, nivel }: { seccion: SeccionCasos; id: string; nivel: "h1" | "h2" }) {
  const { subtitulo, titulo, descripcion, giros, casos, pasoAutomatico, segundosPorCaso, animar } = seccion;

  return (
    <MarcoClientes id={id} nivel={nivel} subtitulo={subtitulo} titulo={titulo} descripcion={descripcion} animar={animar}>
      <CasosGiros
        giros={giros}
        casos={casos}
        pasoAutomatico={pasoAutomatico}
        segundosPorCaso={segundosPorCaso}
        animar={animar}
      />
    </MarcoClientes>
  );
}
