"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Anim } from "@/components/marketing/Anim";
import { OrnamentoIcono, OrnamentoNodo, OrnamentoRuta } from "@/components/marketing/OrnamentoNautico";
import { claveGiro, type CasoExito, type Logro, type SeccionLogros } from "@/lib/asesorias";
import type { GiroNegocio, IconoCategoria, ImagenSanity } from "@/lib/marketing-digital";
import { MazoCasos } from "./MazoCasos";

/**
 * Logros de Asesorías (tipo achievementsBanner). Reemplaza a «Reseñas en
 * Google» en esta página (pedido del 2026-10-07, con una referencia: "Historias
 * que nos enorgullecen").
 *
 *   ┌───────────────────┐   — LOGROS DE NUESTROS EMPRENDEDORES
 *   │                   │   Historias que nos
 *   │   foto de la      │   ENORGULLECEN
 *   │   historia        │   ┌──────────────┐
 *   │ [nombre]          │   │ tarjeta      │ (mazo: se pasa con un clic)
 *   │ [etiqueta]        │   └──────────────┘
 *   └───────────────────┘   [Ver otro logro →]  01 / 04  · Toca para ver otro logro
 *
 * CADA CLIC CAMBIA LA FOTO: la tarjeta del frente es el mismo mazo de los
 * casos de éxito (MazoCasos): un clic, el botón, arrastrarla o las flechas
 * del teclado la mandan al fondo, y la foto de la izquierda entra con un
 * barrido desde el lado del mazo. Si está activo en el Studio, también pasa
 * sola: se pausa con el cursor encima y se detiene para siempre en cuanto el
 * visitante pasa una tarjeta (y después de dos vueltas).
 *
 * TODO SE EDITA EN EL STUDIO: cuántas tarjetas, sus fotos, sus textos y la
 * etiqueta de cada una. Una tarjeta sin foto deja la foto anterior.
 *
 * UNA PANTALLA: la foto se mide por el alto útil de la sección, así el
 * conjunto entra entero en una laptop de 730 px de alto.
 */

const CURVA = [0.16, 1, 0.3, 1] as const;

function posicion(h: ImagenSanity["hotspot"]) {
  return h ? `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` : "50% 30%";
}

/** "Historias que nos enorgullecen" -> ["Historias que nos", "enorgullecen"]. */
function partirUltima(titulo: string): [string, string] {
  const i = titulo.lastIndexOf(" ");
  return i < 0 ? ["", titulo] : [titulo.slice(0, i), titulo.slice(i + 1)];
}

type Capa = { clave: string; foto: ImagenSanity };

/** La foto de la historia al frente. Cada foto nueva entra con un barrido
 *  desde la derecha (el lado del mazo) y un zoom que se asienta; la anterior
 *  queda debajo hasta que la nueva termina, así nunca se ve un hueco. */
function FotoLogro({ logro, alt }: { logro: Logro | null; alt: string }) {
  const reducido = useReducedMotion() ?? false;
  const inicial = logro?.foto ? [{ clave: logro.key, foto: logro.foto }] : [];
  const [capas, setCapas] = useState<Capa[]>(inicial);

  useEffect(() => {
    if (!logro?.foto) return;
    const foto = logro.foto;
    setCapas((previas) =>
      previas.length > 0 && previas[previas.length - 1].clave === logro.key
        ? previas
        : [...previas.slice(-1), { clave: logro.key, foto }]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logro?.key]);

  return (
    <>
      {capas.map((capa, i) => {
        const entrando = capas.length > 1 && i === capas.length - 1;
        return (
          <motion.img
            key={capa.clave}
            src={capa.foto.url}
            alt={i === capas.length - 1 ? alt : ""}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: posicion(capa.foto.hotspot) }}
            // transform y clipPath completos: corren en el compositor.
            initial={entrando && !reducido ? { clipPath: "inset(0% 0% 0% 100%)", transform: "scale(1.1)" } : false}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transform: "scale(1)" }}
            transition={{ duration: reducido ? 0 : 0.85, ease: CURVA }}
            onAnimationComplete={() => {
              if (entrando) setCapas((previas) => previas.slice(-1));
            }}
          />
        );
      })}
    </>
  );
}

