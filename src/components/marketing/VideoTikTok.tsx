"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowClockwise,
  BatteryFull,
  CellSignalFull,
  ChatCircleDots,
  FilmSlate,
  Heart,
  House,
  MagnifyingGlass,
  MusicNotesSimple,
  Play,
  Plus,
  ShareFat,
  SpeakerHigh,
  SpeakerSlash,
  Tray,
  User,
  Users,
  WifiHigh,
} from "@phosphor-icons/react";
import { MarcoIphone } from "@/components/MarcoIphone";
import type { ImagenSanity, PerfilTikTok, VideoSeccion } from "@/lib/marketing-digital";

/**
 * El video de «Clientes y casos de éxito» como una publicación de TikTok en un
 * iPhone (pedido del 2026-10-16). Lo usan Marketing Digital y Asesorías, cada
 * una con su video, usuario, descripción y contadores desde el Studio.
 *
 * PANTALLA (390 x 844, la de un iPhone): barra de estado arriba, el video en
 * 9:16 exacto (390 x 693) y la barra de navegación de TikTok abajo. Encima del
 * video, como en la app: «Siguiendo · Para ti», la columna de la derecha (foto
 * de perfil, Me gusta, Comentarios, Compartir y el disco del sonido) y, abajo,
 * el usuario, la descripción y el sonido. El video nunca se deforma.
 *
 * REPRODUCCIÓN: arranca solo y en silencio cuando se ve (sin movimiento
 * reducido), UNA vez: tocar el video lo pausa o lo sigue; al terminar queda el
 * botón «Ver de nuevo». Si la persona lo pausó, no vuelve a arrancar solo al
 * volver a la sección. Fuera de pantalla se pausa.
 *
 * CONTADORES (simulación visual, no métricas reales): cada uno arranca en su
 * valor del Studio y sube SEGÚN EL TIEMPO DEL VIDEO -- el valor sale de
 * `currentTime`, no de un reloj aparte: pausado no sube, terminado queda en el
 * final y desde el inicio vuelve al valor de arranque. El ritmo varía un poco
 * (curva suave), sin saltos. El único bucle (requestAnimationFrame) corre
 * mientras el video se reproduce y se cancela al pausar, terminar o salir.
 *
 * Sin video cargado: el mismo teléfono con un aviso en la pantalla.
 */

const PANTALLA = { ancho: 390, alto: 844 } as const;
/** Zonas de la pantalla, en sus unidades: el video es 9:16 exacto. */
const VIDEO = { arriba: 44, alto: 693 } as const;

/** Cuánto sube cada contador por segundo de video (promedio). */
const RITMO = { meGusta: 3, comentarios: 0.4, compartidos: 0.6 } as const;

/** Curva de avance: creciente siempre, con el ritmo un poco desparejo (como la
 *  actividad real) pero sin saltos. curva(0) = 0, curva(1) = 1. */
function curva(p: number) {
  const k = 3;
  const a = 0.8;
  const x = Math.min(1, Math.max(0, p));
  return x - (a * Math.sin(2 * Math.PI * k * x)) / (2 * Math.PI * k);
}

