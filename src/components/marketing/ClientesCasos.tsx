import { ClientesLogos } from "./ClientesLogos";
import { MarcoClientes } from "./MarcoClientes";
import type { SeccionClientes } from "@/lib/marketing-digital";

/**
 * 5 · Clientes y casos de éxito (clientsBanner). Marketing Digital y Asesorías.
 *
 *   Título
 *   ┌──────────────────────────┬──────────────┐
 *   │ Carrusel de giros        │  ◯ ◯ ◯ ◯     │
 *   │ Fila de logos del giro   │  logos del   │
 *   └──────────────────────────┴──── giro ────┘
 *
 * TODO EN UNA PANTALLA (pedido del 2026-10-07): el marco (MarcoClientes) mide
 * el alto de la ventana, la tira del carrusel se queda con lo que dejan el
 * título y la fila de logos, y la columna derecha ocupa el alto completo.
 *
 * COLUMNA DERECHA (pedido del 2026-10-20): los logos del giro abierto en
 * círculos, con forma y tamaño elegidos en el Studio (ClientesLogos). El
 * celular con el video que iba acá se mudó a la portada de ChatBots/CRM.
 *
 * GIROS: solo los que existen en el Studio, con sus empresas y logos
 * (CarruselGiros). No hay giros de respaldo ni contenido de relleno.
 *
 * SIN BOTÓN: el "Ver casos de éxito" que cerraba la sección se quitó por
 * pedido explícito (2026-10-01), en esta página y en la de FENIAX.
 */
export function ClientesCasos({ seccion, id, nivel }: { seccion: SeccionClientes; id: string; nivel: "h1" | "h2" }) {
  const { subtitulo, titulo, descripcion, giros, rotacionAutomatica, ajusteLogos, animar } = seccion;

  return (
    <MarcoClientes id={id} nivel={nivel} subtitulo={subtitulo} titulo={titulo} descripcion={descripcion} animar={animar}>
      <ClientesLogos giros={giros} rotacion={rotacionAutomatica} animar={animar} ajuste={ajusteLogos} />
    </MarcoClientes>
  );
}
