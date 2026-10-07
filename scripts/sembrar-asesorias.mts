/**
 * Carga en Sanity la página Asesorías 1 a 1 · Rescatando Emprendedores
 * (documento "asesoriasPage") con el contenido que hoy muestra la web como
 * respaldo, para que todo quede EDITABLE en el Studio:
 *
 *  - Las 5 secciones, en orden: Portada (título, logo, frase, botón y la foto
 *    grupal), ¿Qué es Rescatando Emprendedores?, Clientes y casos de éxito
 *    (el mazo de casos), Logros (las tarjetas con foto que reemplazan a las
 *    reseñas, pedido del 2026-10-07) y Cierre, con los textos de
 *    src/lib/asesorias-respaldo.ts.
 *  - Sube el logo, la foto de la portada, las imágenes de los casos y las
 *    fotos de los logros (public/asesorias/), cada una con su texto
 *    alternativo.
 *  - Clientes no lleva giros propios: usa los de Marketing Digital (las mismas
 *    empresas y logos, sin cargarlos dos veces).
 *
 * LOS CASOS Y LOS LOGROS SON DE EJEMPLO (firman «Ejemplo — reemplázalo»):
 * quedan cargados para reemplazarlos en el Studio por los reales. Ahí se
 * agregan, borran y reordenan las tarjetas, y se cambia la foto y el mensaje
 * de cada una.
 *
 * SEGURO POR DEFECTO:
 *  - Sin --aplicar solo muestra lo que haría (no sube ni escribe nada).
 *  - Antes de escribir guarda una copia del documento actual en
 *    audit/backup-asesoriasPage-<fecha>.json.
 *  - Si el documento ya tiene alguna sección ACTIVA con título, no lo toca
 *    salvo con --forzar (hoy es el esqueleto: 5 secciones vacías y apagadas).
 *
 * Para --aplicar hace falta SANITY_WRITE_TOKEN (permiso Editor) en
 * .env.local, o una sesión de la CLI de Sanity (`sanity exec
 * --with-user-token`); la simulación no necesita ninguno. Después de
 * correrlo, redeploy del Studio para ver los tipos nuevos (splitHeroBanner,
 * casesClientsBanner, achievementsBanner).
 *
 * Uso: npx tsx --env-file=.env.local scripts/sembrar-asesorias.mts [--aplicar] [--forzar]
 */
import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COPY_ASESORIAS, IMAGENES_ASESORIAS } from "../src/lib/asesorias-respaldo";

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

/** Igual que claveGiro() de src/lib/asesorias.ts: sin mayúsculas, tildes ni
 *  espacios de más («CONSTRUCCIÓN» y «Construccion» son el mismo giro). */
const claveGiro = (nombre: string) =>
  nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

// ---------------------------------------------------------------- datos
const existente = await client.getDocument("asesoriasPage");
const girosMarketing =
  (await client.fetch<Array<string | null> | null>(
    `*[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias[].nombre`
  )) ?? [];

const seccionesActivas = ((existente?.sections as Array<Record<string, unknown>>) ?? []).filter(
  (s) => s.activo !== false && typeof s.titulo === "string" && s.titulo.trim()
);

console.log(
  `Documento "asesoriasPage": ${
    existente
      ? `existe (${(existente.sections as unknown[] | undefined)?.length ?? 0} secciones, ${seccionesActivas.length} activas con título)`
      : "no existe"
  }`
);

if (seccionesActivas.length > 0 && !forzar) {
  console.log("\nNo se toca: ya tiene secciones activas cargadas a mano. Usa --forzar para reemplazarlo igual.");
  process.exit(0);
}

// ---------------------------------------------------------------- imágenes
type Archivo = { archivo: string; alt: string };
const subidas = new Map<string, string>();

/** Archivo de public/asesorias/ -> imagen de Sanity con su alt. Cada archivo
 *  se sube una sola vez; sin --aplicar no se sube nada. */
