import {
  Buildings,
  Cpu,
  ForkKnife,
  Handshake,
  Heartbeat,
  RocketLaunch,
  Sparkle,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import type {
  ClienteMarquesina,
  ClientesData,
  IconoCategoria,
  MultimediaData,
} from "@/lib/marketing-digital";

/**
 * 5 · Clientes y casos de éxito.
 *
 * IZQUIERDA: marquesina de clientes en dos filas que corren en sentidos
 * opuestos. Salen del tipo "cuenta" de Sanity (el mismo de /clientes), solo
 * las activas.
 *
 * LOGOS: se muestran con sus colores ORIGINALES -- sin escala de grises,
 * sin opacidad, sin filtros, como pide el brief. Mientras una cuenta no
 * tenga logo subido se muestra su nombre: hoy ninguna de las 26 lo tiene, y
 * mostrar monogramas o logos inventados seria peor que el nombre real.
 *
 * DERECHA: zona multimedia (video, imagen, testimonio, texto) cargada en el
 * Studio. Si esta vacia no se pinta un recuadro de "proximamente": la
 * marquesina ocupa todo el ancho.
 *
 * CATEGORIAS: son iconos visuales de los rubros que atiende DOFI, no una
 * clasificacion de cada cliente (pedido explicito). Por eso viven en la
 * pagina y no en cada cuenta.
 *
 * MOVIMIENTO: la marquesina es la unica animacion continua de la pagina, y
 * esta pedida. Se pausa con el cursor encima y, con movimiento reducido,
 * pasa a desplazamiento manual (reglas .wall-track / .wall-viewport de
 * globals.css, las mismas del muro de la home).
 */

const ICONOS: Record<IconoCategoria, typeof Buildings> = {
  construccion: Buildings,
  belleza: Sparkle,
  servicios: Handshake,
  comercio: Storefront,
  emprendedores: RocketLaunch,
  salud: Heartbeat,
  gastronomia: ForkKnife,
  tecnologia: Cpu,
};

/** Ancho medio de un elemento (tile 168px + separacion 16px) y velocidad
 *  sobria para una franja de confianza. La duracion se calcula con estos
 *  dos numeros para que la velocidad real no cambie con la cantidad. */
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

function tieneMultimedia(m: MultimediaData) {
  return Boolean(m.videoUrl || m.imagen || m.testimonio || m.texto);
}

function Multimedia({ m }: { m: MultimediaData }) {
  const mostrarVideo = m.tipo === "video" && m.videoUrl;
  const mostrarImagen = !mostrarVideo && m.imagen;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-abyss text-foam shadow-[0_30px_60px_-30px_rgba(18,10,38,0.6)]">
      {mostrarVideo && (
        // Sin autoplay a proposito: un video que arranca solo es movimiento
        // que nadie pidio. Se reproduce cuando el visitante lo decide.
        <video
          controls
          playsInline
          preload="metadata"
          poster={m.poster?.url}
          className="aspect-video w-full bg-black object-cover"
          src={m.videoUrl ?? undefined}
        />
      )}
      {mostrarImagen && m.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.imagen.url}
          alt={m.imagen.alt}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col gap-5 p-7 md:p-8">
        {m.cuenta && (
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foam/85">
            {m.cuenta.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.cuenta.logo} alt="" className="h-4 w-auto" />
            )}
            {m.cuenta.nombre}
          </p>
        )}
        {m.testimonio && (
          <figure>
            <blockquote className="font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl">
              “{m.testimonio.cita}”
            </blockquote>
            <figcaption className="mt-4 font-sans text-sm text-mist">
              <span className="font-semibold text-foam">{m.testimonio.autor}</span>
              {m.testimonio.cargo && <> · {m.testimonio.cargo}</>}
            </figcaption>
          </figure>
        )}
        {m.texto && <p className="font-sans text-base leading-relaxed text-foam/80">{m.texto}</p>}
      </div>
    </div>
  );
}

export function ClientesCasos({ data }: { data: ClientesData }) {
  const { titulo, descripcion, categorias, multimedia, cta, animar, clientes } = data;
  const filaA = clientes.filter((_, i) => i % 2 === 0);
  const filaB = clientes.filter((_, i) => i % 2 === 1);
  const conMultimedia = tieneMultimedia(multimedia);

  return (
    <section
      id="clientes"
      aria-labelledby="clientes-titulo"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <Anim animar={animar} className="max-w-[760px]">
          <h2
            id="clientes-titulo"
            className="text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </h2>
          {descripcion && (
            <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
          )}
        </Anim>

        {categorias.length > 0 && (
          <Anim animar={animar} delay={0.08}>
            <ul aria-label="Rubros" className="mt-9 flex flex-wrap gap-3">
              {categorias.map((c) => {
                const Icono = ICONOS[c.icono];
                return (
                  <li
                    key={c.nombre}
                    className="inline-flex items-center gap-3 rounded-full border border-brand/12 bg-white py-2 pl-2 pr-5 shadow-[0_8px_20px_-14px_rgba(26,15,61,0.3)]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icono size={18} weight="duotone" aria-hidden="true" />
                    </span>
                    <span className="font-display text-sm font-semibold text-ink">{c.nombre}</span>
                  </li>
                );
              })}
            </ul>
          </Anim>
        )}

        {/* grid-cols-1 + min-w-0 NO son decorativos. La tira de la marquesina
            mide miles de px a proposito (w-max), y un item de grid sin
            min-w-0 se estira hasta el ancho minimo de su contenido. Medido:
            la ventana de la marquesina llegaba a 5138px en un telefono de
            390px -- el overflow-hidden de la seccion lo tapaba, asi que la
            pagina no desbordaba, pero el <Reveal> nunca se disparaba (entraba
            en pantalla el 7,6% de su area, contra el 25% que exige) y en
            mobile la marquesina quedaba invisible. */}
        <div className={`mt-12 grid grid-cols-1 gap-8 ${conMultimedia ? "lg:grid-cols-12 lg:gap-10" : ""}`}>
          {clientes.length > 0 && (
            <Anim
              animar={animar}
              delay={0.12}
              className={`flex min-w-0 flex-col justify-center gap-4 ${conMultimedia ? "lg:col-span-7" : ""}`}
            >
              {filaA.length > 0 && <FilaMarquesina clientes={filaA} reverso={false} />}
              {filaB.length > 0 && <FilaMarquesina clientes={filaB} reverso />}
            </Anim>
          )}

          {conMultimedia && (
            <Anim animar={animar} delay={0.18} className="min-w-0 lg:col-span-5">
              <Multimedia m={multimedia} />
            </Anim>
          )}
        </div>

        {cta && (
          <Anim animar={animar} className="mt-12">
            <BotonCta texto={cta.texto} enlace={cta.enlace} />
          </Anim>
        )}
      </div>
    </section>
  );
}
