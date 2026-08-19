import { ServiceRow, type Service, type ServiceIcon } from "./ServiceRow";

// Sanity no maneja el icono de cada fila (megaphone/funnel/sparkle): se
// asigna por posicion, en el mismo orden en que ya estaban las 3 filas
// (Marketing, CRM, IA). Si algun dia hay mas de 3 tarjetas, las que se
// pasen de este arreglo caen en "sparkle" en vez de romper.
const ICONOS_POR_ORDEN: ServiceIcon[] = ["megaphone", "funnel", "sparkle"];

export type ServicesProps = {
  titulo: string;
  subtitulo: string;
  tarjetas: { titulo: string; descripcion: string }[];
};

/**
 * Servicios como lista editorial.
 *
 * Se descarto la fila de tres tarjetas iguales: con tres elementos se ve
 * vacia y es el patron mas templado que existe. Las filas a ancho completo
 * dejan respirar la tipografia y dan un lugar natural a la microanimacion.
 *
 * La seccion se renderiza en el servidor; solo cada fila es isla de cliente.
 *
 * Presentacional: ya no hace su propio fetch. page.tsx trae
 * paginaInicio.secciones (ver src/lib/sanity.ts) de una sola vez y le pasa
 * a esta seccion la parte que le toca (_type "seccionHacemos") por props.
 * El esquema nuevo no trae "etiquetas" por tarjeta (el metadato fino que
 * ServiceRow mostraba bajo cada descripcion): ver ServiceRow.tsx, ese
 * renglon ahora es opcional y se omite si no hay dato.
 */
export function Services({ titulo, subtitulo, tarjetas }: ServicesProps) {
  const services: Service[] = tarjetas.map((t, i) => ({
    name: t.titulo,
    body: t.descripcion,
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
            {subtitulo}
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
