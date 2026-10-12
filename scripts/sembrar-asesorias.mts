/**
 * Carga en Sanity la página Asesorías 1 a 1 · Rescatando Emprendedores
 * (documento "asesoriasPage") con el contenido que hoy muestra la web como
 * respaldo, para que todo quede EDITABLE en el Studio:
 *
 *  - Las 5 secciones, en orden: Portada (título, logo, frase, botón y la foto
 *    grupal), ¿Qué es Rescatando Emprendedores?, Clientes y casos de éxito,
 *    Logros (las tarjetas con foto que reemplazan a las reseñas, pedido del
 *    2026-10-07) y Cierre, con los textos de src/lib/asesorias-respaldo.ts.
 *  - CLIENTES Y CIERRE SON LOS DE MARKETING DIGITAL, TAL CUAL (pedido del
 *    2026-10-08): Clientes lleva el mismo título, la misma portada y el MISMO
 *    VIDEO (el archivo ya subido, no se vuelve a subir) y usa los giros de
 *    Marketing Digital (las mismas empresas y logos); el Cierre lleva las dos
 *    imágenes que acompañan al de Marketing (el hombre y el delfín: el mismo
 *    archivo). Todo se puede reemplazar en el Studio, en esta página.
 *  - Sube el logo, la foto de la portada y las fotos de los logros
 *    (public/asesorias/), cada una con su texto alternativo.
 *
 * LOS LOGROS SON DE EJEMPLO (firman «Ejemplo — reemplázalo»): quedan cargados
 * para reemplazarlos en el Studio por los reales. Ahí se agregan, borran y
 * reordenan las tarjetas, y se cambia la foto y el mensaje de cada una.
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
 * achievementsBanner).
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

// ---------------------------------------------------------------- datos
const existente = await client.getDocument("asesoriasPage");
const girosMarketing =
  (await client.fetch<Array<string | null> | null>(
    `*[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0].categorias[].nombre`
  )) ?? [];
// Lo de Marketing Digital que Asesorías replica (referencias a los mismos archivos).
const clientesMarketing = await client.fetch<Record<string, unknown> | null>(
  `*[_type == "marketingDigitalPage"][0].sections[_type == "clientsBanner"][0]{ subtitulo, titulo, descripcion, rotacionAutomatica, imagen, video, ajusteVideo, sonidoVideo }`
);
const cierreMarketing = await client.fetch<{ imagen?: Record<string, unknown> } | null>(
  `*[_type == "marketingDigitalPage"][0].sections[_type == "ctaBanner"][0]{ imagen }`
);

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
      // El mismo Clientes de Marketing Digital: título, portada y video.
      _type: "clientsBanner",
      subtitulo: (clientesMarketing?.subtitulo as string | undefined) ?? undefined,
      titulo: (clientesMarketing?.titulo as string | undefined) || c.clientes.titulo,
      descripcion: (clientesMarketing?.descripcion as string | undefined) ?? undefined,
      rotacionAutomatica: (clientesMarketing?.rotacionAutomatica as boolean | undefined) ?? true,
      ...(clientesMarketing?.imagen ? { imagen: clientesMarketing.imagen } : {}),
      ...(clientesMarketing?.video ? { video: clientesMarketing.video } : {}),
      ...(clientesMarketing?.ajusteVideo ? { ajusteVideo: clientesMarketing.ajusteVideo } : {}),
      ...(typeof clientesMarketing?.sonidoVideo === "boolean" ? { sonidoVideo: clientesMarketing.sonidoVideo } : {}),
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
      // Las dos imágenes que acompañan el cierre de Marketing (el mismo archivo).
      ...(cierreMarketing?.imagen ? { imagen: cierreMarketing.imagen } : {}),
    },
  ].map((s) => ({ _key: clave(), activo: true, animar: true, ...s })),
};

console.log(`\nSecciones: ${doc.sections.map((s) => s._type).join(", ")}`);
console.log(`Logros: ${logros.length} · Imágenes subidas: ${subidas.size}`);
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
