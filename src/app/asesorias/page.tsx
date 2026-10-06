import type { Metadata } from "next";
import { PaginaAsesorias } from "@/components/asesorias/PaginaAsesorias";

export const metadata: Metadata = {
  title: "Asesorías 1 a 1 · Rescatando Emprendedores | DOFI Agencia Creativa",
  description:
    "Asesorías 1 a 1 con Dani: revisamos tu negocio a fondo, detectamos lo que está frenando tus ventas y sales con una ruta clara para crecer. Rescatando Emprendedores, Cuenca - Ecuador.",
};

export default function AsesoriasPage() {
  return <PaginaAsesorias />;
}
