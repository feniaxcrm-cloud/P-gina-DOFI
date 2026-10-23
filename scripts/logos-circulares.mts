/**
 * Logos circulares de «Clientes y casos de éxito» (pedido del 2026-10-23).
 *
 * Para cada logo de las empresas de los giros (Marketing Digital,
 * Tráfico/Ads, ChatBots/CRM y Asesorías) genera su VERSIÓN CIRCULAR
 * (scripts/logo-circular.mts) y la guarda en Sanity, en el campo «Logo
 * circular» de la empresa (o de la Cuenta, si la empresa es una Cuenta). El
 * logo original no se toca. Un mismo archivo se procesa y se sube UNA vez
 * aunque aparezca en varias páginas.
 *
 * Solo completa lo que falta: una empresa que ya tiene logo circular (generado
 * antes o subido a mano en el Studio) se respeta. Correrlo de nuevo después de
 * agregar empresas genera solo los nuevos.
 *
 * Sin --aplicar: genera las versiones circulares en --carpeta=<dir> con una
 * hoja de contacto (original | circular) para revisarlas, y no escribe nada.
 * Con --aplicar: además las sube y las asigna (copia previa de cada documento
 * en audit/backup-<documento>-antes-de-logos-circulares-<fecha>.json). Para
 * --aplicar hace falta SANITY_WRITE_TOKEN en .env.local, o una sesión de la
 * CLI de Sanity (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/logos-circulares.mts [--carpeta=dir] [--aplicar]
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { logoCircular } from "./logo-circular.mts";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const aplicar = process.argv.includes("--aplicar");
const carpeta = process.argv.find((a) => a.startsWith("--carpeta="))?.slice("--carpeta=".length);

if (!projectId || !dataset || (aplicar && !token)) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o (para --aplicar) SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token: aplicar ? token : undefined, apiVersion: "2024-01-01", useCdn: false });
const raiz = process.cwd();
const fecha = new Date().toISOString().slice(0, 10);
const PAGINAS = ["marketingDigitalPage", "traficoAdsPage", "chatbotsCrmPage", "asesoriasPage"];

type Img = { _type?: string; asset?: { _ref?: string } } | undefined;
type Empresa = { _key: string; _type?: string; _ref?: string; nombre?: string; logo?: Img; logoCircular?: Img };
type Giro = { _key: string; empresas?: Empresa[] };
type Seccion = { _key: string; _type: string; categorias?: Giro[] };
type Cuenta = { _id: string; nombre?: string; logo?: Img; logoCircular?: Img };

/** Logos con DECORACIÓN en las esquinas (líneas, dibujos, redes de puntos)
 *  que el análisis automático toma por contenido y entonces achica el logo
 *  de más. Su marca y su nombre ya están dentro del círculo: van con recorte
 *  circular directo, como foto de perfil (revisado a ojo el 2026-10-23). */
const SOLO_RECORTE = new Set([
  "image-71b22cce2d262b8ca86363d4929cd26621028f57-1080x1080-jpg", // Gimnasio Dorian
  "image-aee3c54355488f43b72e7a94e2220ff905d8efdc-1080x1080-png", // Casona del Zam
  "image-8f4986e477b55274c0045532b8d324c887d65f4d-844x844-jpg", // Universidad Católica de Cuenca
  "image-378173d501096839d6e95f677831f6322650fa31-1080x1080-jpg", // Scan 3D
]);

