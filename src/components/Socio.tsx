import { MagneticCta } from "./MagneticCta";
import { Reveal } from "./Reveal";
import { SocioPortrait } from "./SocioPortrait";
import { getSeccionSocio } from "@/lib/sanity";

/**
 * Daniel Vallejo, El Socio.
 *
 * Familia de layout propia, distinta a todo lo demas de la pagina: el retrato
 * se ancla y queda fijo mientras el relato pasa al lado. Es CSS puro
 * (position: sticky), sin scroll hijack ni JS, asi que no puede romperse.
 *
 * La superficie sube a purpura profundo en vez de negro. Rompe la monotonia
 * sin invertir el tema, que se mantiene oscuro en toda la pagina.
 *
 * OJO CON EL TEXTO: la historia esta escrita en terminos verificables desde
 * el contexto del negocio. No lleva cifras ni fechas inventadas a proposito.
 * Daniel deberia revisarla y agregar los datos concretos que solo el conoce.
 *
 * Nombre, los dos primeros parrafos y el retrato vienen de Sanity
 * (seccionSocio, ver src/lib/sanity.ts). La cita en blockquote y el cierre
 * con el CTA se quedan estaticos: no estaban en los campos pedidos.
 */
export async function Socio() {
  const { nombre, parrafo1, parrafo2, imagen } = await getSeccionSocio();
  // "Daniel Vallejo" -> dos lineas, igual que el diseño original. Si el
  // nombre no trae espacio, se muestra completo en una sola linea.
  const espacio = nombre.indexOf(" ");
  const [primerNombre, apellido] =
    espacio === -1
      ? [nombre, null]
      : [nombre.slice(0, espacio), nombre.slice(espacio + 1)];

  return (
    // Sin overflow-hidden: un ancestro con overflow recortado anula el
    // position:sticky del retrato. El degradado ya queda acotado por ser
    // absolute inset-0, asi que el recorte no hacia falta.
    <section id="socio" className="relative bg-deep py-32 md:py-48">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,#2E1B68_0%,transparent_65%)]"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 md:px-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
        {/* Retrato. En desktop se queda fijo mientras el relato avanza. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SocioPortrait src={imagen} alt={`Retrato de ${nombre}`} />
        </div>

        <div className="max-w-[42rem]">
          <Reveal>
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              El Socio
            </p>
            <h2 className="mt-6 font-display text-5xl font-extrabold leading-[1] tracking-tighter text-foam md:text-7xl">
              {primerNombre}
              {apellido && (
                <>
                  <br />
                  {apellido}
                </>
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 space-y-6 font-sans text-lg leading-relaxed text-mist">
              <p>{parrafo1}</p>
              <p>{parrafo2}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <blockquote className="mt-16 border-l-2 border-accent pl-8">
              <p className="font-display text-2xl font-bold leading-snug tracking-tight text-foam md:text-4xl">
                Una marca no necesita más publicaciones. Necesita que cada
                persona que levanta la mano encuentre a alguien del otro lado.
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-16 border-t border-brand-lift/20 pt-10">
              <p className="max-w-[46ch] font-sans text-lg leading-relaxed text-mist">
                Si quieres esa conversación antes de hablar de presupuesto,
                empieza por aquí.
              </p>
              <div className="mt-8">
                <MagneticCta href="#contacto">Iniciar proyecto</MagneticCta>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
