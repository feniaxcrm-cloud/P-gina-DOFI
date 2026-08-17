import { ServiceRow, type Service } from "./ServiceRow";

const services: Service[] = [
  {
    name: "Marketing Digital 360",
    body: "Una sola idea sostenida en todos los formatos, del concepto a la pauta.",
    includes: "Dirección creativa, producción audiovisual, contenidos, pauta",
    icon: "megaphone",
  },
  {
    name: "CRM",
    body: "Cada conversación queda registrada, asignada y medida. Nada se enfría en una bandeja.",
    includes: "Kommo, embudos, campos, automatizaciones, reportes",
    icon: "funnel",
  },
  {
    name: "Inteligencia Artificial",
    body: "Atención que no duerme: responde, califica y entrega el lead listo al vendedor.",
    includes: "Bots de WhatsApp, calificación automática, respuestas con contexto",
    icon: "sparkle",
  },
];

/**
 * Servicios como lista editorial.
 *
 * Se descarto la fila de tres tarjetas iguales: con tres elementos se ve
 * vacia y es el patron mas templado que existe. Las filas a ancho completo
 * dejan respirar la tipografia y dan un lugar natural a la microanimacion.
 *
 * La seccion se renderiza en el servidor; solo cada fila es isla de cliente.
 */
export function Services() {
  return (
    <section id="servicios" className="relative bg-abyss py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="max-w-[34rem]">
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tighter text-foam md:text-6xl">
            Lo que hacemos
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-mist">
            Tres frentes que se sostienen entre sí. La campaña atrae, el CRM
            ordena, la IA responde.
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
