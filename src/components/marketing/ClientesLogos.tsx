"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CarruselGiros } from "./CarruselGiros";
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
 * FORMA (2026-10-22): por defecto cada logo se ve con SU forma original --
 * un logo cuadrado, cuadrado; uno redondo, redondo; uno apaisado, apaisado --
 * sin marco encima (antes iban todos dentro de un círculo y los cuadrados se
 * veían chicos y raros). Para que se vean del mismo "peso", cada logo ocupa la
 * misma AREA según su proporción real (un cuadrado no queda gigante al lado
 * de uno apaisado). Círculo y ficha redondeada siguen como opciones.
 *
 * LOGOS: siempre enteros (object-contain), sin deformar ni recortar el
 * archivo, y con su transparencia. Son las MISMAS URLs que usa la fila del
 * carrusel: el navegador los baja una sola vez.
 *
 * CAMBIO DE GIRO: un fundido corto de toda la grilla (sin escalonar logo por
 * logo); con movimiento reducido, cambio directo. Si los logos no entran en el
 * alto de la columna (escritorio), la columna se desplaza por dentro.
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
        <CarruselGiros giros={giros} rotacion={rotacion} animar={animar} activo={activo} onCambio={(i) => setActivo(i)} />
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

  const forma = ajuste.forma === "circular" ? "rounded-full" : "rounded-[24%]";
  return (
    <li
      title={empresa.nombre}
      className={`flex h-[var(--logo)] w-[var(--logo)] shrink-0 items-center justify-center bg-white shadow-[0_14px_30px_-20px_rgba(26,15,61,0.45)] ring-1 ring-ink/[0.06] ${forma}`}
    >
      {empresa.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={empresa.logo.url}
          alt={empresa.nombre}
          width={empresa.logo.ancho}
          height={empresa.logo.alto}
          loading="lazy"
          decoding="async"
          // 66% del marco: el logo entra entero aunque sea apaisado (un
          // rectangulo dentro de un circulo necesita ese margen).
          className="h-[66%] w-[66%] object-contain"
        />
      ) : (
        <span className="line-clamp-3 w-[70%] text-center font-display text-xs font-semibold leading-tight text-ink">{empresa.nombre}</span>
      )}
    </li>
  );
}

function LogosGiro({ giro, ajuste }: { giro: GiroNegocio | null; ajuste: AjusteLogos }) {
  const reducido = useReducedMotion() ?? false;
  const tamanos = { "--logo-d": `${ajuste.tamano}px`, "--logo-m": `${ajuste.tamanoMovil}px` } as React.CSSProperties;
  const original = ajuste.forma === "original";

  return (
    // La caja mide la columna; si los logos no entran, se desplaza por dentro
    // (el contenido centrado vive en un hijo con min-h-full, asi el centrado
    // nunca deja logos fuera del alcance del scroll).
    <div
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
                className={`flex flex-wrap content-center justify-center ${original ? "gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-5" : "gap-3 sm:gap-4"}`}
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
