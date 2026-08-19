import { ServiceRow, type Service, type ServiceIcon } from "./ServiceRow";
import { getSeccionHacemos, getSeccionPilares } from "@/lib/sanity";

// Sanity no maneja el icono de cada fila (megaphone/funnel/sparkle): se
// asigna por posicion, en el mismo orden en que ya estaban las 3 filas
// (Marketing, CRM, IA). Si algun dia hay mas de 3 pilares, los que se pasen
// de este arreglo caen en "sparkle" en vez de romper.
const ICONOS_POR_ORDEN: ServiceIcon[] = ["megaphone", "funnel", "sparkle"];

/**
 * Servicios como lista editorial.
 *
 * Se descarto la fila de tres tarjetas iguales: con tres elementos se ve
 * vacia y es el patron mas templado que existe. Las filas a ancho completo
 * dejan respirar la tipografia y dan un lugar natural a la microanimacion.
 *
 * La seccion se renderiza en el servidor; solo cada fila es isla de cliente.
 *
 * Titulo, bajada y las 3 filas (titulo/descripcion/etiquetas de cada una)
 * vienen de Sanity: seccionHacemos y seccionPilares, ver src/lib/sanity.ts.
 * ServiceRow no cambio nada: "etiquetas" llega como texto unido con ", "
 * para reproducir exactamente el mismo renglon de metadato que ya existia.
 */
export async function Services() {
  const [{ titulo, descripcion }, pilares] = await Promise.all([
    getSeccionHacemos(),
    getSeccionPilares(),
  ]);

  const services: Service[] = pilares.map((p, i) => ({
    name: p.titulo,
    body: p.descripcion,
    includes: p.etiquetas.join(", "),
    icon: ICONOS_POR_ORDEN[i] ?? "sparkle",
  }));

  return (
    <section id="servicios" className="relative bg-abyss py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="max-w-[34rem]">
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tighter text-foam md:text-6xl">
            {titulo}
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-mist">
            {descripcion}
          </p>
        </div>

        <ul className="mt-20 border-t border-brand-lift/20">
          {services.map((service, i) => (
            <ServiceRow key={service.name} service={service} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
