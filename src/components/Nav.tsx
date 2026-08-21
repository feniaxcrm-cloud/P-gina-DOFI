"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";

/**
 * Navbar V1 — infraestructura de orientacion y conversion.
 *
 * QUE RESUELVE (ver AUDITORIA-DOFI-V1)
 * ------------------------------------
 *  · Sin CTA por debajo de 640px: en movil no habia ninguna accion posible
 *    hasta el pixel 7 301. Ahora el CTA vive en la barra siempre.
 *  · Sin estado activo: en una pagina de 9 pantallas con navegacion por
 *    anclas, el usuario no sabia donde estaba. Ahora hay scrollspy.
 *  · Hover roto: el filete usaba group-hover pero el enlace no tenia la
 *    clase group, asi que el efecto nunca se disparaba. Corregido.
 *  · "Herramientas" en tercera posicion: software de terceros por delante
 *    de la prueba social. Fuera de la navegacion principal.
 *  · CTA generico: "Iniciar proyecto" describia la intencion del usuario,
 *    no lo que ocurre al pulsar. Ahora dice "Solicitar diagnostico", igual
 *    que el Hero: una sola accion comercial en toda la pagina.
 *  · Contenedor de 1400px: no alineaba con el Hero. Ahora comparte
 *    container.page (1320) y el mismo padding por breakpoint, asi que el
 *    logo cae exactamente sobre el borde izquierdo del H1.
 *
 * ESCRITORIO DESDE lg (1024)
 * --------------------------
 * Medido: logo (48) + 4 enlaces (207) + gaps (96) + CTA (198) = 549px de
 * los 928 utiles a 1024. Sobran 379px, asi que no hay compresion y no hace
 * falta retrasar la navegacion completa hasta xl.
 *
 * MOVIL
 * -----
 * Tres zonas: marca · CTA compacto · hamburguesa. El CTA dice
 * "Diagnostico" y no el texto completo porque a 360 el contenido son 320px
 * y el texto largo no deja aire entre las tres zonas. Dentro del menu si
 * aparece completo.
 *
 * PESO
 * ----
 * Isla de cliente, pero minima: el fondo de la barra transiciona por CSS
 * (no por Motion) y el scrollspy usa IntersectionObserver nativo. Motion
 * solo interviene en el panel del menu.
 */

/** Navegacion principal. Cuatro entradas, ordenadas por valor comercial:
 *  que hacemos -> como lo hacemos -> a quien se lo hemos hecho -> quienes
 *  somos.
 *
 *  DESTINOS TEMPORALES. Los nombres ya son los definitivos, pero apuntan a
 *  secciones que todavia no se han rediseñado:
 *    Sistema -> #proceso   (pasara a la seccion Ventas Inteligentes)
 *    Casos   -> #clientes  (pasara a la seccion Casos)
 *    Nosotros-> #socio     (pasara a la seccion Equipo)
 *  No se inventan anclas que no existan. */
const LINKS = [
  { label: "Servicios", href: "/#servicios", id: "servicios" },
  { label: "Sistema", href: "/#proceso", id: "proceso" },
  { label: "Casos", href: "/#clientes", id: "clientes" },
  { label: "Nosotros", href: "/#socio", id: "socio" },
] as const;

/** Secciones vigiladas. Incluye #contacto aunque no sea un enlace: al
 *  llegar al formulario ninguna entrada debe quedar marcada como activa. */
const SECCIONES = ["servicios", "proceso", "clientes", "socio", "contacto"];

/** La barra pasa a solida despues de este scroll. 32px es suficiente para
 *  que no parpadee con el rebote de scroll y sigue dentro del rango del
 *  Design System (24-48). */
const UMBRAL_SOLIDO = 32;

