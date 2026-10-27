"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CarruselGiros } from "./CarruselGiros";
import { LogoRedondo } from "./LogoRedondo";
import type { AjusteLogos, EmpresaGiro, GiroNegocio } from "@/lib/marketing-digital";

/**
 * Las dos columnas de «Clientes y casos de éxito» en las cuatro páginas
 * (Marketing Digital, Tráfico/Ads, ChatBots/CRM y Asesorías), pedido del
 * 2026-10-20:
 *
 *   ┌──────────────────────────┬────────────────────┐
 *   │ Carrusel de giros        │  ◯  ◯  ◯  ◯        │
 *   │ Fila de logos del giro   │  ◯  ◯  ◯  (logos   │
 *   │ (se desliza sola)        │   del giro abierto)│
 *   └──────────────────────────┴────────────────────┘
 *
 * La izquierda es la de siempre (CarruselGiros, con su fila de logos). La
 * derecha, donde antes iba el celular (o el panel de Meta en Tráfico),
 * muestra los logos del giro abierto, con la forma y el tamaño que se eligen
 * en el Studio («Presentación de los logos»). Un solo estado para las dos
 * columnas: abrir «Turismo» en el carrusel cambia los logos de la derecha.
 *
 * FORMA (2026-10-23): por defecto, LOGOS REDONDOS -- cada logo en su versión
 * circular (el logo mismo es redondo; ver LogoRedondo y
 * scripts/logos-circulares.mts), en la columna y en la fila que se desliza.
 * «Forma original» (cada logo como es, a la misma área según su proporción)
 * queda como opción en el Studio.
 *
 * LOGOS: siempre enteros (object-contain), sin deformar ni recortar el
 * archivo, y con su transparencia. Son las MISMAS URLs que usa la fila del
 * carrusel: el navegador los baja una sola vez.
 *
 * CAMBIO DE GIRO: un fundido corto de toda la grilla (sin escalonar logo por
 * logo); con movimiento reducido, cambio directo.
 *
 * QUE ENTREN TODOS (2026-10-27): el tamaño del Studio es el MÁXIMO. En
 * escritorio la columna tiene el alto de la pantalla: si el giro tiene muchas
 * empresas (Construcción, 18), los logos se achican hasta entrar todos, sin
 * cortarse ni desplazarse por dentro. En el teléfono, al menos tres por fila
 * (dos en «Forma original»).
 * Solo si ni con el mínimo entran, la columna se desplaza por dentro.
 */
export function ClientesLogos({
  giros,
  rotacion,
  animar,
  ajuste,
}: {
  giros: GiroNegocio[];
  rotacion: boolean;
  animar: boolean;
  ajuste: AjusteLogos;
}) {
  const [activo, setActivo] = useState(0);
  const n = giros.length;
  const giro = n > 0 ? giros[Math.min(activo, n - 1)] : null;

  return (
    // 3fr / 2fr, como siempre en Clientes: el carrusel a la izquierda y la
    // columna de logos a la derecha. En teléfono y tablet se apilan.
    <div className="grid grid-cols-1 gap-10 lg:h-full lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
      <div className="min-w-0 lg:h-full lg:min-h-0">
        <CarruselGiros
          giros={giros}
          rotacion={rotacion}
          animar={animar}
          activo={activo}
          onCambio={(i) => setActivo(i)}
          logosRedondos={ajuste.forma === "circular"}
        />
      </div>
      <div className="min-w-0 lg:h-full lg:min-h-0">
        <LogosGiro giro={giro} ajuste={ajuste} />
      </div>
    </div>
  );
}

/** Medidas de un logo en "forma original", en unidades del tamaño elegido
 *  (--logo): todos ocupan la misma area (62% del cuadrado de --logo) segun su
 *  proporcion, sin pasar de 1,35 de ancho ni de 1 de alto. */
function medidasOriginal(ancho: number, alto: number) {
  const r = ancho / alto;
  const AREA = 0.62;
  let w = Math.sqrt(AREA * r);
  let h = Math.sqrt(AREA / r);
  const k = Math.min(1, 1.35 / w, 1 / h);
  w *= k;
  h *= k;
  return { width: `calc(var(--logo) * ${w.toFixed(3)})`, height: `calc(var(--logo) * ${h.toFixed(3)})` };
}

function LogoGiro({ empresa, ajuste }: { empresa: EmpresaGiro; ajuste: AjusteLogos }) {
  if (ajuste.forma === "original") {
    return (
      <li title={empresa.nombre} className="flex h-[var(--logo)] shrink-0 items-center justify-center">
        {empresa.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={empresa.logo.url}
            alt={empresa.nombre}
            width={empresa.logo.ancho}
            height={empresa.logo.alto}
            loading="lazy"
            decoding="async"
            className="object-contain"
            style={medidasOriginal(empresa.logo.ancho, empresa.logo.alto)}
          />
        ) : (
          <span className="flex h-[70%] w-[var(--logo)] items-center justify-center rounded-2xl bg-white px-3 text-center font-display text-xs font-semibold leading-tight text-ink shadow-[0_10px_24px_-18px_rgba(26,15,61,0.4)]">
            {empresa.nombre}
          </span>
        )}
      </li>
    );
  }

  return (
    <li title={empresa.nombre} className="shrink-0">
      <LogoRedondo empresa={empresa} className="h-[var(--logo)] w-[var(--logo)]" />
    </li>
  );
}

