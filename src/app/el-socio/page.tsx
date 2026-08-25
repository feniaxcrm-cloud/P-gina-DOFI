import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "El Socio | DOFI Agencia Creativa",
};

export default function ElSocioPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="El Socio" />
      </main>
      <Footer />
    </>
  );
}
