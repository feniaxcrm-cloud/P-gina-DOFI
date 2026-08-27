import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "Tráfico / Ads | DOFI Agencia Creativa",
};

export default function TraficoAdsPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="Tráfico / Ads" />
      </main>
      <Footer />
    </>
  );
}
