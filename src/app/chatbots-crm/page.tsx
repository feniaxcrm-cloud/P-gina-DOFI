import type { Metadata } from "next";
import { PaginaServicio } from "@/components/marketing/PaginaServicio";

export const metadata: Metadata = {
  title: "ChatBots / CRM | DOFI Agencia Creativa",
};

export default function ChatbotsCrmPage() {
  return <PaginaServicio tipo="chatbotsCrmPage" titulo="ChatBots / CRM" />;
}
