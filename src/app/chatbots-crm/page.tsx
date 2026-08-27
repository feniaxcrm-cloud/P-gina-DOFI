import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "ChatBots / CRM | DOFI Agencia Creativa",
};

export default function ChatbotsCrmPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="ChatBots / CRM" />
      </main>
      <Footer />
    </>
  );
}
