import { Sailboat } from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { Brujula } from "./Brujula";
import { ModoPieza, parrafosDe } from "./PiezaGrafica";
import type { SeccionNavegacion } from "@/lib/marketing-digital";

/**
 * 3 · ¿Cómo navegamos contigo? (navigationBanner).
 *
 * La version anterior repetia la composicion de "¿Qué es DOFI?" invertida y
 * se leia generica. Esta es editorial y de marca:
 *
 *  - FONDO MORADO PROFUNDO. Rompe la secuencia de bloques blancos: la
 *    pagina alterna oscuro (Equipo) / claro (Qué es DOFI) / oscuro (esta) /
 *    claro (Método), que es usar los colores DOFI para dar jerarquia.
 *  - TITULO PROTAGONISTA, grande y pesado, con la ultima palabra en
 *    degradado naranja ("contigo?"): el foco cae en el cliente.
 *  - UN SEPARADOR CON VELERO entre titulo y texto, y los dos parrafos en
 *    dos columnas angostas, como en una revista.
 *  - UNA BRUJULA como elemento grafico, con su orbita punteada que se
 *    dibuja al entrar y una aguja que se asienta una vez.
 *  - ONDAS DOFI abajo.
 *
 * Con una pieza grafica cargada en el Studio, pasa a modo pieza igual que
 * "¿Qué es DOFI?".
 */

/** Separa la ultima palabra del titulo para destacarla. "¿Cómo navegamos
 *  contigo?" -> ["¿Cómo navegamos", "contigo?"]. */
function partirTitulo(titulo: string): [string, string] {
  const i = titulo.lastIndexOf(" ");
  return i < 0 ? ["", titulo] : [titulo.slice(0, i), titulo.slice(i + 1)];
}

export function NavegacionEditorial({
  seccion,
  id,
  nivel,
}: {
  seccion: SeccionNavegacion;
  id: string;
  nivel: "h1" | "h2";
}) {
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
  const [inicio, ultima] = partirTitulo(titulo);
  const parrafos = parrafosDe(descripcion);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-abyss text-foam">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_120%_at_88%_12%,#2E1B68_0%,#1A0F3D_48%,#120A26_100%)]"
      />
      <div aria-hidden="true" className="absolute -bottom-40 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px]" />

      <div className="relative mx-auto max-w-page px-5 pb-32 pt-24 sm:px-6 md:px-10 md:pb-40 md:pt-32 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            {subtitulo && (
              <Anim animar={animar} y={12}>
                <p className="mb-6 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent-lift">
                  {subtitulo}
                </p>
              </Anim>
            )}

            <Anim animar={animar} y={20} delay={0.06}>
              <Titulo
                id={`${id}-titulo`}
                className="text-balance font-display text-[clamp(2.75rem,1.5rem+4.2vw,5.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em]"
              >
                {inicio && <>{inicio} </>}
                <span className="bg-gradient-to-r from-accent-lift to-accent bg-clip-text text-transparent">{ultima}</span>
              </Titulo>
            </Anim>

            <Anim animar={animar} y={10} delay={0.14}>
              <div aria-hidden="true" className="mt-10 flex max-w-[680px] items-center gap-4 text-accent-lift">
                <span className="h-px w-14 bg-accent-lift/70" />
                <Sailboat size={24} weight="duotone" />
                <span className="h-px flex-1 border-t border-dashed border-white/20" />
              </div>
            </Anim>

            {parrafos.length > 0 && (
              <div className={`mt-10 grid max-w-[680px] gap-8 ${parrafos.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {parrafos.map((p, i) => (
                  <Anim key={i} animar={animar} y={14} delay={0.2 + i * 0.08}>
                    <p className="font-sans text-base leading-relaxed text-foam/80 md:text-lg">{p}</p>
                  </Anim>
                ))}
              </div>
            )}

            {destacado && (
              <Anim animar={animar} y={14} delay={0.34}>
                <p className="mt-10 font-display text-2xl font-bold tracking-tight text-foam">{destacado}</p>
              </Anim>
            )}

            {cta && (
              <Anim animar={animar} y={14} delay={0.4}>
                <div className="mt-10">
                  <BotonCta texto={cta.texto} enlace={cta.enlace} />
                </div>
              </Anim>
            )}
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Anim animar={animar} y={24} delay={0.1}>
              <Brujula animar={animar} className="mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px]" />
            </Anim>
          </div>
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 w-full"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 92 C 240 52, 480 132, 720 92 S 1200 52, 1440 86" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
        <path d="M0 122 C 260 82, 520 162, 760 122 S 1220 82, 1440 116" stroke="rgba(244,123,32,0.35)" strokeWidth="1.5" />
      </svg>
    </section>
  );
}
