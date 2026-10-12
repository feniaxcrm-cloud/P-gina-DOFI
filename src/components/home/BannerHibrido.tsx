import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ESCENARIO, GEOMETRIA, type ClaveEscena } from "@/remotion/home/tema";
import { EscenaBanner } from "./EscenaBanner";

/**
 * Un banner del Home de tipo HIBRIDO (pedido del 2026-10-08): la mitad de la
 * pieza es una escena dibujada con codigo y movimiento (Remotion) y la otra
 * mitad es una FOTO que se sube y se cambia en el Studio.
 *
 *   Redes y CRM:       ESCENA a la izquierda · FOTO a la derecha
 *   Pauta y Asesorías: FOTO a la izquierda   · ESCENA a la derecha
 *
 * ESCRITORIO Y TABLET (768 px o mas): un "escenario" con la proporcion exacta
 * de las piezas originales (2077 x 757). La escena y la foto ocupan las
 * mismas zonas que ocupaban en la imagen; el escenario cubre el ancho del
 * banner como lo hacia la imagen (centrado, sin deformarse). El boton, que
 * llega ya armado por ContentBanner, queda encima en las mismas coordenadas
 * que se eligen en el Studio.
 *
 * TELEFONO: apilado. Primero la escena (el mensaje), debajo la foto y, al
 * final, el boton en su propia fila (no encima de la foto: taparia lo que
 * dice). Cada bloque conserva su proporcion.
 *
 * El FONDO es el color de la pieza original (tema.ts): la escena es
 * transparente y la foto se funde con el en su borde, asi no hay costuras.
 * El texto de la pieza va como texto real para lectores de pantalla y
 * buscadores (la escena es decorativa).
 */

export type FotoBanner = { url: string; ancho: number; alto: number; hotspot: { x: number; y: number } | null };

// 36.45vw = el ancho dividido por la proporcion del escenario (2077 / 757): de
// 768 px a unos 2080 px el escenario ocupa el ancho exacto de la pantalla, sin
// recortar ni un borde (los titulos y las fotos quedan enteros). Mas alla, el
// alto deja de crecer y el escenario no pasa de 2200 px de ancho.
const ALTO = "clamp(280px, 36.45vw, 760px)";

function Foto({
  foto,
  alt,
  ajuste,
  difuminado,
  sizes,
  className = "",
  estilo,
}: {
  foto: FotoBanner;
  alt: string;
  ajuste: "cubrir" | "completa";
  difuminado: "izquierda" | "derecha" | "arriba";
  sizes: string;
  className?: string;
  estilo?: React.CSSProperties;
}) {
  const pos = foto.hotspot ? `${Math.round(foto.hotspot.x * 100)}% ${Math.round(foto.hotspot.y * 100)}%` : ajuste === "completa" ? "50% 100%" : "50% 50%";
  // La mascara apaga el borde que mira a la escena.
  const dir = difuminado === "izquierda" ? "to right" : difuminado === "derecha" ? "to left" : "to bottom";
  const mascara = `linear-gradient(${dir}, transparent 0%, #000 12%, #000 100%)`;
  return (
    <div className={`absolute ${className}`} style={{ ...estilo, WebkitMaskImage: mascara, maskImage: mascara }}>
      <Image
        src={foto.url}
        alt={alt}
        fill
        sizes={sizes}
        loading="lazy"
        unoptimized={foto.url.startsWith("/")}
        className={ajuste === "completa" ? "object-contain" : "object-cover"}
        style={{ objectPosition: pos }}
      />
    </div>
  );
}

export function BannerHibrido({
  escena,
  lineas,
  alt,
  foto,
  ajusteFoto,
  superposicion,
  ctaMovil,
}: {
  escena: ClaveEscena;
  lineas: string[];
  alt: string;
  foto: FotoBanner;
  ajusteFoto: "cubrir" | "completa";
  /** El boton sobre el banner (escritorio): ya con sus coordenadas. */
  superposicion: React.ReactNode;
  /** El mismo boton, en su propia fila (telefono). */
  ctaMovil: React.ReactNode;
}) {
  const g = GEOMETRIA[escena];
  const E = ESCENARIO;
  const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
  // El borde de la escena que mira a la foto es el contrario al de la foto.
  const bordeEscena = g.difuminado === "izquierda" ? "derecha" : "izquierda";
  const alto = E.alto;
  const textos = lineas.length > 0 ? lineas : g.lineasPorDefecto;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: g.fondo, backgroundColor: g.borde, "--alto-banner": ALTO } as React.CSSProperties}
    >
      <h2 className="sr-only">{alt || textos.join(" ")}</h2>

      {/* Escritorio y tablet */}
      <Reveal y={20}>
        <div className="group relative hidden h-[var(--alto-banner)] w-full overflow-hidden md:block">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: "min(2200px, max(100%, calc(var(--alto-banner) * 2.7437)))", aspectRatio: `${E.ancho} / ${E.alto}` }}
          >
            <div className="absolute inset-y-0" style={{ left: pct(g.escena.x, E.ancho), width: pct(g.escena.ancho, E.ancho) }}>
              <EscenaBanner escena={escena} lineas={textos} ancho={g.escena.ancho} alto={alto} borde={bordeEscena} className="h-full w-full" />
            </div>
            <Foto
              foto={foto}
              alt={alt}
              ajuste={ajusteFoto}
              difuminado={g.difuminado}
              sizes="(min-width: 1200px) 55vw, 60vw"
              className="inset-y-0"
              estilo={{ left: pct(g.foto.x, E.ancho), width: pct(g.foto.ancho, E.ancho) }}
            />
          </div>
          {superposicion}
        </div>
      </Reveal>

      {/* Telefono */}
      <div className="md:hidden">
        <EscenaBanner escena={escena} lineas={textos} ancho={g.escena.ancho} alto={alto} borde="abajo" className="w-full" />
        <div className="relative w-full" style={{ aspectRatio: `${g.foto.ancho} / ${E.alto}` }}>
          <Foto foto={foto} alt={alt} ajuste={ajusteFoto} difuminado="arriba" sizes="100vw" className="inset-0" />
        </div>
        <div className="flex justify-center px-5 pb-9 pt-3">{ctaMovil}</div>
      </div>
    </section>
  );
}
