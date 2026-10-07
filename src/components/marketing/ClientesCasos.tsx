import { CarruselGiros } from "./CarruselGiros";
import { MarcoClientes } from "./MarcoClientes";
import { VideoClientes } from "./VideoClientes";
import type { SeccionClientes } from "@/lib/marketing-digital";

/**
 * 5 · Clientes y casos de éxito (clientsBanner).
 *
 *   Título
 *   ┌──────────────────────────┬──────────────┐
 *   │ Carrusel de giros        │    Video     │
 *   │ Fila de logos del giro   │              │
 *   └──────────────────────────┴──────────────┘
 *
 * TODO EN UNA PANTALLA (pedido del 2026-10-07): el marco (MarcoClientes) mide
 * el alto de la ventana, la tira del carrusel se queda con lo que dejan el
 * título y la fila de logos, y el video ocupa el alto completo de su columna.
 * Antes el video se estiraba hasta el alto de la grilla de logos (5 filas en
 * Construcción) y se veía cortado a la mitad.
 *
 * DOS COLUMNAS REALES desde escritorio (lg): carrusel ~55% y video ~45%. En
 * telefono y tablet se apilan: carrusel, logos, video. Ninguna se oculta por
 * falta de datos: cada una tiene su estado vacío discreto.
 *
 * GIROS: solo los que existen en el Studio, con sus empresas y logos
 * (CarruselGiros). No hay giros de respaldo ni contenido de relleno.
 *
 * VIDEO: archivo, ajuste y portada desde el Studio (VideoClientes).
 *
 * SIN BOTÓN: el "Ver casos de éxito" que cerraba la sección se quitó por
 * pedido explícito (2026-10-01), en esta página y en la de FENIAX.
 */
export function ClientesCasos({ seccion, id, nivel }: { seccion: SeccionClientes; id: string; nivel: "h1" | "h2" }) {
  const { imagen, subtitulo, titulo, descripcion, giros, rotacionAutomatica, video, animar } = seccion;

  return (
    <MarcoClientes id={id} nivel={nivel} subtitulo={subtitulo} titulo={titulo} descripcion={descripcion} animar={animar}>
      {/* 11fr / 9fr = 55% carrusel, 45% video. */}
      <div className="grid grid-cols-1 gap-10 lg:h-full lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-10">
        <div className="min-w-0 lg:h-full lg:min-h-0">
          <CarruselGiros giros={giros} rotacion={rotacionAutomatica} animar={animar} />
        </div>
        <div className="min-w-0 lg:h-full lg:min-h-0">
          <VideoClientes video={video} portada={imagen} titulo={titulo} />
        </div>
      </div>
    </MarcoClientes>
  );
}
