import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ContentBanner } from "@/components/ContentBanner";
import { Footer } from "@/components/Footer";
import { getPaginaInicio } from "@/lib/sanity";

/**
 * Home.
 *
 * ORDEN FIJO pedido explicitamente:
 *
 *   1. Hero              - introduccion (incluye las 4 tarjetas de capacidades)
 *   2. ContentBanner x4  - los 4 banners full-width (Sprint "Banners
 *                          full-width"), inmediatamente debajo de las
 *                          tarjetas. Cada uno es una sola imagen de Sanity
 *                          a todo el ancho: la pieza grafica ES el diseño,
 *                          no hay texto ni botones en HTML.
 *   3. Footer
 *
 * Sprint "Retirar secciones entre Sección 4 y el Footer": LogoWall, Clients,
 * Services (seccionHacemos), Process, Manifesto, Tools, Socio (seccionSocio)
 * y Contact (seccionCierre) se sacaron del render -- la Sección 04 pasa a
 * ser lo ultimo que se ve antes del Footer. NO se borraron los archivos de
 * esos componentes (siguen en src/components/, listos para reincorporarse
 * si hace falta), solo dejaron de pintarse aca. Tampoco se tocaron sus datos
 * en Sanity (paginaInicio.secciones[] sigue trayendo Hacemos/Socio/Cierre,
 * getPaginaInicio() los sigue devolviendo) -- si el dia de mañana vuelven a
 * la pagina, no hay que volver a cargar nada en el Studio.
 *
 * OJO: el Footer y la pagina de detalle de cliente (/clientes/[slug]) tienen
 * enlaces ancla a #servicios/#socio/#herramientas/#clientes/#contacto que
 * apuntaban a algunas de estas secciones -- quedaron sin el ancla que
 * los recibe (no rompen, simplemente ya no scrollean a ningun lado). No se
 * tocaron esos archivos: no era parte de este pedido.
 */
export default async function Home() {
  const { hero, capacidades, seccionesContenido } = await getPaginaInicio();

  return (
    <>
      <Nav />
      <main>
        <Hero content={hero} capacidades={capacidades} />

        {seccionesContenido.map((banner) => (
          <ContentBanner key={banner.id} {...banner} />
        ))}
      </main>
      <Footer />
    </>
  );
}
