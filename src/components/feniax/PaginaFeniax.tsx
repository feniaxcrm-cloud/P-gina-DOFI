import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPaginaFeniax, type SeccionFeniax, type TipoSeccionFeniax } from "@/lib/feniax";
import { FeniaxPortada } from "./FeniaxPortada";
import { FeniaxQueEs } from "./FeniaxQueEs";
import { FeniaxEditorial } from "./FeniaxEditorial";
import { FeniaxMetodo } from "./FeniaxMetodo";
import { FeniaxClientes } from "./FeniaxClientes";
import { FeniaxResenas } from "./FeniaxResenas";
import { FeniaxCierre } from "./FeniaxCierre";

/**
 * Página FENIAX / ChatBots-CRM. Mismo patrón que /marketing-digital: la
 * página ES su lista de secciones, en el orden de `sections[]` en Sanity; la
 * primera lleva el <h1> y el resto <h2>; anclas estables por tipo.
 *
 * Todo el <main> va dentro de .tema-feniax (globals.css): los tokens de
 * color pasan a la paleta del brandbook de FENIAX. Nav y Footer quedan
 * afuera -- son el marco del sitio DOFI.
 */
const ANCLA: Record<TipoSeccionFeniax, string> = {
  teamBanner: "inicio-feniax",
  aboutBanner: "que-es-feniax",
  navigationBanner: "como-funciona",
  methodBanner: "metodo",
  chatClientsBanner: "clientes",
  reviewsBanner: "resenas",
  ctaBanner: "contacto",
};

function Seccion({ seccion, id, nivel }: { seccion: SeccionFeniax; id: string; nivel: "h1" | "h2" }) {
  switch (seccion.tipo) {
    case "teamBanner":
      return <FeniaxPortada seccion={seccion} id={id} nivel={nivel} />;
    case "aboutBanner":
      return <FeniaxQueEs seccion={seccion} id={id} nivel={nivel} />;
    case "navigationBanner":
      return <FeniaxEditorial seccion={seccion} id={id} nivel={nivel} />;
    case "methodBanner":
      return <FeniaxMetodo seccion={seccion} id={id} nivel={nivel} />;
    case "chatClientsBanner":
      return <FeniaxClientes seccion={seccion} id={id} nivel={nivel} />;
    case "reviewsBanner":
      return <FeniaxResenas seccion={seccion} id={id} nivel={nivel} />;
    case "ctaBanner":
      return <FeniaxCierre seccion={seccion} id={id} nivel={nivel} />;
  }
}

export async function PaginaFeniax() {
  const { secciones } = await getPaginaFeniax();
  const vistas = new Map<string, number>();

  return (
    <>
      <Nav />
      <main className="tema-feniax bg-canvas">
        {secciones.map((seccion, i) => {
          const base = ANCLA[seccion.tipo];
          const n = (vistas.get(base) ?? 0) + 1;
          vistas.set(base, n);
          return (
            <Seccion key={seccion.key} seccion={seccion} id={n === 1 ? base : `${base}-${n}`} nivel={i === 0 ? "h1" : "h2"} />
          );
        })}
      </main>
      <Footer />
    </>
  );
}
