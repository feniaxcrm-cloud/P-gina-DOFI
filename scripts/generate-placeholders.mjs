/**
 * Genera imagenes provisionales locales con la paleta de DOFI.
 *
 * Existen para que la pagina se vea completa sin depender de ningun host
 * externo. Cada archivo se reemplaza por la foto real conservando el
 * mismo nombre y la misma relacion de aspecto. No hay que tocar codigo.
 *
 *   node scripts/generate-placeholders.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "media");

/** name, width, height, dos colores del degradado y angulo del brillo */
const assets = [
  ["socio-retrato", 1000, 1400, "#3B1F7A", "#1A0F3D", 0.5],
  ["cover-16-9", 1280, 720, "#3B1F7A", "#120A26", 0.45],
  ["cover-9-16", 720, 1280, "#4B2A93", "#120A26", 0.55],
];

const svg = (w, h, a, b, glow) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="warm" cx="${glow}" cy="0.28" r="0.62">
      <stop offset="0%" stop-color="#F47B20" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#F47B20" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#warm)"/>
  ${Array.from({ length: 9 }, (_, i) => {
    const y = (h / 10) * (i + 1);
    const amp = h * 0.035;
    return `<path d="M0 ${y} C ${w * 0.25} ${y - amp}, ${w * 0.55} ${y + amp}, ${w} ${y - amp * 0.4}"
      fill="none" stroke="#B3A5D4" stroke-opacity="${0.05 + i * 0.012}" stroke-width="${1 + i * 0.25}"/>`;
  }).join("")}
</svg>`;

await mkdir(OUT, { recursive: true });

for (const [name, w, h, a, b, glow] of assets) {
  const file = path.join(OUT, `${name}.jpg`);
  await sharp(Buffer.from(svg(w, h, a, b, glow)))
    .blur(1.2)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
  console.log(`ok  public/media/${name}.jpg  ${w}x${h}`);
}
