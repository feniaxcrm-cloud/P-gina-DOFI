import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { PiezaCompleta } from "./PiezaCompleta";
import type { PiezaGraficaData } from "@/lib/marketing-digital";

/**
 * Seccion construida alrededor de una pieza grafica TERMINADA (2 · ¿Qué es
 * DOFI? y 3 · ¿Cómo navegamos contigo?).
 *
 * CON PIEZA CARGADA
 * -----------------------------------------------------------------
 * Se muestra la pieza completa, sin recortar ni superponerle nada (ver
 * PiezaCompleta). Su texto -- que ya esta dibujado dentro de la imagen --
 * no se repite en pantalla: pasa al `alt` y a un titulo solo para lectores
 * de pantalla. Asi buscadores y lectores lo tienen, y nadie lo lee dos veces.
 * El "texto adicional" y el boton van debajo de la pieza: son contenido que
 * la imagen no trae.
 *
 * SIN PIEZA TODAVIA
 * -----------------------------------------------------------------
 * Esos mismos textos se muestran en HTML con un diseño propio, y el texto
 * adicional se integra en la misma columna (como un parrafo mas) en vez de
 * quedar suelto debajo con otra alineacion. La pagina se ve terminada hoy, y
 * el dia que se sube la pieza en el Studio la reemplaza sola.
 */
export function PiezaGrafica({
  data,
  id,
  invertido = false,
}: {
  data: PiezaGraficaData;
  id: string;
  /** Titulo a la derecha en escritorio, para que dos secciones seguidas no
   *  repitan la misma composicion. */
  invertido?: boolean;
}) {
  const { imagen, imagenMovil, titulo, texto, destacado, textoAdicional, cta, animar } = data;
  const parrafos = texto
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const altPieza = imagen?.alt || [texto, destacado].filter(Boolean).join(" ");
  const idTitulo = `${id}-titulo`;

  if (!imagen) {
    return (
      <section id={id} aria-labelledby={idTitulo} className="relative overflow-hidden bg-canvas">
        <VersionTexto
          idTitulo={idTitulo}
          titulo={titulo}
          parrafos={textoAdicional ? [...parrafos, textoAdicional] : parrafos}
          destacado={destacado}
          cta={cta}
          invertido={invertido}
          animar={animar}
        />
      </section>
    );
  }

  return (
    <section id={id} aria-labelledby={idTitulo} className="relative overflow-hidden bg-canvas">
      <h2 id={idTitulo} className="sr-only">
        {titulo}
      </h2>
      <Anim animar={animar} y={20}>
        <PiezaCompleta imagen={imagen} imagenMovil={imagenMovil} alt={altPieza} />
      </Anim>

      {(textoAdicional || cta) && (
        <div className="relative mx-auto max-w-page px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-12">
          <Anim animar={animar} className="mx-auto flex max-w-[780px] flex-col items-center text-center">
            {textoAdicional && (
              <p className="font-sans text-lg leading-relaxed text-ink-muted md:text-xl">{textoAdicional}</p>
            )}
            {cta && (
              <div className={textoAdicional ? "mt-9" : ""}>
                <BotonCta texto={cta.texto} enlace={cta.enlace} />
              </div>
            )}
          </Anim>
        </div>
      )}
    </section>
  );
}

function VersionTexto({
  idTitulo,
  titulo,
  parrafos,
  destacado,
  cta,
  invertido,
  animar,
}: {
  idTitulo: string;
  titulo: string;
  parrafos: string[];
  destacado: string;
  cta: PiezaGraficaData["cta"];
  invertido: boolean;
  animar: boolean;
}) {
  return (
    <div className="relative">
      {/* Decoracion: resplandor y oleaje en tinta de marca muy baja. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-10 h-[26rem] w-[26rem] rounded-full bg-brand-lift/10 blur-[120px] ${
            invertido ? "-right-24" : "-left-24"
          }`}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-40 w-full"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M0 96 C 240 56, 480 136, 720 96 S 1200 56, 1440 90" stroke="rgba(75,42,147,0.12)" strokeWidth="1.5" />
          <path d="M0 126 C 260 86, 520 166, 760 126 S 1220 86, 1440 120" stroke="rgba(244,123,32,0.22)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* items-center: titulo y texto se centran entre si en alto. Con el
          texto arriba y un titulo de tres lineas al lado, la columna mas
          corta dejaba un hueco debajo (medido en la seccion 3). */}
      <div className="relative mx-auto grid max-w-page gap-10 px-5 py-20 sm:px-6 md:grid-cols-12 md:items-center md:gap-12 md:px-10 md:py-28 lg:px-12">
        <Anim
          animar={animar}
          className={
            invertido
              ? "md:col-span-5 md:col-start-8 md:row-start-1"
              : "md:col-span-5 md:col-start-1 md:row-start-1"
          }
        >
          <h2
            id={idTitulo}
            className="text-balance font-display text-[clamp(2.5rem,1.6rem+3.4vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </h2>
          <span aria-hidden="true" className="mt-7 block h-1.5 w-20 rounded-full bg-gradient-to-r from-brand to-accent" />
        </Anim>

        <Anim
          animar={animar}
          delay={0.1}
          className={
            invertido
              ? "flex flex-col gap-6 md:col-span-6 md:col-start-1 md:row-start-1"
              : "flex flex-col gap-6 md:col-span-6 md:col-start-7 md:row-start-1"
          }
        >
          {parrafos.map((p) => (
            <p key={p} className="font-sans text-lg leading-relaxed text-ink-muted md:text-xl">
              {p}
            </p>
          ))}
          {destacado && (
            <p className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-brand md:text-[1.75rem]">
              {destacado}
            </p>
          )}
          {cta && (
            <div className="mt-3">
              <BotonCta texto={cta.texto} enlace={cta.enlace} />
            </div>
          )}
        </Anim>
      </div>
    </div>
  );
}
