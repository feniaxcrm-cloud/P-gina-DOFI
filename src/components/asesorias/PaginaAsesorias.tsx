import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BannerFoto } from "@/components/marketing/BannerFoto";
import { MetodoDofi } from "@/components/marketing/MetodoDofi";
import { NavegacionEditorial } from "@/components/marketing/NavegacionEditorial";
import { PiezaGrafica } from "@/components/marketing/PiezaGrafica";
import { ResenasGoogle } from "@/components/marketing/ResenasGoogle";
import { getPaginaAsesorias, type SeccionAsesorias, type TipoSeccionAsesorias } from "@/lib/asesorias";
import { AsesoriasClientes } from "./AsesoriasClientes";
import { AsesoriasPortada } from "./AsesoriasPortada";

/**
 * Página Asesorías 1 a 1 · Rescatando Emprendedores. Mismo patrón que
 * /marketing-digital y /trafico-ads: la página ES su lista de secciones, en
 * el orden de `sections[]` en Sanity (se reordena arrastrando en el Studio);
 * la primera lleva el <h1> y el resto <h2>, sea cual sea su tipo; anclas
 * estables por tipo. Un tipo que este código no conoce se ignora sin romper.
 *
 * Reutiliza los componentes de Marketing Digital donde la sección es la misma
 * (¿Qué es...? → PiezaGrafica, reseñas, cierre) y tiene los suyos donde
 * cambia: la portada con logo e imagen, y Clientes con el mazo de casos.
 */
const ANCLA: Record<TipoSeccionAsesorias, string> = {
  splitHeroBanner: "inicio",
  aboutBanner: "rescatando-emprendedores",
  navigationBanner: "como-trabajamos",
  methodBanner: "metodo",
  casesClientsBanner: "clientes",
  reviewsBanner: "resenas",
  ctaBanner: "contacto",
};

function Seccion({ seccion, id, nivel }: { seccion: SeccionAsesorias; id: string; nivel: "h1" | "h2" }) {
  switch (seccion.tipo) {
    case "splitHeroBanner":
      return <AsesoriasPortada seccion={seccion} id={id} nivel={nivel} prioridad={nivel === "h1"} />;
    case "aboutBanner":
      return <PiezaGrafica seccion={seccion} id={id} nivel={nivel} />;
    case "navigationBanner":
      return <NavegacionEditorial seccion={seccion} id={id} nivel={nivel} />;
    case "methodBanner":
      return <MetodoDofi seccion={seccion} id={id} nivel={nivel} />;
    case "casesClientsBanner":
      return <AsesoriasClientes seccion={seccion} id={id} nivel={nivel} />;
    case "reviewsBanner":
      return <ResenasGoogle seccion={seccion} id={id} nivel={nivel} />;
    case "ctaBanner":
      return <BannerFoto seccion={seccion} id={id} nivel={nivel} prioridad={nivel === "h1"} />;
  }
}

export async function PaginaAsesorias() {
  const { secciones } = await getPaginaAsesorias();
  const vistas = new Map<string, number>();

  return (
    <>
      <Nav />
      <main>
        {secciones.map((seccion, i) => {
          const base = ANCLA[seccion.tipo];
          const n = (vistas.get(base) ?? 0) + 1;
          vistas.set(base, n);
          return (
            <Seccion
              key={seccion.key}
              seccion={seccion}
              id={n === 1 ? base : `${base}-${n}`}
              nivel={i === 0 ? "h1" : "h2"}
            />
          );
        })}
      </main>
      <Footer />
    </>
  );
}
