"use client";

import { useEffect, useRef, useState } from "react";
import { LinkBreak, LinkSimple } from "@phosphor-icons/react";

/**
 * La composicion de la portada de Tráfico/Ads: "Muchos likes, muchas vistas…
 * pero ¿y las ventas?", dibujada como tres paneles de métricas, UNO POR
 * PLATAFORMA (Meta Ads, TikTok Ads y Google Ads), con las cifras contando
 * desde cero.
 *
 * LA HISTORIA (16 segundos, y en bucle mientras la composicion se ve):
 *  1. Meta Ads: los me gusta suben (0 -> 18,4 mil).
 *  2. TikTok Ads: las visualizaciones suben (0 -> 412 mil).
 *  3. Google Ads: las ventas están "sin conexión" (¿?) ... y se conectan: el
 *     panel se enciende y las ventas cuentan desde cero (0 -> 1,2 mil).
 * Lo que DOFI hace es ese tercer paso: conectar el tráfico con las ventas.
 * LARGA A PROPOSITO (pedido del 2026-10-08): antes todo pasaba en 6 segundos y
 * el visitante llegaba cuando ya habia terminado. Ahora cada cifra tarda 6 s
 * en llegar, las lineas se dibujan al mismo ritmo (van con la cifra, no por
 * su cuenta), el resultado se queda a la vista unos segundos y la historia
 * vuelve a empezar.
 *
 * ES UNA ILUSTRACION, no datos: las cifras son redondas a proposito y debajo
 * lleva «Cifras ilustrativas». Las demostraciones con cifras de una campaña
 * (Clientes) dicen que son de ejemplo. Por eso va aria-hidden y el lector de
 * pantalla recibe una frase equivalente (sr-only).
 *
 * UN SOLO RELOJ: un requestAnimationFrame mueve `t` (segundos) y cada panel
 * saca de ahi su avance (con su retraso), cifra y linea. Corre mientras la
 * composicion esta en pantalla (se detiene al salir y sigue donde iba). Con
 * movimiento reducido no corre: se ve el cuadro final, con todo conectado.
 * Los logos llegan como trazos desde el servidor (simple-icons no viaja al
 * navegador). La flotacion de los paneles es CSS (.trafico-flotar,
 * globals.css).
 */

export type MarcaPlataforma = { path: string; hex: string };

type Props = {
  marcas: { meta: MarcaPlataforma; tiktok: MarcaPlataforma; google: MarcaPlataforma };
  className?: string;
};

/** Segundos. */
const CUENTA = 6; // lo que tarda cada cifra en llegar a su valor
const SALIDA = { meta: 0.5, tiktok: 1.8, google: 10.2 }; // cuando arranca cada conteo
const CONECTA = 9.6; // cuando el panel de ventas pasa de "sin conexión" a conectado
const CUENTAS = SALIDA.google + CUENTA; // todo ha llegado a su valor
const REPOSO = 4.5; // el resultado se queda a la vista
const FUNDIDO = 0.7; // se apaga y vuelve a empezar
const CICLO = CUENTAS + REPOSO + FUNDIDO;

/** Frena hacia el final: la cifra "se asienta" en vez de frenar en seco. */
const salida = (p: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 2.4);

const NUMERO = new Intl.NumberFormat("es-EC", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const ENTERO = new Intl.NumberFormat("es-EC", { maximumFractionDigits: 0 });

/** La linea de tendencia: se dibuja a la par de la cifra (`progreso` 0 -> 1). */
function Linea({ d, progreso }: { d: string; progreso: number }) {
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" fill="none" aria-hidden="true">
      <path
        d={d}
        pathLength={1}
        stroke="var(--color-positive)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - progreso}
      />
    </svg>
  );
}

function Logo({ marca }: { marca: MarcaPlataforma }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ring-1 ring-white/25"
      style={{ background: `#${marca.hex}` }}
    >
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={marca.path} />
      </svg>
    </span>
  );
}

const CAJA = "rounded-[26px] border p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-5";
const ETIQUETA_PLATAFORMA = "whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.1em] text-foam";
const CHIP = "rounded-full bg-positive/15 px-2.5 py-1 font-sans text-xs font-semibold tabular-nums text-positive";

