import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, InstagramLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { BotonCta } from "@/components/BotonCta";
import { AtmosferaMar } from "@/components/marketing/AtmosferaMar";
import { perfilesRedes } from "@/config/company";
import { TEXTO_CTA, enlaceFormulario } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Mira nuestro trabajo | DOFI Agencia Creativa",
  description: "Las redes de DOFI y de Daniel Vallejo: mira lo que hacemos todos los días.",
};

/** Cada red con su ícono y el color de su marca, para la baldosa del ícono. */
const REDES = {
  instagram: {
    nombre: "Instagram",
    Icono: InstagramLogo,
    fondo: "bg-[linear-gradient(45deg,#FEDA75_0%,#D62976_45%,#962FBF_75%,#4F5BD5_100%)]",
  },
  tiktok: {
    nombre: "TikTok",
    Icono: TiktokLogo,
    fondo: "bg-black ring-1 ring-white/20",
  },
} as const;

/**
 * «Mira nuestro trabajo» (pedido del 2026-10-15): la página a la que lleva el
 * segundo botón del hero del Home. Una sola columna al estilo Linktree con los
 * perfiles de DOFI y de Daniel (src/config/company.ts → perfilesRedes), sobre
 * el fondo de marca de siempre.
 *
 * Cada tarjeta es un enlace completo (toda la tarjeta se puede tocar) que abre
 * el perfil en una pestaña nueva. En el teléfono la columna ocupa el ancho; en
 * escritorio se queda en 460 px, centrada. Todo entra en una pantalla.
 */
export default function RedesPage() {
  return (
    <>
      <Nav />
      <main>
        <section
          aria-labelledby="redes-titulo"
          className="pantalla relative isolate min-h-[100svh] overflow-hidden bg-abyss text-foam"
        >
          <div className="absolute inset-0 -z-10">
            <AtmosferaMar variante="cierre" />
          </div>

          <div className="relative mx-auto flex w-full max-w-[460px] flex-col items-center px-5 text-center">
            <Reveal y={14}>
              <Image
                src="/logo-dofi.png"
                alt="DOFI Agencia Creativa"
                width={640}
                height={654}
                priority
                className="h-auto w-[88px] sm:w-[104px]"
              />
            </Reveal>

            <Reveal y={14} delay={0.06}>
              <h1
                id="redes-titulo"
                className="mt-6 text-balance font-display text-[clamp(2rem,1.4rem+2.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              >
                Mira nuestro trabajo
              </h1>
              <p className="mx-auto mt-3 max-w-[34ch] font-sans text-base leading-relaxed text-foam/75 sm:text-lg">
                Síguenos y mira lo que hacemos todos los días.
              </p>
            </Reveal>

            <ul className="mt-9 flex w-full flex-col gap-3.5">
              {perfilesRedes.map((perfil, i) => {
                const red = REDES[perfil.red];
                return (
                  <li key={perfil.href}>
                    <Reveal y={14} delay={0.12 + i * 0.06}>
                      <a
                        href={perfil.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-[76px] items-center gap-4 rounded-[22px] border border-white/15 bg-white/[0.07] p-3 pr-5 text-left shadow-[0_24px_48px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-[background-color,border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-lift focus-visible:ring-offset-2 focus-visible:ring-offset-abyss motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] text-white ${red.fondo}`}
                        >
                          <red.Icono size={28} weight="bold" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-lg font-bold leading-tight text-foam">{perfil.nombre}</span>
                          <span className="mt-0.5 block truncate font-sans text-[15px] text-foam/70">
                            {red.nombre} · {perfil.usuario}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={20}
                          weight="bold"
                          aria-hidden="true"
                          className="shrink-0 text-foam/60 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-lift"
                        />
                        <span className="sr-only">(se abre en una pestaña nueva)</span>
                      </a>
                    </Reveal>
                  </li>
                );
              })}
            </ul>

            <Reveal y={14} delay={0.34} className="mt-9">
              <BotonCta texto={TEXTO_CTA} enlace={enlaceFormulario()} />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
