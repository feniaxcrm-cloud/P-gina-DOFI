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

export default function Home() {
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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
