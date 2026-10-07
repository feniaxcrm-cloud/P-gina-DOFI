import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CheckCircle,
  Eye,
  Heart,
  InstagramLogo,
  MetaLogo,
  TiktokLogo,
  TrendUp,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { curva, resorte } from "./curvas";
import { color, ETAPAS, fuente, LIENZO, RUTAS, TARJETAS, TOTAL_CUADROS } from "./tema";

/**
 * Composicion Remotion del hero del Home: "Ventas Inteligentes", lo que hace
 * DOFI contado en 12 segundos y en bucle.
 *
 *   01 · ATRAER     un contenido en redes que se llena de me gusta y vistas
 *        ↘ (un punto de luz viaja por la ruta)
 *   02 · CONVERTIR  ese cliente escribe por WhatsApp, la IA responde y queda
 *                   registrado en el CRM
 *        ↙
 *   03 · ESCALAR    la curva de ventas sube: Ventas Inteligentes
 *
 * SIN CIFRAS INVENTADAS: los me gusta y las vistas son barras, la grafica no
 * tiene ejes con valores y el chat es un ejemplo generico. Es una
 * ilustracion de un proceso, no el resultado de un cliente.
 *
 * BUCLE SIN COSTURA: el cuadro 0 y el ultimo son el mismo estado (las tres
 * tarjetas en reposo); la flotacion de cada tarjeta es una onda que completa
 * su vuelta justo en TOTAL_CUADROS.
 *
 * Todo depende SOLO del cuadro actual: con movimiento reducido la pagina
 * muestra CUADRO_QUIETO (las tres etapas completas) sin reproducir nada.
 */

const sujetar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 -> 1 -> 0 dentro de una ventana, con rampas suaves de `rampa` cuadros. */
function ventana(frame: number, desde: number, hasta: number, rampa = 14) {
  return interpolate(frame, [desde, desde + rampa, hasta - rampa, hasta], [0, 1, 1, 0], {
    ...sujetar,
    easing: curva.entradaSalida,
  });
}

/** 1 mientras la vuelta esta en curso; baja a 0 en el reinicio. Todo lo que
 *  "se llena" durante la vuelta se multiplica por esto para volver al reposo. */
function vigente(frame: number) {
  return interpolate(frame, [ETAPAS.reinicio.desde, ETAPAS.reinicio.hasta], [1, 0], {
    ...sujetar,
    easing: curva.entradaSalida,
  });
}

/** Flotacion ambiental: una onda por vuelta exacta, cada tarjeta con su fase. */
function flotar(frame: number, fase: number, amplitud: number) {
  return Math.sin((frame / TOTAL_CUADROS) * Math.PI * 2 + fase) * amplitud;
}

type Punto = { x: number; y: number };

/** Punto de una curva cubica (las rutas son una sola curva cada una). */
function enCurva([a, b, c, d]: readonly [Punto, Punto, Punto, Punto], t: number): Punto {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}

/** Mezcla de dos colores rgb (los mismos de los tokens foam y deep). */
function mezcla(a: readonly number[], b: readonly number[], t: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
const FOAM = [244, 240, 254] as const;
const DEEP = [26, 15, 61] as const;

// ------------------------------------------------------------------ piezas

function Tarjeta({
  geo,
  activo,
  flot,
  children,
}: {
  geo: { x: number; y: number; ancho: number; alto: number; giro: number };
  activo: number;
  flot: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: geo.x,
        top: geo.y,
        width: geo.ancho,
        height: geo.alto,
        transform: `translateY(${flot - 8 * activo}px) rotate(${geo.giro * (1 - 0.35 * activo)}deg) scale(${1 + 0.03 * activo})`,
        borderRadius: 26,
        background: activo > 0.5 ? color.vidrioActivo : color.vidrio,
        border: `1.5px solid ${color.borde}`,
        boxShadow: `0 0 0 2px rgba(255, 148, 64, ${(0.7 * activo).toFixed(3)}), ${activo > 0.5 ? color.sombraActiva : color.sombra}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        color: color.texto,
        opacity: 0.8 + 0.2 * activo,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/** "01 · Atraer": se enciende en naranja cuando su etapa esta activa. */
function Etiqueta({ numero, texto, activo }: { numero: string; texto: string; activo: number }) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        borderRadius: 999,
        background: color.veloFuerte,
        fontFamily: fuente.display,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: "0.01em",
        color: mezcla(FOAM, DEEP, activo),
        overflow: "hidden",
      }}
    >
      <span style={{ position: "absolute", inset: 0, background: color.acentoSuave, opacity: activo }} />
      <span style={{ position: "relative" }}>{numero}</span>
      <span style={{ position: "relative", opacity: 0.55 }}>·</span>
      <span style={{ position: "relative" }}>{texto}</span>
    </span>
  );
}

function Icono({ children, fondo = color.velo, tam = 34 }: { children: React.ReactNode; fondo?: string; tam?: number }) {
  return (
    <span
      style={{
        display: "flex",
        width: tam,
        height: tam,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        background: fondo,
        color: color.texto,
      }}
    >
      {children}
    </span>
  );
}

function Barra({ ancho, color: c }: { ancho: number; color: string }) {
  return (
    <span style={{ position: "relative", display: "block", height: 9, flex: 1, borderRadius: 999, background: color.velo }}>
      <span
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${ancho * 100}%`, borderRadius: 999, background: c }}
      />
    </span>
  );
}

