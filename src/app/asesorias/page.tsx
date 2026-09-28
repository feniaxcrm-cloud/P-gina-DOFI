import type { Metadata } from "next";
import { PaginaServicio } from "@/components/marketing/PaginaServicio";

export const metadata: Metadata = {
  title: "Asesorías | DOFI Agencia Creativa",
};

export default function AsesoriasPage() {
  return <PaginaServicio tipo="asesoriasPage" titulo="Asesorías" />;
}
