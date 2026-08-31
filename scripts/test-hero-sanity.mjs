/**
 * Prueba real del flujo Sanity -> Hero (spec §47 del sprint "Implementación
 * final del Hero + Sanity + Cards"). Genera 2 imagenes SINTETICAS (con
 * sharp, sin ningun archivo de terceros ni contenido real de un cliente --
 * cero riesgo de derechos de autor) y las sube una tras otra al documento
 * singleton `hero`, para verificar de punta a punta que cambiar la foto
 * desde Sanity efectivamente cambia lo que muestra el frontend.
 *
 * Uso:
 *   node scripts/test-hero-sanity.mjs paso1   -> crea el doc hero con la
 *                                                imagen de prueba 1
 *   node scripts/test-hero-sanity.mjs paso2   -> reemplaza por la imagen
 *                                                de prueba 2
 *   node scripts/test-hero-sanity.mjs limpiar -> borra el campo heroImage
 *                                                (deja el documento Hero
 *                                                existente pero vacio, listo
 *                                                para la foto real)
 */
import { createClient } from "@sanity/client";
import sharp from "sharp";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

async function generarImagenPrueba(color1, color2, etiqueta) {
  const svg = `
    <svg width="1600" height="1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#g)"/>
      <circle cx="1150" cy="350" r="220" fill="rgba(255,255,255,0.15)"/>
      <text x="80" y="920" font-family="sans-serif" font-size="64" fill="rgba(255,255,255,0.85)" font-weight="bold">${etiqueta}</text>
    </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

const paso = process.argv[2];

if (paso === "paso1" || paso === "paso2") {
  const [c1, c2, etiqueta] =
    paso === "paso1"
      ? ["#4B2A93", "#F47B20", "PRUEBA SANITY 1 -- verificacion Hero"]
      : ["#F47B20", "#1A0F3D", "PRUEBA SANITY 2 -- verificacion Hero"];

  const buffer = await generarImagenPrueba(c1, c2, etiqueta);
  console.log(`Generada imagen sintetica de prueba (${buffer.length} bytes)...`);

  const asset = await client.assets.upload("image", buffer, {
    filename: `hero-test-${paso}.png`,
    contentType: "image/png",
  });
  console.log("Asset subido:", asset._id);

  const doc = await client.createOrReplace({
    _id: "hero",
    _type: "hero",
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      hotspot: { _type: "sanity.imageHotspot", x: 0.72, y: 0.35, height: 0.4, width: 0.3 },
    },
    heroImageAlt: `Imagen de prueba (${paso}) para verificar el flujo Sanity -> Hero`,
  });
  console.log("Documento hero actualizado:", doc._id, "rev:", doc._rev);
} else if (paso === "limpiar") {
  const doc = await client.patch("hero").unset(["heroImage", "heroImageAlt"]).commit({ autoGenerateArrayKeys: true });
  console.log("Campo heroImage limpiado. Documento Hero sigue existiendo, listo para la foto real:", doc._id);
} else {
  console.error("Uso: node scripts/test-hero-sanity.mjs [paso1|paso2|limpiar]");
  process.exit(1);
}
