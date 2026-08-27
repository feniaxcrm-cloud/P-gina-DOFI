import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "Asesorías | DOFI Agencia Creativa",
};

export default function AsesoriasPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="Asesorías" />
      </main>
      <Footer />
    </>
  );
}
