/**
 * Prueba real del flujo Sanity -> Secciones de contenido (spec §33 del
 * sprint "Crear 4 secciones de contenido debajo del Hero"). Mismo patron
 * que scripts/test-hero-sanity.mjs: genera imagenes SINTETICAS con sharp
 * (sin ningun archivo de terceros ni foto real de un cliente) y las sube a
 * paginaInicio.seccionesContenido[], para verificar de punta a punta que
 * editar/publicar desde Sanity cambia lo que muestra el frontend.
 *
 * Uso (con las credenciales de .env.local ya cargadas, ej.
 * `node --env-file=.env.local scripts/test-content-sections-sanity.mjs <paso>`):
 *
 *   seed     -> carga las 4 secciones con contenido+imagen de prueba
 *               (title/description distinguibles del respaldo del codigo,
 *               para probar que lo que se ve viene de Sanity y no del
 *               fallback por coincidencia). CTA de la 4ta seccion es
 *               EXTERNO (https://example.com) para probar target=_blank.
 *   editar   -> cambia titulo, descripcion, imagen, texto de CTA y URL de
 *               las secciones 1 y 2 (indices 0 y 1) -- "editar y volver a
 *               publicar" repetido en mas de una seccion, spec §33.
 *   limpiar  -> saca el campo seccionesContenido del documento (unset) y
 *               borra los assets de imagen subidos por este script. La
 *               pagina vuelve a mostrar el respaldo del codigo.
 */
import { createClient } from "@sanity/client";
import sharp from "sharp";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_LOG = path.join(__dirname, ".test-content-sections-assets.json");