export function LogrosAsesorias({
  seccion,
  giros,
  id,
  nivel,
}: {
  seccion: SeccionLogros;
  /** Los giros de la página: la etiqueta de un logro que coincide con un giro
   *  lleva su icono (el mismo del carrusel de Clientes). */
  giros: GiroNegocio[];
  id: string;
  nivel: "h1" | "h2";
}) {
  const { subtitulo, titulo, descripcion, logros, pasoAutomatico, segundosPorLogro, animar } = seccion;
  const Titulo = nivel;
  const [inicio, ultima] = partirUltima(titulo);
  const n = logros.length;
  const reducido = useReducedMotion() ?? false;

  const [indice, setIndice] = useState(0);
  const [elegido, setElegido] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [pausado, setPausado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const pasos = useRef(0);

  // El mazo es el de los casos de éxito: cada logro viaja como un "caso"
  // (la etiqueta va donde el caso lleva su giro y la firma al pie).
  const tarjetas: CasoExito[] = useMemo(
    () => logros.map((l) => ({ key: l.key, titulo: l.titulo, texto: l.texto, giro: l.etiqueta, cliente: l.firma, imagen: l.foto })),
    [logros]
  );

  const iconoDeEtiqueta = useMemo(() => {
    const mapa = new Map(giros.map((g) => [claveGiro(g.nombre), g.icono]));
    return (caso: CasoExito): IconoCategoria | null => (caso.giro ? (mapa.get(claveGiro(caso.giro)) ?? null) : null);
  }, [giros]);

  // Las fotos se piden de entrada: cuando una historia pasa al frente, su
  // foto ya está en el navegador y el barrido nunca muestra un hueco.
  useEffect(() => {
    for (const l of logros) {
      if (l.foto) {
        const img = new Image();
        img.src = l.foto.url;
      }
    }
  }, [logros]);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const corriendo = pasoAutomatico && animar && !elegido && !reducido && enVista && !pausado && n > 1;

  useEffect(() => {
    if (!corriendo) return;
    const t = window.setTimeout(() => {
      pasos.current += 1;
      if (pasos.current >= n * 2) setElegido(true);
      setIndice((i) => (i + 1) % n);
    }, segundosPorLogro * 1000);
    return () => window.clearTimeout(t);
  }, [corriendo, indice, segundosPorLogro, n]);

  // La foto que se ve es la del logro al frente o, si ese no trae foto, la
  // última que sí tenía (nunca un hueco).
  const conFoto = useMemo(() => {
    for (let k = 0; k < n; k++) {
      const l = logros[(indice - k + n) % n];
      if (l?.foto) return l;
    }
    return null;
  }, [logros, indice, n]);
  const actual = n > 0 ? logros[indice] : null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="group/nautico pantalla relative isolate overflow-hidden bg-[linear-gradient(180deg,#FDFBF7_0%,#F4EFFB_100%)]"
    >
      <OrnamentoRuta ambiente="derivar" duracion={12} retraso={1} className="left-[38%] top-[8%] hidden h-20 w-[50%] lg:block" />
      <OrnamentoIcono
        motivo="ancla"
        capa="secundario"
        ambiente="flotar"
        duracion={8}
        className="-right-6 bottom-8 hidden h-28 w-28 rotate-6 md:block lg:h-36 lg:w-36"
      />
      <OrnamentoNodo className="right-[8%] top-[14%] h-3 w-3 sm:h-4 sm:w-4" retraso={0.8} />
      <OrnamentoNodo className="left-[4%] bottom-6 hidden h-3 w-3 md:block" ambiente="pulsar" retraso={1.6} />

      <div
        ref={raiz}
        // Telefono: titulo, foto y mazo, en ese orden (la foto queda arriba de
        // la tarjeta que la cambia). Escritorio: la foto a la izquierda ocupa
        // todo el alto; a la derecha, titulo y mazo juntos y centrados (las
        // filas 1fr de los extremos reparten el aire).
        className="relative mx-auto grid w-full max-w-page grid-cols-1 gap-x-[clamp(3rem,6vw,6rem)] gap-y-10 px-5 sm:px-6 md:px-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-y-0 lg:px-12"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setPausado(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setPausado(false);
        }}
        onFocus={() => setPausado(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausado(false);
        }}
      >
        {/* ---------- Título ---------- */}
        <Anim animar={animar} className="min-w-0 lg:col-start-2 lg:row-start-2">
          {subtitulo && (
            <p className="mb-3 flex items-center gap-3 font-display text-[12.5px] font-bold uppercase tracking-[0.2em] text-brand">
              <span aria-hidden="true" className="h-[3px] w-8 rounded-full bg-accent" />
              {subtitulo}
            </p>
          )}
          <Titulo id={`${id}-titulo`} className="max-w-[16ch] text-balance font-display text-titulo font-extrabold text-ink">
            {inicio && <>{inicio} </>}
            <span className="relative inline-block whitespace-nowrap text-brand">
              {ultima}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-[5px] origin-left rounded-full bg-accent"
                initial={animar && !reducido ? { scaleX: 0 } : false}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease: CURVA, delay: 0.3 }}
              />
            </span>
          </Titulo>
          {descripcion && (
            <p className="mt-4 max-w-[560px] font-sans text-lg leading-relaxed text-ink-muted">{descripcion}</p>
          )}
        </Anim>

        {/* ---------- La foto de la historia ---------- */}
        <Anim animar={animar} y={24} className="lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:self-center">
          <div className="relative mx-auto w-full max-w-[420px] pb-6 pr-6 lg:w-auto lg:max-w-none">
            {/* Resplandor cálido detrás y el marco naranja corrido: la foto
                "se despega" del fondo, como en la referencia. */}
            <span
              aria-hidden="true"
              className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-accent/15 blur-3xl"
            />
            <span aria-hidden="true" className="absolute inset-0 left-6 top-6 rounded-[28px] border-2 border-accent/70" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#3A2280_0%,#1A0F3D_100%)] shadow-[0_40px_70px_-36px_rgba(26,15,61,0.65)] lg:h-[min(calc(var(--alto-util)-2.25rem),40rem)] lg:w-auto">
              <FotoLogro logro={conFoto} alt={conFoto?.foto?.alt ?? ""} />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,10,38,0.35)_0%,transparent_28%,transparent_62%,rgba(18,10,38,0.55)_100%)]"
              />
              {actual?.nombre && (
                <motion.p
                  key={`nombre-${actual.key}`}
                  initial={reducido ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: CURVA, delay: 0.25 }}
                  className="absolute left-5 top-5 font-display text-sm font-bold uppercase tracking-[0.22em] text-white [text-shadow:0_1px_12px_rgba(18,10,38,0.6)]"
                >
                  {actual.nombre}
                </motion.p>
              )}
              {actual?.etiqueta && (
                <motion.p
                  key={`etiqueta-${actual.key}`}
                  initial={reducido ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: CURVA, delay: 0.3 }}
                  className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-sans text-[13px] font-semibold text-brand shadow-[0_10px_24px_-12px_rgba(18,10,38,0.6)]"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {actual.etiqueta}
                </motion.p>
              )}
            </div>
          </div>
        </Anim>

        {/* ---------- El mazo ---------- */}
        <Anim animar={animar} delay={0.1} className="w-full max-w-[480px] lg:col-start-2 lg:row-start-3 lg:mt-[clamp(1rem,3.4svh,2.5rem)]">
          <MazoCasos
            casos={tarjetas}
            indice={Math.min(indice, Math.max(0, n - 1))}
            iconoDeGiro={iconoDeEtiqueta}
            onPasar={(dir) => {
              setElegido(true);
              setIndice((i) => (((i + dir) % n) + n) % n);
            }}
            progreso={corriendo ? { ms: segundosPorLogro * 1000 } : null}
            anunciar={elegido}
            textoBoton="Ver otro logro"
            etiqueta="Logros"
            pista="Toca para ver otro logro"
          />
        </Anim>
      </div>
    </section>
  );
}