// ------------------------------------------------------------------ 01 · Atraer

const CORAZONES = [0, 13, 26, 39, 52, 66, 80];
/** Cuadros (desde el inicio de la etapa) en que la pieza recibe un "doble toque". */
const DOBLE_TOQUE = [18, 62];

function Atraer({ frame, fps }: { frame: number; fps: number }) {
  const { desde, hasta } = ETAPAS.atraer;
  const activo = ventana(frame, desde, hasta);
  const vivo = vigente(frame);
  const llenado = interpolate(frame, [desde + 6, hasta - 8], [0, 1], { ...sujetar, easing: curva.salida }) * vivo;

  return (
    <Tarjeta geo={TARJETAS.atraer} activo={activo} flot={flotar(frame, 0, 7)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Etiqueta numero="01" texto="Atraer" activo={activo} />
        <div style={{ display: "flex", gap: 6 }}>
          <Icono tam={32}>
            <TiktokLogo size={17} weight="fill" />
          </Icono>
          <Icono tam={32}>
            <InstagramLogo size={17} weight="bold" />
          </Icono>
          <Icono tam={32}>
            <MetaLogo size={18} weight="bold" />
          </Icono>
        </div>
      </div>

      {/* La pieza publicada: un video con el brillo de la marca. */}
      <div
        style={{
          position: "relative",
          marginTop: 12,
          height: 94,
          flexShrink: 0,
          borderRadius: 18,
          overflow: "hidden",
          background:
            "radial-gradient(70% 90% at 85% 100%, rgba(244,123,32,0.75) 0%, rgba(244,123,32,0) 70%), linear-gradient(140deg, #6D4BC9 0%, #4B2A93 55%, #2E1B68 100%)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 286 94" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
          <path
            d={`M0 ${70 + flotar(frame, 1, 4)} C 60 ${52 + flotar(frame, 2, 5)}, 120 ${86 + flotar(frame, 0.5, 5)}, 180 ${68 + flotar(frame, 1.5, 4)} S 260 ${56 + flotar(frame, 2.5, 4)}, 286 64`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d={`M0 ${86 + flotar(frame, 2, 4)} C 70 ${70 + flotar(frame, 1, 5)}, 130 ${100 + flotar(frame, 2.2, 4)}, 200 ${84 + flotar(frame, 0.3, 4)} S 270 ${74 + flotar(frame, 1.2, 4)}, 286 80`}
            stroke="rgba(255,194,140,0.55)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        {/* El "doble toque": un corazon grande aparece sobre la pieza cuando le
            dan me gusta y se desvanece. Sin boton de play encima: en el sitio
            nada se reproduce con un clic (pedido del 2026-10-07), y un
            triangulo en un circulo se leeria como uno. */}
        {DOBLE_TOQUE.map((d) => {
          const t0 = desde + d;
          const p = interpolate(frame, [t0, t0 + 34], [0, 1], sujetar);
          if (p <= 0 || p >= 1) return null;
          const pop = spring({ frame: frame - t0, fps, config: resorte.agil, durationInFrames: 16 });
          return (
            <span
              key={d}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                display: "flex",
                color: "#FFFFFF",
                opacity: interpolate(p, [0, 0.12, 0.6, 1], [0, 1, 1, 0]),
                transform: `translate(-50%, -50%) scale(${0.35 + 0.75 * pop})`,
                filter: "drop-shadow(0 6px 16px rgba(26,15,61,0.5))",
              }}
            >
              <Heart size={46} weight="fill" />
            </span>
          );
        })}
      </div>

      {/* Me gusta y vistas: barras que se llenan (sin numeros). */}
      <div style={{ position: "relative", marginTop: "auto", display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Heart size={20} weight="fill" color="#FF9440" />
          <Barra ancho={0.18 + 0.72 * llenado} color="linear-gradient(90deg, #FF9440, #EE9070)" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Eye size={20} weight="bold" color="#B3A5D4" />
          <Barra ancho={0.12 + 0.68 * llenado} color="linear-gradient(90deg, #6D4BC9, #B3A5D4)" />
        </div>
      </div>

      {/* Corazones que suben desde el me gusta mientras la etapa esta activa. */}
      {CORAZONES.map((d, i) => {
        const t0 = desde + 10 + d;
        const p = interpolate(frame, [t0, t0 + 42], [0, 1], sujetar);
        if (p <= 0 || p >= 1) return null;
        const pop = spring({ frame: frame - t0, fps, config: resorte.agil, durationInFrames: 14 });
        const x = 22 + (i % 3) * 18 + Math.sin(p * Math.PI * 2 + i) * 10;
        const y = 168 - p * 120;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: interpolate(p, [0, 0.15, 0.7, 1], [0, 1, 1, 0]),
              transform: `scale(${0.6 + 0.5 * pop})`,
              color: i % 2 ? "#FF9440" : "#EE9070",
              filter: "drop-shadow(0 4px 10px rgba(244,123,32,0.45))",
            }}
          >
            <Heart size={22 + (i % 2) * 6} weight="fill" />
          </span>
        );
      })}
    </Tarjeta>
  );
}

