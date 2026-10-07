import type { Metadata } from "next";
import { PaginaFeniax } from "@/components/feniax/PaginaFeniax";

export const metadata: Metadata = {
  title: "FENIAX · ChatBots / CRM con IA | DOFI Agencia Creativa",
  description:
    "FENIAX conecta tu WhatsApp, Instagram, Facebook y TikTok a un CRM con inteligencia artificial que responde al instante y le da seguimiento a cada cliente. Ventas inteligentes, Cuenca - Ecuador.",
};

export default function ChatbotsCrmPage() {
  return <PaginaFeniax />;
}
