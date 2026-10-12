"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ClaveEscena } from "@/remotion/home/tema";

/**
 * La parte de un banner del Home que se dibuja con Remotion (ver
 * src/remotion/home/ y BannerHibrido.tsx).
 *
 * CARGA DIFERIDA: Remotion llega cuando el banner esta a ~600 px de entrar en
 * pantalla, no antes; el banner que esta oculto en este tamaño (el de
 * escritorio en un telefono y al reves) nunca se carga. Mientras llega, el
 * hueco muestra el fondo del banner; la escena aparece con un fundido.
 *
 * Solo corre mientras esta en pantalla. Con movimiento reducido no corre:
 * queda un cuadro quieto con todo en su sitio.
 *
 * El borde que mira a la foto se desvanece (mascara): asi la escena y la foto
 * se funden en vez de encontrarse en una linea recta. Es decorativo
 * (aria-hidden): el texto del banner va en BannerHibrido para lectores de
 * pantalla y buscadores.
 */

const ReproductorEscena = dynamic(() => import("./ReproductorEscena"), { ssr: false });

export function EscenaBanner({
  escena,
  lineas,
  ancho,
  alto,
  borde,
  className = "",
}: {
  escena: ClaveEscena;
  lineas: string[];
  /** Proporcion de la escena (la de su lienzo Remotion). */
  ancho: number;
  alto: number;
  /** Que borde de la escena se desvanece: el que mira a la foto. */
  borde: "izquierda" | "derecha" | "abajo" | null;
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
      { rootMargin: "600px 0px" }
    );
    const visible = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.1 });
    lejos.observe(el);
    visible.observe(el);
    return () => {
      lejos.disconnect();
      visible.disconnect();
    };
  }, []);

  // `borde` es el borde de la escena que se desvanece (el que mira a la foto):
  // la mascara va opaca hasta el 86% y se apaga hacia ese borde.
  const direccion = borde === "derecha" ? "to right" : borde === "izquierda" ? "to left" : "to bottom";
  const mascara = borde ? `linear-gradient(${direccion}, #000 0%, #000 86%, transparent 100%)` : undefined;

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      className={`relative ${className}`}
      style={{
        aspectRatio: `${ancho} / ${alto}`,
        WebkitMaskImage: mascara,
        maskImage: mascara,
      }}
    >
      {cerca && (
        <div className="absolute inset-0 animate-[aparecer_0.7s_ease-out_both] motion-reduce:animate-none">
          <ReproductorEscena escena={escena} lineas={lineas} activo={enVista} reducido={reducido} />
        </div>
      )}
    </div>
  );
}
