import { Reveal } from "./Reveal";
import { ClientsCarousel } from "./ClientsCarousel";
import { getActiveAccounts } from "@/lib/sanity";

/**
 * Galeria de clientes, en carrusel.
 *
 * Muestra 3 tarjetas a la vez y avanza sola cada 5 segundos (ver
 * ClientsCarousel). Cada tarjeta enlaza a su pagina /clientes/[slug].
 *
 * Familia de layout propia, distinta de la lista de servicios y del bento
 * de herramientas.
 *
 * Las cuentas se traen de Sanity (ver src/lib/sanity.ts) en el servidor;
 * ClientsCarousel y ClientCard reciben la lista ya lista, sin saber de
 * donde vino. Si Sanity no responde, getActiveAccounts() cae de vuelta a
 * src/data/clients.ts para que el carrusel nunca se rompa ni quede vacio.
 */
export async function Clients() {
  const clientes = await getActiveAccounts();

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

        <ClientsCarousel clients={clientes} />
      </div>
    </section>
  );
}
