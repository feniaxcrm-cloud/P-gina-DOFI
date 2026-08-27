"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  List,
  X,
  InstagramLogo,
  TiktokLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";
import { socialLinks, type SocialKey } from "@/config/company";

/**
 * Header DOFI — arquitectura de 3 zonas sobre lienzo blanco, inspirada en
 * Converzzo (Sprint "Header nuevo + lienzo blanco global"; corregido en
 * "Corrección del Header V2").
 *
 * Se toma de la referencia SOLO la composición: redes a la izquierda, logo
 * centrado de verdad en el viewport, navegación a la derecha — sobre un
 * lienzo blanco cálido. Nada de la identidad de Converzzo (color, tipo,
 * iconografía) se copia; ver el reporte del sprint para el detalle.
 *
 * SIN CTA (V2, spec §2)
 * -----------------------------------------------------------------
 * "Empecemos" se elimina por completo de la barra, en desktop Y en mobile —
 * no se reemplaza por otro botón ni se reubica dentro del header. El sitio
 * sigue teniendo el CTA en el propio contenido de cada página (Hero,
 * secciones de cierre); el header ya no lo repite.
 *
 * CENTRADO REAL DEL LOGO (spec §9, §41 — tolerancia ±4px)
 * -----------------------------------------------------------------
 * `grid-template-columns: 1fr auto 1fr` dentro de un contenedor de ancho
 * simétrico (`mx-auto max-w-page` con el mismo padding lateral que el resto
 * del sitio): las dos columnas `1fr` reparten el espacio sobrante en partes
 * MATEMÁTICAMENTE iguales sin importar cuánto contenido tenga cada una, así
 * que la columna `auto` del centro queda exactamente en el centro del
 * contenedor — y ese contenedor, al ser `mx-auto`, está a su vez centrado en
 * el viewport. El resultado es 0px de diferencia, no una aproximación. Esto
 * es intencional: si hoy la zona izquierda está vacía (cero redes
 * configuradas, ver abajo) el centrado del logo no se mueve ni un pixel
 * cuando aparezcan.
 *
 * REDES — SOLO LAS REALES YA CONFIGURADAS (spec §7-8, §35)
 * -----------------------------------------------------------------
 * Mismo origen de datos que el pie (`socialLinks` de `src/config/company.ts`,
 * ya filtra a las que tienen URL real por variable de entorno). Hoy ese
 * arreglo está VACÍO — ninguna red tiene `NEXT_PUBLIC_INSTAGRAM_URL` /
 * `_TIKTOK_URL` / `_LINKEDIN_URL` configurada — así que la zona izquierda se
 * renderiza vacía a propósito (nunca con URLs inventadas). El día que se
 * configure una variable, el icono aparece solo, sin tocar este archivo.
 *
 * FONDO — VIDRIO CLARO INTEGRADO, NO CÁPSULA (spec §15-17, §36-37)
 * -----------------------------------------------------------------
 * El Nav anterior era un panel flotante con margen superior y radio propio
 * (una "cápsula"). Este Header ocupa el ancho completo del viewport, pegado
 * al borde superior, sin margen ni radio — más integrado con el layout
 * general, tal como pide el brief. Dos estados de opacidad/blur según
 * scroll (misma lógica de umbral que ya existía), nunca una barra oscura.
 *
 * ESTADO ACTIVO — TEXTO + SUBRAYADO, NO CÁPSULA GRANDE (spec §13)
 * -----------------------------------------------------------------
 * Se conserva la técnica de layout compartido de Framer Motion (`layoutId`)
 * del Nav anterior — ya aprobada, sin rebote, sin overshoot — pero aplicada
 * a una barra de 2px bajo el texto en vez de a un fondo tipo píldora. El
 * hover NUNCA mueve esta barra: es un cambio de color CSS puro y sutil
 * (morado apagado -> morado brillante), sin la barra. NO usa el naranja de
 * acento como color de TEXTO en hover: DOFI-DESIGN-SYSTEM-V1.md §5.2 ya
 * midio que --color-accent sobre superficie clara da 2,42:1 — reprueba
 * AA (4,5:1) por mucho. brand-lift sobre --color-canvas mide ~5,8:1 (formula
 * WCAG), pasa con margen real.
 */

