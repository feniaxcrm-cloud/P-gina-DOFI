import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";
import { BannerFoto } from "./BannerFoto";
import { PiezaGrafica } from "./PiezaGrafica";
import { NavegacionEditorial } from "./NavegacionEditorial";
import { MetodoDofi } from "./MetodoDofi";
import { getPaginaServicio, type SeccionServicio, type TipoPaginaServicio } from "@/lib/pagina-servicio";

/**
 * Cascarón compartido por las páginas de servicio (Tráfico/Ads, ChatBots/CRM,
 * Asesorías): mismo patrón que /marketing-digital/page.tsx -- secciones
 * dinámicas según `sections[]` en Sanity, h1 en la primera y h2 en el resto,
 * anclas estables por tipo -- factorizado acá porque las 3 páginas son
 * idénticas salvo el tipo de documento y el título. Sin secciones cargadas
 * todavía, muestra PaginaEnConstruccion en vez de inventar contenido.
 */
const ANCLA: Record<SeccionServicio["tipo"], string> = {
  teamBanner: "equipo",
  aboutBanner: "introduccion",
  navigationBanner: "como-trabajamos",
  methodBanner: "metodo",
  ctaBanner: "contacto",
};

function Seccion({ seccion, id, nivel }: { seccion: SeccionServicio; id: string; nivel: "h1" | "h2" }) {
  switch (seccion.tipo) {
    case "teamBanner":
    case "ctaBanner":
      return <BannerFoto seccion={seccion} id={id} nivel={nivel} prioridad={nivel === "h1"} />;
    case "aboutBanner":
      return <PiezaGrafica seccion={seccion} id={id} nivel={nivel} />;
    case "navigationBanner":
      return <NavegacionEditorial seccion={seccion} id={id} nivel={nivel} />;
    case "methodBanner":
      return <MetodoDofi seccion={seccion} id={id} nivel={nivel} />;
  }
}

export async function PaginaServicio({ tipo, titulo }: { tipo: TipoPaginaServicio; titulo: string }) {
  const { secciones } = await getPaginaServicio(tipo);
  const vistas = new Map<string, number>();

  return (
    <>
      <Nav />
      <main>
        {secciones.length === 0 ? (
          <PaginaEnConstruccion titulo={titulo} />
        ) : (
          secciones.map((seccion, i) => {
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
          })
        )}
      </main>
      <Footer />
    </>
  );
}
