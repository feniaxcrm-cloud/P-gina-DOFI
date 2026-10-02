import type { Metadata } from "next";
import { PaginaTrafico } from "@/components/trafico/PaginaTrafico";

export const metadata: Metadata = {
  title: "Tráfico / Ads | DOFI Agencia Creativa",
  description:
    "Convertimos la atención en tráfico estratégico: Meta Ads, TikTok Ads, Google Ads y tráfico web, medidos y optimizados con datos. DOFI Agencia Creativa, Cuenca - Ecuador.",
};

export default function TraficoAdsPage() {
  return <PaginaTrafico />;
}
