"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "motion/react";
import {
  Buildings,
  Cpu,
  ForkKnife,
  Handshake,
  Heartbeat,
  RocketLaunch,
  Sparkle,
  Storefront,
  type Icon,
} from "@phosphor-icons/react";
import type { EmpresaGiro, GiroNegocio, IconoCategoria, ImagenSanity } from "@/lib/marketing-digital";

/**
 * Carrusel de giros de negocio (seccion Clientes de Marketing Digital).
 *
 * REPRODUCE EL VIDEO DE REFERENCIA, no es un set de tabs. Medido cuadro a
 * cuadro (cada 50ms) sobre la grabacion:
 *  - Paneles verticales altos, uno abierto y el resto angostos. El abierto
 *    mide 2,9 veces uno cerrado (255px contra 88px) y el ancho total nunca
 *    cambia: lo que crece uno lo cede el otro.
 *  - La seleccion sigue al cursor. Cada cambio dura ~450ms con curva
 *    ease-out cubica: 40% del recorrido en los primeros 100ms y un asentado
 *    largo y suave.
 *  - El panel abierto va a color; los cerrados, en escala de grises y un poco
 *    mas oscuros (con foto). Sin foto, el equivalente en colores DOFI: lavanda
 *    suave cerrado, degradado morado con brillo naranja abierto.
 *  - La etiqueta (barra + nombre) aparece abajo a la izquierda con un fade
 *    sincronizado, recortada por el borde mientras el panel todavia es angosto.
 *
 * DEBAJO, LOS LOGOS DEL GIRO ABIERTO. Al cambiar de giro salen con fade y
 * entran deslizando desde el lado hacia el que se avanza, escalonados. La
 * altura se reserva con el giro que mas empresas tiene: cambiar de giro nunca
 * mueve la pagina.
 *
 * INTERACCION: cursor (como el video), clic o toque, teclado (flechas,
 * Inicio, Fin: patron de pestañas accesible) y deslizar el dedo en movil.
 *
 * ROTACION AUTOMATICA (opcional desde el Studio): avanza sola mientras el
 * carrusel esta en pantalla y nadie lo toca, con una linea de progreso en el
 * panel abierto. Se pausa con el cursor o el foco adentro, se detiene para
 * siempre cuando el visitante elige un giro y despues de dos vueltas. Con
 * movimiento reducido no rota y los cambios son instantaneos.
 *
 * MUCHOS GIROS: si no entran con un ancho legible, se muestra una ventana de
 * paneles que se desplaza para mantener visible el abierto.
 */

const ICONOS: Record<IconoCategoria, Icon> = {
  construccion: Buildings,
  belleza: Sparkle,
  servicios: Handshake,
  comercio: Storefront,
  emprendedores: RocketLaunch,
  salud: Heartbeat,
  gastronomia: ForkKnife,
  tecnologia: Cpu,
};

/** Medidas del video de referencia. */
const DURACION_MS = 450;
const CURVA = "cubic-bezier(0.33, 1, 0.68, 1)";
const CURVA_MOTION = [0.33, 1, 0.68, 1] as const;
const RELACION_ABIERTO = 2.9;

const INTERVALO_MS = 4800;
const VUELTAS_MAXIMAS = 2;

/** Limites por panel. "compacto" = tira de menos de 560px (telefono): el
 *  abierto necesita 176px para que un nombre largo ("Emprendedores") entre
 *  entero en su etiqueta. Las clases del HTML del servidor (flexServidor y
 *  el margen) repiten estos numeros. */
const MEDIDAS = {
  compacto: { separacion: 6, min: 34, max: 60, abiertoMin: 176 },
  amplio: { separacion: 10, min: 52, max: 124, abiertoMin: 240 },
};

type Distribucion = { inicio: number; visibles: number; plegado: number; abierto: number; separacion: number };

