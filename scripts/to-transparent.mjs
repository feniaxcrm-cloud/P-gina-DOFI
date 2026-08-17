/**
 * Convierte un logo claro sobre fondo oscuro solido en un PNG con fondo
 * transparente, listo para prepare-logo.mjs.
 *
 * Metodo "screen to alpha": para contenido claro sobre negro, el valor que
 * se ve ya es el color premultiplicado por su cobertura. Entonces:
 *   alpha  = max(r, g, b)        -> captura tanto el blanco como el naranja
 *   color  = canal / alpha * 255 -> se despremultiplica para recuperar el tono
 *
 * Esto conserva el antialiasing de los bordes sin recortes duros: un pixel
 * gris de borde (mitad blanco sobre negro) queda blanco con alpha 128.
 *
 * Uso:
 *   node scripts/to-transparent.mjs "entrada.png" "salida.png"
 */
import sharp from "sharp";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Uso: node scripts/to-transparent.mjs "entrada.png" "salida.png"');
  process.exit(1);
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(data.length);
const ch = info.channels;

for (let i = 0; i < data.length; i += ch) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const alpha = Math.max(r, g, b);

  if (alpha === 0) {
    out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
    continue;
  }

  // Despremultiplica para recuperar el color pleno del contenido
  out[i] = Math.min(255, Math.round((r / alpha) * 255));
  out[i + 1] = Math.min(255, Math.round((g / alpha) * 255));
  out[i + 2] = Math.min(255, Math.round((b / alpha) * 255));
  out[i + 3] = alpha;
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: ch },
})
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`ok ${output} (${info.width}x${info.height}, fondo transparente)`);
