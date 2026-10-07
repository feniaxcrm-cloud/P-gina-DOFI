import { Anim } from "./Anim";
import { OrnamentoIcono, OrnamentoNodo, OrnamentoOlas, OrnamentoRuta } from "./OrnamentoNautico";

/**
 * El marco común de «Clientes y casos de éxito» en las cuatro páginas
 * (Marketing Digital, Tráfico/Ads, ChatBots/CRM y Asesorías): la sección, su
 * fondo, el título y el cuerpo de dos columnas (carrusel de giros | video,
 * panel de Meta Ads, teléfono o mazo de casos).
 *
 * UNA SOLA PANTALLA (pedido del 2026-10-07): en escritorio la sección mide
 * el alto de la ventana y TODO entra en ella -- título, carrusel, la fila de
 * logos del giro abierto y la columna derecha completa. El contenedor mide
 * exacto el alto útil (--alto-util, globals.css: la pantalla menos el header
 * y los márgenes), el título no crece y el cuerpo se queda con el resto
 * (flex-1): la tira del carrusel y la columna derecha se estiran o se
 * encogen con la pantalla, nunca la desbordan. Por debajo de 480 px de alto
 * útil deja de encoger y la sección crece (pantallas muy bajas).
 *
 * En escritorio la descripción va a la derecha del título, en la misma línea:
 * son ~45 px de alto que se ganan para el carrusel.
 *
 * SIN MARQUESINA AL FINAL: los logos ya se ven en la fila del giro abierto
 * (que se desliza sola cuando no entran), y la marquesina de abajo era lo que
 * dejaba la sección fuera de la pantalla.
 *
 * `decoracion`: el fondo propio de la página (FENIAX lleva sus ondas y la
 * nube de puntos). Sin ella, los ornamentos náuticos de DOFI.
 */
export function MarcoClientes({
  id,
  nivel,
  subtitulo,
  titulo,
  descripcion,
  animar,
  fondo = "bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)]",
  colorTitulo = "text-brand",
  etiqueta,
  decoracion,
  children,
}: {
  id: string;
  nivel: "h1" | "h2";
  subtitulo: string;
  titulo: string;
  descripcion: string;
  animar: boolean;
  fondo?: string;
  colorTitulo?: string;
  /** Cómo se pinta el subtítulo (FENIAX usa su propia etiqueta). */
  etiqueta?: (texto: string) => React.ReactNode;
  decoracion?: React.ReactNode;
  children: React.ReactNode;
}) {
  const Titulo = nivel;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      // overflow-clip y no hidden: hidden convierte la sección en contenedor
      // de scroll y rompe el sticky/las mediciones de las columnas.
      className={`group/nautico pantalla relative isolate overflow-clip ${fondo}`}
    >
      {decoracion ?? <OrnamentosClientes />}

      <div className="relative mx-auto flex w-full max-w-page flex-col px-5 sm:px-6 md:px-10 lg:h-[var(--alto-util)] lg:min-h-[480px] lg:px-12">
        <Anim animar={animar} className="shrink-0 lg:flex lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            {subtitulo &&
              (etiqueta ? (
                etiqueta(subtitulo)
              ) : (
                <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>
              ))}
            <Titulo
              id={`${id}-titulo`}
              className={`text-balance font-display text-titulo font-extrabold ${colorTitulo}`}
            >
              {titulo}
            </Titulo>
          </div>
          {descripcion && (
            <p className="mt-4 max-w-[760px] font-sans text-lg leading-relaxed text-ink-muted lg:mt-0 lg:max-w-[420px] lg:shrink-0 lg:pb-1 lg:text-right lg:text-base xl:text-lg">
              {descripcion}
            </p>
          )}
        </Anim>

        <Anim animar={animar} delay={0.08} className="mt-8 min-w-0 lg:mt-[clamp(1rem,3svh,2rem)] lg:min-h-0 lg:flex-1">
          {children}
        </Anim>
      </div>
    </section>
  );
}

/** Los ornamentos náuticos de siempre (velero, brújula, timón, ruta, oleaje y
 *  nodos), en los márgenes: nunca encima del carrusel ni de la columna. */
function OrnamentosClientes() {
  return (
    <>
      <OrnamentoRuta ambiente="derivar" duracion={12} retraso={1.5} className="right-[6%] top-[10%] hidden h-20 w-[55%] md:block lg:h-24" />
      <OrnamentoOlas ambiente="derivar" duracion={11} retraso={0.6} className="inset-x-0 bottom-0 h-12 opacity-70 md:h-16 lg:h-20" />
      <OrnamentoIcono
        motivo="velero"
        capa="principal"
        ambiente="flotar"
        duracion={7}
        className="-right-8 -top-6 h-32 w-32 rotate-6 sm:-right-10 sm:h-44 sm:w-44 lg:-right-12 lg:h-56 lg:w-56"
      />
      <OrnamentoIcono
        motivo="brujula"
        capa="secundario"
        ambiente="girar"
        duracion={100}
        className="-left-6 bottom-6 hidden h-24 w-24 md:block lg:h-32 lg:w-32"
      />
      <OrnamentoIcono
        motivo="timon"
        capa="secundario"
        ambiente="flotar"
        duracion={8}
        retraso={0.5}
        className="-left-10 -top-8 hidden h-28 w-28 rotate-[8deg] lg:block lg:h-36 lg:w-36"
      />
      <OrnamentoNodo className="left-[30%] top-[6%] h-3 w-3 sm:h-4 sm:w-4" retraso={2} />
      <OrnamentoNodo className="right-[24%] top-3 hidden h-3 w-3 sm:block" ambiente="pulsar" retraso={1} />
      <OrnamentoNodo className="left-[8%] bottom-3 hidden h-3 w-3 md:block" ambiente="pulsar" retraso={0.4} />
    </>
  );
}
