import { siN8n, siRailway } from "simple-icons";

/**
 * Las herramientas con las que trabaja DOFI, flotando en el fondo del hero de
 * ChatBots/CRM (pedido del 2026-10-16): GoHighLevel, Kommo, Bitrix24, n8n y
 * Railway.
 *
 * DECORATIVOS: van en la capa del fondo, detrás del texto y del video, con
 * poca intensidad (opacidad baja), sin enlaces ni foco (aria-hidden). Flotan
 * muy despacio (herramienta-flotar, globals.css), cada uno a su ritmo; con
 * movimiento reducido quedan quietos.
 *
 * DÓNDE: en escritorio, repartidos por los bordes y el hueco entre las dos
 * columnas, nunca encima del título, el texto o el botón. En teléfono y
 * tablet el contenido va apilado y ocupa el ancho: quedan solo dos, arriba a
 * la derecha, al lado del logo de FENIAX, más chicos.
 *
 * LOGOS: n8n y Railway, su marca oficial (simple-icons, se resuelve en el
 * servidor). Kommo, su archivo oficial (public/marcas/kommo.png). GoHighLevel
 * y Bitrix24 no están en simple-icons y no hay archivo oficial en el
 * proyecto: GHL va con su marca de tres flechas (la misma del banner del
 * Home) y Bitrix24 como wordmark tipográfico. Para usar el logo oficial de
 * cualquiera, basta reemplazar su pieza acá.
 */

type Icono = {
  nombre: string;
  logo: React.ReactNode;
  /** Posición, tamaño y giro por pantalla. */
  clases: string;
  giro: number;
  duracion: number;
  retraso: number;
};

function Ghl() {
  return (
    <svg viewBox="0 0 92 92" className="h-[78%] w-[78%]" aria-hidden="true">
      {[
        { x: 8, c: "#F9B72D", h: 40 },
        { x: 34, c: "#2F7BFF", h: 52 },
        { x: 60, c: "#2FB24C", h: 40 },
      ].map((f) => (
        <path key={f.x} transform={`translate(${f.x} ${58 - f.h})`} d={`M12 0 L24 14 H17 V${f.h} H7 V14 H0 Z`} fill={f.c} />
      ))}
      <text x="46" y="84" textAnchor="middle" fontFamily="var(--font-sora), sans-serif" fontWeight="800" fontSize="22" fill="#fff">
        GHL
      </text>
    </svg>
  );
}

function MarcaSimple({ path, color }: { path: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[56%] w-[56%]" aria-hidden="true">
      <path d={path} fill={color} />
    </svg>
  );
}

function Bitrix24() {
  return (
    <span className="flex items-center gap-1 font-display text-lg font-extrabold leading-none text-white">
      Bitrix
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#2FC6F6] text-sm text-[#2FC6F6]">24</span>
    </span>
  );
}

const ICONOS: Icono[] = [
  {
    nombre: "GoHighLevel",
    logo: <Ghl />,
    clases:
      "flex right-[6%] top-[calc(var(--alto-nav)+1.5rem)] h-11 w-11 lg:left-[44%] lg:right-auto lg:top-[14%] lg:h-[76px] lg:w-[76px]",
    giro: -6,
    duracion: 12,
    retraso: 0,
  },
  {
    nombre: "n8n",
    logo: <MarcaSimple path={siN8n.path} color={`#${siN8n.hex}`} />,
    clases: "flex right-[24%] top-[calc(var(--alto-nav)+3.25rem)] h-9 w-9 lg:right-[4%] lg:top-[10%] lg:h-[60px] lg:w-[60px]",
    giro: 8,
    duracion: 10,
    retraso: -3,
  },
  {
    nombre: "Kommo",
    // eslint-disable-next-line @next/next/no-img-element
    logo: <img src="/marcas/kommo.png" alt="" className="h-[50%] w-auto" />,
    clases: "hidden lg:flex lg:bottom-[16%] lg:left-[2.5%] lg:h-[58px] lg:w-[58px]",
    giro: -4,
    duracion: 13,
    retraso: -6,
  },
  {
    nombre: "Railway",
    logo: <MarcaSimple path={siRailway.path} color="#FFFFFF" />,
    clases: "hidden lg:flex lg:bottom-[9%] lg:right-[3%] lg:h-[54px] lg:w-[54px]",
    giro: 6,
    duracion: 11,
    retraso: -8,
  },
  {
    nombre: "Bitrix24",
    logo: <Bitrix24 />,
    clases: "hidden lg:flex lg:bottom-[7%] lg:left-[44%] lg:h-[58px] lg:w-[110px]",
    giro: -3,
    duracion: 14,
    retraso: -2,
  },
];

export function IconosHerramientas() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {ICONOS.map((i) => (
        <span
          key={i.nombre}
          data-herramienta={i.nombre}
          className={`absolute items-center justify-center rounded-[24%] border border-white/12 bg-white/[0.05] opacity-[0.3] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)] animate-[herramienta-flotar_var(--duracion)_ease-in-out_var(--retraso)_infinite] motion-reduce:animate-none lg:opacity-[0.26] ${i.clases}`}
          style={
            {
              "--giro": `${i.giro}deg`,
              "--duracion": `${i.duracion}s`,
              "--retraso": `${i.retraso}s`,
              transform: `rotate(${i.giro}deg)`,
            } as React.CSSProperties
          }
        >
          {i.logo}
        </span>
      ))}
    </div>
  );
}
