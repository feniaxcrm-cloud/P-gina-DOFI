import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PaginaEnConstruccion } from "@/components/PaginaEnConstruccion";

export const metadata: Metadata = {
  title: "Clientes | DOFI Agencia Creativa",
};

/**
 * Indice de /clientes. Coexiste con /clientes/[slug] (las 26 paginas de
 * caso ya existentes, que siguen funcionando igual). Este sprint solo
 * necesitaba que la ruta base existiera para que el Navbar pudiera
 * enlazarla y marcarla activa; el listado real de cuentas es contenido de
 * un sprint aparte (hoy ese listado ya vive en la home, seccion Clientes).
 */
export default function ClientesPage() {
  return (
    <>
      <Nav />
      <main>
        <PaginaEnConstruccion titulo="Clientes" />
      </main>
      <Footer />
    </>
  );
}
