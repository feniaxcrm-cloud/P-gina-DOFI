import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { PiezaCompleta } from "@/components/marketing/PiezaCompleta";
import { parrafosDe } from "@/components/marketing/PiezaGrafica";
import { VideoBucle } from "@/components/marketing/VideoBucle";
import type { SeccionEcosistema } from "@/lib/trafico";

/**
 * 6 · El ecosistema (tipo ecosystemBanner).
 *
 * "No trabajamos campañas aisladas. Construimos ecosistemas." Fondo morado
 * profundo (rompe la secuencia de secciones claras, como el bloque editorial
 * de Marketing Digital) y, a la derecha, el recorrido que cuenta el texto:
 * una persona descubre la marca en Instagram, la busca en Google, visita la
 * web y la contacta por WhatsApp. Es un motion graphic de HyperFrames
 * (video/ecosistema-trafico/, ver su README) en bucle y sin audio.
 *
 * Si se sube una imagen en el Studio, reemplaza al video en esa columna
 * (completa, sin recortes), como en el bloque editorial.
 */

/** Separa la ultima palabra del titulo para destacarla: "...Construimos
 *  ecosistemas." -> ["...Construimos", "ecosistemas."]. */
function partirTitulo(titulo: string): [string, string] {
  const i = titulo.lastIndexOf(" ");
  return i < 0 ? ["", titulo] : [titulo.slice(0, i), titulo.slice(i + 1)];
}

export function TraficoEcosistema({ seccion, id, nivel }: { seccion: SeccionEcosistema; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;
  const Titulo = nivel;
  const [inicio, ultima] = partirTitulo(titulo);
  const parrafos = parrafosDe(descripcion);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-abyss text-foam">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(100%_110%_at_92%_10%,#2E1B68_0%,#1A0F3D_48%,#120A26_100%)]"
      />
      <div aria-hidden="true" className="absolute -bottom-40 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px]" />

      <div className="relative mx-auto max-w-page px-5 pb-32 pt-24 sm:px-6 md:px-10 md:pb-40 md:pt-32 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            {subtitulo && (
              <Anim animar={animar} y={12}>
                <p className="mb-6 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent-lift">{subtitulo}</p>
              </Anim>
            )}

            <Anim animar={animar} y={20} delay={0.06}>
              <Titulo
                id={`${id}-titulo`}
                className="max-w-[18ch] text-balance font-display text-[clamp(2.25rem,1.4rem+3.6vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em]"
              >
                {inicio && <>{inicio} </>}
                <span className="text-accent-lift">{ultima}</span>
              </Titulo>
            </Anim>

            {parrafos.length > 0 && (
              <div className="mt-9 grid max-w-[640px] gap-6">
                {parrafos.map((p, i) => (
                  <Anim key={i} animar={animar} y={14} delay={0.16 + i * 0.08}>
                    <p className="font-sans text-base leading-relaxed text-foam/80 md:text-lg">{p}</p>
                  </Anim>
                ))}
              </div>
            )}

            {destacado && (
              <Anim animar={animar} y={14} delay={0.34}>
                <p className="mt-9 flex max-w-[640px] items-start gap-4 font-display text-xl font-bold leading-snug tracking-tight text-foam md:text-2xl">
                  <span aria-hidden="true" className="mt-[0.75em] h-px w-12 shrink-0 bg-accent-lift/70" />
                  {destacado}
                </p>
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
              {imagen ? (
                <PiezaCompleta imagen={imagen} imagenMovil={imagenMovil} alt={imagen.alt || titulo} />
              ) : (
                <VideoBucle
                  src="/trafico/ecosistema.mp4"
                  poster="/trafico/ecosistema.jpg"
                  descripcion="Animación: una persona descubre una marca en Instagram, la busca en Google, visita su página web y finalmente la contacta por WhatsApp. Todo ese recorrido es tráfico."
                  className="mx-auto w-full max-w-[480px]"
                />
              )}
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
