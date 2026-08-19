"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";
import { MagneticCta } from "./MagneticCta";

// Los anchors llevan "/" delante para que funcionen desde cualquier ruta,
// no solo desde la home (ej. /clientes/[slug]). En la home igual hacen scroll.
const links = [
  { label: "Servicios", href: "/#servicios" },
  { label: "El Socio", href: "/#socio" },
  { label: "Herramientas", href: "/#herramientas" },
  { label: "Clientes", href: "/#clientes" },
  { label: "Proceso", href: "/#proceso" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Motivo: la barra gana contraste al salir del hero para no perder legibilidad.
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={false}
        animate={{
          backgroundColor: solid ? "rgba(18,10,38,0.82)" : "rgba(18,10,38,0)",
          borderColor: solid ? "rgba(109,75,201,0.28)" : "rgba(109,75,201,0)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="border-b backdrop-blur-xl"
      >
        <nav className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/" aria-label="DOFI Agencia Creativa, inicio">
            <Wordmark size="sm" />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative font-sans text-sm text-fog transition-colors duration-300 hover:text-foam"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* El ocultado va en un contenedor, no en el propio boton: la clase
                base del boton ya trae inline-flex y le ganaba a hidden por
                orden de las reglas en el CSS generado. */}
            <div className="hidden sm:block">
              <MagneticCta href="/#contacto">Iniciar proyecto</MagneticCta>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Cerrar menu" : "Abrir menu"}
              className="rounded-full border border-brand-lift/40 p-2.5 text-foam lg:hidden"
            >
              {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </nav>
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-brand-lift/25 bg-abyss/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1400px] flex-col gap-1 px-5 py-4">
            {[...links, { label: "Iniciar proyecto", href: "/#contacto" }].map(
              (l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-[12px] px-3 py-3 font-display text-base text-foam transition-colors hover:bg-surface"
                  >
                    {l.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </motion.div>
      )}
    </header>
  );
}