// ------------------------------------------------------------------ 02 · Convertir

function Burbuja({
  lado,
  aparece,
  children,
}: {
  lado: "cliente" | "ia";
  aparece: number;
  children: React.ReactNode;
}) {
  const cliente = lado === "cliente";
  return (
    <div
      style={{
        alignSelf: cliente ? "flex-start" : "flex-end",
        maxWidth: "88%",
        padding: "9px 14px",
        borderRadius: 18,
        borderBottomLeftRadius: cliente ? 6 : 18,
        borderBottomRightRadius: cliente ? 18 : 6,
        background: cliente ? color.burbujaCliente : color.burbujaIA,
        color: cliente ? "#1A0F3D" : "#FFFFFF",
        fontSize: 18,
        lineHeight: 1.3,
        opacity: aparece,
        transform: `translateY(${(1 - aparece) * 10}px) scale(${0.85 + 0.15 * aparece})`,
        transformOrigin: cliente ? "left bottom" : "right bottom",
        boxShadow: "0 10px 22px -14px rgba(8,4,20,0.8)",
      }}
    >
      {children}
    </div>
  );
}

function Convertir({ frame, fps }: { frame: number; fps: number }) {
  const { desde, hasta } = ETAPAS.convertir;
  const activo = ventana(frame, desde, hasta);
  const vivo = vigente(frame);

  const b1 = spring({ frame: frame - (desde + 12), fps, config: resorte.agil, durationInFrames: 16 }) * vivo;
  const escribiendo = ventana(frame, desde + 32, desde + 58, 6) * vivo;
  const b2 = spring({ frame: frame - (desde + 58), fps, config: resorte.agil, durationInFrames: 16 }) * vivo;
  const crm = spring({ frame: frame - (desde + 80), fps, config: resorte.suave, durationInFrames: 22 }) * vivo;

  return (
    <Tarjeta geo={TARJETAS.convertir} activo={activo} flot={flotar(frame, 2.1, 6)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Etiqueta numero="02" texto="Convertir" activo={activo} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #FF9440, #EE9070)",
              color: "#1A0F3D",
              fontFamily: fuente.display,
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            IA
          </span>
          <Icono tam={32} fondo={color.whatsapp}>
            <WhatsappLogo size={19} weight="fill" />
          </Icono>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
        <Burbuja lado="cliente" aparece={b1}>
          Hola, ¿tienen disponible?
        </Burbuja>
        {escribiendo > 0.01 && b2 < 0.05 ? (
          <div
            style={{
              alignSelf: "flex-end",
              display: "flex",
              gap: 5,
              padding: "12px 14px",
              borderRadius: 18,
              borderBottomRightRadius: 6,
              background: color.burbujaIA,
              opacity: escribiendo,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "#FFFFFF",
                  opacity: 0.45 + 0.55 * Math.max(0, Math.sin(((frame - i * 4) / fps) * Math.PI * 3)),
                }}
              />
            ))}
          </div>
        ) : (
          <Burbuja lado="ia" aparece={b2}>
            ¡Sí! Ya te cuento todo
          </Burbuja>
        )}
      </div>

      {/* Y queda registrado: cliente nuevo en el CRM. */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "9px 12px",
          borderRadius: 14,
          background: "rgba(29, 168, 81, 0.16)",
          border: "1px solid rgba(29, 168, 81, 0.45)",
          opacity: crm,
          transform: `translateY(${(1 - crm) * 18}px)`,
          fontFamily: fuente.display,
          fontWeight: 700,
          fontSize: 16.5,
          whiteSpace: "nowrap",
        }}
      >
        <CheckCircle size={21} weight="fill" color="#4ADE80" />
        Cliente nuevo en el CRM
      </div>
    </Tarjeta>
  );
}

