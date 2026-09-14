import { getImageProps } from "next/image";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { Parallax } from "./Parallax";
import { AtmosferaMar } from "./AtmosferaMar";
import type {
  Alineacion,
  ImagenSanity,
  Overlay,
  SeccionCierre,
  SeccionEquipo,
} from "@/lib/marketing-digital";

/**
 * Banner fotografico a todo el ancho con texto HTML encima. Lo usan dos tipos
 * de seccion: teamBanner (Equipo DOFI, abre la pagina) y ctaBanner (el
 * cierre, Daniel dando la mano).
 *
 * La foto SI se recorta (es un fondo; el mensaje va en HTML), por eso usa
 * object-cover con el hotspot de Sanity, overlay para leer el texto y
 * parallax ligero. Sin foto, pinta AtmosferaMar: el mismo banner con fondo de
 * marca, y la foto ocupa su lugar el dia que se sube.
 *
 * ESCALA DEL TITULO (Equipo)
 * -----------------------------------------------------------------
 * El brief pidio un titulo bastante mas chico que la version anterior (que
 * llegaba a 72px y ocupaba casi todo el alto). Ahora tope de ~56px y un
 * ancho maximo en `ch` con text-balance: el salto de linea cae natural en
 * dos lineas en escritorio, en vez de una palabra suelta al final. En un
 * telefono de 390px baja a 30px: con 34px la pregunta se partia en 4 lineas.
 *
 * ENTRADA ESCALONADA
 * -----------------------------------------------------------------
 * Ubicacion -> titulo -> descripcion -> slogan -> boton, cada uno 80ms
 * despues del anterior y en 600ms: rapida, sin movimiento permanente.
 */

function aPosicion(h: ImagenSanity["hotspot"]) {
  return h ? `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` : "50% 50%";
}

/** Foto de fondo con direccion de arte: version movil opcional, cada una
 *  con su propio punto focal (ver .foto-dirigida en globals.css). */
function FotoCubierta({
  imagen,
  imagenMovil,
  prioridad,
}: {
  imagen: ImagenSanity;
  imagenMovil: ImagenSanity | null;
  prioridad: boolean;
}) {
  const {
    props: { srcSet: srcEscritorio, style, ...resto },
  } = getImageProps({ src: imagen.url, alt: imagen.alt, fill: true, sizes: "100vw", priority: prioridad });

  const srcMovil = imagenMovil
    ? getImageProps({ src: imagenMovil.url, alt: imagen.alt, fill: true, sizes: "100vw" }).props.srcSet
    : undefined;

  const posEscritorio = aPosicion(imagen.hotspot);
  const posMovil = imagenMovil ? aPosicion(imagenMovil.hotspot) : posEscritorio;

  return (
    <picture>
      {srcMovil && <source media="(max-width: 767px)" srcSet={srcMovil} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...resto}
        alt={imagen.alt}
        srcSet={srcEscritorio}
        className="foto-dirigida object-cover"
        style={{ ...style, "--pos-m": posMovil, "--pos-d": posEscritorio } as React.CSSProperties}
      />
    </picture>
  );
}

/** Overlay orientado hacia el lado del texto. Strings literales (no armados)
 *  para que Tailwind los vea al compilar. */
const OVERLAY: Record<Exclude<Overlay, "ninguno">, Record<Alineacion, string>> = {
  suave: {
    izquierda: "bg-gradient-to-r from-abyss/60 via-abyss/25 to-transparent",
    centro: "bg-abyss/35",
    derecha: "bg-gradient-to-l from-abyss/60 via-abyss/25 to-transparent",
  },
  medio: {
    izquierda: "bg-gradient-to-r from-abyss/80 via-abyss/45 to-abyss/10",
    centro: "bg-abyss/55",
    derecha: "bg-gradient-to-l from-abyss/80 via-abyss/45 to-abyss/10",
  },
  fuerte: {
    izquierda: "bg-gradient-to-r from-abyss/90 via-abyss/65 to-abyss/30",
    centro: "bg-abyss/72",
    derecha: "bg-gradient-to-l from-abyss/90 via-abyss/65 to-abyss/30",
  },
};

