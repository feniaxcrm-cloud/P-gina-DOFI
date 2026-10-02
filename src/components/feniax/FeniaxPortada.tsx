import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { VideoBucle } from "@/components/marketing/VideoBucle";
import { LOGOS_FENIAX } from "@/config/feniax";
import type { SeccionEquipo } from "@/lib/marketing-digital";
import { OndasFeniax } from "./OndasFeniax";
import { Etiqueta, FotoFondo, Puntos, partirFinal } from "./piezas";

/**
 * 1 · Portada de FENIAX (tipo teamBanner, el mismo que abre Marketing
 * Digital: subtítulo, título, descripción, destacado, botón e imagen).
 *
 * Composición: texto a la izquierda y, a la derecha, el producto funcionando:
 * un panel de FENIAX CRM en movimiento -- los clientes avanzan de Nuevo a En
 * curso y Cerrado, la IA está activa, cada venta cerrada se avisa y la gráfica
 * de crecimiento sube (motion graphic de HyperFrames, 10 s en bucle: ver
 * video/crm-hero-feniax). Reemplaza al teléfono con la demo de WhatsApp, que
 * ahora vive solo en Clientes (pedido del 2026-10-01).
 *
 * Fondo: el de la portada del brandbook -- berenjena profundo con el
 * resplandor naranja arriba a la derecha, el morado abajo a la izquierda, la
 * cinta de líneas cruzando y la nube de puntos. Si se sube una foto en el
 * Studio, la foto pasa al fondo con un velo de marca encima.
 *
 * El logotipo va completo y en su versión negativa (letras blancas, "IA" en
 * degradado), que es la que el brandbook usa sobre fondo oscuro.
 */
export function FeniaxPortada({
  seccion,
  id,
  nivel,
}: {
  seccion: SeccionEquipo;
  id: string;
  nivel: "h1" | "h2";
}) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;
  const Titulo = nivel;
  const [inicio, final] = partirFinal(titulo, 1);
  const relleno = nivel === "h1" ? "pt-28 pb-20 md:pt-32 md:pb-24" : "py-20 md:py-24";

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="relative isolate overflow-hidden bg-abyss text-foam">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {imagen ? (
          <>
            <FotoFondo imagen={imagen} imagenMovil={imagenMovil} prioridad={nivel === "h1"} />
            <div className="absolute inset-0 bg-gradient-to-r from-abyss/92 via-abyss/70 to-abyss/35" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_88%_0%,rgba(237,109,25,0.38)_0%,rgba(229,53,42,0.12)_45%,transparent_75%),radial-gradient(60%_60%_at_0%_100%,rgba(121,40,131,0.65)_0%,transparent_70%),linear-gradient(160deg,#2A1638_0%,#1C0E27_55%,#160A20_100%)]" />
        )}
        <OndasFeniax idGradiente="ondas-portada" className="inset-x-0 bottom-[6%] h-[42%] md:bottom-[2%]" amplitud={80} opacidad={0.55} duracion={46} />
        <Puntos className="-right-24 -top-24 h-[420px] w-[520px] opacity-70" />
        <Puntos className="-bottom-28 -left-28 h-[360px] w-[420px] opacity-40" color="rgba(201,179,211,0.5)" />
      </div>

      <div className={`relative mx-auto grid max-w-page grid-cols-1 items-center gap-14 px-5 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-8 lg:px-12 ${relleno}`}>
        <div className="min-w-0 lg:col-span-6">
          <Anim animar={animar} y={12} duration={0.6}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGOS_FENIAX.negativo}
              alt="FENIAX · Ventas inteligentes"
              width={232}
              height={Math.round(232 / LOGOS_FENIAX.proporcion)}
              className="mb-10 h-auto w-[188px] md:w-[232px]"
            />
          </Anim>

          {subtitulo && (
            <Anim animar={animar} y={12} delay={0.06} duration={0.6}>
              <Etiqueta tono="oscuro">{subtitulo}</Etiqueta>
            </Anim>
          )}

          <Anim animar={animar} y={16} delay={0.12} duration={0.6}>
            <Titulo
              id={`${id}-titulo`}
              className="max-w-[16ch] text-balance font-display text-[clamp(2.5rem,1.4rem+4vw,4.75rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.015em]"
            >
              {inicio && <>{inicio} </>}
              <span className="texto-ia">{final}</span>
            </Titulo>
          </Anim>

          {descripcion && (
            <Anim animar={animar} y={14} delay={0.2} duration={0.6}>
              <p className="mt-7 max-w-[560px] font-sans text-lg leading-relaxed text-foam/80 md:text-xl">{descripcion}</p>
            </Anim>
          )}

          {destacado && (
            <Anim animar={animar} y={14} delay={0.26} duration={0.6}>
              <p className="mt-7 flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-foam md:text-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGOS_FENIAX.isotipo} alt="" aria-hidden="true" className="h-6 w-auto" />
                {destacado}
              </p>
            </Anim>
          )}

          {cta && (
            <Anim animar={animar} y={14} delay={0.32} duration={0.6}>
              <div className="mt-10">
                <BotonCta texto={cta.texto} enlace={cta.enlace} color="feniax" />
              </div>
            </Anim>
          )}
        </div>

        <div className="relative min-w-0 lg:col-span-6">
          <Anim animar={animar} y={24} delay={0.18} duration={0.8}>
            <VideoBucle
              src="/feniax/crm-crecimiento.mp4"
              poster="/feniax/crm-crecimiento.jpg"
              descripcion="Animación del panel de FENIAX CRM: la IA está activa, los clientes avanzan de Nuevo a En curso y Cerrado, cada venta cerrada se avisa y la gráfica de crecimiento sube."
              variante="flotante"
              prioridad={nivel === "h1"}
              className="mx-auto w-full max-w-[440px] sm:max-w-[500px] lg:ml-auto lg:mr-0 lg:max-w-[620px]"
            />
          </Anim>
        </div>
      </div>
    </section>
  );
}
