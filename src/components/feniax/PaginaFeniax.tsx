import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPaginaFeniax, type SeccionClientesChat, type SeccionFeniax, type TipoSeccionFeniax } from "@/lib/feniax";
import { FeniaxPortada } from "./FeniaxPortada";
import type { ConversacionHero } from "./HeroConversaciones";
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

type ConversacionesHero = { conversaciones: ConversacionHero[]; rotacion: boolean };

function Seccion({
  seccion,
  id,
  nivel,
  hero,
}: {
  seccion: SeccionFeniax;
  id: string;
  nivel: "h1" | "h2";
  hero: ConversacionesHero;
}) {
  switch (seccion.tipo) {
    case "teamBanner":
      return <FeniaxPortada seccion={seccion} id={id} nivel={nivel} conversaciones={hero.conversaciones} rotacion={hero.rotacion} />;
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

  // El celular de la portada reproduce las conversaciones por giro que se
  // cargan en «Clientes» (solo la clave y el chat: el resto de cada giro no
  // viaja al navegador).
  const clientes = secciones.find((s): s is SeccionClientesChat => s.tipo === "chatClientsBanner");
  const hero: ConversacionesHero = {
    conversaciones: (clientes?.giros ?? []).map((g) => ({ clave: g.key, chat: g.chat })),
    rotacion: clientes?.rotacionAutomatica ?? true,
  };

  return (
    <>
      <Nav />
      <main className="tema-feniax bg-canvas">
        {secciones.map((seccion, i) => {
          const base = ANCLA[seccion.tipo];
          const n = (vistas.get(base) ?? 0) + 1;
          vistas.set(base, n);
          return (
            <Seccion key={seccion.key} seccion={seccion} id={n === 1 ? base : `${base}-${n}`} nivel={i === 0 ? "h1" : "h2"} hero={hero} />
          );
        })}
      </main>
      <Footer />
    </>
  );
}