/** En mobile el texto va siempre abajo; en escritorio, centrado en alto y
 *  alineado segun "Posición del contenido". */
const ALINEA: Record<Alineacion, { caja: string; texto: string }> = {
  izquierda: { caja: "justify-start", texto: "items-start text-left" },
  centro: { caja: "justify-center", texto: "items-center text-center" },
  derecha: { caja: "justify-start md:justify-end", texto: "items-start text-left md:items-end md:text-right" },
};

export function BannerFoto({
  seccion,
  id,
  nivel,
  prioridad = false,
}: {
  seccion: SeccionEquipo | SeccionCierre;
  id: string;
  nivel: "h1" | "h2";
  /** Precarga la foto: solo para la seccion que se ve sin hacer scroll. */
  prioridad?: boolean;
}) {
  const { imagen, imagenMovil, subtitulo, titulo, descripcion, destacado, cta, alineacion, overlay, animar } =
    seccion;
  const esEquipo = seccion.tipo === "teamBanner";
  const Titulo = nivel;
  const a = ALINEA[alineacion];
  const alto = esEquipo ? "min-h-[640px] md:min-h-[600px] lg:min-h-[660px]" : "min-h-[560px] md:min-h-[600px]";
  // La seccion que abre la pagina arranca debajo del header fijo (64-68px).
  const relleno = nivel === "h1" ? "pb-16 pt-32 md:pb-20 md:pt-36" : "py-20 md:py-24";
  const escalaTitulo = esEquipo
    ? "max-w-[18ch] text-[clamp(1.875rem,1.3rem+2.3vw,3.5rem)] leading-[1.06]"
    : "max-w-[20ch] text-[clamp(2.25rem,1.3rem+2.8vw,3.875rem)] leading-[1.05]";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className={`relative isolate flex overflow-hidden bg-abyss text-foam ${alto}`}
    >
      <div className="absolute inset-0 -z-10">
        {imagen ? (
          animar ? (
            <Parallax className="absolute inset-0 overflow-hidden">
              <FotoCubierta imagen={imagen} imagenMovil={imagenMovil} prioridad={prioridad} />
            </Parallax>
          ) : (
            <FotoCubierta imagen={imagen} imagenMovil={imagenMovil} prioridad={prioridad} />
          )
        ) : (
          <AtmosferaMar variante={esEquipo ? "equipo" : "cierre"} />
        )}

        {imagen && overlay !== "ninguno" && (
          <>
            <div aria-hidden="true" className={`absolute inset-0 ${OVERLAY[overlay][alineacion]}`} />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-abyss/20 to-transparent md:hidden"
            />
          </>
        )}
      </div>

      <div
        className={`relative mx-auto flex w-full max-w-page items-end px-5 sm:px-6 md:items-center md:px-10 lg:px-12 ${relleno} ${a.caja}`}
      >
        <div className={`flex max-w-[720px] flex-col ${a.texto}`}>
          {subtitulo && (
            <Anim animar={animar} y={12} duration={0.6}>
              <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
                {esEquipo && <MapPin size={15} weight="fill" aria-hidden="true" className="text-accent-lift" />}
                {subtitulo}
              </p>
            </Anim>
          )}

          <Anim animar={animar} y={16} delay={0.08} duration={0.6}>
            <Titulo
              id={`${id}-titulo`}
              className={`text-balance font-display font-extrabold tracking-[-0.02em] [text-shadow:0_2px_24px_rgba(18,10,38,0.35)] ${escalaTitulo}`}
            >
              {titulo}
            </Titulo>
          </Anim>

          {descripcion && (
            <Anim animar={animar} y={14} delay={0.16} duration={0.6}>
              <p className="mt-5 max-w-[520px] font-sans text-lg leading-relaxed text-foam/85 md:text-xl">
                {descripcion}
              </p>
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
                <BotonCta texto={cta.texto} enlace={cta.enlace} tamano={esEquipo ? "normal" : "grande"} />
              </div>
            </Anim>
          )}
        </div>
      </div>
    </section>
  );
}
