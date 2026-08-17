/**
 * Compone el logo sobre el fondo real del sitio para evaluarlo como se vera.
 * Un logo blanco no se puede juzgar sobre fondo claro.
 */
import sharp from "sharp";
import path from "node:path";

/**
 * El archivo de salida se escribe en la raiz del proyecto (no en /public),
 * para que no se despliegue. Esta ignorado por git.
 */
const variante = process.argv[2] ?? "logo-dofi.png";
const logo = path.join(process.cwd(), "public", variante);
const meta = await sharp(logo).metadata();

const W = meta.width + 160;
const H = meta.height + 160;

await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 0x12, g: 0x0a, b: 0x26, alpha: 1 }, // --color-abyss
  },
})
  .composite([{ input: logo, left: 80, top: 80 }])
  .png()
  .toFile(path.join(process.cwd(), "logo-preview.png"));

console.log(`ok logo-preview.png (${variante}): ${W}x${H} sobre #120A26`);
