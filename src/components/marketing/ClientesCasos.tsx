import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { CarruselGiros } from "./CarruselGiros";
import { OrnamentoIcono } from "./OrnamentoNautico";
import { VideoClientes } from "./VideoClientes";
import type { ClienteMarquesina, SeccionClientes } from "@/lib/marketing-digital";

/**
 * 5 · Clientes y casos de éxito (clientsBanner).
 *
 *   Título (una línea en escritorio, morado DOFI)
 *   ┌──────────────────────────┬──────────────┐
 *   │ Carrusel de giros + logos │    Video     │
 *   └──────────────────────────┴──────────────┘
 *   Marquesina continua de clientes (la de siempre)
 *   Botón (el de siempre)
 *
 * DOS COLUMNAS REALES, SIEMPRE: carrusel ~55% y video ~45% desde tablet
 * (en telefono se apilan: carrusel, logos, video). Ninguna de las dos se
 * oculta por falta de datos: cada una tiene su estado vacio discreto, asi el
 * carrusel nunca se estira a todo el ancho (con la columna al 55% el panel
 * abierto tiene la misma proporcion que en el video de referencia).
 *
 * GIROS: solo los que existen en el Studio, con sus empresas y logos
 * (CarruselGiros). No hay giros de respaldo ni contenido de relleno.
 *
 * VIDEO: archivo, ajuste y portada desde el Studio (VideoClientes).
 *
 * MARQUESINA: mismo componente, mismas clases, misma velocidad y mismos
 * sentidos que siempre -- lo unico que cambia es de donde saca los datos.
 * Antes mostraba TODAS las Cuentas activas (con su nombre como texto cuando
 * no tenian logo, que era casi siempre). Ahora reutiliza los logos que YA
 * estan cargados en los giros de arriba (logosDeGiros(), en
 * marketing-digital.ts): solo empresas CON logo real, nunca su nombre como
 * sustituto. Se pausa con el cursor y, con movimiento reducido, pasa a
 * desplazamiento manual (.wall-track / .wall-viewport en globals.css).
 *
 * BOTON: sin cambios.
 */

/** Ancho medio de un elemento (tile 168px + separacion 16px) y velocidad
 *  sobria. La duracion sale de estos dos numeros, asi la velocidad real no
 *  cambia con la cantidad de clientes. */
const ANCHO_ELEMENTO = 184;
const PX_POR_SEGUNDO = 38;

function FilaMarquesina({ clientes, reverso }: { clientes: ClienteMarquesina[]; reverso: boolean }) {
  const duracion = `${Math.max(18, Math.round((clientes.length * ANCHO_ELEMENTO) / PX_POR_SEGUNDO))}s`;
  const tira = [...clientes, ...clientes];

  return (
    <div className="wall-viewport mascara-bordes">
      <ul
        className={`wall-track flex w-max items-center gap-4 py-2 ${reverso ? "wall-track--reverse" : ""}`}
        style={{ animationDuration: duracion }}
      >
        {tira.map((c, i) => {
          // Solo la primera copia existe para el lector de pantalla.
          const esCopia = i >= clientes.length;
          return (
            <li key={`${c.slug || c.nombre}-${i}`} aria-hidden={esCopia || undefined} className="shrink-0">
              {/* Solo el logo: nunca el nombre como sustituto (regla explicita
                  del brief). Todas las fichas de aca ya tienen logo real,
                  cargado en el Studio dentro de un giro de negocio. */}
              <div className="flex h-20 min-w-[168px] items-center justify-center rounded-2xl border border-brand/10 bg-white px-6 shadow-[0_10px_26px_-16px_rgba(26,15,61,0.3)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={esCopia ? "" : c.nombre}
                  loading="lazy"
                  decoding="async"
                  className="max-h-11 w-auto max-w-[140px] object-contain"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ClientesCasos({ seccion, id, nivel }: { seccion: SeccionClientes; id: string; nivel: "h1" | "h2" }) {
  const { imagen, subtitulo, titulo, descripcion, giros, rotacionAutomatica, video, cta, animar, clientes } = seccion;
  const Titulo = nivel;
  const filaA = clientes.filter((_, i) => i % 2 === 0);
  const filaB = clientes.filter((_, i) => i % 2 === 1);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="group/nautico relative overflow-hidden bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)] py-20 md:py-28"
    >
      {/* Velero arriba (sobre fondo liso, antes del carrusel) y una brujula
          chica abajo, cerca del boton: los dos siempre sobre fondo plano,
          nunca detras del carrusel ni del video (que ya tienen su propio
          fondo opaco). */}
      <OrnamentoIcono
        motivo="velero"
        className="-right-6 top-0 h-24 w-24 rotate-6 text-brand/[0.08] sm:-right-8 sm:h-36 sm:w-36 lg:-right-10 lg:h-44 lg:w-44"
      />
      <OrnamentoIcono
        motivo="brujula"
        deriva="asentar"
        className="-left-4 bottom-10 hidden h-20 w-20 -rotate-6 text-accent/[0.14] md:block lg:h-28 lg:w-28"
      />
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar}>
          {subtitulo && (
            <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>
          )}
          {/* Sin ancho maximo: "Clientes y casos de éxito" entra en una linea
              desde tablet; en telefono se parte en dos, balanceado. */}
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

        {/* 11fr / 9fr = 55% carrusel, 45% video. */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:gap-8 lg:gap-10">
          <Anim animar={animar} delay={0.08} className="min-w-0">
            <CarruselGiros giros={giros} rotacion={rotacionAutomatica} animar={animar} />
          </Anim>
          <Anim animar={animar} delay={0.16} className="min-w-0 md:h-full">
            <VideoClientes video={video} portada={imagen} titulo={titulo} />
          </Anim>
        </div>

        {clientes.length > 0 && (
          <Anim animar={animar} delay={0.12} className="mt-12 flex min-w-0 flex-col gap-4">
            {filaA.length > 0 && <FilaMarquesina clientes={filaA} reverso={false} />}
            {filaB.length > 0 && <FilaMarquesina clientes={filaB} reverso />}
          </Anim>
        )}

        {cta && (
          <Anim animar={animar} className="mt-12 lg:mt-10">
            <BotonCta texto={cta.texto} enlace={cta.enlace} />
          </Anim>
        )}
      </div>
    </section>
  );
}
