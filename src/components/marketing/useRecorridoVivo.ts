"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * El recorrido "vivo" del Método (RutaMetodo con `vivo`): un punto luminoso
 * viaja de parada en parada y cada parada se enciende cuando llega -- el
 * método se lee como lo que es, un camino que se recorre en orden y termina en
 * la venta.
 *
 * UN SOLO NUMERO MANDA: `v` va de 0 a n-1 (la parada 0 es la primera, n-1 el
 * destino) y es una funcion del tiempo (`valorEn`): parada quieta, viaje con
 * aceleracion, parada quieta... Con él se calculan, sin pasar por React (un
 * requestAnimationFrame, sin re-render):
 *  - la posicion del punto (curva de Bezier entre paradas en escritorio, linea
 *    recta en la vista vertical);
 *  - la linea de avance que va dejando (escritorio: recorte de la linea
 *    punteada; vertical: el tramo entre paradas que se llena);
 *  - y, solo cuando cambia de parada, el estado `activo` (React) que enciende
 *    la parada, su titulo y la microanimacion de su icono.
 *
 * Sin librerias de animacion a proposito: este hook vive en el paquete de
 * RutaMetodo, que cargan tambien Marketing Digital y Tráfico/Ads, y no deben
 * pagar KB por algo que solo usa FENIAX.
 *
 * El punto desaparece al llegar a una parada y reaparece al salir: la parada
 * "lo absorbe", asi nunca tapa su propio icono.
 *
 * SOLO CORRE MIENTRAS ES VISIBLE y no esta en pausa. Con movimiento reducido
 * no corre nunca (la ruta queda estatica, como siempre). Siempre se puede
 * pausar (el boton lo pone RutaMetodo).
 *
 * LA GEOMETRIA SE MIDE, no se supone: los centros de las paradas salen de las
 * posiciones reales en el DOM (offsetLeft/offsetTop, que ignoran las
 * transformaciones de la animacion de entrada), asi funciona igual en
 * escritorio, tablet y telefono, y se vuelve a medir cuando cambia el tamaño.
 */

/** Segundos. */
const ESPERA_INICIAL = 1.9; // deja terminar la entrada (linea + paradas)
const ESPERA_REGRESO = 0.35; // al volver a entrar en pantalla
const PARADA = 1.15;
const VIAJE = 0.9;
const PARADA_FINAL = 2.4;
const DESCANSO = 0.7; // entre una vuelta y la siguiente

type Punto = { x: number; y: number };

const acotar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const suave = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

/** Segundos que dura una vuelta completa (sin el descanso). */
const duracion = (n: number) => n * PARADA - PARADA + PARADA_FINAL + (n - 1) * VIAJE;

/** Posicion del recorrido (0 .. n-1) `t` segundos despues de salir. */
function valorEn(t: number, n: number): number {
  let inicio = 0;
  for (let i = 0; i < n; i++) {
    const parada = i === n - 1 ? PARADA_FINAL : PARADA;
    if (t < inicio + parada) return i;
    inicio += parada;
    if (i < n - 1) {
      if (t < inicio + VIAJE) return i + suave((t - inicio) / VIAJE);
      inicio += VIAJE;
    }
  }
  return n - 1;
}

function bezier(a: Punto, b: Punto, f: number): Punto {
  // La misma curva que dibuja la linea punteada: tangente horizontal en cada
  // parada (puntos de control a mitad de camino en x, con la y de cada extremo).
  const mx = (a.x + b.x) / 2;
  const u = 1 - f;
  return {
    x: u * u * u * a.x + 3 * u * u * f * mx + 3 * u * f * f * mx + f * f * f * b.x,
    y: u * u * u * a.y + 3 * u * u * f * a.y + 3 * u * f * f * b.y + f * f * f * b.y,
  };
}

