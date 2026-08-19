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
import { getSeccionCierre } from "@/lib/sanity";

export default async function Home() {
  // Contact es "use client" (maneja el formulario) y no puede hacer su
  // propio fetch async, asi que el texto de seccionCierre se trae aca y
  // baja como props. Ver src/lib/sanity.ts.
  const cierre = await getSeccionCierre();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        <Services />
        <Socio />
        <Tools />
        <Clients />
        <Manifesto />
        <Process />
        <Contact
          slogan={cierre.slogan}
          formularioTitulo={cierre.formularioTitulo}
          formularioSubtitulo={cierre.formularioSubtitulo}
        />
      </main>
      <Footer />
    </>
  );
}
