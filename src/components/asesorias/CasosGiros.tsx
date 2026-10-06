"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CarruselGiros, type FotoCaso } from "@/components/marketing/CarruselGiros";
import { claveGiro, type CasoExito } from "@/lib/asesorias";
import type { GiroNegocio, IconoCategoria } from "@/lib/marketing-digital";
import { MazoCasos } from "./MazoCasos";

/**
 * Las dos columnas de Clientes en Asesorías: el carrusel de giros (el mismo
 * de Marketing Digital, en modo controlado) y, donde allá va el video, el
 * mazo de casos de éxito.
 *
 * UN SOLO ESTADO PARA LAS DOS COLUMNAS (texto 1 → imagen 1):
 *  - Pasar de caso (botón, arrastre, teclado o paso automático) abre en el
 *    carrusel el giro de ese caso y muestra SU imagen en el panel abierto.
 *  - Elegir un giro en el carrusel lleva el mazo al primer caso de ese giro
 *    (si no tiene casos, el mazo se queda donde está y el panel muestra el
 *    giro como siempre).
 *
 * PASO AUTOMATICO (si está activo en el Studio): avanza mientras la sección
 * está en pantalla y nadie la toca, con una línea de progreso. Se pausa con
 * el cursor o el foco adentro, se detiene para siempre cuando el visitante
 * pasa un caso o elige un giro, y después de dos vueltas -- el mismo criterio
 * que la rotación del carrusel. Con movimiento reducido no avanza solo.
 *
 * El carrusel solo cambia con clic, toque, teclado o deslizando
 * (seleccionPorCursor={false}): llevar el mouse hacia el mazo no puede ir
 * abriendo giros en el camino.
 */
export function CasosGiros({
  giros,
  casos,
  pasoAutomatico,
  segundosPorCaso,
  animar,
}: {
  giros: GiroNegocio[];
  casos: CasoExito[];
  pasoAutomatico: boolean;
  segundosPorCaso: number;
  animar: boolean;
}) {
  const n = casos.length;
  const reducido = useReducedMotion() ?? false;

  const indiceDeGiro = useMemo(() => {
    const mapa = new Map(giros.map((g, i) => [claveGiro(g.nombre), i]));
    return (caso: CasoExito) => (caso.giro ? (mapa.get(claveGiro(caso.giro)) ?? -1) : -1);
  }, [giros]);

  const iconoDeGiro = useCallback(
    (caso: CasoExito): IconoCategoria | null => {
      const i = indiceDeGiro(caso);
      return i >= 0 ? giros[i].icono : null;
    },
    [giros, indiceDeGiro]
  );

  const [indice, setIndice] = useState(0);
  const [giroActivo, setGiroActivo] = useState(() => {
    const g = n > 0 ? indiceDeGiro(casos[0]) : -1;
    return g >= 0 ? g : 0;
  });
  const [elegido, setElegido] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [pausado, setPausado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const pasos = useRef(0);

  // Las imagenes de los casos se piden de entrada: cuando un caso pasa al
  // frente, su imagen ya esta en el navegador y el barrido nunca muestra un
  // hueco.
  useEffect(() => {
    for (const c of casos) {
      if (c.imagen) {
        const img = new Image();
        img.src = c.imagen.url;
      }
    }
  }, [casos]);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function irACaso(destino: number, porVisitante: boolean) {
    if (n === 0) return;
    const i = ((destino % n) + n) % n;
    setIndice(i);
    const g = indiceDeGiro(casos[i]);
    // El mazo primero: el cambio de giro (panel + logos) es lo pesado, y como
    // transición no frena el arranque del vuelo de la tarjeta.
    if (g >= 0) startTransition(() => setGiroActivo(g));
    if (porVisitante) setElegido(true);
  }

  const corriendo = pasoAutomatico && animar && !elegido && !reducido && enVista && !pausado && n > 1;

  useEffect(() => {
    if (!corriendo) return;
    const t = window.setTimeout(() => {
      pasos.current += 1;
      if (pasos.current >= n * 2) setElegido(true);
      irACaso(indice + 1, false);
    }, segundosPorCaso * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corriendo, indice, segundosPorCaso, n]);

  function alCambiarGiro(i: number, porVisitante: boolean) {
    setGiroActivo(i);
    if (!porVisitante) return;
    setElegido(true);
    const j = casos.findIndex((c) => indiceDeGiro(c) === i);
    if (j >= 0) setIndice(j);
  }

  const caso = n > 0 ? casos[indice] : null;
  const giroDelCaso = caso ? indiceDeGiro(caso) : -1;
  // La imagen del caso va en el panel abierto mientras ese panel sea su giro
  // (o el caso no tenga giro). Si el visitante abre otro giro sin casos, el
  // panel se ve como siempre.
  const foto: FotoCaso | null =
    caso?.imagen && (giroDelCaso === -1 || giroDelCaso === giroActivo)
      ? { clave: caso.key, url: caso.imagen.url, hotspot: caso.imagen.hotspot, alt: caso.imagen.alt }
      : null;

  const mazo = (
    <MazoCasos
      casos={casos}
      indice={indice}
      iconoDeGiro={iconoDeGiro}
      onPasar={(dir) => irACaso(indice + dir, true)}
      progreso={corriendo ? { ms: segundosPorCaso * 1000 } : null}
      anunciar={elegido}
    />
  );

  return (
    // 11fr / 9fr = 55% carrusel, 45% mazo: la misma retícula que Clientes de
    // Marketing Digital, desde 1024 px (lg). Por debajo, el mazo va DENTRO
    // del carrusel, entre los giros y sus logos (prop `intermedio`): queda
    // justo debajo del panel cuya imagen cambia. La instancia oculta
    // (display: none) no se ve ni la lee un lector de pantalla.
    <div
      ref={raiz}
      className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-14"
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
      <div className="min-w-0">
        <CarruselGiros
          giros={giros}
          rotacion={false}
          animar={animar}
          activo={giroActivo}
          seleccionPorCursor={false}
          onCambio={alCambiarGiro}
          fotoAbierto={foto}
          intermedio={<div className="mb-4 mt-10 lg:hidden">{mazo}</div>}
        />
      </div>

      {/* En escritorio el mazo acompaña el scroll mientras se recorren los
          logos del giro (la columna de la izquierda es más alta). */}
      <div className="hidden min-w-0 lg:sticky lg:top-24 lg:block lg:self-start lg:pt-2">{mazo}</div>
    </div>
  );
}
