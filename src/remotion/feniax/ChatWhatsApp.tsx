import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AirplaneTilt,
  Buildings,
  Car,
  Cpu,
  ForkKnife,
  GraduationCap,
  Handshake,
  Heartbeat,
  HouseLine,
  RocketLaunch,
  Sparkle,
  Storefront,
  type Icon,
} from "@phosphor-icons/react";
import type { ChatDemo, MensajeChat } from "@/lib/chat-demo";
import type { IconoCategoria } from "@/lib/marketing-digital";
import { calcularLinea, type LineaChat } from "./linea";
import { curva, resorte } from "./curvas";
import { FUENTE_SISTEMA, marca, sombra, whatsapp, type TemaChat } from "./tema";

/**
 * Composicion Remotion: la pantalla de un telefono con una conversacion de
 * WhatsApp que se escribe sola. Todo lo que se ve depende SOLO del cuadro
 * actual (useCurrentFrame) y de la linea de tiempo calculada a partir de los
 * mensajes (linea.ts): por eso se puede adelantar, pausar y retroceder como
 * un video, y por eso una conversacion nueva en el Studio es un video nuevo.
 *
 * Capas, de abajo hacia arriba: fondo con garabatos -> encabezado -> lista de
 * mensajes (crece desde abajo, como la app) -> barra para escribir -> aviso
 * del CRM (lo unico con colores FENIAX) -> salida.
 *
 * ALTURAS SIN MEDIR: cada burbuja nueva empuja a las anteriores hacia arriba
 * creciendo con `grid-template-rows: Xfr` (de 0 a 1). Es CSS puro y
 * determinista: no hace falta medir el DOM ni guardar estado.
 */

export type PropsChatWhatsApp = {
  chat: ChatDemo;
  tema: TemaChat;
};

const ICONOS: Record<IconoCategoria, Icon> = {
  construccion: Buildings,
  belleza: Sparkle,
  servicios: Handshake,
  comercio: Storefront,
  emprendedores: RocketLaunch,
  salud: Heartbeat,
  gastronomia: ForkKnife,
  tecnologia: Cpu,
  automotriz: Car,
  inmobiliaria: HouseLine,
  educacion: GraduationCap,
  turismo: AirplaneTilt,
};

const ALTO_ESTADO = 47;
const ALTO_ENCABEZADO = 58;
const ALTO_COMPOSITOR = 62;
const ALTO_INICIO = 26;

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Hora de cada mensaje: arranca 10:24 y avanza un minuto cada dos. */
function hora(i: number) {
  const min = 24 + Math.floor(i / 2);
  return `10:${String(min).padStart(2, "0")}`;
}

function garabatos(color: string) {
  const c = encodeURIComponent(color);
  // Mosaico de 132px con trazos sueltos (globo, corazon, estrella, onda,
  // circulo): la textura del fondo de WhatsApp sin copiar su ilustracion.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='132' height='132' fill='none' stroke='${c}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M14 18h20a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H24l-7 6v-6h-3a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z'/><path d='M92 22c-4-6-14-3-12 4 1 4 12 11 12 11s11-7 12-11c2-7-8-10-12-4z'/><path d='M30 92l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z'/><path d='M74 98c6-8 12 8 18 0s12 8 18 0'/><circle cx='104' cy='72' r='7'/><path d='M60 54l6 6m0-6l-6 6'/></svg>`;
  return `url("data:image/svg+xml,${svg}")`;
}

