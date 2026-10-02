/**
 * Carga en Sanity la página FENIAX / ChatBots-CRM (documento
 * "chatbotsCrmPage") con el contenido que hoy muestra la web como respaldo,
 * para que todo quede EDITABLE en el Studio:
 *
 *  - Las 7 secciones (Portada, ¿Qué es FENIAX?, Bloque editorial, Método,
 *    Clientes + demo de WhatsApp, Reseñas, Cierre) con los textos de
 *    src/lib/feniax-respaldo.ts.
 *  - (La portada ya no lleva un telefono con WhatsApp: lleva un motion de
 *    CRM hecho con HyperFrames, que no se carga desde el Studio.)
 *  - En Clientes: los MISMOS giros de Marketing Digital (nombre, ícono, foto
 *    y empresas: las Cuentas se enlazan, no se duplican) y, en cada giro, su
 *    demo de WhatsApp ya escrita (src/lib/chat-demo.ts). Desde el Studio se
 *    pueden sumar empresas, logos y fotos a cada giro, o cambiar los mensajes.
 *  - Las fotos de las demos (public/feniax/demo/*.jpg) se suben como imágenes
 *    de Sanity, para poder reemplazarlas desde el Studio.
 *
 * SEGURO POR DEFECTO:
 *  - Sin --aplicar solo muestra lo que haría (no escribe ni sube nada).
 *  - Antes de escribir guarda una copia del documento actual en
 *    audit/backup-chatbots-crm-<fecha>.json.
 *  - Si el documento ya tiene alguna sección ACTIVA con título, no lo toca
 *    salvo con --forzar (hoy tiene 5 secciones vacías y apagadas).
 *
 * Para --aplicar hace falta SANITY_WRITE_TOKEN (permiso Editor) en
 * .env.local; la simulación no lo necesita. Después de
 * correrlo, redeploy del Studio para ver los tipos nuevos (chatClientsBanner,
 * chatDemo).
 *
 * Uso: npx tsx --env-file=.env.local scripts/sembrar-feniax.mts [--aplicar] [--forzar]
 */
import { createClient, type SanityClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COPY_FENIAX } from "../src/lib/feniax-respaldo";
import { plantillaParaGiro, type ChatDemo } from "../src/lib/chat-demo";
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

// ---------------------------------------------------------------- fotos
const subidas = new Map<string, string>();

/** "/feniax/demo/x.jpg" -> referencia a un asset de Sanity (sube una sola vez). */
async function imagenDe(ruta: string | null, cliente: SanityClient) {
  if (!ruta) return undefined;
  if (!aplicar) return { _type: "image", asset: { _type: "reference", _ref: `(se subira ${ruta})` } };
  let id = subidas.get(ruta);
  if (!id) {
    const archivo = path.join(raiz, "public", ruta);
    const asset = await cliente.assets.upload("image", fs.createReadStream(archivo), {
      filename: path.basename(archivo),
    });
    id = asset._id;
    subidas.set(ruta, id);
    console.log(`  foto subida: ${ruta} -> ${id}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: id } };
}

async function chatSanity(chat: ChatDemo) {
  return {
    _type: "chatDemo",
    negocio: chat.negocio,
    estado: chat.estado,
    mensajes: await Promise.all(
      chat.mensajes.map(async (m) => ({
        _key: clave(),
        _type: "mensajeChat",
        de: m.de,
        texto: m.texto,
        ...(m.imagen ? { imagen: await imagenDe(m.imagen, client) } : {}),
      }))
    ),
    ...(chat.aviso ? { aviso: { titulo: chat.aviso.titulo, texto: chat.aviso.texto } } : {}),
  };
}

// ---------------------------------------------------------------- datos
const existente = await client.getDocument("chatbotsCrmPage");
const girosMarketing =
  (await client.fetch<Giro[] | null>(
    `*[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias`
  )) ?? [];

const seccionesActivas = ((existente?.sections as Array<Record<string, unknown>>) ?? []).filter(
  (s) => s.activo !== false && typeof s.titulo === "string" && s.titulo.trim()
);

console.log(`Documento "chatbotsCrmPage": ${existente ? `existe (${(existente.sections as unknown[] | undefined)?.length ?? 0} secciones, ${seccionesActivas.length} activas con título)` : "no existe"}`);
console.log(`Giros de Marketing Digital a copiar: ${girosMarketing.map((g) => g.nombre).join(", ") || "(ninguno)"}`);

if (seccionesActivas.length > 0 && !forzar) {
  console.log("\nNo se toca: ya tiene secciones activas cargadas a mano. Usa --forzar para reemplazarlo igual.");
  process.exit(0);
}

const c = COPY_FENIAX;
const cta = (x: { texto: string; enlace: string }) => ({ _type: "ctaSimple", texto: x.texto, enlace: x.enlace });

const giros = [];
for (const g of girosMarketing) {
  const chat = plantillaParaGiro(g.nombre ?? "", (g.icono as IconoCategoria) ?? null);
  giros.push({
    _key: clave(),
    _type: "categoriaIcono",
    nombre: g.nombre,
    ...(g.icono ? { icono: g.icono } : {}),
    ...(g.imagen ? { imagen: g.imagen } : {}),
    // Las Cuentas quedan como referencia (mismo logo en todo el sitio); las
    // empresas con logo propio se copian tal cual (mismo archivo de logo).
    empresas: (g.empresas ?? []).map((e) => ({ ...e, _key: clave() })),
    chat: await chatSanity(chat),
  });
  console.log(`  giro "${g.nombre}": ${g.empresas?.length ?? 0} empresas · demo "${chat.negocio}"`);
}

const doc = {
  _id: "chatbotsCrmPage",
  _type: "chatbotsCrmPage",
  titulo: "ChatBots / CRM",
  sections: [
    { _type: "teamBanner", ...c.portada, cta: cta(c.portada.cta), alineacion: "izquierda", overlay: "medio" },
    { _type: "aboutBanner", ...c.queEs },
    { _type: "navigationBanner", ...c.editorial },
    {
      _type: "methodBanner",
      titulo: c.metodo.titulo,
      descripcion: c.metodo.descripcion,
      destacado: c.metodo.destacado,
      cta: cta(c.metodo.cta),
      mostrarPasos: true,
      pasos: c.metodo.pasos.map((p) => ({ _key: clave(), _type: "pasoMetodo", ...p })),
    },
    {
      _type: "chatClientsBanner",
      titulo: c.clientes.titulo,
      descripcion: c.clientes.descripcion,
      categorias: giros,
      rotacionAutomatica: true,
      temaChat: "claro",
    },
    { _type: "reviewsBanner", ...c.resenas },
    { _type: "ctaBanner", ...c.cierre, cta: cta(c.cierre.cta), alineacion: "centro", overlay: "medio" },
  ].map((s) => ({ _key: clave(), activo: true, animar: true, ...s })),
};

console.log(`\nSecciones: ${doc.sections.map((s) => s._type).join(", ")}`);

if (!aplicar) {
  console.log("\nDry run: no se escribió ni se subió nada. Vuelve a correrlo con --aplicar.");
  process.exit(0);
}

if (existente) {
  const fecha = new Date().toISOString().slice(0, 10);
  const destino = path.join(raiz, "audit", `backup-chatbots-crm-${fecha}.json`);
  fs.writeFileSync(destino, JSON.stringify(existente, null, 2));
  console.log(`Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

const res = await client.createOrReplace(doc);
console.log("Listo. rev:", res._rev);