const ICONOS_SOCIAL = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  linkedin: LinkedinLogo,
} satisfies Record<SocialKey, typeof InstagramLogo>;

type NavLink = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

const esRuta = (base: string) => (pathname: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

/**
 * Navegación nueva (spec §10-12). Las 4 rutas de servicio todavía no
 * existían en el proyecto — se verificó la arquitectura de rutas antes de
 * escribir estos href (no se inventaron sobre la marcha). Cada una recibe
 * hoy una página placeholder mínima (`PaginaEnConstruccion`, ya usada por
 * /feniax y /el-socio con el mismo propósito) para que la navegación sea
 * real y no rompa: no se diseña contenido de servicio en este sprint.
 */
const LINKS: NavLink[] = [
  { label: "Inicio", href: "/", match: (p) => p === "/" },
  {
    label: "Marketing Digital",
    href: "/marketing-digital",
    match: esRuta("/marketing-digital"),
  },
  {
    label: "Tráfico / Ads",
    href: "/trafico-ads",
    match: esRuta("/trafico-ads"),
  },
  {
    label: "ChatBots / CRM",
    href: "/chatbots-crm",
    match: esRuta("/chatbots-crm"),
  },
  { label: "Asesorías", href: "/asesorias", match: esRuta("/asesorias") },
];

/** La barra gana opacidad despues de este scroll (rango del sistema 24-48). */
const UMBRAL_SOLIDO = 32;

function RedesSociales({ className }: { className?: string }) {
  // OJO: nunca "return null" aqui. Este componente es el PRIMER hijo directo
  // del grid de 3 zonas (`1fr auto 1fr`) en la barra desktop — CSS Grid
  // asigna columnas por HIJOS DEL DOM en orden, no por "huecos" logicos de
  // JSX. Si este devuelve null (hoy: 0 redes configuradas), el grid queda
  // con solo 2 hijos reales y el logo cae en la PRIMERA columna 1fr en vez
  // de la columna `auto` central — se descentra por completo. Un <ul> vacio
  // (sin <li>, sin anunciar nada a un lector de pantalla) conserva el hueco
  // del grid sin regresar contenido visible. Verificado con Puppeteer: sin
  // este fix el logo media -478px de diferencia contra el centro real.
  return (
    <ul className={["flex items-center gap-2", className].filter(Boolean).join(" ")}>
      {socialLinks.map(({ key, label, href }) => {
        const Icon = ICONOS_SOCIAL[key];
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-brand/20 bg-white text-brand shadow-[0_1px_2px_rgba(26,15,61,0.06)] transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-fg-on-accent"
            >
              <Icon size={17} weight="bold" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

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

  // El menu no sobrevive a un cambio de ruta.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // --- Fondo mas solido al bajar -----------------------------------------
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
  useEffect(() => {
    if (!abierto) return;
    const fondo = [
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter((n): n is HTMLElement => n !== null);

    fondo.forEach((n) => n.setAttribute("inert", ""));
    return () => fondo.forEach((n) => n.removeAttribute("inert"));
  }, [abierto]);

  // --- Al pasar al breakpoint de 3 zonas (lg, 1024), cerrar ---------------
  // Mismo umbral que las clases lg:flex/lg:hidden de mas abajo (V2: sin CTA
  // en la barra sobra espacio real, la barra de 3 zonas vuelve a entrar
  // desde 1024px — ver nota junto a la barra desktop).
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
      className={[
        "fixed inset-x-0 top-0 z-50 w-full border-b transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        abierto
          ? "border-brand/14 bg-canvas/97 backdrop-blur-xl"
          : solido
            ? "border-brand/14 bg-canvas/97 backdrop-blur-md"
            : "border-brand/8 bg-canvas/85 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="mx-auto max-w-page px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        {/* ---------- Barra desktop: 3 zonas, logo centrado real ----------
            El logo NO es un tercer hijo de grid compitiendo por espacio con
            las otras dos zonas: eso fue justo el bug que midio Puppeteer
            (con `1fr auto 1fr`, un `1fr` con contenido real fuerza al otro
            `1fr` -vacio hoy, sin redes configuradas- a encogerse, y el
            centro deja de coincidir con el centro real del header). El logo
            va posicionado en absoluto sobre el centro EXACTO de este
            contenedor (`left-1/2 -translate-x-1/2`), fuera del flujo, asi
            que redes/nav nunca pueden empujarlo — se mide en 0px de
            diferencia sin importar cuanto contenido tenga cada lado.

            BREAKPOINT (V2): al quitar el CTA "Empecemos" de esta barra
            (spec §2) sobra espacio real que antes no habia — medido con
            Puppeteer, la version de 3 zonas ahora entra limpia tambien a
            1024px, asi que el punto de quiebre vuelve a `lg` (coincide con
            el §26 del brief, que vuelve a listar 1024 en "test desktop"). */}
        <div className="relative hidden h-16 items-center lg:flex lg:h-[68px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {/* Difuminado sutil DOFI (spec §10-13): dos manchas muy
                translucidas, nunca un fondo — recortadas por el propio
                header (overflow-hidden en este contenedor) para que jamas
                se sientan como un hero oscuro. Morado detras del logo,
                naranja muy tenue hacia el lado de la navegacion. Mismo
                blur/opacidad que ya usa el slot de imagen del Hero, solo
                que aqui a una escala mucho mas chica (el header mide
                64-68px de alto). */}
            <div className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/12 blur-3xl" />
            <div className="absolute -right-10 top-1/2 h-28 w-56 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl" />
          </div>

          <div className="relative flex flex-1 items-center">
            <RedesSociales />
          </div>

          <Link
            href="/"
            aria-label="DOFI Agencia Creativa, inicio"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg"
          >
            <Wordmark size="nav" tone="light" />
          </Link>

          <nav
            aria-label="Navegación principal"
            className="relative flex flex-1 items-center justify-end"
          >
            <ul className="flex items-center gap-0.5">
              {LINKS.map((l) => {
                const esActivo = l.match(pathname);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={esActivo ? "page" : undefined}
                      className={[
                        "relative inline-flex h-10 items-center whitespace-nowrap px-1 font-sans text-[13px] font-medium transition-colors duration-200",
                        esActivo
                          ? "text-brand"
                          : "text-ink-muted hover:text-brand-lift",
                      ].join(" ")}
                    >
                      {l.label}
                      {esActivo && (
                        <motion.span
                          layoutId="nav-active-underline"
                          className="absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-brand"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                          }
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* ---------- Barra tablet/mobile: logo izquierda, hamburguesa derecha ----------
            Activa hasta 1023px inclusive (lg:hidden). Sin CTA (spec §17):
            "[ LOGO DOFI ] ... [ ☰ ]" — nada mas en la barra cerrada. */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          <Link
            href="/"
            aria-label="DOFI Agencia Creativa, inicio"
            className="shrink-0 rounded-lg"
          >
            <Wordmark size="sm" tone="light" />
          </Link>

          <div className="flex shrink-0 items-center">
            <button
              ref={botonRef}
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-principal"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/25 text-ink transition-colors duration-200 hover:border-brand/45"
            >
              {abierto ? (
                <X size={22} weight="bold" aria-hidden="true" />
              ) : (
                <List size={22} weight="bold" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* ---------- Panel movil ---------- */}
        <AnimatePresence>
          {abierto && (
            <motion.div
              id="menu-principal"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
              transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden"
            >
              <div className="border-t border-brand/12 pb-6 pt-2">
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
                              esActivo ? "text-brand" : "text-ink-muted",
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

                {/* Redes al final del panel (spec §20-21). Puede no
                    renderizar nada hoy — ver RedesSociales(). */}
                <div className="mt-6 border-t border-brand/10 pt-6">
                  <RedesSociales />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
