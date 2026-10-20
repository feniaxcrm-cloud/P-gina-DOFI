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
 * muestra los logos del giro abierto en CÍRCULOS (o fichas redondeadas),
 * del tamaño que se elige en el Studio («Presentación de los logos»). Un solo
 * estado para las dos columnas: abrir «Turismo» en el carrusel cambia los
 * logos de la derecha.
 *
 * LOGOS: siempre enteros dentro de su forma (object-contain con margen), sin
 * deformar ni recortar el archivo, y con su transparencia. Son las MISMAS URLs
 * que usa la fila del carrusel: el navegador los baja una sola vez.
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

function LogoCirculo({ empresa, ajuste }: { empresa: EmpresaGiro; ajuste: AjusteLogos }) {
  const forma = ajuste.forma === "circular" ? "rounded-full" : "rounded-[24%]";
  return (
    <li
      title={empresa.nombre}
      className={`flex h-[var(--logo-m)] w-[var(--logo-m)] shrink-0 items-center justify-center bg-white shadow-[0_14px_30px_-20px_rgba(26,15,61,0.45)] ring-1 ring-ink/[0.06] lg:h-[var(--logo-d)] lg:w-[var(--logo-d)] ${forma}`}
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
          // 66% del círculo: el logo entra entero aunque sea apaisado (un
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

  return (
    // La caja mide la columna; si los logos no entran, se desplaza por dentro
    // (el contenido centrado vive en un hijo con min-h-full, asi el centrado
    // nunca deja logos fuera del alcance del scroll).
    <div
      // El borde de abajo se desvanece (lo que mide el margen interior): avisa
      // que hay mas logos al desplazar y, al final, no tapa ninguno.
      className="relative h-full rounded-[32px] bg-white/55 ring-1 ring-brand/10 lg:overflow-y-auto lg:[mask-image:linear-gradient(to_bottom,#000_calc(100%-28px),transparent)]"
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
              <ul aria-label={`Empresas de ${giro.nombre}`} className="flex flex-wrap content-center justify-center gap-3 sm:gap-4">
                {giro.empresas.map((empresa) => (
                  <LogoCirculo key={empresa.key} empresa={empresa} ajuste={ajuste} />
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
