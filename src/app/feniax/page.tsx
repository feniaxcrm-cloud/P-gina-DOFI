import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "FENIAX | DOFI Agencia Creativa",
};

export default function FeniaxPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="FENIAX" />
      </main>
      <Footer />
    </>
  );
}
