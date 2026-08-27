"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";

/**
 * Navbar DOFI — flotante, multipagina, con capsula de pagina activa.
 *
 * Sobre RUTA (usePathname()), no scrollspy: DOFI es un sitio multipagina,
 * "donde estoy" lo decide la URL.
 *
 * FORMA
 * -----
 * Panel flotante con margen, radio y borde propios (no pegado al borde
 * superior). El bloque topbar + panel movil comparten un unico contenedor
 * con radio y `overflow-hidden`, asi que al abrir el menu se sigue viendo
 * como UNA sola pieza flotante, no dos rectangulos apilados.
 *
 * SUPERFICIE CLARA (Replanteo Navbar + Hero + Sanity, §6-10)
 * ------------------------------------------------------------
 * El nav paso de capsula oscura a vidrio claro: blanco calido translucido
 * + blur sutil + borde morado de opacidad baja. Nunca un bloque oscuro
 * pesado. El logo usa la variante recoloreada `tone="light"` (ver
 * Wordmark.tsx) porque el asset original es blanco puro — invisible sobre
 * esta superficie.
 *
 * PAGINA ACTIVA
 * -------------
 * Una sola capsula (`motion.span` con `layoutId`) vive dentro del link
 * activo. Al cambiar de ruta, React la desmonta de un link y la monta en
 * otro; Framer Motion interpola posicion y ancho entre ambos puntos
 * (proyeccion de layout compartido), sin que el codigo calcule ningun
 * pixel a mano. `type: "tween"` fuerza una curva lineal en vez del spring
 * por defecto: sin rebote, sin overshoot. Sobre claro: fondo morado muy
 * suave, texto morado profundo (spec §9) — nunca bloque oscuro.
 *
 * El hover NUNCA mueve esta capsula: el hover es puramente CSS (cambio de
 * color + un tinte de superficie mas debil que el de la capsula activa) y
 * no toca el layoutId en absoluto.
 */

/** Estrategia de "pagina activa" (ver Sprint, punto 8):
 *
 *   /               match EXACTO. Si en el futuro existen paginas de
 *                    servicio bajo DOFI (/marketing-digital, etc., ver
 *                    punto 29), NO deben marcar "DOFI" activo solo por
 *                    vivir bajo la marca — se decide cuando existan.
 *   /feniax/...      match por PREFIJO: cualquier pagina hija sigue
 *   /el-socio/...    marcando activa a su seccion. Root de contenido,
 *   /clientes/...    no root de marca: /clientes/taitico ya existe hoy
 *   /contactanos/... y debe marcar "CLIENTES" activo.
 */
type NavLink = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