const urlDe = (ref: string) => {
  const [, id, dim, ext] = ref.split("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dim}.${ext}`;
};

// Qué falta: logos (por archivo) y dónde se usan.
const docs = (await Promise.all(PAGINAS.map((id) => client.getDocument(id)))).filter(Boolean) as unknown as {
  _id: string;
  sections?: Seccion[];
}[];
const usos = new Map<string, { nombre: string; rutas: { doc: string; ruta: string }[] }>();
const cuentasRef = new Set<string>();
for (const doc of docs) {
  for (const s of doc.sections ?? []) {
    for (const g of s.categorias ?? []) {
      for (const e of g.empresas ?? []) {
        if (e._ref) {
          cuentasRef.add(e._ref);
          continue;
        }
        const ref = e.logo?.asset?._ref;
        if (!ref || e.logoCircular?.asset?._ref) continue;
        const u = usos.get(ref) ?? { nombre: e.nombre ?? "(sin nombre)", rutas: [] };
        u.rutas.push({ doc: doc._id, ruta: `sections[_key=="${s._key}"].categorias[_key=="${g._key}"].empresas[_key=="${e._key}"].logoCircular` });
        usos.set(ref, u);
      }
    }
  }
}
const cuentas = (await client.fetch<Cuenta[]>(`*[_id in $ids]{ _id, nombre, logo, logoCircular }`, { ids: [...cuentasRef] })) ?? [];
for (const c of cuentas) {
  const ref = c.logo?.asset?._ref;
  if (!ref || c.logoCircular?.asset?._ref) continue;
  const u = usos.get(ref) ?? { nombre: c.nombre ?? "(sin nombre)", rutas: [] };
  u.rutas.push({ doc: c._id, ruta: "logoCircular" });
  usos.set(ref, u);
}

const total = [...usos.values()].reduce((n, u) => n + u.rutas.length, 0);
console.log(`Logos por convertir: ${usos.size} archivos, usados en ${total} empresa(s).`);
if (usos.size === 0) process.exit(0);

// Generar.
const generados = new Map<string, Buffer>();
const casos: Record<string, number> = {};
const celdas: sharp.OverlayOptions[] = [];
const T = 150;
const COLS = 8;
if (carpeta) fs.mkdirSync(carpeta, { recursive: true });
let i = 0;
for (const [ref, u] of usos) {
  const res = await fetch(`${urlDe(ref)}?w=1000&fit=max`);
  if (!res.ok) throw new Error(`No se pudo bajar el logo de ${u.nombre} (${res.status})`);
  const original = Buffer.from(await res.arrayBuffer());
  const { salida, caso, fondo } = await logoCircular(original, { soloRecorte: SOLO_RECORTE.has(ref) });
  generados.set(ref, salida);
  casos[caso] = (casos[caso] ?? 0) + 1;
  console.log(`  ${String(i).padStart(2, "0")} ${caso.padEnd(12)} ${(fondo ?? "").padEnd(8)} ${u.nombre}`);
  if (carpeta) {
    fs.writeFileSync(path.join(carpeta, `${String(i).padStart(2, "0")}.webp`), salida);
    const col = i % COLS;
    const fila = Math.floor(i / COLS);
    const o = await sharp(original).resize(T, T, { fit: "contain", background: "#e9e5f0" }).flatten({ background: "#e9e5f0" }).png().toBuffer();
    const c = await sharp(salida).resize(T, T).png().toBuffer();
    celdas.push({ input: o, left: col * (2 * T + 36), top: fila * (T + 24) });
    celdas.push({ input: c, left: col * (2 * T + 36) + T + 8, top: fila * (T + 24) });
  }
  i++;
}
console.log("Casos:", casos);
if (carpeta) {
  const filas = Math.ceil(usos.size / COLS);
  await sharp({ create: { width: COLS * (2 * T + 36), height: filas * (T + 24), channels: 4, background: "#F4EFFB" } })
    .composite(celdas)
    .png()
    .toFile(path.join(carpeta, "hoja.png"));
  console.log(`Hoja de contacto: ${path.join(carpeta, "hoja.png")}`);
}

if (!aplicar) {
  console.log("\nDry run: no se subió ni se escribió nada. Vuelve a correrlo con --aplicar.");
  process.exit(0);
}

// Subir y asignar.
const asset = new Map<string, string>();
for (const [ref, buf] of generados) {
  const a = await client.assets.upload("image", buf, { filename: `logo-circular-${ref.split("-")[1]}.webp`, contentType: "image/webp" });
  asset.set(ref, a._id);
}
console.log(`Subidos: ${asset.size} logos circulares.`);

const porDoc = new Map<string, Record<string, unknown>>();
for (const [ref, u] of usos) {
  for (const r of u.rutas) {
    const set = porDoc.get(r.doc) ?? {};
    set[r.ruta] = { _type: "image", asset: { _type: "reference", _ref: asset.get(ref) } };
    porDoc.set(r.doc, set);
  }
}
for (const [id, set] of porDoc) {
  const doc = await client.getDocument(id);
  fs.writeFileSync(path.join(raiz, "audit", `backup-${id}-antes-de-logos-circulares-${fecha}.json`), JSON.stringify(doc, null, 2));
  const r = await client.patch(id).set(set).commit();
  console.log(`  ${id}: ${Object.keys(set).length} logo(s) circular(es). rev ${r._rev}`);
}
console.log("Listo.");
