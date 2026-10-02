/**
 * Carga en Sanity la página Tráfico / Ads (documento "traficoAdsPage") con el
 * contenido que hoy muestra la web como respaldo, para que todo quede
 * EDITABLE en el Studio:
 *
 *  - Las 9 secciones, en orden: Portada, Nuestro sistema, El mapa, Método
 *    (los 7 frentes), ¿Dónde traficamos? (Meta, TikTok, Google, web),
 *    Ecosistema, Clientes + métricas de Meta Ads, Reseñas y Cierre, con los
 *    textos de src/lib/trafico-respaldo.ts (resumidos del documento del
 *    equipo: poco texto y enfocado en vender).
 *  - En Clientes: los MISMOS giros de Marketing Digital (nombre, ícono, foto
 *    y empresas: las Cuentas se enlazan, no se duplican) y, en cada giro, su
 *    panel de Meta Ads de ejemplo ya cargado (src/lib/metricas-demo.ts). Desde
 *    el Studio se pueden sumar empresas, logos y fotos a cada giro, o cambiar
 *    las cifras de la campaña.
 *
 * SEGURO POR DEFECTO:
 *  - Sin --aplicar solo muestra lo que haría (no escribe nada).
 *  - Antes de escribir guarda una copia del documento actual en
 *    audit/backup-traficoAdsPage-<fecha>.json.
 *  - Si el documento ya tiene alguna sección ACTIVA con título, no lo toca
 *    salvo con --forzar (hoy tiene 5 secciones vacías y apagadas).
 *
 * Para --aplicar hace falta SANITY_WRITE_TOKEN (permiso Editor) en
 * .env.local, o una sesión de la CLI de Sanity (`sanity exec
 * --with-user-token`); la simulación no necesita ninguno. Después de
 * correrlo, redeploy del Studio para ver los tipos nuevos (platformsBanner,
 * ecosystemBanner, metricsClientsBanner, metricasDemo).
 *
 * Uso: npx tsx --env-file=.env.local scripts/sembrar-trafico.mts [--aplicar] [--forzar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COPY_TRAFICO } from "../src/lib/trafico-respaldo";
import { metricasParaGiro } from "../src/lib/metricas-demo";
import type { IconoCategoria } from "../src/lib/marketing-digital";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

const aplicar = process.argv.includes("--aplicar");

// El token solo hace falta para escribir: la simulación lee el dataset
// público, así se puede revisar qué haría sin tener credenciales de edición.
if (!projectId || !dataset || (aplicar && !token)) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o (para --aplicar) SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}
const forzar = process.argv.includes("--forzar");
const clave = () => crypto.randomBytes(6).toString("hex");
const raiz = process.cwd();

const client = createClient({ projectId, dataset, token: aplicar ? token : undefined, apiVersion: "2024-01-01", useCdn: false });

type Giro = {
  _key?: string;
  nombre?: string;
  icono?: string;
  imagen?: unknown;
  empresas?: Array<Record<string, unknown>>;
};

// ---------------------------------------------------------------- datos
const existente = await client.getDocument("traficoAdsPage");
const girosMarketing =
  (await client.fetch<Giro[] | null>(
    `*[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias`
  )) ?? [];

const seccionesActivas = ((existente?.sections as Array<Record<string, unknown>>) ?? []).filter(
  (s) => s.activo !== false && typeof s.titulo === "string" && s.titulo.trim()
);

console.log(
  `Documento "traficoAdsPage": ${
    existente
      ? `existe (${(existente.sections as unknown[] | undefined)?.length ?? 0} secciones, ${seccionesActivas.length} activas con título)`
      : "no existe"
  }`
);
console.log(`Giros de Marketing Digital a copiar: ${girosMarketing.map((g) => g.nombre).join(", ") || "(ninguno)"}`);

if (seccionesActivas.length > 0 && !forzar) {
  console.log("\nNo se toca: ya tiene secciones activas cargadas a mano. Usa --forzar para reemplazarlo igual.");
  process.exit(0);
}

const c = COPY_TRAFICO;
const cta = (x: { texto: string; enlace: string }) => ({ _type: "ctaSimple", texto: x.texto, enlace: x.enlace });

const giros = girosMarketing.map((g) => {
  const m = metricasParaGiro(g.nombre ?? "", (g.icono as IconoCategoria) ?? null);
  console.log(`  giro "${g.nombre}": ${g.empresas?.length ?? 0} empresas · campaña "${m.campana}" (${m.objetivo})`);
  return {
    _key: clave(),
    _type: "categoriaIcono",
    nombre: g.nombre,
    ...(g.icono ? { icono: g.icono } : {}),
    ...(g.imagen ? { imagen: g.imagen } : {}),
    // Las Cuentas quedan como referencia (mismo logo en todo el sitio); las
    // empresas con logo propio se copian tal cual (mismo archivo de logo).
    empresas: (g.empresas ?? []).map((e) => ({ ...e, _key: clave() })),
    metricas: {
      _type: "metricasDemo",
      ...m,
      hitos: m.hitos.map((h) => ({ _key: clave(), _type: "hito", dia: h.dia, texto: h.texto })),
    },
  };
});

const doc = {
  _id: "traficoAdsPage",
  _type: "traficoAdsPage",
  titulo: "Tráfico / Ads",
  sections: [
    { _type: "teamBanner", ...c.portada, cta: cta(c.portada.cta), alineacion: "izquierda", overlay: "medio" },
    { _type: "aboutBanner", ...c.sistema },
    { _type: "navigationBanner", ...c.mapa },
    {
      _type: "methodBanner",
      subtitulo: c.metodo.subtitulo,
      titulo: c.metodo.titulo,
      descripcion: c.metodo.descripcion,
      destacado: c.metodo.destacado,
      mostrarPasos: true,
      pasos: c.metodo.pasos.map((titulo) => ({ _key: clave(), _type: "pasoMetodo", titulo, descripcion: "" })),
    },
    {
      _type: "platformsBanner",
      subtitulo: c.plataformas.subtitulo,
      titulo: c.plataformas.titulo,
      descripcion: c.plataformas.descripcion,
      plataformas: c.plataformas.items.map((p) => ({ _key: clave(), _type: "plataforma", ...p })),
    },
    { _type: "ecosystemBanner", ...c.ecosistema },
    {
      _type: "metricsClientsBanner",
      titulo: c.clientes.titulo,
      descripcion: c.clientes.descripcion,
      categorias: giros,
      rotacionAutomatica: true,
    },
    { _type: "reviewsBanner", ...c.resenas },
    { _type: "ctaBanner", ...c.cierre, cta: cta(c.cierre.cta), alineacion: "centro", overlay: "medio" },
  ].map((s) => ({ _key: clave(), activo: true, animar: true, ...s })),
};

console.log(`\nSecciones: ${doc.sections.map((s) => s._type).join(", ")}`);

if (!aplicar) {
  console.log("\nDry run: no se escribió nada. Vuelve a correrlo con --aplicar.");
  process.exit(0);
}

if (existente) {
  const fecha = new Date().toISOString().slice(0, 10);
  const destino = path.join(raiz, "audit", `backup-traficoAdsPage-${fecha}.json`);
  fs.writeFileSync(destino, JSON.stringify(existente, null, 2));
  console.log(`Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

const res = await client.createOrReplace(doc);
console.log("Listo. rev:", res._rev);
