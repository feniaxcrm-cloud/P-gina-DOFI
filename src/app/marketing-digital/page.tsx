import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BannerFoto } from "@/components/marketing/BannerFoto";
import { PiezaGrafica } from "@/components/marketing/PiezaGrafica";
import { NavegacionEditorial } from "@/components/marketing/NavegacionEditorial";
import { MetodoDofi } from "@/components/marketing/MetodoDofi";
import { ClientesCasos } from "@/components/marketing/ClientesCasos";
import { ResenasGoogle } from "@/components/marketing/ResenasGoogle";
import {
  getPaginaMarketingDigital,
  type SeccionMarketing,
  type TipoSeccion,
} from "@/lib/marketing-digital";

export const metadata: Metadata = {
  title: "Marketing Digital | DOFI Agencia Creativa",
  description:
    "Todo lo que necesitas para hacer crecer tu negocio, en un solo equipo. DOFI Agencia Creativa, Cuenca - Ecuador.",
};

/**
 * Marketing Digital. Sin Hero tradicional: la pagina ES su lista de
 * secciones, en el orden de `sections[]` en Sanity (se reordena arrastrando
 * en el Studio). Cada tipo de seccion tiene su componente; un tipo que este
 * codigo no conoce se ignora sin romper la pagina.
 *
 * ENCABEZADOS: la PRIMERA seccion lleva el <h1> y todas las demas <h2>, sea
 * cual sea su tipo. Asi, si el orden cambia en el Studio, la pagina sigue
 * teniendo exactamente un h1.
 *
 * ANCLAS: cada tipo tiene un id estable (#equipo, #metodo, ...). Si un tipo
 * se repite, las siguientes llevan sufijo (#metodo-2).
 */
const ANCLA: Record<TipoSeccion, string> = {
  teamBanner: "equipo",
  aboutBanner: "que-es-dofi",
  navigationBanner: "como-navegamos",
  methodBanner: "metodo",
  clientsBanner: "clientes",
  reviewsBanner: "resenas",
  ctaBanner: "socios",
};

function Seccion({
  seccion,
  id,
  nivel,
  prioridad,
}: {
  seccion: SeccionMarketing;
  id: string;
  nivel: "h1" | "h2";
  prioridad: boolean;
}) {
  switch (seccion.tipo) {
    case "teamBanner":
    case "ctaBanner":
      return <BannerFoto seccion={seccion} id={id} nivel={nivel} prioridad={prioridad} />;
    case "aboutBanner":
      return <PiezaGrafica seccion={seccion} id={id} nivel={nivel} />;
    case "navigationBanner":
      return <NavegacionEditorial seccion={seccion} id={id} nivel={nivel} />;
    case "methodBanner":
      return <MetodoDofi seccion={seccion} id={id} nivel={nivel} />;
    case "clientsBanner":
      return <ClientesCasos seccion={seccion} id={id} nivel={nivel} />;
    case "reviewsBanner":
      return <ResenasGoogle seccion={seccion} id={id} nivel={nivel} />;
  }
}

export default async function MarketingDigitalPage() {
  const { secciones } = await getPaginaMarketingDigital();
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
              prioridad={i === 0}
            />
          );
        })}
      </main>
      <Footer />
    </>
  );
}
