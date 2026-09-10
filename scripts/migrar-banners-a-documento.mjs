/**
 * Migracion de un solo uso: mueve los 4 banners de
 * paginaInicio.seccionesContenido al documento propio `banners`
 * (studio/schemaTypes/banners.ts).
 *
 * POR QUE
 * ---------------------------------------------------------------
 * El menu del Studio tenia una entrada "Banners" que abria paginaInicio
 * esperando caer en su pestaña "Banners". No funcionaba: el structure
 * builder de Sanity no permite elegir con que pestaña se abre un documento,
 * asi que caia siempre en "Hero". Con documento propio, esa entrada abre un
 * formulario que solo tiene banners.
 *
 * COMO
 * ---------------------------------------------------------------
 * 1. Sin flags: dry run. Muestra que haria y no escribe nada.
 * 2. --aplicar : crea/actualiza el documento `banners` con una COPIA del
 *    arreglo. No borra nada de paginaInicio todavia -- si algo sale mal, el
 *    original sigue ahi.
 * 3. --limpiar : recien despues de verificar que la web se ve bien, borra
 *    el campo viejo de paginaInicio.
 *
 * Cada item conserva su _key, que es lo que mantiene el orden 01/02/03/04 y
 * la identidad de cada banner.
 *
 * Uso: node --env-file=.env.local scripts/migrar-banners-a-documento.mjs [--aplicar|--limpiar]
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const ID_BANNERS = "banners";
const aplicar = process.argv.includes("--aplicar");
const limpiar = process.argv.includes("--limpiar");

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const pagina = await client.getDocument("paginaInicio");
const origen = pagina?.seccionesContenido ?? [];
const destinoActual = await client.getDocument(ID_BANNERS);

// ---------- Limpieza (paso 3, despues de verificar) ----------
if (limpiar) {
  const enDestino = destinoActual?.seccionesContenido ?? [];
  if (enDestino.length === 0) {
    console.error(
      `El documento "${ID_BANNERS}" no tiene banners. No se limpia el origen: seria borrar el unico ejemplar.`
    );
    process.exit(1);
  }
  console.log(`El documento "${ID_BANNERS}" tiene ${enDestino.length} banners.`);
  console.log("Quitando el campo viejo paginaInicio.seccionesContenido...");
  const r = await client.patch("paginaInicio").unset(["seccionesContenido"]).commit();
  console.log("Listo. rev:", r._rev);
  process.exit(0);
}

// ---------- Copia (pasos 1 y 2) ----------
if (origen.length === 0) {
  if ((destinoActual?.seccionesContenido ?? []).length > 0) {
    console.log(
      `paginaInicio ya no tiene banners y "${ID_BANNERS}" tiene ${destinoActual.seccionesContenido.length}: la migracion ya se hizo.`
    );
    process.exit(0);
  }
  console.error("paginaInicio.seccionesContenido esta vacio: no hay nada que migrar.");
  process.exit(1);
}

console.log(`${origen.length} banners a copiar de paginaInicio -> ${ID_BANNERS}:\n`);
origen.forEach((b, i) => {
  const d = b.ctaPosicionDesktop ?? {};
  console.log(`  [${i + 1}] _key=${b._key}`);
  console.log(`      alt    : ${b.backgroundImageAlt ?? "(sin alt)"}`);
  console.log(`      imagen : ${b.backgroundImage?.asset?._ref ?? "(sin imagen)"}`);
  console.log(`      boton  : "${b.ctaTexto ?? ""}" -> ${b.ctaEnlace ?? ""}  [${b.ctaColor ?? "naranja"}]`);
  console.log(`      pos PC : ${d.horizontal ?? "?"}/${d.vertical ?? "?"} (${d.desplazamientoX ?? 0}, ${d.desplazamientoY ?? 0})\n`);
});

if (!aplicar) {
  console.log("Dry run. Volve a correrlo con --aplicar para escribir en Sanity.");
  console.log("Despues, y solo despues de verificar la web, corre --limpiar.");
  process.exit(0);
}

// Respaldo en disco antes de tocar nada: barato y evita depender del
// historial de Sanity si hubiera que reconstruir a mano.
const respaldo = `audit/backup-banners-antes-de-documento-propio.json`;
fs.writeFileSync(respaldo, JSON.stringify(origen, null, 2), "utf8");
console.log(`Respaldo escrito en ${respaldo}`);

const res = await client.createOrReplace({
  _id: ID_BANNERS,
  _type: "banners",
  titulo: "Banners",
  seccionesContenido: origen,
});
console.log("Documento creado/actualizado. rev:", res._rev);
console.log("\nAhora verifica la web. Si se ve bien, corre --limpiar para quitar el campo viejo.");
