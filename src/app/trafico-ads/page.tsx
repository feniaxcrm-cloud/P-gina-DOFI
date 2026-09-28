import type { Metadata } from "next";
import { PaginaServicio } from "@/components/marketing/PaginaServicio";

export const metadata: Metadata = {
  title: "Tráfico / Ads | DOFI Agencia Creativa",
};

export default function TraficoAdsPage() {
  return <PaginaServicio tipo="traficoAdsPage" titulo="Tráfico / Ads" />;
}
