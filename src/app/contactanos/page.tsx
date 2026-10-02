import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AtmosferaMar } from "@/components/marketing/AtmosferaMar";
import { FormularioContacto } from "@/components/contacto/FormularioContacto";

export const metadata: Metadata = {
  title: "Contáctanos | DOFI Agencia Creativa",
  description: "Cuéntanos qué necesitas y te escribimos por WhatsApp para empezar a mejorar tus ventas.",
};

/**
 * El formulario al que llevan los botones de los banners finales de todas las
 * paginas (y "Contáctanos" del menu). Cuatro campos y, al enviar, WhatsApp con
 * el mensaje armado: ver FormularioContacto y src/lib/cta.ts.
 *
 * La pagina es estatica: el servicio de la pagina de origen (?servicio=) lo
 * lee el formulario en el navegador.
 */
export default function ContactanosPage() {
  return (
    <>
      <Nav />
      <main>
        <section aria-labelledby="contacto-titulo" className="relative isolate overflow-hidden bg-abyss text-foam">
          <div className="absolute inset-0 -z-10">
            <AtmosferaMar variante="cierre" />
          </div>

          <div className="relative mx-auto grid w-full max-w-page grid-cols-1 gap-12 px-5 pb-20 pt-32 sm:px-6 md:px-10 md:pb-28 md:pt-40 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="mb-6 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
                Contáctanos
              </p>
              <h1
                id="contacto-titulo"
                className="max-w-[14ch] text-balance font-display text-[clamp(2.25rem,1.4rem+3.4vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              >
                Cuéntanos qué necesitas
              </h1>
              <p className="mt-6 max-w-[40ch] font-sans text-lg leading-relaxed text-foam/85">
                Llena el formulario y abrimos WhatsApp con tu mensaje listo. Así empezamos a mejorar tus ventas.
              </p>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <div className="rounded-[28px] border border-white/15 bg-abyss/60 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] backdrop-blur-md sm:p-8 md:p-10">
                <FormularioContacto />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
