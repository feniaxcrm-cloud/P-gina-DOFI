import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { CarruselGiros } from "./CarruselGiros";
import { VideoClientes } from "./VideoClientes";
import type { ClienteMarquesina, FormatoVideo, SeccionClientes } from "@/lib/marketing-digital";

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
 * GIROS: cada giro es un panel del carrusel (CarruselGiros, reproduce el
 * video de referencia) con sus propias empresas, todo desde el Studio.
 *
 * VIDEO: archivo, formato y portada desde el Studio (VideoClientes). Sin
 * video, el carrusel ocupa todo el ancho: nunca un recuadro vacio.
 *
 * MARQUESINA Y BOTON: sin cambios pedidos. FilaMarquesina, sus clases, su
 * velocidad, sus sentidos y el boton quedan exactamente como estaban.
 * Muestra las Cuentas activas (tipo "cuenta", el mismo de /clientes) con sus
 * logos originales, sin filtros; sin logo, el nombre real. Se pausa con el
 * cursor y, con movimiento reducido, pasa a desplazamiento manual
 * (.wall-track / .wall-viewport en globals.css).
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
              <div className="flex h-20 min-w-[168px] items-center justify-center rounded-2xl border border-brand/10 bg-white px-6 shadow-[0_10px_26px_-16px_rgba(26,15,61,0.3)]">
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.logo}
                    alt={esCopia ? "" : c.nombre}
                    loading="lazy"
                    decoding="async"
                    className="max-h-11 w-auto max-w-[140px] object-contain"
                  />
                ) : (
                  <span className="whitespace-nowrap font-display text-[15px] font-semibold tracking-tight text-ink">
                    {c.nombre}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Columnas en escritorio segun el formato del video. Vertical: columna fija
 *  angosta y el marco se estira al alto del carrusel. Cuadrado y horizontal:
 *  columna proporcional y el video centrado en alto, con su proporcion.
 *  Clases literales para que Tailwind las vea al compilar. */
const COLUMNAS: Record<FormatoVideo, string> = {
  vertical: "lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]",
  cuadrado: "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]",
  horizontal: "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]",
};
const CELDA_VIDEO: Record<FormatoVideo, string> = {
  vertical: "lg:h-full",
  cuadrado: "lg:self-center",
  horizontal: "lg:self-center",
};

export function ClientesCasos({ seccion, id, nivel }: { seccion: SeccionClientes; id: string; nivel: "h1" | "h2" }) {
  const { imagen, subtitulo, titulo, descripcion, giros, rotacionAutomatica, video, cta, animar, clientes } = seccion;
  const Titulo = nivel;
  const filaA = clientes.filter((_, i) => i % 2 === 0);
  const filaB = clientes.filter((_, i) => i % 2 === 1);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)] py-20 md:py-28"
    >
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

        {(giros.length > 0 || video) && (
          <div className={`mt-12 grid grid-cols-1 gap-10 md:mt-16 ${video ? COLUMNAS[video.formato] : ""}`}>
            {giros.length > 0 && (
              <Anim animar={animar} delay={0.08} className="min-w-0">
                <CarruselGiros giros={giros} rotacion={rotacionAutomatica} animar={animar} />
              </Anim>
            )}
            {video && (
              <Anim animar={animar} delay={0.16} className={`min-w-0 ${CELDA_VIDEO[video.formato]}`}>
                <VideoClientes
                  url={video.url}
                  formato={video.formato}
                  sonido={video.sonido}
                  portada={imagen}
                  titulo={titulo}
                />
              </Anim>
            )}
          </div>
        )}

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
