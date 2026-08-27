import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "Marketing Digital | DOFI Agencia Creativa",
};

export default function MarketingDigitalPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="Marketing Digital" />
      </main>
      <Footer />
    </>
  );
}
