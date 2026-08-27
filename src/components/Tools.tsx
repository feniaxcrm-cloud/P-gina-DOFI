import { existsSync } from "node:fs";
import path from "node:path";
import {
  siMeta,
  siTiktok,
  siFacebook,
  siInstagram,
} from "simple-icons";
import { Reveal } from "./Reveal";

/**
 * Stack de herramientas.
 *
 * LOGOS
 * -----
 * Meta, TikTok, Facebook e Instagram usan su marca oficial desde el paquete
 * simple-icons. Se resuelven en el servidor, asi que el paquete nunca llega
 * al bundle del cliente: al HTML solo baja el path del SVG.
 *
 * Kommo y CapCut no estan en simple-icons y sus logos NO se dibujan a mano:
 * saldrian mal. Mientras tanto se muestran como wordmark tipografico.
 *
 * PARA PONER EL LOGO OFICIAL de cualquiera de las dos (o reemplazar alguna
 * de las otras): deja el archivo en public/marcas/<slug>.svg y listo. La
 * comprobacion ocurre al construir, no hace falta tocar codigo.
 */

type Tool = {
  slug: string;
  name: string;
  /** Rol de una linea. Categoria de la herramienta. */
  role: string;
  body: string;
  /** Path del SVG oficial, si simple-icons lo tiene */
  iconPath?: string;
  /** Color de marca. Se usa solo en hover. */
  color: string;
  /** Colocacion en la reticula de 6 columnas */
  cell: string;
  /** La celda alta (Kommo) es destacada: tipografia y aire mayores. */
  feature?: boolean;
};

const tools: Tool[] = [
  {
    slug: "kommo",
    name: "Kommo",
    role: "CRM",
    body: "El CRM donde vive cada conversación. Embudos, campos y automatizaciones montados por FENIAX para que ningún lead se enfríe.",
    color: "#3FBF7F",
    cell: "md:col-span-3 md:row-span-2",
    feature: true,
  },
  {
    slug: "meta",
    name: "Meta Ads",
    role: "Pauta",
    body: "Campañas en Facebook e Instagram con seguimiento hasta el cierre.",
    iconPath: siMeta.path,
    color: `#${siMeta.hex}`,
    cell: "md:col-span-3",
  },
  {
    slug: "capcut",
    name: "CapCut",
    role: "Edición",
    body: "Edición y adaptación por formato, al ritmo que piden las redes.",
    color: "#00E0E0",
    cell: "md:col-span-3",
  },
  {
    slug: "tiktok",
    name: "TikTok",
    role: "Social",
    body: "Producción de contenido nativo de alto impacto y pauta estratégica para capturar al público más joven.",
    iconPath: siTiktok.path,
    // El hex oficial es negro. Antes se sustituia por un cian porque la
    // tarjeta era oscura y el negro desaparecia; con la tarjeta migrada a
    // lienzo claro en este sprint el negro real vuelve a funcionar y ya no
    // hace falta el sustituto.
    color: `#${siTiktok.hex}`,
    cell: "md:col-span-2",
  },
  {
    slug: "instagram",
    name: "Instagram",
    role: "Social",
    body: "Estructuración visual de Reels, historias interactivas y catálogos optimizados para conectar y convertir.",
    iconPath: siInstagram.path,
    color: `#${siInstagram.hex}`,
    cell: "md:col-span-2",
  },
  {
    slug: "facebook",
    name: "Facebook",
    role: "Social",
    body: "Campañas de alto alcance local y construcción de comunidades sólidas que fidelizan con tu marca.",
    iconPath: siFacebook.path,
    color: `#${siFacebook.hex}`,
    cell: "md:col-span-2",
  },
];

/**
 * Comprobacion en tiempo de build: existe un logo propio en public/marcas?
 * Acepta SVG (ideal) o PNG. El SVG gana si estan los dos.
 */
function logoPropio(slug: string) {
  for (const ext of ["svg", "png"]) {
    const rel = `/marcas/${slug}.${ext}`;
    if (existsSync(path.join(process.cwd(), "public", "marcas", `${slug}.${ext}`))) {
      return rel;
    }
  }
  return null;
}

export function Tools() {
  return (
    <section id="herramientas" className="relative bg-canvas py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal className="max-w-[36rem]">
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tighter text-ink md:text-6xl">
            Con qué trabajamos
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink-muted">
            Las herramientas no son el trabajo, pero sí definen qué tan rápido
            se ejecuta y qué tan bien se mide.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
          {tools.map((tool, i) => (
            <Reveal key={tool.slug} delay={i * 0.06} className={tool.cell}>
              <ToolCell tool={tool} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCell({ tool }: { tool: Tool }) {
  const propio = logoPropio(tool.slug);
  const markSize = tool.feature ? "h-12 w-12" : "h-9 w-9";
  // La marca grafica arriba solo tiene sentido cuando es distinta del nombre.
  // Si la herramienta se representa con wordmark, dibujarla arriba Y como h3
  // abajo seria imprimir el nombre dos veces, asi que la fila superior queda
  // solo con la etiqueta de rol.
  const hasGraphic = Boolean(propio || tool.iconPath);

  return (
    <article
      style={{ "--brand": tool.color } as React.CSSProperties}
      className="tool-cell group flex h-full min-h-[13rem] flex-col justify-between gap-10 rounded-[20px] border border-brand/15 bg-canvas-raised p-7 shadow-[0_1px_2px_rgba(26,15,61,0.06)] transition-colors duration-500 hover:border-[color:var(--brand)]/60"
    >
      <div
        className={`flex items-center ${hasGraphic ? "justify-between" : "justify-end"}`}
      >
        {propio ? (
          // Los PNG propios (kommo.png, capcut.png) son marca blanca solida
          // sobre transparente -- se subieron pensados para la tarjeta
          // oscura anterior. Sobre el lienzo claro nuevo serian
          // practicamente invisibles (verificado: blanco sobre --color-
          // canvas-raised). Un chip oscuro propio los mantiene legibles sin
          // tocar el archivo (spec §24: adaptar, no reemplazar el asset).
          <span className="inline-flex items-center justify-center rounded-[14px] bg-ink px-3 py-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={propio}
              alt={tool.name}
              className={`${markSize} w-auto max-w-[8rem] object-contain`}
            />
          </span>
        ) : tool.iconPath ? (
          <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label={tool.name}
            className={`tool-mark ${markSize} transition-colors duration-500`}
          >
            <path d={tool.iconPath} fill="currentColor" />
          </svg>
        ) : null}
        <span className="rounded-full border border-brand/20 px-3 py-1 font-sans text-[11px] uppercase tracking-wider text-ink-subtle">
          {tool.role}
        </span>
      </div>

      <div>
        <h3
          className={`tool-mark font-display font-extrabold tracking-tight transition-colors duration-500 ${
            tool.feature ? "text-4xl" : "text-2xl"
          } ${hasGraphic ? "!text-ink" : ""}`}
        >
          {tool.name}
        </h3>
        <p
          className={`mt-3 font-sans leading-relaxed text-ink-muted ${
            tool.feature ? "max-w-[38ch] text-base" : "text-sm"
          }`}
        >
          {tool.body}
        </p>
      </div>
    </article>
  );
}
