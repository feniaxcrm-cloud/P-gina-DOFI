import { BotonCta } from "@/components/BotonCta";
import { Anim } from "@/components/marketing/Anim";
import { AtmosferaMar } from "@/components/marketing/AtmosferaMar";
import { BannerFoto } from "@/components/marketing/BannerFoto";
import { PiezaCompleta } from "@/components/marketing/PiezaCompleta";
import type { SeccionCierreImagen } from "@/lib/trafico";

/**
 * 9 · Cierre de Tráfico/Ads (tipo ctaImageBanner): «¿Listos para poner tu
 * inversión en movimiento?», con la IMAGEN A LA DERECHA.
 *
 *   ┌────────────────────────────┬────────────────────┐
 *   │ Pregunta · frase · «Zarpemos│  Imagen completa   │
 *   │ juntos.» · botón grande     │  (sin recortes)    │
 *   └────────────────────────────┴────────────────────┘
 *
 * La imagen se muestra ENTERA, tal como se diseñó (PiezaCompleta: ni recorte
 * ni deformacion); en telefono va debajo del texto. El fondo, el titulo y el
 * boton son los del cierre de siempre (mismo AtmosferaMar, misma escala).
 *
 * SIN IMAGEN: es el cierre normal (BannerFoto): fondo de marca y el texto
 * centrado. Asi la pagina se ve completa mientras la imagen no esta cargada.
 */
export function TraficoCierre({ seccion, id, nivel }: { seccion: SeccionCierreImagen; id: string; nivel: "h1" | "h2" }) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, animar } = seccion;

  if (!imagen) {
    return (
      <BannerFoto
        seccion={{ ...seccion, tipo: "ctaBanner", alineacion: "centro", overlay: "medio" }}
        id={id}
        nivel={nivel}
      />
    );
  }

  const Titulo = nivel;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="relative isolate overflow-hidden bg-abyss text-foam"
    >
      <div className="absolute inset-0 -z-10">
        <AtmosferaMar variante="cierre" />
      </div>

      <div className="relative mx-auto grid w-full max-w-page grid-cols-1 items-center gap-12 px-5 py-20 sm:px-6 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="flex min-w-0 flex-col items-start lg:col-span-6">
          {subtitulo && (
            <Anim animar={animar} y={12} duration={0.6}>
              <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
                {subtitulo}
              </p>
            </Anim>
          )}

          <Anim animar={animar} y={16} delay={0.08} duration={0.6}>
            <Titulo
              id={`${id}-titulo`}
              className="max-w-[18ch] text-balance font-display text-[clamp(2.25rem,1.3rem+2.8vw,3.875rem)] font-extrabold leading-[1.05] tracking-[-0.02em] [text-shadow:0_2px_24px_rgba(18,10,38,0.35)]"
            >
              {titulo}
            </Titulo>
          </Anim>

          {descripcion && (
            <Anim animar={animar} y={14} delay={0.16} duration={0.6}>
              <p className="mt-5 max-w-[520px] font-sans text-lg leading-relaxed text-foam/85 md:text-xl">{descripcion}</p>
            </Anim>
          )}

          {destacado && (
            <Anim animar={animar} y={14} delay={0.24} duration={0.6}>
              <p className="mt-6 flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-accent-lift md:text-xl">
                <span aria-hidden="true" className="h-px w-10 bg-accent-lift/70" />
                {destacado}
              </p>
            </Anim>
          )}

          {cta && (
            <Anim animar={animar} y={14} delay={0.32} duration={0.6}>
              <div className="mt-9">
                <BotonCta texto={cta.texto} enlace={cta.enlace} tamano="grande" />
              </div>
            </Anim>
          )}
        </div>

        <div className="min-w-0 lg:col-span-6">
          <Anim animar={animar} y={24} delay={0.12} duration={0.8}>
            <div className="mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-0 lg:max-w-none">
              <PiezaCompleta imagen={imagen} imagenMovil={imagenMovil} alt={imagen.alt || titulo} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </Anim>
        </div>
      </div>
    </section>
  );
}
