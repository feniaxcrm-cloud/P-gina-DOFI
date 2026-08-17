/**
 * Genera el icono de pestaña desde la marca del logo.
 *
 * Usa SOLO el delfin, no el lockup completo: a 16px el texto "DOFi" y el
 * claim se vuelven una mancha ilegible.
 *
 * Va compuesto sobre el purpura de marca en un cuadrado redondeado, y no
 * sobre transparente, porque el delfin es blanco: en una pestaña de tema
 * claro un logo blanco transparente desaparece.
 *
 * Salida: src/app/icon.png, que Next sirve como favicon automaticamente.
 *
 * Uso: node scripts/prepare-favicon.mjs
 */
import sharp from "sharp";
import path from "node:path";

const SIZE = 512;
const RADIO = 112; // esquinas redondeadas, proporcional a 512
const FONDO = { r: 0x1a, g: 0x0f, b: 0x3d }; // --color-deep

const marca = path.join(process.cwd(), "public", "logo-dofi-mark.png");
const salida = path.join(process.cwd(), "src", "app", "icon.png");

// La marca ocupa el 68% del lienzo para dejar aire alrededor
const anchoMarca = Math.round(SIZE * 0.68);
const redimensionada = await sharp(marca)
  .resize({ width: anchoMarca, kernel: "lanczos3" })
  .toBuffer({ resolveWithObject: true });

const mascara = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
     <rect width="${SIZE}" height="${SIZE}" rx="${RADIO}" ry="${RADIO}" fill="#fff"/>
   </svg>`
);

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { ...FONDO, alpha: 1 },
  },
})
  .composite([
    {
      input: redimensionada.data,
      left: Math.round((SIZE - redimensionada.info.width) / 2),
      top: Math.round((SIZE - redimensionada.info.height) / 2),
    },
    // Recorta las esquinas al final para que el fondo tambien quede redondeado
    { input: mascara, blend: "dest-in" },
  ])
  .png({ compressionLevel: 9 })
  .toFile(salida);

console.log(`ok src/app/icon.png (${SIZE}x${SIZE})`);