export function useRecorridoVivo({
  habilitado,
  n,
  contenedor,
  nodos,
  orbe,
  relleno,
  tramos,
}: {
  habilitado: boolean;
  /** Paradas, contando el destino. */
  n: number;
  contenedor: RefObject<HTMLDivElement | null>;
  nodos: RefObject<(HTMLElement | null)[]>;
  orbe: RefObject<HTMLElement | null>;
  /** Linea de avance de escritorio: se recorta hasta donde llego el punto. */
  relleno: RefObject<HTMLElement | null>;
  /** Tramos de la vista vertical: cada uno se llena de arriba hacia abajo. */
  tramos: RefObject<(HTMLElement | null)[]>;
}) {
  const [activo, setActivo] = useState<number | null>(null);
  const [pausado, setPausado] = useState(false);
  const [enVista, setEnVista] = useState(false);
  const [reducido, setReducido] = useState(false);

  const puntos = useRef<Punto[]>([]);
  const escritorio = useRef(false);
  const ancho = useRef(1);
  const valor = useRef(0);
  /** Parada encendida ahora (null: el recorrido no ha arrancado o esta en descanso). */
  const ultimo = useRef<number | null>(null);
  const yaCorrio = useRef(false);

  useEffect(() => {
    if (!habilitado) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, [habilitado]);

  useEffect(() => {
    const el = contenedor.current;
    if (!habilitado || !el) return;
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [habilitado, contenedor]);

  const medir = useCallback(() => {
    const raiz = contenedor.current;
    if (!raiz) return;
    ancho.current = Math.max(1, raiz.offsetWidth);
    escritorio.current = window.matchMedia("(min-width: 1280px)").matches;
    puntos.current = (nodos.current ?? []).slice(0, n).map((el) => {
      if (!el) return { x: 0, y: 0 };
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      for (let o: HTMLElement | null = el; o && o !== raiz; o = o.offsetParent as HTMLElement | null) {
        x += o.offsetLeft;
        y += o.offsetTop;
      }
      return { x, y };
    });
  }, [contenedor, nodos, n]);

  const escribir = useCallback(
    (v: number) => {
      valor.current = v;
      const pts = puntos.current;
      if (pts.length < n) return;
      const i = Math.min(n - 2, Math.max(0, Math.floor(v)));
      const f = acotar(v - i);
      const a = pts[i];
      const b = pts[i + 1];
      const pos = escritorio.current ? bezier(a, b, f) : { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };

      const o = orbe.current;
      if (o) {
        o.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        // Visible solo en viaje: lo absorbe la parada al llegar y lo suelta al salir.
        o.style.opacity = String(Math.min(1, Math.sin(Math.PI * f) * 2.4));
      }
      if (relleno.current) {
        relleno.current.style.clipPath = `inset(0 ${Math.max(0, 100 - (pos.x / ancho.current) * 100)}% 0 0)`;
      }
      (tramos.current ?? []).forEach((t, k) => {
        if (t) t.style.transform = `scaleY(${acotar(v - k)})`;
      });

      // La parada se enciende al LLEGAR el punto, no a mitad de camino.
      const llegada = Math.floor(v + 0.02);
      if (llegada !== ultimo.current) {
        ultimo.current = llegada;
        setActivo(llegada);
      }
    },
    [n, orbe, relleno, tramos]
  );

  // Cambia el tamaño (o carga la fuente): se vuelve a medir y a colocar el punto.
  useEffect(() => {
    const raiz = contenedor.current;
    if (!habilitado || !raiz) return;
    const ro = new ResizeObserver(() => {
      medir();
      // Solo si el recorrido ya arranco: con movimiento reducido (o antes de
      // la primera vuelta) no debe encender ninguna parada.
      if (ultimo.current !== null) escribir(valor.current);
    });
    ro.observe(raiz);
    return () => ro.disconnect();
  }, [habilitado, contenedor, medir, escribir]);

  useEffect(() => {
    if (!habilitado || reducido || !enVista || pausado || n < 2) return;
    let cancelado = false;
    let cuadro = 0;
    const vuelta = duracion(n);
    const ciclo = vuelta + DESCANSO;
    medir();
    // Una vuelta empieza `espera` segundos despues de arrancar el efecto.
    const salida = performance.now() + (yaCorrio.current ? ESPERA_REGRESO : ESPERA_INICIAL) * 1000;
    yaCorrio.current = true;

    const paso = (ahora: number) => {
      if (cancelado) return;
      const t = (ahora - salida) / 1000;
      if (t >= 0) {
        const en = t % ciclo;
        if (en < vuelta) {
          escribir(valorEn(en, n));
        } else if (ultimo.current !== null) {
          // Descanso: todo apagado un instante y vuelve a empezar.
          ultimo.current = null;
          setActivo(null);
          if (orbe.current) orbe.current.style.opacity = "0";
        }
      }
      cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);

    return () => {
      cancelado = true;
      cancelAnimationFrame(cuadro);
    };
  }, [habilitado, reducido, enVista, pausado, n, medir, escribir, orbe]);

  const alternar = useCallback(() => setPausado((v) => !v), []);

  return { activo, pausado, reducido, alternar };
}
