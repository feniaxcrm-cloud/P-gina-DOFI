/**
 * Migracion de un solo uso: pasa el documento "marketingDigitalPage" de
 * campos fijos (equipo, queEs, navegamos, metodo, clientes, resenas,
 * ctaFinal) a la lista tipada `sections[]` que pide el brief
 * ("PROMPT MAESTRO", 2026-09-14).
 *
 * TRES PASOS, SEPARADOS A PROPOSITO
 * ---------------------------------------------------------------
 * 1. Sin flags   -> dry run: muestra que haria y no escribe nada.
 * 2. --aplicar   -> escribe `sections` como COPIA. Los campos viejos quedan:
 *                   la web en vivo (codigo anterior) los sigue leyendo, asi
 *                   que no se rompe mientras el codigo nuevo no se despliega.
 * 3. --limpiar   -> SOLO despues de que el codigo nuevo este en produccion y
 *                   verificado: quita los campos viejos. Se niega si
 *                   `sections` esta vacio.
 *
 * (En la migracion de los banners se limpio antes de desplegar y la home se
 * quedo unos minutos sin banners. Este orden existe por eso.)
 *
 * Se conservan todos los valores existentes (imagenes, alt, botones,
 * alineacion, overlay, pasos con sus _key). Se aplican los textos NUEVOS que
 * pide el brief: titulo y descripcion del Equipo, y el destino del Metodo.
 *
 * Uso: node --env-file=.env.local scripts/migrar-marketing-a-secciones.mjs [--aplicar|--limpiar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const ID = "marketingDigitalPage";
const CAMPOS_VIEJOS = ["equipo", "queEs", "navegamos", "metodo", "clientes", "resenas", "ctaFinal"];
const aplicar = process.argv.includes("--aplicar");
const limpiar = process.argv.includes("--limpiar");
const clave = () => crypto.randomBytes(6).toString("hex");

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });
const doc = await client.getDocument(ID);

if (!doc) {
  console.error(`No existe el documento "${ID}".`);
  process.exit(1);
}

// ---------- Paso 3: limpieza ----------
if (limpiar) {
  if (!Array.isArray(doc.sections) || doc.sections.length === 0) {
    console.error("`sections` esta vacio: no se limpia (seria borrar el unico ejemplar del contenido).");
    process.exit(1);
  }
  const presentes = CAMPOS_VIEJOS.filter((c) => doc[c] !== undefined);
  if (presentes.length === 0) {
    console.log("No quedan campos viejos: ya estaba limpio.");
    process.exit(0);
  }
  console.log(`sections tiene ${doc.sections.length} secciones. Quitando: ${presentes.join(", ")}`);
  const r = await client.patch(ID).unset(presentes).commit();
  console.log("Listo. rev:", r._rev);
  process.exit(0);
}

// ---------- Pasos 1 y 2: copia ----------
if (Array.isArray(doc.sections) && doc.sections.length > 0) {
  console.log(`El documento ya tiene ${doc.sections.length} secciones: la migracion ya se hizo.`);
  process.exit(0);
}

/** Quita claves vacias: Sanity guarda `null` tal cual y el Studio lo
 *  mostraria como un valor cargado. */
function sinVacios(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
}

/** Une texto y texto adicional en una sola descripcion de dos parrafos. */
const unir = (...partes) =>
  partes
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .join("\n\n");

/** Una imagen que venia dentro de un arreglo trae _key; en un campo simple
 *  sobra. */
function imagenSuelta(img) {
  if (!img) return undefined;
  const { _key, ...resto } = img;
  return resto;
}

const e = doc.equipo ?? {};
const q = doc.queEs ?? {};
const n = doc.navegamos ?? {};
const m = doc.metodo ?? {};
const cl = doc.clientes ?? {};
const r = doc.resenas ?? {};
const f = doc.ctaFinal ?? {};