/** Anchos en px para una tira de `ancho`. Los cerrados reparten a razon de
 *  1 : 2,9 con el abierto, con un minimo (legibles), un maximo (que sigan
 *  siendo "angostos" en pantallas anchas) y sin dejar al abierto por debajo
 *  de su minimo; el abierto toma el resto. Si no entran todos, `visibles` < n
 *  y la ventana arranca en `inicio`. */
function distribuir(ancho: number, n: number, activo: number, inicioPrevio: number): Distribucion {
  const m = ancho < 560 ? MEDIDAS.compacto : MEDIDAS.amplio;
  const capacidad = Math.max(2, Math.floor((ancho - m.abiertoMin) / (m.min + m.separacion)) + 1);
  const visibles = Math.min(n, capacidad);
  // La ventana se mueve lo minimo: solo cuando el abierto quedaria afuera.
  let inicio = inicioPrevio;
  if (activo < inicio) inicio = activo;
  else if (activo >= inicio + visibles) inicio = activo - visibles + 1;
  inicio = Math.min(Math.max(0, inicio), n - visibles);
  const util = ancho - (visibles - 1) * m.separacion;
  const plegado =
    visibles > 1
      ? Math.max(m.min, Math.min(m.max, (util - m.abiertoMin) / (visibles - 1), util / (visibles - 1 + RELACION_ABIERTO)))
      : 0;
  return { inicio, visibles, plegado, abierto: util - (visibles - 1) * plegado, separacion: m.separacion };
}

function posicionFoto(h: ImagenSanity["hotspot"]) {
  return h ? `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` : "50% 50%";
}

/** Logos de proporciones distintas se ven del mismo "peso" si ocupan la
 *  misma AREA, no el mismo alto: un logo cuadrado a 44px de alto se ve chico
 *  al lado de uno apaisado. Se reparte un area fija segun la proporcion real
 *  del archivo, sin pasarse de la celda, y object-contain evita deformar. */
function tamanoLogo(ancho: number, alto: number) {
  const proporcion = ancho / alto;
  const AREA = 2400;
  const w = Math.sqrt(AREA * proporcion);
  const h = Math.sqrt(AREA / proporcion);
  const k = Math.min(1, 116 / w, 42 / h);
  return { width: Math.round(w * k), height: Math.round(h * k) };
}

function cantidad(n: number) {
  return `${n} ${n === 1 ? "empresa" : "empresas"}`;
}

const GRILLA_LOGOS = "mt-4 grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-3";
const CELDA_LOGO = "h-[72px]";

const ficha: Variants = {
  entrada: (direccion: number) => ({ opacity: 0, x: 22 * direccion, scale: 0.96 }),
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: DURACION_MS / 1000, ease: CURVA_MOTION } },
  salida: {},
};

function FichaEmpresa({ empresa, direccion }: { empresa: EmpresaGiro; direccion: number }) {
  return (
    <motion.li
      variants={ficha}
      custom={direccion}
      className={`${CELDA_LOGO} flex items-center justify-center rounded-2xl bg-white px-4 shadow-[0_10px_28px_-20px_rgba(26,15,61,0.35)]`}
    >
      {empresa.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={empresa.logo.url}
          alt={empresa.nombre}
          loading="lazy"
          decoding="async"
          className="object-contain"
          style={tamanoLogo(empresa.logo.ancho, empresa.logo.alto)}
        />
      ) : (
        <span className="line-clamp-2 text-center font-display text-[13.5px] font-semibold leading-tight text-ink">
          {empresa.nombre}
        </span>
      )}
    </motion.li>
  );
}

