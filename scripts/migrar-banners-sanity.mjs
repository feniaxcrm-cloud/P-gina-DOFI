/**
 * Migracion de un solo uso: pasa los 4 items de
 * paginaInicio.seccionesContenido del schema viejo (dos columnas con texto
 * y boton) al nuevo (un banner = una sola imagen).
 *
 *   imagen      -> backgroundImage   (conserva asset, crop y hotspot)
 *   imagenAlt   -> backgroundImageAlt
 *   se eliminan: titulo, descripcion, imagenSecundaria, imagenSecundariaAlt,
 *                ctaTexto, ctaEnlace
 *
 * Por que reescribe el arreglo entero en vez de hacer unset campo por
 * campo: asi queda UNA sola escritura atomica y cada item conserva su
 * _key (o sea, no se rompen las referencias ni el orden 01/02/03/04).
 *
 * El contenido anterior quedo respaldado ANTES de correr esto en
 * audit/backup-secciones-contenido-2026-09-08.json -- si hay que volver
 * atras, ese archivo tiene titulos, descripciones y URLs de los CTA.
 *
 * Uso: node --env-file=.env.local scripts/migrar-banners-sanity.mjs [--aplicar]
 * Sin --aplicar solo muestra que haria (dry run).
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const aplicar = process.argv.includes("--aplicar");
const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const doc = await client.getDocument("paginaInicio");
const actuales = doc?.seccionesContenido ?? [];

if (actuales.length === 0) {
  console.error("paginaInicio.seccionesContenido esta vacio: no hay nada que migrar.");
  process.exit(1);
}

const migrados = actuales.map((item) => ({
  _type: "seccionContenido",
  _key: item._key,
  ...(item.backgroundImage ?? item.imagen
    ? { backgroundImage: item.backgroundImage ?? item.imagen }
    : {}),
  // El titulo va PRIMERO a proposito: es el mensaje que la pieza grafica
  // comunica, o sea exactamente lo que tiene que leer un lector de
  // pantalla. Los imagenAlt cargados eran textos de prueba ("Texto de
  // prueba 3"), asi que servirian de poco. De paso, el copy que se escribio
  // para los titulos no se pierde: sobrevive como texto alternativo.
  backgroundImageAlt: item.backgroundImageAlt ?? item.titulo ?? item.imagenAlt ?? "",
}));

console.log(`${actuales.length} banners a migrar:\n`);
for (let i = 0; i < actuales.length; i++) {
  const antes = actuales[i];
  const despues = migrados[i];
  console.log(`  [${i + 1}] _key=${antes._key}`);
  console.log(`      se elimina : titulo="${antes.titulo ?? ""}", cta="${antes.ctaTexto ?? ""}" -> ${antes.ctaEnlace ?? ""}`);
  console.log(`      backgroundImage    : ${despues.backgroundImage?.asset?._ref ?? "(sin imagen)"}`);
  console.log(`      backgroundImageAlt : "${despues.backgroundImageAlt}"`);
}

if (!aplicar) {
  console.log("\nDry run. Volve a correrlo con --aplicar para escribir en Sanity.");
  process.exit(0);
}

const res = await client.patch("paginaInicio").set({ seccionesContenido: migrados }).commit();
console.log("\nMigrado. rev:", res._rev);