function Avatar({ chat, tamano }: { chat: ChatDemo; tamano: number }) {
  if (chat.avatar) {
    return (
      <Img
        src={chat.avatar}
        style={{ width: tamano, height: tamano, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  if (chat.icono === "feniax") {
    return (
      <div
        style={{
          width: tamano,
          height: tamano,
          borderRadius: "50%",
          background: marca.berenjena,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Img src="/feniax/feniax-isotipo.svg" style={{ width: tamano * 0.6, height: "auto", marginTop: -1 }} />
      </div>
    );
  }
  const IconoGiro = chat.icono ? ICONOS[chat.icono] : Storefront;
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        borderRadius: "50%",
        background: marca.degradadoAvatar,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: marca.blanco,
        flexShrink: 0,
      }}
    >
      <IconoGiro size={tamano * 0.52} weight="duotone" />
    </div>
  );
}

function BarraEstado({ color }: { color: string }) {
  return (
    <div
      style={{
        height: ALTO_ESTADO,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "0 30px 9px 34px",
        color,
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: "-0.01em",
      }}
    >
      <span>9:41</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill={color} aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="6" rx="1" />
          <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="15" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={color} aria-hidden="true">
          <path d="M8 2.3c2.2 0 4.2.8 5.7 2.2l1.2-1.2A9.7 9.7 0 0 0 8 .6 9.7 9.7 0 0 0 1.1 3.3l1.2 1.2A8 8 0 0 1 8 2.3zm0 3.3c1.3 0 2.5.5 3.4 1.3l1.2-1.2A6.6 6.6 0 0 0 8 4a6.6 6.6 0 0 0-4.6 1.7l1.2 1.2A4.9 4.9 0 0 1 8 5.6zm0 3.3c.5 0 .9.2 1.2.5L8 10.6 6.8 9.4c.3-.3.7-.5 1.2-.5z" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke={color} strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill={color} />
          <path d="M24 4v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill={color} fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

function Palomitas({ color }: { color: string }) {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden="true" style={{ marginLeft: 3 }}>
      <path d="M1 6l3 3 6-7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8.6L7.5 9l6-7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Burbuja({
  mensaje,
  indice,
  inicioGrupo,
  linea,
  tema,
}: {
  mensaje: MensajeChat;
  indice: number;
  inicioGrupo: boolean;
  linea: LineaChat;
  tema: TemaChat;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = whatsapp[tema];
  const saliente = mensaje.de === "cliente";
  const desde = linea.aparece[indice];
  const p = spring({ frame: frame - desde, fps, config: resorte.agil });
  const crecer = spring({ frame: frame - desde, fps, config: resorte.suave, durationInFrames: Math.round(fps * 0.45) });
  const leido = frame >= linea.leido[indice];

  if (frame < desde) return null;

  return (
    <div style={{ display: "grid", gridTemplateRows: `${crecer}fr` }}>
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: saliente ? "flex-end" : "flex-start",
            paddingTop: inicioGrupo ? 9 : 3,
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "80%",
              background: saliente ? col.saliente : col.entrante,
              color: col.texto,
              borderRadius: 9,
              borderTopRightRadius: saliente && inicioGrupo ? 0 : 9,
              borderTopLeftRadius: !saliente && inicioGrupo ? 0 : 9,
              padding: mensaje.imagen ? 4 : "6px 8px 7px 9px",
              boxShadow: sombra.burbuja,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
              transformOrigin: saliente ? "100% 100%" : "0% 100%",
            }}
          >
            {inicioGrupo && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  [saliente ? "right" : "left"]: -7,
                  width: 8,
                  height: 13,
                  background: saliente ? col.saliente : col.entrante,
                  clipPath: saliente ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%)",
                }}
              />
            )}
            {mensaje.imagen && (
              <Img
                src={mensaje.imagen}
                style={{
                  display: "block",
                  width: 248,
                  height: 186,
                  objectFit: "cover",
                  borderRadius: 7,
                }}
              />
            )}
            <div
              style={{
                fontSize: 15.5,
                lineHeight: 1.34,
                padding: mensaje.imagen ? "6px 5px 3px 5px" : 0,
                wordBreak: "break-word",
              }}
            >
              {mensaje.texto}
              {/* Espacio reservado para la hora: el texto nunca pasa por debajo. */}
              <span style={{ display: "inline-block", width: saliente ? 70 : 50 }} />
              <span
                style={{
                  position: "absolute",
                  right: mensaje.imagen ? 9 : 8,
                  bottom: mensaje.imagen ? 6 : 4,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 11.5,
                  color: col.meta,
                }}
              >
                {hora(indice)}
                {saliente && <Palomitas color={leido ? col.leido : col.meta} />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Los tres puntos de "escribiendo...". Visible solo dentro de su tramo; se
 *  pliega rapido al llegar la respuesta, que ocupa su lugar. */
function Escribiendo({ linea, tema }: { linea: LineaChat; tema: TemaChat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = whatsapp[tema];
  const tramo = linea.escribiendo.find((e) => frame >= e.desde && frame < e.hasta + 4);
  if (!tramo) return null;
  const entra = spring({ frame: frame - tramo.desde, fps, config: resorte.agil });
  const sale = interpolate(frame, [tramo.hasta, tramo.hasta + 4], [1, 0], { ...sujetar, easing: curva.entrada });
  const alto = Math.min(entra, sale);

  return (
    <div style={{ display: "grid", gridTemplateRows: `${alto}fr` }}>
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <div style={{ paddingTop: 9, display: "flex" }}>
          <div
            style={{
              background: col.entrante,
              borderRadius: 9,
              borderTopLeftRadius: 0,
              padding: "11px 13px",
              display: "flex",
              gap: 4,
              boxShadow: sombra.burbuja,
              opacity: alto,
            }}
          >
            {[0, 1, 2].map((i) => {
              const fase = (frame - tramo.desde) / (fps * 0.16) - i * 0.9;
              const y = Math.max(0, Math.sin(fase)) * -3.5;
              return (
                <span
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: col.meta,
                    opacity: 0.55 + Math.max(0, Math.sin(fase)) * 0.45,
                    transform: `translateY(${y}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Compositor({ chat, linea, tema }: { chat: ChatDemo; linea: LineaChat; tema: TemaChat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = whatsapp[tema];
  const tramo = linea.tecleo.find((t) => frame >= t.desde && frame < t.hasta + 2);
  const texto = tramo ? chat.mensajes[tramo.indice].texto : "";
  // Tecleo humano: no constante. La velocidad oscila un poco (sin) y el
  // avance sigue una curva suave -- nunca una rampa lineal.
  const avance = tramo
    ? interpolate(frame, [tramo.desde, tramo.hasta], [0, 1], { ...sujetar, easing: curva.entradaSalida })
    : 0;
  const titubeo = tramo ? Math.sin((frame - tramo.desde) / 3.1) * 0.02 : 0;
  const visibles = Math.round(Math.min(1, Math.max(0, avance + titubeo)) * texto.length);
  const escrito = texto.slice(0, visibles);
  const cursor = tramo ? Math.floor((frame - tramo.desde) / (fps * 0.45)) % 2 === 0 : false;
  const enviar = Boolean(tramo);

  return (
    <div
      style={{
        height: ALTO_COMPOSITOR,
        background: col.compositor,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 8px 0 10px",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={col.barraTenue} strokeWidth="1.7" aria-hidden="true">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
      <div
        style={{
          flex: 1,
          minHeight: 38,
          background: col.campo,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          fontSize: 15.5,
          color: escrito ? col.campoTexto : col.barraTenue,
          whiteSpace: "nowrap",
          overflow: "hidden",
          justifyContent: "flex-start",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "clip", direction: "rtl", textAlign: "left", flex: 1 }}>
          <bdi>
            {escrito || "Mensaje"}
            {tramo && (
              <span style={{ display: "inline-block", width: 2, height: 18, marginLeft: 1, verticalAlign: "middle", background: col.verde, opacity: cursor ? 1 : 0 }} />
            )}
          </bdi>
        </span>
      </div>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: col.verde,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {enviar ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={marca.blanco} aria-hidden="true">
            <path d="M3.4 20.4l17.4-7.5c.8-.4.8-1.5 0-1.8L3.4 3.6c-.7-.3-1.4.3-1.3 1l.9 5.4 9 2-9 2-.9 5.4c-.1.7.6 1.3 1.3 1z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill={marca.blanco} aria-hidden="true">
            <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 1 0-7 0v6A3.5 3.5 0 0 0 12 15zm6-3.5a.9.9 0 1 0-1.8 0 4.2 4.2 0 0 1-8.4 0 .9.9 0 1 0-1.8 0 6 6 0 0 0 5.1 5.9V20H9a.9.9 0 1 0 0 1.8h6a.9.9 0 1 0 0-1.8h-2.1v-2.6a6 6 0 0 0 5.1-5.9z" />
          </svg>
        )}
      </div>
    </div>
  );
}

function AvisoCrm({ chat, linea }: { chat: ChatDemo; linea: LineaChat }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!chat.aviso || linea.aviso === null || frame < linea.aviso) return null;
  const p = spring({ frame: frame - linea.aviso, fps, config: resorte.rebote });
  const sale = interpolate(frame, [linea.salida, linea.total - 2], [0, 1], { ...sujetar, easing: curva.entrada });
  // Respira mientras esta en pantalla (mas de 2 segundos quieto).
  const respira = Math.sin((frame - linea.aviso) / 22) * 1.5;

  return (
    <div
      style={{
        position: "absolute",
        top: ALTO_ESTADO + 6,
        left: 10,
        right: 10,
        borderRadius: 20,
        padding: "12px 14px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        background: marca.avisoFondo,
        border: `1px solid ${marca.avisoBorde}`,
        boxShadow: marca.avisoSombra,
        color: marca.blanco,
        opacity: Math.min(p, 1 - sale),
        transform: `translateY(${interpolate(p, [0, 1], [-90, 0]) - sale * 60 + respira}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: marca.degradadoIA,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: marca.avisoIconoSombra,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={marca.blanco} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, letterSpacing: "0.08em", color: marca.avisoTenue, fontWeight: 600 }}>
          <span>FENIAX CRM</span>
          <span style={{ letterSpacing: 0, fontWeight: 500 }}>ahora</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{chat.aviso.titulo}</div>
        <div style={{ fontSize: 13.5, color: marca.avisoSuave, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {chat.aviso.texto}
        </div>
      </div>
    </div>
  );
}

export function ChatWhatsApp({ chat, tema }: PropsChatWhatsApp) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = whatsapp[tema];
  const linea = calcularLinea(chat, fps);

  const escribiendo = linea.escribiendo.some((e) => frame >= e.desde && frame < e.hasta);
  const salida = interpolate(frame, [linea.salida, linea.total], [0, 1], { ...sujetar, easing: curva.entrada });
  const chip = spring({ frame: frame - 4, fps, config: resorte.suave });

  return (
    <AbsoluteFill style={{ background: col.fondo, fontFamily: FUENTE_SISTEMA, color: col.texto, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: garabatos(col.garabatos), backgroundSize: "132px 132px" }} />

      {/* Barra de estado + encabezado del chat */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: col.barra, zIndex: 2, boxShadow: sombra.barra }}>
        <BarraEstado color={col.barraTexto} />
        <div style={{ height: ALTO_ENCABEZADO, display: "flex", alignItems: "center", gap: 10, padding: "0 14px 0 6px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={col.verde} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <Avatar chat={chat} tamano={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: col.barraTexto, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 5 }}>
              {chat.negocio}
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <path fill={col.verde} d="M12 1.5l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-.9 2.9-3-.2L12 19.7l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7.9-2.9 3 .2z" />
                <path d="M8 10.8l2.7 2.7L16 8.2" stroke={marca.blanco} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: 12.5, color: escribiendo ? col.verde : col.barraTenue, marginTop: 1 }}>
              {escribiendo ? "escribiendo…" : chat.estado}
            </div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={col.verde} strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
            <path d="M15.5 10.5l5-3v9l-5-3z" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={col.verde} strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 8 }}>
            <path d="M6.6 3.5h2.6l1.6 4.2-2.1 1.4a11 11 0 0 0 6.2 6.2l1.4-2.1 4.2 1.6v2.6a2.1 2.1 0 0 1-2.3 2.1A16.9 16.9 0 0 1 4.5 5.8a2.1 2.1 0 0 1 2.1-2.3z" />
          </svg>
        </div>
      </div>

      {/* Mensajes: crecen desde abajo y empujan a los anteriores. */}
      <div
        style={{
          position: "absolute",
          top: ALTO_ESTADO + ALTO_ENCABEZADO,
          bottom: ALTO_COMPOSITOR + ALTO_INICIO,
          left: 0,
          right: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 14px 10px 14px",
          opacity: 1 - salida,
          transform: `translateY(${-salida * 18}px)`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
          <span
            style={{
              background: col.chip,
              color: col.chipTexto,
              fontSize: 12.5,
              fontWeight: 500,
              padding: "5px 12px",
              borderRadius: 8,
              boxShadow: sombra.burbuja,
              opacity: chip,
              transform: `translateY(${interpolate(chip, [0, 1], [-8, 0])}px)`,
            }}
          >
            Hoy
          </span>
        </div>
        {chat.mensajes.map((m, i) => (
          <Burbuja
            key={i}
            mensaje={m}
            indice={i}
            inicioGrupo={i === 0 || chat.mensajes[i - 1].de !== m.de}
            linea={linea}
            tema={tema}
          />
        ))}
        <Escribiendo linea={linea} tema={tema} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: col.compositor }}>
        <Compositor chat={chat} linea={linea} tema={tema} />
        {/* Indicador de inicio del telefono */}
        <div style={{ height: ALTO_INICIO, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 134, height: 5, borderRadius: 3, background: col.barraTexto, opacity: 0.85 }} />
        </div>
      </div>

      <AvisoCrm chat={chat} linea={linea} />
    </AbsoluteFill>
  );
}