async function imagenDe(img: Archivo) {
  const ruta = path.join(raiz, "public", "asesorias", img.archivo);
  if (!fs.existsSync(ruta)) throw new Error(`No existe ${path.relative(raiz, ruta)}`);
  let id = subidas.get(img.archivo);
  if (!id) {
    if (aplicar) {
      const asset = await client.assets.upload("image", fs.createReadStream(ruta), { filename: img.archivo });
      id = asset._id;
      console.log(`  imagen subida: ${img.archivo} -> ${id}`);
    } else {
      id = `(se subirá ${img.archivo})`;
    }
    subidas.set(img.archivo, id);
  }
  return { _type: "image", asset: { _type: "reference", _ref: id }, alt: img.alt };
}

// ---------------------------------------------------------------- secciones
const c = COPY_ASESORIAS;
const img = IMAGENES_ASESORIAS;
const cta = (x: { texto: string; enlace: string }) => ({ _type: "ctaSimple", texto: x.texto, enlace: x.enlace });

// En serie, no en paralelo: así un mismo archivo nunca se sube dos veces.
const casos = [];
for (const caso of c.clientes.casos) {
  if (caso.giro && !girosMarketing.some((g) => g && claveGiro(g) === claveGiro(caso.giro))) {
    console.log(`  AVISO: el caso «${caso.titulo}» abre el giro «${caso.giro}», que no está en Marketing Digital. Elige otro en el Studio.`);
  }
  casos.push({
    _key: clave(),
    _type: "casoExito",
    titulo: caso.titulo,
    texto: caso.texto,
    giro: caso.giro,
    cliente: caso.cliente,
    imagen: await imagenDe(img.casos[caso.imagen]),
  });
}

const logros = [];
for (const l of c.logros.items) {
  logros.push({
    _key: clave(),
    _type: "logro",
    titulo: l.titulo,
    texto: l.texto,
    etiqueta: l.etiqueta,
    nombre: l.nombre,
    firma: l.firma,
    foto: await imagenDe(img.logros[l.foto]),
  });
}

const doc = {
  _id: "asesoriasPage",
  _type: "asesoriasPage",
  titulo: "Asesorías",
  sections: [
    {
      _type: "splitHeroBanner",
      titulo: c.portada.titulo,
      descripcion: c.portada.descripcion,
      cta: cta(c.portada.cta),
      imagen: await imagenDe(img.portada),
      logo: await imagenDe(img.logo),
    },
    { _type: "aboutBanner", ...c.queEs },
    {
      _type: "casesClientsBanner",
      titulo: c.clientes.titulo,
      casos,
      pasoAutomatico: c.clientes.pasoAutomatico,
      segundosPorCaso: c.clientes.segundosPorCaso,
    },
    {
      _type: "achievementsBanner",
      subtitulo: c.logros.subtitulo,
      titulo: c.logros.titulo,
      logros,
      pasoAutomatico: c.logros.pasoAutomatico,
      segundosPorLogro: c.logros.segundosPorLogro,
    },
    {
      _type: "ctaBanner",
      titulo: c.cierre.titulo,
      descripcion: c.cierre.descripcion,
      cta: cta(c.cierre.cta),
      alineacion: "centro",
      overlay: "medio",
    },
  ].map((s) => ({ _key: clave(), activo: true, animar: true, ...s })),
};

console.log(`\nSecciones: ${doc.sections.map((s) => s._type).join(", ")}`);
console.log(`Casos: ${casos.length} · Logros: ${logros.length} · Imágenes: ${subidas.size}`);
console.log(`Giros de Marketing Digital (Clientes los usa): ${girosMarketing.filter(Boolean).join(", ") || "(ninguno)"}`);

if (!aplicar) {
  console.log("\nDry run: no se subió ni se escribió nada. Vuelve a correrlo con --aplicar.");
  process.exit(0);
}

if (existente) {
  const fecha = new Date().toISOString().slice(0, 10);
  const destino = path.join(raiz, "audit", `backup-asesoriasPage-${fecha}.json`);
  fs.writeFileSync(destino, JSON.stringify(existente, null, 2));
  console.log(`Copia del documento anterior: ${path.relative(raiz, destino)}`);
}

const res = await client.createOrReplace(doc);
console.log("Listo. rev:", res._rev);
