"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LIENZO, TARJETAS } from "@/remotion/hero/tema";

/**
 * La columna derecha del hero del Home: la animacion "Ventas Inteligentes"
 * (Remotion, ver src/remotion/hero/VentasInteligentes.tsx).
 *
 * CARGA DIFERIDA: Remotion llega despues de que la pagina se pinta. Mientras,
 * se ven las tres tarjetas en reposo, en el mismo lugar y del mismo tamaño
 * que en el cuadro 0 de la animacion: cuando el reproductor aparece, nada se
 * mueve de golpe.
 *
 * Solo corre mientras esta en pantalla. Con movimiento reducido no corre:
 * queda el cuadro con las tres etapas completas.
 *
 * ACCESIBILIDAD: la animacion es decorativa (aria-hidden) y lo que cuenta va
 * en texto para lectores de pantalla.
 */

const ReproductorHero = dynamic(() => import("./ReproductorHero"), { ssr: false });

export function EscenaHero({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const raiz = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);
  // Arranca en false A PROPOSITO: el play() del reproductor tiene que llegar
  // despues de montado (cuando el observador confirma que se ve), no en el
  // mismo instante en que se crea -- ahi el Player todavia lo ignora.
  const [enVista, setEnVista] = useState(false);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener("change", alCambiar);
    // Recien despues del primer pintado: el titulo y los botones primero.
    const id = window.requestAnimationFrame(() => setListo(true));
    return () => {
      mq.removeEventListener("change", alCambiar);
      window.cancelAnimationFrame(id);
    };
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      ref={raiz}
      className={`relative ${className}`}
      style={{ aspectRatio: `${LIENZO.ancho} / ${LIENZO.alto}`, ...style }}
    >
      <div aria-hidden="true" className="absolute inset-0">
        {listo ? (
          <ReproductorHero activo={enVista} reducido={reducido} />
        ) : (
          // Las tarjetas en reposo, en porcentajes del lienzo.
          Object.values(TARJETAS).map((t) => (
            <span
              key={`${t.x}-${t.y}`}
              className="absolute rounded-[26px] border border-white/14 bg-white/[0.075] shadow-[0_30px_60px_-28px_rgba(8,4,20,0.85)] backdrop-blur-[16px]"
              style={{
                left: `${(t.x / LIENZO.ancho) * 100}%`,
                top: `${(t.y / LIENZO.alto) * 100}%`,
                width: `${(t.ancho / LIENZO.ancho) * 100}%`,
                height: `${(t.alto / LIENZO.alto) * 100}%`,
                transform: `rotate(${t.giro}deg)`,
                opacity: 0.8,
              }}
            />
          ))
        )}
      </div>
      <figcaption className="sr-only">
        Cómo trabaja DOFI: primero atraemos con contenido y pauta en redes; después convertimos, porque cada
        cliente que escribe por WhatsApp recibe respuesta de la IA y queda en el CRM; y así escalamos tus ventas:
        Ventas Inteligentes.
      </figcaption>
    </figure>
  );
}