async function generarImagen(color1, color2, etiqueta) {
  const svg = `
    <svg width="1400" height="1050" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <rect width="1400" height="1050" fill="url(#g)"/>
      <circle cx="1050" cy="260" r="180" fill="rgba(255,255,255,0.15)"/>
      <text x="60" y="960" font-family="sans-serif" font-size="48" fill="rgba(255,255,255,0.9)" font-weight="bold">${etiqueta}</text>
    </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function subirImagen(color1, color2, etiqueta, filename) {
  const buffer = await generarImagen(color1, color2, etiqueta);
  const asset = await client.assets.upload("image", buffer, { filename, contentType: "image/png" });
  console.log(`  asset subido (${filename}):`, asset._id);
  return asset._id;
}

async function guardarAssetIds(ids) {
  const previos = await leerAssetIds();
  await writeFile(ASSETS_LOG, JSON.stringify([...previos, ...ids], null, 2));
}
async function leerAssetIds() {
  try {
    return JSON.parse(await readFile(ASSETS_LOG, "utf8"));
  } catch {
    return [];
  }
}

function seccionObj({ titulo, descripcion, assetId, hotspot, ctaTexto, ctaEnlace, imagenAlt }) {
  return {
    _type: "seccionContenido",
    titulo,
    descripcion,
    imagen: {
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      hotspot: { _type: "sanity.imageHotspot", x: hotspot.x, y: hotspot.y, height: 0.5, width: 0.5 },
    },
    imagenAlt,
    ctaTexto,
    ctaEnlace,
  };
}

const paso = process.argv[2];

if (paso === "seed") {
  console.log("Generando y subiendo 4 imagenes de prueba...");
  const a1 = await subirImagen("#4B2A93", "#6D4BC9", "SECCION 01 -- PRUEBA SANITY");
  const a2 = await subirImagen("#F47B20", "#FF9440", "SECCION 02 -- PRUEBA SANITY");
  const a3 = await subirImagen("#6D4BC9", "#F47B20", "SECCION 03 -- PRUEBA SANITY");
  const a4 = await subirImagen("#1A0F3D", "#4B2A93", "SECCION 04 -- PRUEBA SANITY");
  await guardarAssetIds([a1, a2, a3, a4]);

  const seccionesContenido = [
    seccionObj({
      titulo: "Sección 01 (prueba Sanity)",
      descripcion: "Contenido de esta sección, cargado desde Sanity para verificar el flujo end-to-end.",
      assetId: a1,
      hotspot: { x: 0.75, y: 0.3 },
      ctaTexto: "Conocer más",
      ctaEnlace: "/contactanos",
      imagenAlt: "Imagen de prueba, sección 01",
    }),
    seccionObj({
      titulo: "Sección 02 (prueba Sanity)",
      descripcion: "Segundo bloque de prueba, con imagen y CTA propios, independientes del resto.",
      assetId: a2,
      hotspot: { x: 0.3, y: 0.4 },
      ctaTexto: "Ver más",
      ctaEnlace: "/clientes",
      imagenAlt: "Imagen de prueba, sección 02",
    }),
    seccionObj({
      titulo: "Sección 03 (prueba Sanity)",
      descripcion: "Tercer bloque de prueba: confirma que la alternancia sigue el índice, no un campo manual.",
      assetId: a3,
      hotspot: { x: 0.6, y: 0.5 },
      ctaTexto: "Explorar",
      ctaEnlace: "/marketing-digital",
      imagenAlt: "Imagen de prueba, sección 03",
    }),
    seccionObj({
      titulo: "Sección 04 (prueba Sanity)",
      descripcion: "Cuarto bloque de prueba, con un CTA EXTERNO para confirmar que abre en pestaña nueva.",
      assetId: a4,
      hotspot: { x: 0.4, y: 0.35 },
      ctaTexto: "Sitio externo (prueba)",
      ctaEnlace: "https://example.com",
      imagenAlt: "Imagen de prueba, sección 04",
    }),
  ];

  const doc = await client
    .patch("paginaInicio")
    .set({ seccionesContenido })
    .commit({ autoGenerateArrayKeys: true });
  console.log("paginaInicio.seccionesContenido cargado. rev:", doc._rev);
} else if (paso === "editar") {
  console.log("Generando y subiendo 2 imagenes editadas...");
  const b1 = await subirImagen("#FF9440", "#1A0F3D", "SECCION 01 -- EDITADA");
  const b2 = await subirImagen("#6D4BC9", "#1A0F3D", "SECCION 02 -- EDITADA");
  await guardarAssetIds([b1, b2]);

  await client
    .patch("paginaInicio")
    .set({
      "seccionesContenido[0].titulo": "Sección 01 (EDITADA)",
      "seccionesContenido[0].descripcion": "Descripción editada para confirmar que el segundo publish también se refleja.",
      "seccionesContenido[0].imagen": {
        _type: "image",
        asset: { _type: "reference", _ref: b1 },
        hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: 0.6, height: 0.5, width: 0.5 },
      },
      "seccionesContenido[0].ctaTexto": "Conocer más (editado)",
      "seccionesContenido[0].ctaEnlace": "/el-socio",
      "seccionesContenido[1].titulo": "Sección 02 (EDITADA)",
      "seccionesContenido[1].descripcion": "Segunda edición, en otra sección distinta, para cumplir 'repetir con otra sección'.",
      "seccionesContenido[1].imagen": {
        _type: "image",
        asset: { _type: "reference", _ref: b2 },
        hotspot: { _type: "sanity.imageHotspot", x: 0.35, y: 0.45, height: 0.5, width: 0.5 },
      },
      "seccionesContenido[1].ctaTexto": "Ver más (editado)",
      "seccionesContenido[1].ctaEnlace": "/feniax",
    })
    .commit();
  console.log("Secciones 1 y 2 editadas y publicadas.");
} else if (paso === "limpiar") {
  await client.patch("paginaInicio").unset(["seccionesContenido"]).commit();
  console.log("Campo seccionesContenido eliminado del documento (vuelve al respaldo del código).");

  const ids = await leerAssetIds();
  console.log(`Borrando ${ids.length} assets de imagen de prueba...`);
  for (const id of ids) {
    try {
      await client.delete(id);
      console.log("  borrado:", id);
    } catch (err) {
      console.error("  no se pudo borrar", id, err.message);
    }
  }
  await writeFile(ASSETS_LOG, "[]");
} else {
  console.error("Uso: node --env-file=.env.local scripts/test-content-sections-sanity.mjs [seed|editar|limpiar]");
  process.exit(1);
}