const esRuta = (base: string) => (pathname: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

const LINKS: NavLink[] = [
  { label: "DOFI", href: "/", match: (p) => p === "/" },
  { label: "FENIAX", href: "/feniax", match: esRuta("/feniax") },
  { label: "EL SOCIO", href: "/el-socio", match: esRuta("/el-socio") },
  { label: "CLIENTES", href: "/clientes", match: esRuta("/clientes") },
  { label: "CONTÁCTANOS", href: "/contactanos", match: esRuta("/contactanos") },
];

/** La barra gana opacidad despues de este scroll (rango del sistema 24-48). */
const UMBRAL_SOLIDO = 32;

export function Nav() {
  const pathname = usePathname();
  const [solido, setSolido] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const reduce = useReducedMotion();
  const botonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const cerrar = useCallback((devolverFoco = false) => {
    setAbierto(false);
    if (devolverFoco) botonRef.current?.focus();
  }, []);

  // El menu no sobrevive a un cambio de ruta: sin esto, navegar por un
  // enlace del panel en un click brusco podia dejar el estado "abierto"
  // pegado en la pagina de destino antes de que el onClick lo cerrara.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // --- Fondo solido al bajar -------------------------------------------
  useEffect(() => {
    const alScroll = () => setSolido(window.scrollY > UMBRAL_SOLIDO);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // --- Escape cierra y devuelve el foco a la hamburguesa ----------------
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar(true);
    };
    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [abierto, cerrar]);

  // --- Pulsar fuera cierra ----------------------------------------------
  useEffect(() => {
    if (!abierto) return;
    const alPulsarFuera = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) cerrar();
    };
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => document.removeEventListener("pointerdown", alPulsarFuera);
  }, [abierto, cerrar]);

  // --- Bloqueo del scroll mientras el panel esta abierto -----------------
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  // --- Contenido de fondo inerte mientras el panel esta abierto ----------
  // Mismo mecanismo que el preflight de accesibilidad ya verificado: main y
  // footer quedan fuera del arbol de foco Y del arbol de accesibilidad con
  // el atributo nativo `inert` (sin libreria de focus trap). El <header>
  // queda fuera a proposito: el panel y la hamburguesa siguen alcanzables.
  useEffect(() => {
    if (!abierto) return;
    const fondo = [
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter((n): n is HTMLElement => n !== null);

    fondo.forEach((n) => n.setAttribute("inert", ""));
    return () => fondo.forEach((n) => n.removeAttribute("inert"));
  }, [abierto]);

  // --- Al pasar a escritorio, cerrar -------------------------------------
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const alCambiar = () => {
      if (mq.matches) setAbierto(false);
    };
    alCambiar();
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-2 z-50 px-5 sm:px-6 md:top-3 md:px-10 lg:px-12 xl:px-14"
    >
      <div className="mx-auto max-w-page">
        {/* Un unico contenedor con radio + overflow-hidden: la topbar y el
            panel movil (cuando existe) se ven como UNA pieza flotante. */}
        <div
          className={[
            "overflow-hidden rounded-[20px] border transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            // Vidrio claro (spec §7): blanco calido translucido + blur sutil
            // + borde morado de opacidad baja. El panel abierto y el estado
            // "solido" (tras scroll) suben la opacidad para que el texto de
            // la pagina detras nunca se transparente a traves del menu.
            abierto
              ? "border-brand/14 bg-canvas/96 backdrop-blur-xl"
              : solido
                ? "border-brand/14 bg-canvas/92 backdrop-blur-md"
                : "border-brand/10 bg-canvas/80 backdrop-blur-md",
          ].join(" ")}
        >
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:h-[70px] md:px-6">
            <Link
              href="/"
              aria-label="DOFI Agencia Creativa, inicio"
              className="shrink-0 rounded-lg"
            >
              <Wordmark size="sm" tone="light" />
            </Link>

            {/* ---------- Navegacion escritorio ---------- */}
            <nav aria-label="Navegación principal" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {LINKS.map((l) => {
                  const esActivo = l.match(pathname);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={esActivo ? "page" : undefined}
                        className={[
                          "relative inline-flex h-10 items-center whitespace-nowrap rounded-full px-5 font-sans text-[15px] font-medium transition-colors duration-200",
                          esActivo
                            ? "text-pill-active-fg"
                            : "text-ink-muted hover:bg-brand/6 hover:text-ink",
                        ].join(" ")}
                      >
                        {esActivo && (
                          <motion.span
                            layoutId="nav-active-pill"
                            className="absolute inset-0 rounded-full border border-brand/15 bg-pill-active-bg"
                            transition={
                              reduce
                                ? { duration: 0 }
                                : { type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                            }
                          />
                        )}
                        <span className="relative z-10">{l.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---------- Acciones ---------- */}
            <div className="flex shrink-0 items-center gap-3">
              {/* "Empecemos" es accion comercial; "CONTÁCTANOS" (arriba, en
                  la navegacion) es orientacion. Ambos llevan a /contactanos
                  pero coexisten: nunca se elimina uno por "redundante". Sin
                  animacion magnetica ni escala — solo color y una flecha
                  que se corre 4px. */}
              <Link
                href="/contactanos"
                className="group hidden h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent px-5 font-display text-button text-fg-on-accent transition-colors duration-200 hover:bg-accent-lift active:scale-[0.98] sm:inline-flex md:h-12"
              >
                Empecemos
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              {/* Version compacta sin flecha, solo <sm: a 360px el texto
                  completo con flecha no dejaba aire con la hamburguesa. */}
              <Link
                href="/contactanos"
                className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-4 font-display text-sm font-semibold text-fg-on-accent transition-colors duration-200 hover:bg-accent-lift active:scale-[0.98] sm:hidden"
              >
                Empecemos
              </Link>

              <button
                ref={botonRef}
                type="button"
                onClick={() => setAbierto((v) => !v)}
                aria-expanded={abierto}
                aria-controls="menu-principal"
                aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/25 text-ink transition-colors duration-200 hover:border-brand/45 lg:hidden"
              >
                {abierto ? (
                  <X size={22} weight="bold" aria-hidden="true" />
                ) : (
                  <List size={22} weight="bold" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* ---------- Panel movil ----------
              Full-width DEBAJO de la barra, no fullscreen: conserva el
              contexto de la pagina detras y no obliga a un patron de
              dialogo modal para algo que es, en esencia, un desplegable. */}
          <AnimatePresence>
            {abierto && (
              <motion.div
                id="menu-principal"
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={{
                  duration: reduce ? 0 : 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="lg:hidden"
              >
                <div className="border-t border-brand/12 px-4 pb-4 pt-2 md:px-6">
                  {/* Solo los 5 links. El CTA "Empecemos" ya esta siempre
                      visible en la barra superior (no desaparece al abrir
                      el panel) — repetirlo aqui era un segundo CTA
                      redundante sin ninguna accion nueva que ofrecer. */}
                  <nav aria-label="Navegación principal">
                    <ul className="flex flex-col">
                      {LINKS.map((l) => {
                        const esActivo = l.match(pathname);
                        return (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              aria-current={esActivo ? "page" : undefined}
                              className={[
                                "flex min-h-14 items-center gap-3 font-display text-[21px] font-semibold tracking-tight transition-colors duration-200",
                                esActivo ? "text-ink" : "text-ink-muted",
                              ].join(" ")}
                            >
                              <span
                                aria-hidden="true"
                                className={[
                                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200",
                                  esActivo ? "bg-accent" : "bg-transparent",
                                ].join(" ")}
                              />
                              {l.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
