/**
 * Prepara el retrato de Daniel Vallejo para la seccion El Socio.
 *
 * Dos pasos sobre el grafico cuadrado original (1080x1080):
 *
 * 1. QUITAR EL DELFIN de la derecha. Esta sobre cielo estrellado, asi que se
 *    clona un parche de cielo limpio de justo encima (misma columna, sin
 *    delfin ni persona) y se compone encima con bordes difuminados. Al ser
 *    un campo de estrellas aleatorio, el parche calza sin costura visible.
 *
 * 2. RECORTAR a la persona: franja sin los textos de la izquierda, centrada
 *    en la persona, proporcion 5:7 vertical.
 *
 * Uso: node scripts/crop-socio.mjs "entrada.jpg"
 */
import sharp from "sharp";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  console.error('Uso: node scripts/crop-socio.mjs "entrada.jpg"');
  process.exit(1);
}

const salida = path.join(process.cwd(), "public", "media", "socio-retrato.jpg");
const meta = await sharp(input).metadata();
console.log(`origen: ${meta.width}x${meta.height}`);

// --- Paso 1: tapar el delfin ---
// Caja del delfin (con margen para su contorno blanco).
const DOLPHIN = { left: 892, top: 316, width: 188, height: 150 };
// Parche fuente: misma columna, desplazado hacia arriba a cielo limpio.
const PATCH = { left: DOLPHIN.left, top: 150, width: DOLPHIN.width, height: DOLPHIN.height };

const parche = await sharp(input).extract(PATCH).toBuffer();

// Mascara con bordes difuminados (izquierda, arriba y abajo). El borde
// derecho toca el filo de la imagen, no necesita degradado.
const feather = 22;
const mascara = Buffer.from(
  `<svg width="${DOLPHIN.width}" height="${DOLPHIN.height}">
     <defs>
       <linearGradient id="l" x1="0" x2="1" y1="0" y2="0">
         <stop offset="0" stop-color="#000"/>
         <stop offset="${feather / DOLPHIN.width}" stop-color="#fff"/>
       </linearGradient>
       <linearGradient id="v" x1="0" x2="0" y1="0" y2="1">
         <stop offset="0" stop-color="#000"/>
         <stop offset="${feather / DOLPHIN.height}" stop-color="#fff"/>
         <stop offset="${1 - feather / DOLPHIN.height}" stop-color="#fff"/>
         <stop offset="1" stop-color="#000"/>
       </linearGradient>
     </defs>
     <rect width="100%" height="100%" fill="#fff"/>
     <rect width="100%" height="100%" fill="url(#l)" style="mix-blend-mode:multiply"/>
     <rect width="100%" height="100%" fill="url(#v)" style="mix-blend-mode:multiply"/>
   </svg>`
);

const parcheConAlfa = await sharp(parche)
  .ensureAlpha()
  .composite([{ input: mascara, blend: "dest-in" }])
  .png()
  .toBuffer();

const sinDelfin = await sharp(input)
  .composite([{ input: parcheConAlfa, left: DOLPHIN.left, top: DOLPHIN.top }])
  .toBuffer();

// --- Paso 2: recorte centrado en la persona, proporcion 5:7 ---
const LEFT = 546;
const PERSON_CENTER = 786;
const TOP = 44;
const WIDTH = (PERSON_CENTER - LEFT) * 2;
const HEIGHT = Math.round(WIDTH / (5 / 7));

const crop = {
  left: LEFT,
  top: TOP,
  width: WIDTH,
  height: Math.min(HEIGHT, meta.height - TOP),
};
console.log(`recorte: ${crop.width}x${crop.height} en (${crop.left}, ${crop.top})`);

await sharp(sinDelfin)
  .extract(crop)
  .resize({ width: 860, kernel: "lanczos3" })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(salida);

console.log("ok public/media/socio-retrato.jpg");
