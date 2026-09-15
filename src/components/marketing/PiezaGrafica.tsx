import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { OrnamentoDelfin, OrnamentoRuta } from "./OrnamentoNautico";
import { PiezaCompleta } from "./PiezaCompleta";
import type { CtaSimple, ImagenSanity, SeccionQueEs } from "@/lib/marketing-digital";

/**
 * 2 · ¿Qué es DOFI? (aboutBanner).
 *
 * Composicion aprobada: fondo blanco, titulo grande a la izquierda,
 * descripcion a la derecha repartidos 50/50, linea de degradado morado ->
 * naranja y ondas DOFI abajo. Editorial, sin tarjetas.
 *
 * Si en el Studio se sube una pieza grafica terminada, la seccion pasa a
 * "modo pieza" (ModoPieza, abajo): la pieza completa y sin recortar, y el
 * texto pasa al alt para no leerse dos veces.
 */

export function parrafosDe(texto: string): string[] {
  return texto
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Seccion cuyo contenido es una pieza grafica terminada. La comparten
 *  aboutBanner y navigationBanner cuando tienen imagen cargada. */
export function ModoPieza({
  id,
  nivel,
  titulo,
  imagen,
  imagenMovil,
  altPorDefecto,
  cta,
  animar,
}: {
  id: string;
  nivel: "h1" | "h2";
  titulo: string;
  imagen: ImagenSanity;
  imagenMovil: ImagenSanity | null;
  altPorDefecto: string;
  cta: CtaSimple;
  animar: boolean;
}) {
  const Titulo = nivel;
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative overflow-hidden bg-canvas">
      <Titulo id={`${id}-titulo`} className="sr-only">
        {titulo}
      </Titulo>
      <Anim animar={animar} y={20}>
        <PiezaCompleta imagen={imagen} imagenMovil={imagenMovil} alt={imagen.alt || altPorDefecto} />
      </Anim>
      {cta && (
        <div className="mx-auto flex max-w-page justify-center px-5 py-14 sm:px-6 md:px-10 md:py-20 lg:px-12">
          <Anim animar={animar}>
            <BotonCta texto={cta.texto} enlace={cta.enlace} />
          </Anim>
        </div>
      )}
    </section>
  );
}

export function PiezaGrafica({ seccion, id, nivel }: { seccion: SeccionQueEs; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;

  if (imagen) {
    return (
      <ModoPieza
        id={id}
        nivel={nivel}
        titulo={titulo}
        imagen={imagen}
        imagenMovil={imagenMovil}
        altPorDefecto={[descripcion, destacado].filter(Boolean).join(" ")}
        cta={cta}
        animar={animar}
      />
    );
  }

  const Titulo = nivel;
  const parrafos = parrafosDe(descripcion);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="group/nautico relative overflow-hidden bg-canvas">
      {/* Decoracion: resplandor y oleaje en tinta de marca muy baja. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-[26rem] w-[26rem] rounded-full bg-brand-lift/10 blur-[120px]" />
        <svg className="absolute inset-x-0 bottom-0 h-40 w-full" viewBox="0 0 1440 160" preserveAspectRatio="none" fill="none">
          <path d="M0 96 C 240 56, 480 136, 720 96 S 1200 56, 1440 90" stroke="rgba(75,42,147,0.12)" strokeWidth="1.5" />
          <path d="M0 126 C 260 86, 520 166, 760 126 S 1220 86, 1440 120" stroke="rgba(244,123,32,0.22)" strokeWidth="1.5" />
        </svg>
      </div>
      {/* El delfin es EL simbolo de DOFI (lo dice el propio texto de esta
          seccion): sangra por el borde superior derecho, muy sutil. */}
      {/* Arriba del todo, mayormente sobre el relleno superior de la seccion
          (por eso -top-*, no top-*): asi nunca cae sobre la columna de texto,
          que empieza mas abajo. */}
      <OrnamentoDelfin className="-right-5 -top-4 h-24 w-24 text-brand/[0.09] sm:-right-6 sm:-top-6 sm:h-32 sm:w-32 lg:-right-8 lg:-top-8 lg:h-40 lg:w-40" />
      <OrnamentoRuta className="left-[8%] top-[62%] hidden h-20 w-40 text-accent/20 md:block lg:h-24 lg:w-52" />

      {/* 50% titulo / 50% contenido (6 + 6 columnas). items-center: si una
          columna es mas corta, se centra contra la otra en vez de dejar un
          hueco debajo. */}
      {/* pb-32 en movil: las ondas miden 160px y sin ese aire rozaban la frase
          destacada, que en telefono es lo ultimo de la columna. */}
      <div className="relative mx-auto grid max-w-page grid-cols-1 gap-10 px-5 pb-32 pt-20 sm:px-6 md:grid-cols-12 md:items-center md:gap-12 md:px-10 md:py-28 lg:px-12">
        <Anim animar={animar} className="min-w-0 md:col-span-6">
          {subtitulo && (
            <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-brand">{subtitulo}</p>
          )}
          <Titulo
            id={`${id}-titulo`}
            className="text-balance font-display text-[clamp(2.5rem,1.6rem+3.4vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink"
          >
            {titulo}
          </Titulo>
          <span aria-hidden="true" className="mt-7 block h-1.5 w-20 rounded-full bg-gradient-to-r from-brand to-accent" />
        </Anim>

        <Anim animar={animar} delay={0.1} className="flex min-w-0 flex-col gap-6 md:col-span-6 md:col-start-7">
          {parrafos.map((p, i) => (
            <p key={i} className="font-sans text-lg leading-relaxed text-ink-muted md:text-xl">
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
    </section>
  );
}
