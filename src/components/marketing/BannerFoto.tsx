import { getImageProps } from "next/image";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { BotonCta } from "@/components/BotonCta";
import { Anim } from "./Anim";
import { Parallax } from "./Parallax";
import { AtmosferaMar } from "./AtmosferaMar";
import type { Alineacion, BannerFotoData, ImagenSanity, Overlay } from "@/lib/marketing-digital";

/**
 * Banner fotografico a todo el ancho con texto HTML encima. Se usa dos
 * veces en Marketing Digital: 1 · Equipo DOFI (abre la pagina, lleva el H1)
 * y 7 · Cierre (Daniel dando la mano).
 *
 * A diferencia de las piezas graficas terminadas (PiezaGrafica), aca la foto
 * SI se recorta: es un fondo, el mensaje va en HTML por encima. Por eso usa
 * object-cover con el hotspot de Sanity, admite overlay para leer el texto
 * y parallax ligero.
 *
 * SIN FOTO TODAVIA
 * -----------------------------------------------------------------
 * Pinta AtmosferaMar: el mismo banner con fondo de marca. La pagina se ve
 * terminada aunque falte el material fotografico, y el dia que se sube la
 * foto en el Studio ocupa su lugar sin tocar codigo.
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

/** Overlay orientado hacia el lado del texto: oscurece donde se lee y deja
 *  respirar la foto del otro lado. Strings literales (no armados) para que
 *  Tailwind los vea al compilar. */
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
 *  alineado segun el campo "Posición del contenido". */
const ALINEA: Record<Alineacion, { caja: string; texto: string }> = {
  izquierda: { caja: "justify-start", texto: "items-start text-left" },
  centro: { caja: "justify-center", texto: "items-center text-center" },
  derecha: { caja: "justify-start md:justify-end", texto: "items-start text-left md:items-end md:text-right" },
};

export function BannerFoto({
  data,
  id,
  nivel = "h2",
  variante = "equipo",
  prioridad = false,
}: {
  data: BannerFotoData;
  id: string;
  /** "h1" solo en el banner que abre la pagina. */
  nivel?: "h1" | "h2";
  variante?: "equipo" | "cierre";
  /** Precarga la foto: solo para la que se ve sin hacer scroll. */
  prioridad?: boolean;
}) {
  const { imagen, imagenMovil, etiqueta, titulo, descripcion, destacado, cta, alineacion, overlay, animar } = data;
  const Titulo = nivel;
  const a = ALINEA[alineacion];
  const alto =
    variante === "equipo"
      ? "min-h-[680px] md:min-h-[640px] lg:min-h-[720px]"
      : "min-h-[560px] md:min-h-[600px]";
  // El primer banner arranca debajo del header fijo.
  const relleno = nivel === "h1" ? "pb-16 pt-36 md:pb-24 md:pt-40" : "py-20 md:py-24";

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
          <AtmosferaMar variante={variante} />
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
        <Anim animar={animar} y={24} className={`flex max-w-[700px] flex-col ${a.texto}`}>
          {etiqueta && (
            <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
              <MapPin size={15} weight="fill" aria-hidden="true" className="text-accent-lift" />
              {etiqueta}
            </p>
          )}

          <Titulo
            id={`${id}-titulo`}
            className="text-balance font-display text-[clamp(2.25rem,1.35rem+3.4vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.02em] [text-shadow:0_2px_24px_rgba(18,10,38,0.35)]"
          >
            {titulo}
          </Titulo>

          {descripcion && (
            <p className="mt-6 max-w-[580px] font-sans text-lg leading-relaxed text-foam/85 md:text-xl">
              {descripcion}
            </p>
          )}

          {destacado && (
            <p className="mt-7 flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-accent-lift md:text-xl">
              <span aria-hidden="true" className="h-px w-10 bg-accent-lift/70" />
              {destacado}
            </p>
          )}

          {cta && (
            <div className="mt-9">
              <BotonCta texto={cta.texto} enlace={cta.enlace} />
            </div>
          )}
        </Anim>
      </div>
    </section>
  );
}