/** 8240 → «8.240»; 1 250 000 → «1,3 M». */
function formatear(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} M`;
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const x = (v: number) => `${(v / PANTALLA.ancho) * 100}%`;
const y = (v: number) => `${(v / PANTALLA.alto) * 100}%`;
/** Medidas en unidades de la pantalla, escaladas con su ancho (cqw). */
const u = (v: number) => `${(v * 100) / PANTALLA.ancho}cqw`;

const SOMBRA = "[text-shadow:0_1px_3px_rgba(0,0,0,0.55)]";

type Estado = "detenido" | "reproduciendo" | "pausado" | "terminado";

function Accion({
  Icono,
  valor,
  arriba,
}: {
  Icono: typeof Heart;
  valor: number;
  arriba: number;
}) {
  return (
    <div className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: x(352), top: y(arriba) }}>
      <Icono weight="fill" className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" style={{ width: u(36), height: u(36) }} />
      <span className={`mt-[0.6cqw] font-sans font-semibold tabular-nums ${SOMBRA}`} style={{ fontSize: u(12.5) }}>
        {formatear(valor)}
      </span>
    </div>
  );
}

export function VideoTikTok({
  video,
  portada,
  perfil,
  titulo,
}: {
  video: VideoSeccion | null;
  portada: ImagenSanity | null;
  perfil: PerfilTikTok;
  /** El título de la sección: nombre accesible del video. */
  titulo: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const raf = useRef<number | null>(null);
  const pausadoPorUsuario = useRef(false);
  const [estado, setEstado] = useState<Estado>("detenido");
  const [progreso, setProgreso] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [silenciado, setSilenciado] = useState(true);
  const [reducido, setReducido] = useState(false);
  const url = video?.url;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  // El progreso sale del video (milésimas: no se repinta de más).
  const leer = useCallback(() => {
    const v = ref.current;
    if (!v || !v.duration) return;
    setProgreso(Math.round((v.currentTime / v.duration) * 1000) / 1000);
  }, []);

  // Eventos del video: el bucle de cuadros vive solo mientras se reproduce.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    setSilenciado(true);
    pausadoPorUsuario.current = false;
    setEstado("detenido");
    setProgreso(0);

    const parar = () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
    const cuadro = () => {
      leer();
      raf.current = requestAnimationFrame(cuadro);
    };
    const alReproducir = () => {
      setEstado("reproduciendo");
      parar();
      raf.current = requestAnimationFrame(cuadro);
    };
    const alPausar = () => {
      parar();
      leer();
      if (!v.ended) setEstado("pausado");
    };
    const alTerminar = () => {
      parar();
      setProgreso(1);
      setEstado("terminado");
    };
    const alMetadatos = () => setDuracion(Number.isFinite(v.duration) ? v.duration : 0);

    v.addEventListener("play", alReproducir);
    v.addEventListener("pause", alPausar);
    v.addEventListener("ended", alTerminar);
    v.addEventListener("seeked", leer);
    v.addEventListener("loadedmetadata", alMetadatos);
    if (v.readyState >= 1) alMetadatos();
    return () => {
      parar();
      v.removeEventListener("play", alReproducir);
      v.removeEventListener("pause", alPausar);
      v.removeEventListener("ended", alTerminar);
      v.removeEventListener("seeked", leer);
      v.removeEventListener("loadedmetadata", alMetadatos);
    };
  }, [url, leer]);

  // Arranca solo al verse (sin movimiento reducido, si nadie lo pausó y si no
  // terminó); fuera de pantalla se pausa.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!reducido && !pausadoPorUsuario.current && !v.ended && v.paused) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [url, reducido]);

  function alternar() {
    const v = ref.current;
    if (!v) return;
    if (v.ended || estado === "terminado") {
      pausadoPorUsuario.current = false;
      v.currentTime = 0;
      setProgreso(0);
      v.play().catch(() => {});
    } else if (v.paused) {
      pausadoPorUsuario.current = false;
      v.play().catch(() => {});
    } else {
      pausadoPorUsuario.current = true;
      v.pause();
    }
  }

  function alternarSonido() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setSilenciado(v.muted);
  }

  const avance = curva(progreso);
  const contadores = {
    meGusta: perfil.meGusta + Math.floor(RITMO.meGusta * duracion * avance),
    comentarios: perfil.comentarios + Math.floor(RITMO.comentarios * duracion * avance),
    compartidos: perfil.compartidos + Math.floor(RITMO.compartidos * duracion * avance),
  };
  const nombre = perfil.usuario.replace(/^@/, "");
  const girando = estado === "reproduciendo" && !reducido;
  const etiquetaBoton =
    estado === "terminado" ? "Ver el video de nuevo" : estado === "reproduciendo" ? "Pausar el video" : "Reproducir el video";

  return (
    <figure className="flex h-full flex-col lg:min-h-0">
      {/* Escritorio: la caja mide su columna (container-type: size) y el
          teléfono toma el mayor tamaño que entra: su alto es el de la pantalla
          (ancho x 844/390) más los 18 px del bisel. Teléfono: hasta 300 px. */}
      <div className="lg:min-h-0 lg:flex-1 lg:[container-type:size]">
        <div className="mx-auto w-full max-w-[300px] lg:w-[min(100cqw,calc((100cqh-18px)*390/844+18px))] lg:max-w-none">
          <MarcoIphone pantalla={PANTALLA} fondo="#000">
            <div className="absolute inset-0 text-white [container-type:inline-size]">
              {/* Barra de estado */}
              <div aria-hidden="true" className="absolute inset-x-0 top-0 flex items-center justify-between" style={{ height: y(VIDEO.arriba), paddingInline: u(30) }}>
                <span className="font-sans font-semibold" style={{ fontSize: u(15) }}>
                  9:41
                </span>
                <span className="flex items-center" style={{ gap: u(5) }}>
                  <CellSignalFull weight="fill" style={{ width: u(17), height: u(17) }} />
                  <WifiHigh weight="bold" style={{ width: u(17), height: u(17) }} />
                  <BatteryFull weight="fill" style={{ width: u(24), height: u(24) }} />
                </span>
              </div>

              {/* El video, 9:16 */}
              <div className="absolute inset-x-0 overflow-hidden bg-black" style={{ top: y(VIDEO.arriba), height: y(VIDEO.alto) }}>
                {video ? (
                  <>
                    <video
                      ref={ref}
                      src={video.url}
                      poster={portada?.url}
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={`Video: ${titulo}`}
                      className={`absolute inset-0 h-full w-full ${video.ajuste === "completo" ? "object-contain" : "object-cover"}`}
                    />
                    <button
                      type="button"
                      onClick={alternar}
                      aria-label={etiquetaBoton}
                      className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-accent-lift"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(90%_60%_at_80%_100%,rgba(244,123,32,0.22)_0%,rgba(244,123,32,0)_60%),linear-gradient(160deg,#2E1B68_0%,#1A0F3D_55%,#120A26_100%)]">
                    <span className="flex items-center justify-center rounded-full bg-white/10 text-white/80" style={{ width: u(56), height: u(56) }}>
                      <FilmSlate weight="duotone" aria-hidden="true" style={{ width: u(28), height: u(28) }} />
                    </span>
                    <p className="px-[12%] text-center font-sans text-white/70" style={{ fontSize: u(14) }}>
                      Pronto verás aquí nuestro video.
                    </p>
                  </div>
                )}

                {/* Lo de encima del video: decorativo, deja pasar el toque. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <span className="absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-black/40 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-black/60 to-transparent" />

                  <div className={`absolute inset-x-0 flex items-center justify-center font-sans ${SOMBRA}`} style={{ top: u(12), gap: u(18), fontSize: u(16) }}>
                    <span className="text-white/70">Siguiendo</span>
                    <span className="relative font-bold">
                      Para ti
                      <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white" style={{ top: "115%", width: u(28), height: u(2.5) }} />
                    </span>
                  </div>
                  <MagnifyingGlass weight="bold" className="absolute drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" style={{ right: u(16), top: u(12), width: u(22), height: u(22) }} />

                  {/* Columna de la derecha (en unidades de la pantalla completa). */}
                  <div className="absolute inset-0" style={{ top: `-${(VIDEO.arriba / VIDEO.alto) * 100}%`, height: `${(PANTALLA.alto / VIDEO.alto) * 100}%` }}>
                    <div className="absolute -translate-x-1/2" style={{ left: x(352), top: y(372) }}>
                      <span className="flex items-center justify-center overflow-hidden rounded-full border-white bg-abyss" style={{ width: u(48), height: u(48), borderWidth: u(1.5) }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo-dofi-mark.png" alt="" className="h-[70%] w-[70%] object-contain" />
                      </span>
                      <span className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-accent text-white" style={{ bottom: u(-9), width: u(20), height: u(20) }}>
                        <Plus weight="bold" style={{ width: u(12), height: u(12) }} />
                      </span>
                    </div>
                    <Accion Icono={Heart} valor={contadores.meGusta} arriba={448} />
                    <Accion Icono={ChatCircleDots} valor={contadores.comentarios} arriba={522} />
                    <Accion Icono={ShareFat} valor={contadores.compartidos} arriba={596} />
                    <span
                      className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full bg-[conic-gradient(#2a2a2a,#111,#2a2a2a,#111,#2a2a2a)] ${girando ? "animate-[spin_5s_linear_infinite]" : ""}`}
                      style={{ left: x(352), top: y(672), width: u(44), height: u(44) }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-dofi-mark.png" alt="" className="rounded-full bg-abyss object-contain p-[12%]" style={{ width: u(24), height: u(24) }} />
                    </span>
                  </div>

                  {/* Usuario, descripción y sonido */}
                  <div className={`absolute font-sans ${SOMBRA}`} style={{ left: u(14), right: u(76), bottom: u(18) }}>
                    <p className="font-bold" style={{ fontSize: u(15.5) }}>
                      {perfil.usuario}
                    </p>
                    {perfil.descripcion && (
                      <p className="line-clamp-2 leading-snug" style={{ marginTop: u(4), fontSize: u(13.5) }}>
                        {perfil.descripcion}
                      </p>
                    )}
                    <p className="flex items-center truncate" style={{ marginTop: u(6), gap: u(5), fontSize: u(13) }}>
                      <MusicNotesSimple weight="fill" className="shrink-0" style={{ width: u(14), height: u(14) }} />
                      <span className="truncate">sonido original - {nombre}</span>
                    </p>
                  </div>

                  {/* Progreso del video */}
                  <span className="absolute inset-x-0 bottom-0 bg-white/25" style={{ height: u(2) }}>
                    <span className="block h-full bg-white" style={{ width: `${progreso * 100}%` }} />
                  </span>

                  {/* Pausa / fin */}
                  {video && (estado === "pausado" || estado === "detenido") && (
                    <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      <Play weight="fill" style={{ width: u(64), height: u(64) }} />
                    </span>
                  )}
                  {estado === "terminado" && (
                    <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center font-sans font-semibold" style={{ gap: u(8), fontSize: u(14) }}>
                      <span className="flex items-center justify-center rounded-full bg-black/45 backdrop-blur-sm" style={{ width: u(64), height: u(64) }}>
                        <ArrowClockwise weight="bold" style={{ width: u(30), height: u(30) }} />
                      </span>
                      <span className={SOMBRA}>Ver de nuevo</span>
                    </span>
                  )}
                </div>

                {video?.sonido && (
                  <button
                    type="button"
                    onClick={alternarSonido}
                    aria-label={silenciado ? "Activar sonido" : "Silenciar"}
                    className="absolute flex items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-lift"
                    style={{ left: u(14), top: u(14), width: u(34), height: u(34) }}
                  >
                    {silenciado ? <SpeakerSlash weight="fill" style={{ width: u(17), height: u(17) }} /> : <SpeakerHigh weight="fill" style={{ width: u(17), height: u(17) }} />}
                  </button>
                )}
              </div>

              {/* Barra de navegación de TikTok */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-black" style={{ top: y(VIDEO.arriba + VIDEO.alto) }}>
                <div className="flex items-start justify-around font-sans" style={{ paddingTop: u(10), fontSize: u(10.5) }}>
                  {[
                    { Icono: House, texto: "Inicio", activo: true },
                    { Icono: Users, texto: "Amigos" },
                  ].map(({ Icono, texto, activo }) => (
                    <span key={texto} className={`flex flex-col items-center ${activo ? "text-white" : "text-white/60"}`} style={{ gap: u(3) }}>
                      <Icono weight={activo ? "fill" : "regular"} style={{ width: u(24), height: u(24) }} />
                      {texto}
                    </span>
                  ))}
                  <span className="relative flex items-center justify-center rounded-[22%] bg-white text-black shadow-[-3px_0_0_var(--color-brand-lift),3px_0_0_var(--color-accent)]" style={{ width: u(44), height: u(30), marginTop: u(2) }}>
                    <Plus weight="bold" style={{ width: u(18), height: u(18) }} />
                  </span>
                  {[
                    { Icono: Tray, texto: "Bandeja" },
                    { Icono: User, texto: "Perfil" },
                  ].map(({ Icono, texto }) => (
                    <span key={texto} className="flex flex-col items-center text-white/60" style={{ gap: u(3) }}>
                      <Icono style={{ width: u(24), height: u(24) }} />
                      {texto}
                    </span>
                  ))}
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/85" style={{ bottom: u(8), width: u(134), height: u(5) }} />
              </div>
            </div>
          </MarcoIphone>
        </div>
      </div>
      <figcaption className="sr-only">
        Video de {perfil.usuario} presentado como una publicación de TikTok.{perfil.descripcion ? ` ${perfil.descripcion}` : ""}
      </figcaption>
    </figure>
  );
}