export function HeroProblema({ marcas, className = "" }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [enVista, setEnVista] = useState(false);
  const [reducido, setReducido] = useState(false);
  // El reloj sigue donde iba cuando la composicion sale y vuelve a la pantalla.
  const reloj = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducido || !enVista) return;
    let cuadro = 0;
    let anterior = performance.now();
    const paso = (ahora: number) => {
      reloj.current = (reloj.current + (ahora - anterior) / 1000) % CICLO;
      anterior = ahora;
      setT(reloj.current);
      cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [enVista, reducido]);

  // Con movimiento reducido: el cuadro final, todo conectado y a la vista.
  const tt = reducido ? CUENTAS : t;
  // Entra y sale con un fundido: el reinicio no se ve como un salto.
  const visible = reducido
    ? 1
    : Math.min(1, tt / 0.5, Math.max(0, (CICLO - tt) / FUNDIDO));

  const avance = (desde: number) => salida((tt - desde) / CUENTA);
  const meta = avance(SALIDA.meta);
  const tiktok = avance(SALIDA.tiktok);
  const google = avance(SALIDA.google);
  const conectada = tt >= CONECTA;

  return (
    <div ref={raiz} className={`relative mx-auto h-[520px] w-full max-w-[440px] sm:h-[590px] lg:h-[min(590px,var(--alto-util))] lg:min-h-[480px] ${className}`}>
      <p className="sr-only">
        Ilustración con cifras ilustrativas: en Meta Ads suben los me gusta, en TikTok Ads las visualizaciones y, cuando
        el tráfico se conecta con las ventas, en Google Ads también suben las ventas.
      </p>

      <div aria-hidden="true" className="absolute inset-0" style={{ opacity: visible }}>
        {/* Meta Ads · Me gusta */}
        <div
          className="trafico-flotar absolute left-0 top-0 w-[74%] sm:w-[66%]"
          style={{ "--flotar-duracion": "7s", "--flotar-retraso": "0s" } as React.CSSProperties}
        >
          <div className={`${CAJA} border-white/15 bg-white/[0.08]`}>
            <div className="flex items-center gap-3">
              <Logo marca={marcas.meta} />
              <div className="min-w-0">
                <p className={ETIQUETA_PLATAFORMA}>Meta Ads</p>
                <p className="font-sans text-xs text-mist">Me gusta</p>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="whitespace-nowrap font-display text-3xl font-extrabold leading-none tabular-nums text-foam sm:text-4xl">{NUMERO.format(18.4 * meta)} mil</span>
              <span className={CHIP}>▲ {ENTERO.format(24 * meta)}%</span>
            </div>
            <div className="mt-3">
              <Linea d="M2 31 C 12 29, 16 24, 26 25 S 42 18, 52 19 S 66 12, 78 10 S 98 6, 118 3" progreso={meta} />
            </div>
          </div>
        </div>

        {/* TikTok Ads · Visualizaciones */}
        <div
          className="trafico-flotar absolute right-0 top-[30%] w-[80%] sm:w-[70%]"
          style={{ "--flotar-duracion": "8.5s", "--flotar-retraso": "-2.4s" } as React.CSSProperties}
        >
          <div className={`${CAJA} border-white/15 bg-white/[0.08]`}>
            <div className="flex items-center gap-3">
              <Logo marca={marcas.tiktok} />
              <div className="min-w-0">
                <p className={ETIQUETA_PLATAFORMA}>TikTok Ads</p>
                <p className="font-sans text-xs text-mist">Visualizaciones</p>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="whitespace-nowrap font-display text-3xl font-extrabold leading-none tabular-nums text-foam sm:text-4xl">{ENTERO.format(412 * tiktok)} mil</span>
              <span className={CHIP}>▲ {ENTERO.format(38 * tiktok)}%</span>
            </div>
            <div className="mt-3">
              <Linea d="M2 33 C 14 32, 22 28, 34 26 S 52 20, 62 14 S 84 8, 96 7 S 110 3, 118 2" progreso={tiktok} />
            </div>
          </div>
        </div>

        {/* Google Ads · Ventas: sin conexión... y conectadas */}
        <div
          className="trafico-flotar absolute left-[2%] top-[62%] w-[88%] sm:left-[5%] sm:w-[76%]"
          style={{ "--flotar-duracion": "7.5s", "--flotar-retraso": "-4.6s" } as React.CSSProperties}
        >
          <div
            className={`${CAJA} transition-colors duration-700 ${
              conectada ? "border-white/15 bg-white/[0.08]" : "border-dashed border-accent/60 bg-accent/[0.07]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Logo marca={marcas.google} />
              <div className="min-w-0">
                <p className={ETIQUETA_PLATAFORMA}>Google Ads</p>
                <p className="font-sans text-xs text-mist">Ventas</p>
              </div>
              <span
                className={`ml-auto flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-xs font-semibold transition-colors duration-700 ${
                  conectada ? "border-positive/50 text-positive" : "border-accent/50 text-accent-lift"
                }`}
              >
                {conectada ? <LinkSimple size={14} weight="bold" /> : <LinkBreak size={14} weight="bold" />}
                {conectada ? "conectado" : "sin conexión"}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              {conectada ? (
                <>
                  <span className="whitespace-nowrap font-display text-3xl font-extrabold leading-none tabular-nums text-foam sm:text-4xl">{NUMERO.format(1.2 * google)} mil</span>
                  <span className={CHIP}>▲ {ENTERO.format(52 * google)}%</span>
                </>
              ) : (
                <span className="trafico-pregunta font-display text-4xl font-extrabold leading-none text-accent-lift">¿?</span>
              )}
            </div>
            <div className="mt-3">
              {conectada ? (
                <Linea d="M2 33 C 12 31, 20 30, 30 26 S 48 22, 58 17 S 80 12, 92 8 S 108 4, 118 2" progreso={google} />
              ) : (
                <svg viewBox="0 0 120 36" className="h-9 w-full" fill="none" aria-hidden="true">
                  <path d="M2 24 L118 24" stroke="var(--color-accent)" strokeOpacity={0.7} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 7" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <p className="absolute inset-x-0 bottom-0 text-center font-sans text-xs text-mist/70">Cifras ilustrativas</p>
      </div>
    </div>
  );
}
