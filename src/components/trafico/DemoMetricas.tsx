"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MetricasDemo } from "@/lib/metricas-demo";
import { ETIQUETA_OBJETIVO } from "@/lib/metricas-demo";
import { decimal, dolares, entero, moneda, porcentaje } from "@/remotion/trafico/formato";
import { PANEL } from "@/remotion/trafico/tema";

/**
 * Panel de Meta Ads de ejemplo (seccion Clientes de Tráfico/Ads).
 *
 * CARGA DIFERIDA: Remotion (ReproductorMetricas) se descarga recien cuando el
 * panel esta a ~400px de entrar en pantalla. Hasta entonces se ve una caja
 * del mismo tamaño exacto: nada se mueve cuando llega.
 *
 * ACCESIBILIDAD: las cifras finales van tambien como texto (oculto a la
 * vista, leido por lectores de pantalla), porque un video no se puede leer.
 * Con movimiento reducido el panel no se reproduce solo y queda en el dia 30.
 *
 * LA NOTA SE VE: debajo del panel, siempre. Dice que son cifras de ejemplo
 * (o lo que el equipo escriba en el Studio si carga cifras reales).
 */

const ReproductorMetricas = dynamic(() => import("./ReproductorMetricas"), { ssr: false });

export function DemoMetricas({
  datos,
  semilla,
  nombreGiro,
  clave,
  onTermina,
  className = "",
}: {
  datos: MetricasDemo;
  semilla: string;
  nombreGiro: string;
  /** Identifica el giro: al cambiar, el panel vuelve al dia 1. */
  clave: string;
  onTermina?: () => void;
  className?: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const [cerca, setCerca] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [reducido, setReducido] = useState(false);

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
    const lejos = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true);
          lejos.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    const visible = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.3 });
    lejos.observe(el);
    visible.observe(el);
    return () => {
      lejos.disconnect();
      visible.disconnect();
    };
  }, []);

  const frecuencia = Math.max(1, datos.visualizaciones / datos.alcance);

  return (
    <figure ref={raiz} className={`relative ${className}`}>
      {cerca ? (
        <ReproductorMetricas
          datos={datos}
          semilla={semilla}
          activo={enVista}
          reducido={reducido}
          onTermina={onTermina}
          clave={clave}
        />
      ) : (
        <div aria-hidden="true">
          <div
            className="w-full rounded-[28px] bg-[linear-gradient(165deg,#241553_0%,#1A0F3D_46%,#120A26_100%)] shadow-[0_32px_64px_-30px_rgba(26,15,61,0.65)]"
            style={{ aspectRatio: `${PANEL.ancho} / ${PANEL.alto}` }}
          />
          <div className="mt-4 h-11" />
        </div>
      )}

      <p className="mt-3 text-center font-sans text-sm leading-snug text-ink-subtle">{datos.nota}</p>

      <figcaption className="sr-only">
        <p>
          Panel de ejemplo de una campaña de Meta Ads para el giro {nombreGiro}: «{datos.campana}», objetivo{" "}
          {ETIQUETA_OBJETIVO[datos.objetivo]}. Cifras a los 30 días: inversión {dolares(datos.inversion)}, CPR{" "}
          {moneda(datos.cpr)}, CTR {porcentaje(datos.ctr)}, CPA {moneda(datos.cpa)}, alcance {entero(datos.alcance)}{" "}
          personas, {entero(datos.visualizaciones)} visualizaciones y frecuencia {decimal(frecuencia)}. Con la
          campaña en marcha, el costo por resultado baja y el CTR mejora gracias a las optimizaciones:{" "}
          {datos.hitos.map((h) => `día ${h.dia}, ${h.texto.toLowerCase()}`).join("; ")}. {datos.nota}
        </p>
      </figcaption>
    </figure>
  );
}
