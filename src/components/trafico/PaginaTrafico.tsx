import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MetodoDofi } from "@/components/marketing/MetodoDofi";
import { NavegacionEditorial } from "@/components/marketing/NavegacionEditorial";
import { PiezaGrafica } from "@/components/marketing/PiezaGrafica";
import { ResenasGoogle } from "@/components/marketing/ResenasGoogle";
import { getPaginaTrafico, type SeccionTrafico, type TipoSeccionTrafico } from "@/lib/trafico";
import { TraficoCierre } from "./TraficoCierre";
import { TraficoClientes } from "./TraficoClientes";
import { TraficoEcosistema } from "./TraficoEcosistema";
import { TraficoPlataformas } from "./TraficoPlataformas";
import { TraficoPortada } from "./TraficoPortada";

/**
 * Pagina Tráfico/Ads. Mismo patron que /marketing-digital: la pagina ES su
 * lista de secciones, en el orden de `sections[]` en Sanity (se reordena
 * arrastrando en el Studio); la primera lleva el <h1> y el resto <h2>, sea
 * cual sea su tipo; anclas estables por tipo (#sistema, #plataformas...). Un
 * tipo que este codigo no conoce se ignora sin romper la pagina.
 *
 * Reutiliza los componentes de Marketing Digital donde la seccion es la misma
 * (Qué es -> PiezaGrafica, mapa -> NavegacionEditorial, método -> MetodoDofi
 * con los iconos de tráfico, reseñas) y tiene los suyos donde cambia: la
 * portada del problema, ¿Dónde traficamos?, el ecosistema, Clientes con el
 * panel de métricas de Meta y el cierre con la imagen a la derecha.
 */
const ANCLA: Record<TipoSeccionTrafico, string> = {
  teamBanner: "inicio",
  aboutBanner: "sistema",
  navigationBanner: "mapa",
  methodBanner: "datos",
  platformsBanner: "plataformas",
  ecosystemBanner: "ecosistema",
  metricsClientsBanner: "clientes",
  reviewsBanner: "resenas",
  ctaImageBanner: "contacto",
};

function Seccion({ seccion, id, nivel }: { seccion: SeccionTrafico; id: string; nivel: "h1" | "h2" }) {
  switch (seccion.tipo) {
    case "teamBanner":
      return <TraficoPortada seccion={seccion} id={id} nivel={nivel} />;
    case "ctaImageBanner":
      return <TraficoCierre seccion={seccion} id={id} nivel={nivel} />;
    case "aboutBanner":
      return <PiezaGrafica seccion={seccion} id={id} nivel={nivel} />;
    case "navigationBanner":
      return <NavegacionEditorial seccion={seccion} id={id} nivel={nivel} />;
    case "methodBanner":
      return <MetodoDofi seccion={seccion} id={id} nivel={nivel} iconos="trafico" />;
    case "platformsBanner":
      return <TraficoPlataformas seccion={seccion} id={id} nivel={nivel} />;
    case "ecosystemBanner":
      return <TraficoEcosistema seccion={seccion} id={id} nivel={nivel} />;
    case "metricsClientsBanner":
      return <TraficoClientes seccion={seccion} id={id} nivel={nivel} />;
    case "reviewsBanner":
      return <ResenasGoogle seccion={seccion} id={id} nivel={nivel} />;
  }
}

export async function PaginaTrafico() {
  const { secciones } = await getPaginaTrafico();
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
