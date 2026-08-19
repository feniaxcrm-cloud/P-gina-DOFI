import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LogoWall } from "@/components/LogoWall";
import { Services } from "@/components/Services";
import { Socio } from "@/components/Socio";
import { Tools } from "@/components/Tools";
import { Clients } from "@/components/Clients";
import { Manifesto } from "@/components/Manifesto";
import { Process } from "@/components/Process";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getSeccionesPaginaInicio, type SeccionData } from "@/lib/sanity";

/**
 * Diccionario _type -> componente para el bloque dinamico de la home.
 *
 * getSeccionesPaginaInicio() (ver src/lib/sanity.ts) trae, en UNA sola
 * consulta a Sanity, el arreglo "secciones[]" de paginaInicio ya validado
 * y con respaldo aplicado. Este objeto es la unica pieza que sabe traducir
 * cada _type a su componente visual: agregar una seccion nueva es agregar
 * una entrada aca, no reordenar JSX a mano.
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
 * "secciones[]" de Sanity (paginaInicio) hoy solo cubre Hacemos / Socio /
 * Cierre: son las que ya tienen forma y datos reales en el Studio (ver el
 * comentario grande en src/lib/sanity.ts para el detalle completo,
 * incluyendo por que seccionPilares todavia no esta aca). Ese bloque se
 * pinta con un .map() sobre RENDERERS, en el mismo orden en que Sanity
 * devuelve el arreglo: si lo reordenas en el Studio, la pagina cambia de
 * orden sola, sin tocar codigo.
 *
 * Hero, LogoWall, Tools, Clients, Manifesto y Process no tienen todavia un
 * tipo de documento en Sanity, asi que se quedan fijos en su lugar de
 * siempre, alrededor del bloque dinamico.
 *
 * OJO: como seccionCierre (el formulario de contacto) ahora es parte del
 * bloque dinamico, su posicion en la pagina depende del orden real que
 * tenga en Sanity. Hoy cae junto a Hacemos/Socio, ANTES de
 * Tools/Clients/Manifesto/Proceso, no al final como antes. Si prefieres
 * que el formulario siga siendo lo ultimo antes del pie de pagina,
 * ordenalo asi en el arreglo "secciones" del Studio.
 */
export default async function Home() {
  const secciones = await getSeccionesPaginaInicio();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        {secciones.map((seccion, i) =>
          RENDERERS[seccion._type](seccion, `${seccion._type}-${i}`)
        )}
        <Tools />
        <Clients />
        <Manifesto />
        <Process />
      </main>
      <Footer />
    </>
  );
}