// ------------------------------------------------------------------ 03 · Escalar

/** La curva de ventas (sin ejes con valores). */
const CURVA_VENTAS = "M 6 96 C 46 94, 62 78, 98 74 S 150 70, 176 52 S 236 34, 300 10";
const AREA_VENTAS = `${CURVA_VENTAS} L 300 112 L 6 112 Z`;

function Escalar({ frame, fps }: { frame: number; fps: number }) {
  const { desde, hasta } = ETAPAS.escalar;
  const activo = ventana(frame, desde, hasta);
  const vivo = vigente(frame);
  const trazo = interpolate(frame, [desde + 8, desde + 58], [0, 1], { ...sujetar, easing: curva.salida }) * vivo;
  const sello = spring({ frame: frame - (desde + 54), fps, config: resorte.agil, durationInFrames: 18 }) * vivo;

  return (
    <Tarjeta geo={TARJETAS.escalar} activo={activo} flot={flotar(frame, 4.2, 6)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Etiqueta numero="03" texto="Escalar" activo={activo} />
        <Icono tam={32}>
          <TrendUp size={19} weight="bold" />
        </Icono>
      </div>

      <svg width="100%" height={104} viewBox="0 0 306 116" preserveAspectRatio="none" style={{ marginTop: 10, flexShrink: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="hero-trazo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6D4BC9" />
            <stop offset="0.6" stopColor="#FF9440" />
            <stop offset="1" stopColor="#F47B20" />
          </linearGradient>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(244,123,32,0.35)" />
            <stop offset="1" stopColor="rgba(244,123,32,0)" />
          </linearGradient>
        </defs>
        {[28, 62, 96].map((y) => (
          <line key={y} x1="6" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 7" />
        ))}
        <path d={AREA_VENTAS} fill="url(#hero-area)" opacity={trazo} />
        <path
          d={CURVA_VENTAS}
          pathLength={1}
          stroke="url(#hero-trazo)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${trazo} 1`}
        />
        <circle cx="300" cy="10" r={7 * sello} fill="#FF9440" />
        <circle cx="300" cy="10" r={14 * sello} fill="rgba(255,148,64,0.25)" />
      </svg>

      <div
        style={{
          marginTop: "auto",
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 999,
          background: "linear-gradient(135deg, #FF9440 0%, #F47B20 100%)",
          color: "#1A0F3D",
          fontFamily: fuente.display,
          fontWeight: 800,
          fontSize: 18,
          opacity: sello,
          transform: `scale(${0.7 + 0.3 * sello})`,
          transformOrigin: "left center",
          boxShadow: "0 14px 30px -14px rgba(244,123,32,0.9)",
        }}
      >
        <TrendUp size={18} weight="bold" />
        Ventas Inteligentes
      </div>
    </Tarjeta>
  );
}

// ------------------------------------------------------------------ rutas

function Ruta({ d, puntos, desde, hasta, frame }: { d: string; puntos: readonly [Punto, Punto, Punto, Punto]; desde: number; hasta: number; frame: number }) {
  const t = interpolate(frame, [desde, hasta], [0, 1], { ...sujetar, easing: curva.entradaSalida });
  const vivo = vigente(frame);
  const p = enCurva(puntos, t);
  const visible = t > 0 && t < 1 ? Math.min(1, Math.sin(Math.PI * t) * 3) : 0;
  return (
    <>
      <path d={d} stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 11" fill="none" />
      <path d={d} pathLength={1} stroke="#FF9440" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray={`${t} 1`} opacity={vivo} />
      <circle cx={p.x} cy={p.y} r="16" fill="rgba(255,148,64,0.22)" opacity={visible} />
      <circle cx={p.x} cy={p.y} r="7.5" fill="#FFFFFF" stroke="#FF9440" strokeWidth="3" opacity={visible} />
    </>
  );
}

export const VentasInteligentes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: fuente.texto }}>
      <svg width={LIENZO.ancho} height={LIENZO.alto} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <Ruta d={RUTAS.ab.d} puntos={RUTAS.ab.puntos} desde={ETAPAS.viajeAB.desde} hasta={ETAPAS.viajeAB.hasta} frame={frame} />
        <Ruta d={RUTAS.bc.d} puntos={RUTAS.bc.puntos} desde={ETAPAS.viajeBC.desde} hasta={ETAPAS.viajeBC.hasta} frame={frame} />
      </svg>
      <Atraer frame={frame} fps={fps} />
      <Convertir frame={frame} fps={fps} />
      <Escalar frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
