import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "Contáctanos | DOFI Agencia Creativa",
};

/**
 * El formulario real (Contact.tsx, conectado a /api/contacto y a Sanity)
 * vivía en la home como sección #contacto. Sprint "Retirar secciones entre
 * Sección 4 y el Footer": Contact.tsx dejó de pintarse en la home (sigue
 * existiendo el componente y sus datos en Sanity, solo no se renderiza ahí
 * por ahora) — el ancla #contacto ya no tiene destino en "/". Esta ruta es
 * solo el destino de "CONTÁCTANOS" y "Empecemos" en el Navbar; moverle el
 * formulario de verdad es trabajo del sprint de páginas internas.
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
