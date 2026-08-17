import { Reveal } from "./Reveal";
import { ClientsCarousel } from "./ClientsCarousel";

/**
 * Galeria de clientes, en carrusel.
 *
 * Muestra 3 tarjetas a la vez y avanza sola cada 5 segundos (ver
 * ClientsCarousel). Cada tarjeta enlaza a su pagina /clientes/[slug].
 *
 * Familia de layout propia, distinta de la lista de servicios y del bento
 * de herramientas.
 *
 * Las portadas son provisionales. Reemplaza el campo `cover` de cada cuenta
 * en src/data/clients.ts por la foto real.
 */
export function Clients() {
  return (
    <section id="clientes" className="relative bg-abyss py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal className="max-w-[40rem]">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            Clientes
          </p>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tighter text-foam md:text-6xl">
            Marcas que ya están en el agua
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-mist">
            Cada cuenta con su reto, sus piezas y sus resultados. Entra a
            cualquiera para ver el trabajo completo.
          </p>
        </Reveal>

        <ClientsCarousel />
      </div>
    </section>
  );
}
