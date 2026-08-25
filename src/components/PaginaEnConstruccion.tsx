import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

/**
 * Placeholder minimo para rutas que el Navbar V1 necesita que existan
 * (/feniax, /el-socio, /clientes, /contactanos) pero que todavia no tienen
 * contenido ni diseño propio — eso es trabajo de un sprint aparte.
 *
 * A proposito NO inventa copy de marca, servicios ni oferta: solo confirma
 * que la ruta existe y funciona, para poder probar la navegacion real del
 * Navbar sin publicar contenido que nadie escribio todavia.
 */
export function PaginaEnConstruccion({ titulo }: { titulo: string }) {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden pt-32 pb-24 md:pt-40">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,#2A1760_0%,#170D33_55%,#120A26_100%)]"
      />
      <div className="relative mx-auto max-w-page px-5 text-center md:px-8">
        <p className="font-sans text-sm font-medium uppercase tracking-[0.14em] text-fg-subtle">
          {titulo}
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tighter text-fg-primary md:text-6xl">
          Página en construcción
        </h1>
        <p className="mx-auto mt-6 max-w-copy font-sans text-lg text-fg-muted">
          Esta sección todavía no tiene contenido definitivo. La ruta ya
          existe y navega correctamente — el diseño llega en un sprint
          propio.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 font-sans text-sm text-fg-muted transition-colors duration-300 hover:text-fg-primary"
        >
          <ArrowLeft size={16} weight="bold" />
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
