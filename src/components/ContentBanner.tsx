import Image from "next/image";
import { Reveal } from "./Reveal";
import type { SeccionContenido } from "@/lib/sanity";

/**
 * Uno de los 4 banners full-width que van debajo de las tarjetas del Hero.
 * Un solo componente reutilizado 4 veces desde page.tsx.
 *
 * LA IMAGEN ES EL DISEÑO (Sprint "Banners full-width")
 * -----------------------------------------------------------------
 * Reemplaza por completo la maqueta anterior de dos columnas con texto y
 * boton: aca no hay titulo, ni descripcion, ni CTA en HTML. El mensaje, la
 * tipografia y los botones viven DENTRO de la pieza grafica que se carga
 * desde Sanity. El unico texto que existe es el `alt`, que es lo que leen
 * los lectores de pantalla y los buscadores -- por eso es obligatorio en
 * el Studio.
 *
 * ANCHO COMPLETO SIN TRUCOS
 * -----------------------------------------------------------------
 * La seccion no necesita la tecnica full-bleed del Hero: `<main>` no impone
 * ningun ancho maximo, asi que un `<section>` normal ya ocupa el 100% del
 * viewport. Tampoco lleva contenedor centrado ni padding lateral -- la
 * imagen toca los dos bordes de la pantalla, que es justo lo pedido.
 *
 * ALTO Y RECORTE
 * -----------------------------------------------------------------
 * Alto fijo por breakpoint (380px en mobile -> 600px en desktop, dentro del
 * rango pedido de 450-650px) con `object-cover`: la imagen cubre el banner
 * sin deformarse nunca. Lo que decide QUE parte queda visible al recortar
 * es el hotspot de Sanity, traducido a `object-position` -- el mismo
 * mecanismo que ya usa el Hero, sin instalar @sanity/image-url. Esto es
 * mas importante que en una tarjeta: al ser un banner ancho y bajo, el
 * recorte vertical es agresivo, y el punto focal es lo unico que garantiza
 * que no se pierda lo importante de la pieza.
 *
 * MOVIMIENTO
 * -----------------------------------------------------------------
 * Solo una entrada sutil (opacity + 20px de translateY, 750ms) reutilizando
 * <Reveal>, que ya respeta prefers-reduced-motion via la regla de
 * globals.css. Despues de entrar, la imagen queda quieta: sin parallax, sin
 * zoom continuo, sin rotaciones. El unico hover es un scale a 1.01 --
 * apenas perceptible, y desactivado del todo con reduced-motion gracias al
 * prefijo `motion-safe:`.
 */
export function ContentBanner({
  backgroundImage,
  backgroundImageAlt,
  hotspot,
}: SeccionContenido) {
  const objectPosition = hotspot
    ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
    : "50% 50%";

  return (
    <section className="relative w-full">
      <Reveal y={20}>
        <div className="group relative h-[380px] w-full overflow-hidden sm:h-[440px] md:h-[520px] lg:h-[600px]">
          {backgroundImage ? (
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover motion-safe:transition-transform motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.01]"
              style={{ objectPosition }}
            />
          ) : (
            // Sin imagen todavia en Sanity: atmosfera de marca en vez de un
            // hueco. aria-hidden porque no comunica nada -- es el estado
            // "falta cargar la pieza", no contenido.
            <div aria-hidden="true" className="absolute inset-0 bg-canvas-raised">
              <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand/12 blur-[110px]" />
              <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-accent/12 blur-[110px]" />
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