/** Diámetro más grande con el que n logos entran en una caja de ancho x alto
 *  (probando cuántos van por fila). `factor`: ancho del logo en unidades de
 *  --logo (los de forma original pueden ser más anchos que altos). */
function diametroQueEntra(n: number, ancho: number, alto: number, gapX: number, gapY: number, factor: number) {
  let mejor = 0;
  for (let c = 1; c <= n; c++) {
    const filas = Math.ceil(n / c);
    const d = Math.min((ancho - (c - 1) * gapX) / (c * factor), (alto - (filas - 1) * gapY) / filas);
    if (d > mejor) mejor = d;
  }
  return Math.floor(mejor);
}

/** Por debajo de esto un logo ya no se lee: mejor desplazar la columna. */
const LOGO_MINIMO = 64;

function LogosGiro({ giro, ajuste }: { giro: GiroNegocio | null; ajuste: AjusteLogos }) {
  const reducido = useReducedMotion() ?? false;
  const original = ajuste.forma === "original";
  const caja = useRef<HTMLDivElement>(null);
  const cuantos = giro?.empresas.length ?? 0;
  /** Tope medido para que entren todos (null: todavía sin medir). */
  const [tope, setTope] = useState<number | null>(null);

  // Antes de pintar: al cambiar de giro, el primer cuadro ya sale con el
  // tamaño nuevo (con useEffect se veia un instante con el del giro anterior).
  useLayoutEffect(() => {
    const el = caja.current;
    const interior = el?.firstElementChild as HTMLElement | null | undefined;
    if (!el || !interior || cuantos === 0) return;
    const medir = () => {
      const cs = getComputedStyle(interior);
      const ancho = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const alto = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      // Los mismos espacios que la lista (gap-3 / sm:gap-5, y los de forma original).
      const sm = window.matchMedia("(min-width: 640px)").matches;
      const gapX = original ? (sm ? 32 : 24) : sm ? 20 : 12;
      const gapY = original ? (sm ? 20 : 16) : sm ? 20 : 12;
      const factor = original ? 1.35 : 1;
      if (window.matchMedia("(min-width: 1024px)").matches) {
        // Escritorio: la caja tiene alto fijo (el de la columna).
        setTope(Math.max(LOGO_MINIMO, diametroQueEntra(cuantos, ancho, alto, gapX, gapY, factor)));
      } else {
        // Teléfono y tablet: la caja crece hacia abajo; al menos 3 por fila.
        const porFila = Math.min(cuantos, original ? 2 : 3);
        setTope(Math.floor((ancho - (porFila - 1) * gapX) / (porFila * factor)));
      }
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cuantos, original]);

  const tamanos = {
    "--logo-d": `${tope ? Math.min(ajuste.tamano, tope) : ajuste.tamano}px`,
    "--logo-m": `${tope ? Math.min(ajuste.tamanoMovil, tope) : ajuste.tamanoMovil}px`,
  } as React.CSSProperties;

  return (
    // La caja mide la columna y los logos se achican para entrar (ver arriba);
    // si ni con el minimo entran, se desplaza por dentro (el contenido
    // centrado vive en un hijo con min-h-full, asi el centrado nunca deja
    // logos fuera del alcance del scroll).
    <div
      ref={caja}
      // El borde de abajo se desvanece (lo que mide el margen interior): avisa
      // que hay mas logos al desplazar y, al final, no tapa ninguno.
      // --logo: el tamaño del telefono y, desde lg, el de escritorio.
      className="relative h-full rounded-[32px] bg-white/55 ring-1 ring-brand/10 [--logo:var(--logo-m)] lg:overflow-y-auto lg:[--logo:var(--logo-d)] lg:[mask-image:linear-gradient(to_bottom,#000_calc(100%-28px),transparent)]"
      style={tamanos}
    >
      <div className="flex min-h-[200px] items-center justify-center p-5 sm:p-7 lg:min-h-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={giro?.key ?? "vacio"}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reducido ? 0 : 0.28, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: reducido ? 0 : 0.16, ease: "easeIn" } }}
          >
            {!giro || giro.empresas.length === 0 ? (
              <p className="text-center font-sans text-[15px] text-ink-muted">Pronto verás aquí las empresas de este giro.</p>
            ) : (
              <ul
                aria-label={`Empresas de ${giro.nombre}`}
                className={`flex flex-wrap content-center justify-center ${original ? "gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-5" : "gap-3 sm:gap-5"}`}
              >
                {giro.empresas.map((empresa) => (
                  <LogoGiro key={empresa.key} empresa={empresa} ajuste={ajuste} />
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
