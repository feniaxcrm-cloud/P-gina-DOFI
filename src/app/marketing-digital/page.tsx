import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BannerFoto } from "@/components/marketing/BannerFoto";
import { PiezaGrafica } from "@/components/marketing/PiezaGrafica";
import { MetodoDofi } from "@/components/marketing/MetodoDofi";
import { ClientesCasos } from "@/components/marketing/ClientesCasos";
import { ResenasGoogle } from "@/components/marketing/ResenasGoogle";
import { getPaginaMarketingDigital } from "@/lib/marketing-digital";

export const metadata: Metadata = {
  title: "Marketing Digital | DOFI Agencia Creativa",
  description:
    "Un equipo de marketing digital completo a una fracción de lo que te costaría contratarlo. DOFI Agencia Creativa, Cuenca - Ecuador.",
};

/**
 * Marketing Digital. Sin Hero tradicional: siete banners que cuentan una
 * historia -- Historia -> Confianza -> Metodo -> Resultados -> Conversion.
 *
 * Todo sale del documento "marketingDigitalPage" de Sanity (ver
 * src/lib/marketing-digital.ts). Si falta, la pagina se arma con el copy del
 * brief; si falta una imagen, cada seccion tiene su propio estado vacio
 * diseñado, asi que la pagina nunca muestra un hueco.
 */
export default async function MarketingDigitalPage() {
  const p = await getPaginaMarketingDigital();

  return (
    <>
      <Nav />
      <main>
        <BannerFoto data={p.equipo} id="equipo" nivel="h1" prioridad />
        <PiezaGrafica data={p.queEs} id="que-es-dofi" />
        <PiezaGrafica data={p.navegamos} id="como-navegamos" invertido />
        <MetodoDofi data={p.metodo} />
        <ClientesCasos data={p.clientes} />
        <ResenasGoogle data={p.resenas} />
        <BannerFoto data={p.ctaFinal} id="socios" variante="cierre" />
      </main>
      <Footer />
    </>
  );
}
