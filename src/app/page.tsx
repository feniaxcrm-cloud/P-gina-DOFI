import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ContentSection } from "@/components/ContentSection";
import { LogoWall } from "@/components/LogoWall";
import { Services } from "@/components/Services";
import { Socio } from "@/components/Socio";
import { Tools } from "@/components/Tools";
import { Clients } from "@/components/Clients";
import { Manifesto } from "@/components/Manifesto";
import { Process } from "@/components/Process";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getPaginaInicio, type SeccionData } from "@/lib/sanity";

/**
 * Diccionario _type -> componente para las 3 secciones que traen su texto
 * de Sanity (paginaInicio.secciones[], ver src/lib/sanity.ts). Cada una se
 * busca por tipo y se pinta en un lugar FIJO del orden de la home (ver nota
 * en Home mas abajo) — ya no se recorren en el orden del arreglo.
 *
 * `Record<SeccionData["_type"], ...>` obliga a TypeScript a exigir que
 * TODOS los _types de la union tengan renderer: si se agrega un tipo a
 * SeccionData sin registrar su renderer aca, el build falla en vez de
 * mostrar un hueco en la pagina.
 */
const RENDERERS: Record<
  SeccionData["_type"],
  (seccion: SeccionData, key: string) => React.ReactNode
> = {
  seccionHacemos: (seccion, key) => {
    if (seccion._type !== "seccionHacemos") return null;
    const { titulo, subtitulo, tarjetas } = seccion;
    return (
      <Services key={key} titulo={titulo} subtitulo={subtitulo} tarjetas={tarjetas} />
    );
  },
  seccionSocio: (seccion, key) => {
    if (seccion._type !== "seccionSocio") return null;
    const { nombre, descripcion, foto } = seccion;
    return <Socio key={key} nombre={nombre} descripcion={descripcion} foto={foto} />;
  },
  seccionCierre: (seccion, key) => {
    if (seccion._type !== "seccionCierre") return null;
    const { titulo, textoBoton, enlace } = seccion;
    return (
      <Contact key={key} titulo={titulo} textoBoton={textoBoton} enlace={enlace} />
    );
  },
};

/**
 * Home.
 *
 * ORDEN FIJO pedido explicitamente (ya no es "el orden que traiga
 * secciones[] de Sanity", como era antes de este cambio):
 *
 *   1. Hero              - introduccion (incluye las 4 tarjetas de capacidades)
 *   1.5 ContentSection x4 - secciones de contenido (Sprint "Crear 4
 *                          secciones de contenido debajo del Hero"),
 *                          inmediatamente debajo de las tarjetas, antes de
 *                          LogoWall. Alternancia texto/imagen e index de
 *                          fondo salen de la posicion en el arreglo (ver
 *                          ContentSection.tsx) -- nunca de un campo manual.
 *   2. LogoWall + Clients - clientes con los que ya trabajamos
 *   3. Services (seccionHacemos) - servicios
 *   4. Process           - procesos
 *   5. Manifesto         - no pedido explicitamente; se deja como transicion
 *                          justo despues de Procesos (antes vivia entre
 *                          Clientes y Procesos). Mover o quitar si no
 *                          corresponde.
 *   6. Tools             - herramientas
 *   7. Socio (seccionSocio) - socio
 *   8. Contact (seccionCierre) - formulario, ahora si fijo al final
 *
 * "Resultados" (item de la lista original) se salteo a proposito: no
 * existe todavia como seccion ni hay datos reales que mostrar.
 *
 * Hacemos/Socio/Cierre siguen trayendo su TEXTO de Sanity
 * (getSeccionesPaginaInicio(), con respaldo si falta algo), pero su
 * POSICION en la pagina ya no depende del orden del arreglo "secciones"
 * en el Studio: se buscan por _type y se pintan cada una en su lugar fijo
 * de la lista de arriba. Si mas adelante se vuelve a querer reordenarlas
 * desde Sanity, hay que volver al patron anterior (secciones.map(...)).
 *
 * Hero, LogoWall, Tools, Clients, Manifesto y Process no tienen tipo de
 * documento en Sanity: su contenido sigue fijo en cada componente.
 */
export default async function Home() {
  const { secciones, hero, capacidades, seccionesContenido } = await getPaginaInicio();
  const porTipo = (tipo: SeccionData["_type"]) =>
    secciones.find((s) => s._type === tipo);

  const hacemos = porTipo("seccionHacemos");
  const socio = porTipo("seccionSocio");
  const cierre = porTipo("seccionCierre");

  return (
    <>
      <Nav />
      <main>
        <Hero content={hero} capacidades={capacidades} />

        {seccionesContenido.map((seccion, i) => (
          <ContentSection key={seccion.titulo} {...seccion} index={i} />
        ))}

        <LogoWall />
        <Clients />

        {hacemos && RENDERERS.seccionHacemos(hacemos, "hacemos")}

        <Process />
        <Manifesto />

        <Tools />

        {socio && RENDERERS.seccionSocio(socio, "socio")}

        {cierre && RENDERERS.seccionCierre(cierre, "cierre")}
      </main>
      <Footer />
    </>
  );
}