const sections = [
  {
    _key: clave(),
    _type: "teamBanner",
    activo: true,
    imagen: e.imagen,
    imagenMovil: e.imagenMovil,
    subtitulo: e.etiqueta || "Cuenca - Ecuador",
    // Textos nuevos del brief.
    titulo: "¿Necesitas un equipo de marketing completo?",
    descripcion: "Todo lo que necesitas para hacer crecer tu negocio, en un solo equipo.",
    destacado: e.destacado || "Un Mar de Ideas",
    cta: e.cta,
    alineacion: e.alineacion || "izquierda",
    overlay: e.overlay || "medio",
    animar: e.animar ?? true,
  },
  {
    _key: clave(),
    _type: "aboutBanner",
    activo: true,
    imagen: q.imagen,
    imagenMovil: q.imagenMovil,
    titulo: q.titulo,
    descripcion: unir(q.texto, q.textoAdicional),
    destacado: q.destacado,
    cta: q.cta,
    animar: q.animar ?? true,
  },
  {
    _key: clave(),
    _type: "navigationBanner",
    activo: true,
    imagen: n.imagen,
    imagenMovil: n.imagenMovil,
    titulo: n.titulo,
    descripcion: unir(n.texto, n.textoAdicional),
    destacado: n.destacado,
    cta: n.cta,
    animar: n.animar ?? true,
  },
  {
    _key: clave(),
    _type: "methodBanner",
    activo: true,
    imagen: imagenSuelta(m.imagenes?.[0]),
    titulo: m.titulo,
    descripcion: m.introduccion,
    pasos: m.pasos,
    mostrarPasos: m.mostrarPasos ?? true,
    // Destino del recorrido, con la mayuscula que pide el brief.
    destacado: "Ventas Inteligentes Garantizadas",
    cta: m.cta,
    animar: m.animar ?? true,
  },
  {
    _key: clave(),
    _type: "clientsBanner",
    activo: true,
    titulo: cl.titulo,
    descripcion: cl.descripcion,
    // Hoy se ven como "Giros de negocio" (con empresas y foto opcionales).
    categorias: cl.categorias,
    cta: cl.cta,
    animar: cl.animar ?? true,
  },
  {
    _key: clave(),
    _type: "reviewsBanner",
    activo: true,
    titulo: r.titulo,
    descripcion: r.descripcion,
    enlaceGoogle: r.enlaceGoogle,
    animar: r.animar ?? true,
  },
  {
    _key: clave(),
    _type: "ctaBanner",
    activo: true,
    imagen: f.imagen,
    imagenMovil: f.imagenMovil,
    subtitulo: f.etiqueta,
    titulo: f.titulo,
    descripcion: f.descripcion,
    destacado: f.destacado,
    cta: f.cta,
    alineacion: f.alineacion || "centro",
    overlay: f.overlay || "medio",
    animar: f.animar ?? true,
  },
].map(sinVacios);

console.log(`${sections.length} secciones a escribir en "${ID}".sections:\n`);
for (const s of sections) {
  const img = s.imagen?.asset?._ref ? "con imagen" : "sin imagen";
  const extra =
    s._type === "methodBanner" ? ` · ${s.pasos?.length ?? 0} pasos · destino "${s.destacado}"` :
    s._type === "clientsBanner" ? ` · ${s.categorias?.length ?? 0} rubros` : "";
  console.log(`  ${s._type.padEnd(17)} "${s.titulo}"  (${img}${s.cta ? ` · boton "${s.cta.texto}" -> ${s.cta.enlace}` : ""}${extra})`);
}

if (!aplicar) {
  console.log("\nDry run. Vuelve a correrlo con --aplicar para escribir la copia en Sanity.");
  process.exit(0);
}

const respaldo = "audit/backup-marketing-antes-de-secciones.json";
fs.writeFileSync(respaldo, JSON.stringify(Object.fromEntries(CAMPOS_VIEJOS.map((c) => [c, doc[c]])), null, 2), "utf8");
console.log(`\nRespaldo de los campos viejos en ${respaldo}`);

const res = await client.patch(ID).set({ sections }).commit();
console.log("Copia escrita (los campos viejos siguen ahi). rev:", res._rev);
console.log("Despues de desplegar y verificar el codigo nuevo, corre --limpiar.");
