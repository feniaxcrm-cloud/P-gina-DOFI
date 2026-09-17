import { ArrowUpRight, GoogleLogo } from "@phosphor-icons/react/dist/ssr";
import { Anim } from "./Anim";
import {
  OrnamentoDelfin,
  OrnamentoIcono,
  OrnamentoMarca,
  OrnamentoNodo,
  OrnamentoOlas,
  OrnamentoRuta,
} from "./OrnamentoNautico";
import { ResenasCarrusel } from "./ResenasCarrusel";
import type { SeccionResenas } from "@/lib/marketing-digital";

/**
 * 6 · Reseñas de Google (reviewsBanner).
 *
 * SIEMPRE TARJETAS, NUNCA UN BOTÓN: ya no existe ningún botón "Ver reseñas
 * en Google" -- ni oculto ni con espacio reservado. `seccion.resenas` llega
 * YA resuelta desde src/lib/marketing-digital.ts con la prioridad real de
 * Google primero, Sanity como respaldo (ver ese archivo y
 * src/lib/google-places.ts): este componente no sabe ni le importa de cuál
 * de las dos vino, solo pinta lo que recibe.
 *
 * El enlace "Ver todas en Google" que queda arriba a la derecha es otra
 * cosa: un enlace liviano de texto hacia la ficha completa (Google limita a
 * 5 reseñas por consulta, y las de Sanity pueden ser menos que el total
 * real), no una invitación a leer las reseñas "en otro lado" porque acá no
 * haya ninguna.
 *
 * VACÍO DE VERDAD (ninguna fuente tiene reseñas): un mensaje minimo, sin
 * tarjeta ni botón -- no fingir contenido que no existe.
 */
export function ResenasGoogle({ seccion, id, nivel }: { seccion: SeccionResenas; id: string; nivel: "h1" | "h2" }) {
  const { subtitulo, titulo, descripcion, enlaceGoogle, animar, resenas, autoplay, velocidadAutoplay } = seccion;
  const Titulo = nivel;
  const hayResenas = resenas.length > 0;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="group/nautico relative overflow-hidden bg-canvas py-20 md:py-28"
    >
      {/* Cierre de la pagina, con las tarjetas de reseñas como protagonistas:
          una ruta cruzando la franja superior y el oleaje cerrando abajo
          (lineas primero, quedan "atras"), despues el ancla arriba a la
          derecha, un timon entrando desde el borde izquierdo arriba, un
          delfin abajo a la izquierda, una brujula chica abajo a la derecha,
          el trazo del isotipo como acento y varios nodos sueltos -- todo en
          los margenes exteriores, el area de las tarjetas queda libre. */}
      <OrnamentoRuta ambiente="derivar" duracion={11} className="left-[10%] top-[6%] hidden h-20 w-[60%] md:block lg:h-24" />
      <OrnamentoOlas ambiente="derivar" duracion={10.5} className="inset-x-0 bottom-0 h-14 opacity-90 md:h-20 lg:h-24" />
      <OrnamentoIcono
        motivo="ancla"
        capa="principal"
        ambiente="flotar"
        duracion={7.5}
        className="-right-6 -top-6 h-32 w-32 rotate-6 sm:-right-8 sm:h-44 sm:w-44 lg:h-56 lg:w-56"
      />
      <OrnamentoIcono
        motivo="timon"
        capa="secundario"
        ambiente="girar"
        duracion={95}
        className="-left-10 top-10 hidden h-24 w-24 -rotate-6 sm:block sm:h-32 sm:w-32 lg:h-40 lg:w-40"
      />
      <OrnamentoDelfin
        capa="secundario"
        ambiente="flotar"
        duracion={9}
        retraso={0.8}
        className="-left-8 bottom-8 hidden h-24 w-24 -scale-x-100 sm:block sm:h-32 sm:w-32 lg:h-40 lg:w-40"
      />
      <OrnamentoIcono
        motivo="brujula"
        capa="secundario"
        ambiente="pulsar"
        duracion={5}
        className="-right-4 bottom-14 hidden h-16 w-16 sm:block lg:h-20 lg:w-20"
      />
      <OrnamentoMarca ambiente="flotar" duracion={8.5} retraso={1.6} className="right-[10%] top-[8%] hidden h-10 w-10 md:block lg:h-14 lg:w-14" />
      <OrnamentoNodo className="left-[42%] top-[16%] h-3 w-3 sm:h-4 sm:w-4" retraso={1} />
      <OrnamentoNodo className="left-[22%] top-3 hidden h-3 w-3 sm:block" ambiente="pulsar" retraso={2.2} />
      <OrnamentoNodo className="right-[36%] bottom-4 hidden h-3 w-3 md:block" ambiente="pulsar" retraso={0.4} />
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Anim animar={animar} className="max-w-[720px]">
            <p className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              <GoogleLogo size={16} weight="bold" aria-hidden="true" className="text-brand" />
              {subtitulo || "Google"}
            </p>
            <Titulo
              id={`${id}-titulo`}
              className="mt-4 text-balance font-display text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink"
            >
              {titulo}
            </Titulo>
            {descripcion && (
              <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{descripcion}</p>
            )}
          </Anim>

          {hayResenas && enlaceGoogle && (
            <Anim animar={animar} delay={0.08}>
              <a
                href={enlaceGoogle}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand transition-colors duration-300 hover:text-accent"
              >
                Ver todas en Google
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Anim>
          )}
        </div>

        {hayResenas ? (
          <ResenasCarrusel resenas={resenas} animar={animar} autoplay={autoplay} velocidadSegundos={velocidadAutoplay} />
        ) : (
          <Anim animar={animar} delay={0.1} className="mt-12">
            <p className="max-w-[560px] font-sans text-lg leading-relaxed text-ink-muted">
              Muy pronto vas a poder leer aquí las reseñas reales de quienes ya trabajaron con nosotros.
            </p>
          </Anim>
        )}
      </div>
    </section>
  );
}