export function Nav() {
  const [solido, setSolido] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const botonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const cerrar = useCallback((devolverFoco = false) => {
    setAbierto(false);
    if (devolverFoco) botonRef.current?.focus();
  }, []);

  // --- Fondo solido al bajar -------------------------------------------
  useEffect(() => {
    const alScroll = () => setSolido(window.scrollY > UMBRAL_SOLIDO);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // --- Scrollspy --------------------------------------------------------
  // IntersectionObserver nativo, sin librerias ni umbrales de scrollY
  // escritos a mano. La banda de deteccion va desde justo debajo de la
  // barra hasta el 35% de la altura de la ventana: una seccion cuenta como
  // activa cuando su contenido cruza el primer tercio de la pantalla, que
  // es donde el ojo esta leyendo.
  useEffect(() => {
    const nodos = SECCIONES.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null
    );
    if (nodos.length === 0) return;

    const visibles = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visibles.add(e.target.id);
          else visibles.delete(e.target.id);
        }
        // Si hay varias en la banda, gana la primera en orden del documento.
        const siguiente = SECCIONES.find((id) => visibles.has(id)) ?? null;
        setActivo(siguiente);
      },
      { rootMargin: "-72px 0px -65% 0px", threshold: 0 }
    );

    nodos.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
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
  // Medido: el panel ocupa 378px de 844 (45% de la pantalla en un 390). No
  // es una franja pequeña, asi que dejar el cuerpo desplazandose detras
  // permitiria navegar por accidente a contenido tapado. Se guarda y se
  // restaura el valor previo porque el body ya lleva overflow-x: clip.
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  // --- Contenido de fondo inerte mientras el panel esta abierto ----------
  // Sin esto, tabular despues del ultimo elemento del panel llevaba el foco
  // al Hero, que esta detras y con el scroll bloqueado: el usuario perdia
  // el foco en contenido que no podia ver ni alcanzar.
  //
  // Se usa el atributo nativo `inert` en vez de una libreria de focus trap.
  // inert hace las dos cosas que hacen falta a la vez —saca el subarbol del
  // orden de tabulacion Y del arbol de accesibilidad— y es exactamente el
  // comportamiento correcto para un contenido que queda tapado. Una trampa
  // de foco solo resolveria el teclado y dejaria el fondo anunciable por el
  // lector de pantalla.
  //
  // El <header> queda fuera a proposito: el panel y la hamburguesa tienen
  // que seguir siendo alcanzables.
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
  // Si no, al girar el movil o ensanchar la ventana el panel se oculta por
  // CSS (lg:hidden) pero el estado seguiria abierto y el scroll bloqueado.
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
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      {/* El fondo transiciona por CSS y no por Motion: es un cambio de dos
          colores, no necesita un motor de animacion detras. */}
      <div
        className={[
          "border-b backdrop-blur-md transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          solido || abierto
            ? "border-brand-lift/15 bg-surface-base/85"
            : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
          <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 lg:h-[68px]">
            <Link
              href="/"
              aria-label="DOFI Agencia Creativa, inicio"
              className="shrink-0 rounded-lg"
            >
              <Wordmark size="sm" />
            </Link>

            {/* ---------- Navegacion escritorio ---------- */}
            <nav aria-label="Navegación principal" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {LINKS.map((l) => {
                  const esActivo = activo === l.id;
                  return (
                    <li key={l.id}>
                      <Link
                        href={l.href}
                        aria-current={esActivo ? "true" : undefined}
                        className={[
                          "group relative inline-flex h-11 items-center font-sans text-[15px] transition-colors duration-200",
                          esActivo
                            ? "text-fg-primary"
                            : "text-fg-muted hover:text-fg-primary",
                        ].join(" ")}
                      >
                        {l.label}
                        {/* Filete de 2px. El bug anterior era que este span
                            usaba group-hover y el enlace no tenia la clase
                            group: el efecto estaba escrito y muerto. */}
                        <span
                          aria-hidden="true"
                          className={[
                            "absolute bottom-1.5 left-0 h-0.5 rounded-full bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            esActivo
                              ? "w-full opacity-100"
                              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50",
                          ].join(" ")}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---------- Acciones ---------- */}
            {/* 12px entre el CTA y la hamburguesa: con 8 los dos objetivos
                tactiles quedaban demasiado juntos y a 360 sobran 100px. */}
            <div className="flex shrink-0 items-center gap-3">
              {/* CTA. Siempre visible, tambien en 360. Texto corto por
                  debajo de sm y completo a partir de ahi. */}
              <Link
                href="/#contacto"
                className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-accent px-4 font-display text-sm font-semibold text-fg-on-accent transition-colors duration-200 hover:bg-accent-lift active:scale-[0.98] sm:h-12 sm:gap-2 sm:px-6 sm:text-button"
              >
                <span className="sm:hidden">Diagnóstico</span>
                <span className="hidden sm:inline">Solicitar diagnóstico</span>
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="hidden transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
                />
              </Link>

              <button
                ref={botonRef}
                type="button"
                onClick={() => setAbierto((v) => !v)}
                aria-expanded={abierto}
                aria-controls="menu-principal"
                aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-lift/40 text-fg-primary transition-colors duration-200 hover:border-brand-lift/70 lg:hidden"
              >
                {abierto ? (
                  <X size={22} weight="bold" aria-hidden="true" />
                ) : (
                  <List size={22} weight="bold" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Panel del menu ----------
          Panel a ancho completo bajo la barra, NO superposicion a pantalla
          completa: conserva el contexto de la pagina detras, no parece una
          app y no obliga a bloquear el scroll del cuerpo. Mide ~330px de
          844, asi que deja ver donde estaba el usuario. */}
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
            className="border-b border-brand-lift/15 bg-surface-base/95 backdrop-blur-xl lg:hidden"
          >
            <div className="px-5 sm:px-6 md:px-10">
              <div className="mx-auto max-w-page pb-6 pt-2">
                <nav aria-label="Navegación principal">
                  <ul className="flex flex-col">
                    {LINKS.map((l) => {
                      const esActivo = activo === l.id;
                      return (
                        <li key={l.id}>
                          <Link
                            href={l.href}
                            onClick={() => cerrar()}
                            aria-current={esActivo ? "true" : undefined}
                            className={[
                              "flex min-h-14 items-center gap-3 font-display text-[21px] font-semibold tracking-tight transition-colors duration-200",
                              esActivo ? "text-fg-primary" : "text-fg-muted",
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

                {/* CTA del panel: mismo destino, version explicita del
                    texto (la barra dice solo "Diagnostico") pero en
                    CONTORNO, no relleno.
                    Motivo: la barra no desaparece al abrir el panel, asi
                    que su CTA naranja sigue visible 40px mas arriba. Dos
                    rellenos naranja a la vez anulan la jerarquia — lo dice
                    el propio Design System: "dos CTA juntos deben verse
                    distintos: uno relleno, otro contorno". Sigue siendo
                    claramente distinto de los enlaces por su caja, su
                    altura y el filete que lo separa. */}
                <div className="mt-4 border-t border-brand-lift/15 pt-5">
                  <Link
                    href="/#contacto"
                    onClick={() => cerrar()}
                    className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full border border-brand-lift/45 px-6 font-display text-button text-fg-primary transition-colors duration-200 hover:border-accent/60 active:scale-[0.98]"
                  >
                    Solicitar diagnóstico
                    <ArrowRight
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="text-accent"
                    />
                  </Link>
                  <p className="mt-3 text-center font-sans text-sm text-fg-subtle">
                    Respondemos en menos de 24 horas hábiles.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
