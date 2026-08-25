import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "Contáctanos | DOFI Agencia Creativa",
};

/**
 * El formulario real (Contact.tsx, conectado a /api/contacto y a Sanity)
 * sigue viviendo en la home como seccion #contacto — no se toca en este
 * sprint (punto 30). Esta ruta es solo el destino de "CONTÁCTANOS" y
 * "Empecemos" en el Navbar; moverle el formulario de verdad es trabajo del
 * sprint de paginas internas.
 */
export default function ContactanosPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="Contáctanos" />
      </main>
      <Footer />
    </>
  );
}