export function CarruselGiros({
  giros,
  rotacion,
  animar,
}: {
  giros: GiroNegocio[];
  rotacion: boolean;
  animar: boolean;
}) {
  const id = useId();
  const n = giros.length;
  // SOLO para la rotacion (corre en efectos). No se usa en el marcado:
  // useReducedMotion lee matchMedia en el primer render del cliente y en el
  // servidor devuelve null, asi que ramificar el HTML con esto rompe la
  // hidratacion. Las transiciones las apaga globals.css ([data-giros]).
  const reducido = useReducedMotion() ?? false;

  const [activoGuardado, setActivo] = useState(0);
  // Acotado: si desde el Studio se borran giros, el indice guardado puede
  // quedar afuera de la lista.
  const activo = Math.min(activoGuardado, Math.max(0, n - 1));
  const [direccion, setDireccion] = useState(1);
  const [ancho, setAncho] = useState<number | null>(null);
  // Sin transicion al medir por primera vez y al redimensionar: solo los
  // cambios de giro se animan.
  const [sinTransicion, setSinTransicion] = useState(true);
  const [enVista, setEnVista] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [detenido, setDetenido] = useState(!rotacion || !animar);

  const raiz = useRef<HTMLDivElement>(null);
  const tira = useRef<HTMLDivElement>(null);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);
  const inicioVentana = useRef(0);
  const pasosAutomaticos = useRef(0);

  const rotando = !detenido && !reducido && enVista && !pausado && n > 1;

  useEffect(() => {
    const el = tira.current;
    if (!el) return;
    let cuadro = 0;
    const ro = new ResizeObserver(([entrada]) => {
      setAncho(Math.round(entrada.contentRect.width));
      setSinTransicion(true);
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        cuadro = requestAnimationFrame(() => setSinTransicion(false));
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(cuadro);
    };
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!rotando) return;
    const t = window.setTimeout(() => {
      pasosAutomaticos.current += 1;
      if (pasosAutomaticos.current >= n * VUELTAS_MAXIMAS) setDetenido(true);
      setDireccion(1);
      setActivo((a) => (a + 1) % n);
    }, INTERVALO_MS);
    return () => window.clearTimeout(t);
  }, [rotando, activo, n]);

  /** Eleccion del visitante: cambia el giro y apaga la rotacion. */
  function elegir(indice: number, dir?: number) {
    const destino = ((indice % n) + n) % n;
    setDetenido(true);
    if (destino === activo) return;
    setDireccion(dir ?? (destino > activo ? 1 : -1));
    setActivo(destino);
  }

  /** Patron de pestañas accesible: flechas (circular), Inicio y Fin. */
  function alTeclear(e: React.KeyboardEvent) {
    let destino: number;
    let dir: number;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      destino = activo + 1;
      dir = 1;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      destino = activo - 1;
      dir = -1;
    } else if (e.key === "Home") {
      destino = 0;
      dir = -1;
    } else if (e.key === "End") {
      destino = n - 1;
      dir = 1;
    } else {
      return;
    }
    e.preventDefault();
    elegir(destino, dir);
    pestanas.current[((destino % n) + n) % n]?.focus();
  }

  function alDeslizar(evento: PointerEvent, info: PanInfo) {
    // El mouse ya elige con el cursor; deslizar es para el dedo.
    if (evento.pointerType === "mouse") return;
    const { offset, velocity } = info;
    if (Math.abs(offset.x) < Math.abs(offset.y)) return;
    if (Math.abs(offset.x) < 40 && Math.abs(velocity.x) < 400) return;
    const dir = offset.x < 0 ? 1 : -1;
    elegir(activo + dir, dir);
  }

  const distribucion = ancho !== null ? distribuir(ancho, n, activo, inicioVentana.current) : null;
  if (distribucion) inicioVentana.current = distribucion.inicio;

  const maxEmpresas = Math.max(1, ...giros.map((g) => g.empresas.length));
  const giro = n > 0 ? giros[activo] : null;
  const totalEmpresas = giro?.empresas.length ?? 0;

  const escenario: Variants = useMemo(
    () => ({
      entrada: {},
      // Escalonado corto aunque haya muchos logos: todo entra en menos de ~0,7s.
      visible: { transition: { staggerChildren: Math.min(0.045, 0.24 / Math.max(1, totalEmpresas)) } },
      salida: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
    }),
    [totalEmpresas]
  );

  if (!giro) return null;

  const duracion = sinTransicion ? "0ms" : `${DURACION_MS}ms`;
  const retardoEtiqueta = sinTransicion ? "0ms" : "100ms";
  const retardoCerrado = sinTransicion ? "0ms" : "120ms";

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={raiz}
        data-giros="true"
        className="min-w-0"
        style={{ touchAction: "pan-y pinch-zoom" }}
        onPanEnd={alDeslizar}
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
        <div
          ref={tira}
          role="tablist"
          aria-label="Giros de negocio"
          onKeyDown={alTeclear}
          className="relative flex h-[300px] sm:h-[340px] lg:h-[380px] xl:h-[420px]"
        >
          {giros.map((g, i) => {
            const abierto = i === activo;
            const Icono = ICONOS[g.icono];
            const visible = !distribucion || (i >= distribucion.inicio && i < distribucion.inicio + distribucion.visibles);
            const primero = distribucion ? i === distribucion.inicio : i === 0;

            // Con la tira medida, anchos exactos en px (la suma nunca cambia,
            // como en el video). Antes de medir (HTML del servidor), el mismo
            // reparto con flex.
            const estilo: React.CSSProperties | undefined = distribucion
              ? {
                  flex: "0 0 auto",
                  width: visible ? (abierto ? distribucion.abierto : distribucion.plegado) : 0,
                  marginLeft: visible && !primero ? distribucion.separacion : 0,
                  opacity: visible ? 1 : 0,
                  transitionProperty: "width, margin-left, opacity, box-shadow",
                  transitionDuration: duracion,
                  transitionTimingFunction: CURVA,
                }
              : undefined;
            const flexServidor = distribucion
              ? ""
              : `${i === 0 ? "" : "ml-1.5 sm:ml-2.5"} ${
                  abierto
                    ? "flex-[2.9_1_0%] min-w-[176px] sm:min-w-[240px]"
                    : "flex-[1_1_0%] min-w-[34px] max-w-[60px] sm:min-w-[52px] sm:max-w-[124px]"
                }`;

            return (
              <button
                key={g.key}
                ref={(el) => {
                  pestanas.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-giro-${i}`}
                aria-selected={abierto}
                aria-controls={`${id}-empresas`}
                aria-label={g.empresas.length > 0 ? `${g.nombre}, ${cantidad(g.empresas.length)}` : g.nombre}
                tabIndex={abierto ? 0 : -1}
                data-giro={abierto ? "abierto" : "cerrado"}
                onClick={() => elegir(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") elegir(i);
                }}
                style={estilo}
                className={`relative h-full shrink-0 cursor-pointer overflow-hidden rounded-[22px] text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${flexServidor} ${
                  abierto ? "shadow-[0_26px_50px_-28px_rgba(75,42,147,0.75)]" : "shadow-none"
                }`}
              >
                {/* Fondo: foto (gris cerrada, color abierta) o colores DOFI. */}
                {g.imagen ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.imagen.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover ${abierto ? "grayscale-0 brightness-100" : "grayscale brightness-[0.82]"}`}
                      style={{
                        objectPosition: posicionFoto(g.imagen.hotspot),
                        transition: `filter ${duracion} ${CURVA}`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-abyss/15 to-transparent"
                      style={{ opacity: abierto ? 1 : 0.55, transition: `opacity ${duracion} ${CURVA}` }}
                    />
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#F3EEFB_0%,#E7DEF6_100%)]" />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[radial-gradient(120%_80%_at_92%_108%,rgba(244,123,32,0.5)_0%,rgba(244,123,32,0)_58%),linear-gradient(165deg,#6D4BC9_0%,#4B2A93_52%,#281559_100%)]"
                      style={{ opacity: abierto ? 1 : 0, transition: `opacity ${duracion} ${CURVA}` }}
                    />
                    <Icono
                      aria-hidden="true"
                      weight="duotone"
                      className="absolute -bottom-10 -right-10 h-52 w-52 text-white/10"
                      style={{ opacity: abierto ? 1 : 0, transition: `opacity ${duracion} ${CURVA}` }}
                    />
                  </>
                )}

                {/* Cerrado: icono arriba y nombre en vertical. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex flex-col items-center justify-between py-5"
                  style={{
                    opacity: abierto ? 0 : 1,
                    transition: `opacity ${abierto ? "150ms" : duracion} ${CURVA} ${abierto ? "0ms" : retardoCerrado}`,
                  }}
                >
                  <Icono size={22} weight="duotone" className={g.imagen ? "text-white/90" : "text-brand"} />
                  <span
                    className={`rotate-180 whitespace-nowrap font-display text-[15px] font-semibold tracking-tight [writing-mode:vertical-rl] ${
                      g.imagen ? "text-white" : "text-brand"
                    }`}
                  >
                    {g.nombre}
                  </span>
                </span>

                {/* Abierto: icono y etiqueta (barra + nombre), como en el video. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6"
                  style={{
                    opacity: abierto ? 1 : 0,
                    translate: abierto ? "0 0" : "0 8px",
                    transition: `opacity ${abierto ? duracion : "200ms"} ${CURVA} ${abierto ? retardoEtiqueta : "0ms"}, translate ${duracion} ${CURVA}`,
                  }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    <Icono size={20} weight="duotone" />
                  </span>
                  {/* Solo el nombre, como en la referencia: la cantidad de
                      empresas va en el encabezado de los logos. */}
                  <span className="flex items-center gap-2.5 sm:gap-3">
                    <span className="h-5 w-[3px] shrink-0 rounded-full bg-accent sm:h-6" />
                    <span className="whitespace-nowrap font-display text-base font-bold leading-tight text-white sm:text-xl lg:text-2xl">
                      {g.nombre}
                    </span>
                  </span>
                </span>

                {/* Progreso de la rotacion automatica. */}
                {abierto && rotando && (
                  <motion.span
                    key={`progreso-${activo}`}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-accent-lift"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVALO_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Logos del giro abierto. La capa invisible reserva el alto del giro
            con mas empresas: al cambiar de giro la pagina no salta. */}
        <div className="relative mt-6 grid">
          <div aria-hidden="true" className="invisible [grid-area:1/1]">
            <div className="h-7" />
            <ul className={GRILLA_LOGOS}>
              {Array.from({ length: maxEmpresas }, (_, i) => (
                <li key={i} className={CELDA_LOGO} />
              ))}
            </ul>
          </div>

          <div
            id={`${id}-empresas`}
            role="tabpanel"
            aria-labelledby={`${id}-giro-${activo}`}
            className="relative [grid-area:1/1]"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={giro.key}
                className="absolute inset-x-0 top-0"
                initial="entrada"
                animate="visible"
                exit="salida"
                variants={escenario}
              >
                <motion.p variants={ficha} custom={direccion} className="flex h-7 items-center gap-3">
                  <span aria-hidden="true" className="h-[3px] w-6 rounded-full bg-accent" />
                  <span className="font-display text-lg font-bold tracking-tight text-ink">{giro.nombre}</span>
                  {giro.empresas.length > 0 && (
                    <span className="font-sans text-sm text-ink-subtle">· {cantidad(giro.empresas.length)}</span>
                  )}
                </motion.p>
                {giro.empresas.length > 0 ? (
                  <ul className={GRILLA_LOGOS}>
                    {giro.empresas.map((empresa) => (
                      <FichaEmpresa key={empresa.key} empresa={empresa} direccion={direccion} />
                    ))}
                  </ul>
                ) : (
                  <motion.p
                    variants={ficha}
                    custom={direccion}
                    className="mt-4 flex w-fit max-w-full items-center rounded-2xl bg-white/70 px-5 py-4 font-sans text-[15px] text-ink-muted shadow-[0_10px_28px_-22px_rgba(26,15,61,0.35)]"
                  >
                    Pronto verás aquí las empresas de este giro.
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
