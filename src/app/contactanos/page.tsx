import type { Metadata } from "next";
import { ChatsCircle, NotePencil, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AtmosferaMar } from "@/components/marketing/AtmosferaMar";
import { FormularioContacto } from "@/components/contacto/FormularioContacto";

export const metadata: Metadata = {
  title: "Contáctanos | DOFI Agencia Creativa",
  description: "Cuéntanos qué necesitas y te escribimos por WhatsApp para empezar a mejorar tus ventas.",
};

/** Los tres pasos de siempre, dichos en corto: así la tarjeta del formulario
 *  solo tiene campos y el botón. */
const PASOS = [
  { Icono: NotePencil, texto: "Completa el formulario" },
  { Icono: ChatsCircle, texto: "Se abre WhatsApp con tu mensaje listo" },
  { Icono: PaperPlaneTilt, texto: "Lo envías y empezamos a mejorar tus ventas" },
];

/**
 * El formulario al que llevan los botones de los banners finales de todas las
 * paginas (y "Contáctanos" del menu). Cuatro campos y, al enviar, WhatsApp con
 * el mensaje armado: ver FormularioContacto y src/lib/cta.ts.
 *
 * MAS PREMIUM Y SENCILLO (pedido del 2026-10-07): el fondo de marca de
 * siempre, el texto a la izquierda con los tres pasos en corto y, a la
 * derecha, el formulario en una tarjeta clara con un halo de color. Todo en
 * una pantalla.
 *
 * La pagina es estatica: el servicio de la pagina de origen (?servicio=) lo
 * lee el formulario en el navegador.
 */
export default function ContactanosPage() {
  return (
    <>
      <Nav />
      <main>
        <section aria-labelledby="contacto-titulo" className="pantalla relative isolate overflow-hidden bg-abyss text-foam">
          <div className="absolute inset-0 -z-10">
            <AtmosferaMar variante="cierre" />
          </div>

          <div className="relative mx-auto grid w-full max-w-page grid-cols-1 items-center gap-12 px-5 sm:px-6 md:px-10 lg:grid-cols-12 lg:gap-16 lg:px-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-sans text-sm text-foam/90 backdrop-blur-sm">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-lift" />
                Contáctanos
              </p>
              <h1
                id="contacto-titulo"
                className="max-w-[14ch] text-balance font-display text-[clamp(2.25rem,min(1.4rem+3vw,8svh),3.75rem)] font-extrabold leading-[1.04] tracking-[-0.02em]"
              >
                Cuéntanos qué necesitas
              </h1>
              <p className="mt-[clamp(1rem,3svh,1.5rem)] max-w-[40ch] font-sans text-lg leading-relaxed text-foam/80">
                Llena el formulario y abrimos WhatsApp con tu mensaje listo. Así empezamos a mejorar tus ventas.
              </p>

              <ol className="mt-[clamp(1.5rem,5svh,2.5rem)] flex flex-col gap-3">
                {PASOS.map(({ Icono, texto }, i) => (
                  <li key={texto} className="flex items-center gap-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] text-accent-lift">
                      <Icono size={21} weight="duotone" aria-hidden="true" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent font-display text-[10.5px] font-bold text-fg-on-accent">
                        {i + 1}
                      </span>
                    </span>
                    <span className="font-sans text-[15.5px] text-foam/90">{texto}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative min-w-0 lg:col-span-7">
              {/* Halo: la tarjeta clara flota sobre el morado sin recuadro duro. */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_80%_10%,rgba(244,123,32,0.32)_0%,transparent_70%),radial-gradient(70%_70%_at_10%_100%,rgba(109,75,201,0.45)_0%,transparent_70%)] blur-2xl"
              />
              <div className="rounded-[28px] border border-white/60 bg-canvas p-5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.75)] sm:p-8 md:p-[clamp(1.75rem,4.4svh,2.5rem)]">
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
