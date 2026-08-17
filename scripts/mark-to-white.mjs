/**
 * Convierte un logo de una herramienta (marca plana sobre fondo solido) en
 * una marca BLANCA sobre transparente, para que encaje con las demas marcas
 * monocromas de la seccion Herramientas.
 *
 * Detecta el fondo mirando la esquina superior izquierda:
 *   - fondo oscuro  (marca clara): conserva la forma, la pinta de blanco.
 *   - fondo claro   (marca oscura): invierte, la pinta de blanco.
 *
 * El alfa sale de la luminancia normalizada entre el fondo y la marca, asi
 * el antialiasing del borde se conserva sin recortes duros.
 *
 * Luego recorta al contenido real para que llene su caja.
 *
 * Modo (3er argumento, opcional):
 *   auto  (defecto) detecta el fondo por las esquinas.
 *   dark  la marca es la parte OSCURA dentro de una zona opaca. Sirve para
 *         iconos tipo badge (fondo blanco relleno con un simbolo negro
 *         encima, como CapCut): extrae solo el simbolo.
 *
 * Uso:
 *   node scripts/mark-to-white.mjs "entrada.png" "public/marcas/slug.png" [modo]
 */
import sharp from "sharp";

const [, , input, output, modo = "auto"] = process.argv;
if (!input || !output) {
  console.error(
    'Uso: node scripts/mark-to-white.mjs "entrada.png" "salida.png" [auto|dark]'
  );
  process.exit(1);
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const ch = info.channels;
const lum = (i) =>
  0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

// Esquinas, para leer el fondo
const esquinas = [
  0,
  (info.width - 1) * ch,
  (info.height - 1) * info.width * ch,
  ((info.height - 1) * info.width + info.width - 1) * ch,
];
const bgAlpha =
  esquinas.reduce((s, i) => s + data[i + 3], 0) / esquinas.length;
const bgLum = esquinas.reduce((s, i) => s + lum(i), 0) / esquinas.length;

// Si el fondo ya es transparente, la forma vive en el canal alfa del origen:
// se conserva ese alfa y solo se repinta de blanco. Si el fondo es opaco, la
// forma se separa por luminancia (clara sobre oscuro, u oscura sobre claro).
const fondoTransparente = bgAlpha < 24;
const fondoClaro = bgLum > 128;

console.log(
  fondoTransparente
    ? "fondo ya transparente -> conserva alfa del origen y pinta de blanco"
    : `fondo opaco ${fondoClaro ? "claro" : "oscuro"} (lum ${Math.round(
        bgLum
      )}) -> ${fondoClaro ? "invierte" : "conserva"} y pinta de blanco`
);

if (modo === "dark") {
  console.log(
    "modo dark -> extrae el simbolo oscuro dentro de la zona opaca, blanco"
  );
}

const out = Buffer.alloc(info.width * info.height * 4);
for (let p = 0; p < info.width * info.height; p++) {
  const i = p * ch;
  const l = lum(i);
  const srcA = data[i + 3];
  let alpha;

  if (modo === "dark") {
    // La marca es lo oscuro, pero solo dentro de lo que es opaco en el origen.
    // Fuera del badge (transparente) no hay marca.
    alpha = Math.round((255 - l) * (srcA / 255));
  } else if (fondoTransparente) {
    alpha = srcA;
  } else if (fondoClaro) {
    alpha = Math.round(((bgLum - l) / bgLum) * 255); // marca oscura / fondo claro
  } else {
    alpha = Math.round(((l - bgLum) / (255 - bgLum)) * 255); // marca clara / fondo oscuro
  }
  alpha = Math.max(0, Math.min(255, alpha));

  const o = p * 4;
  out[o] = 255;
  out[o + 1] = 255;
  out[o + 2] = 255;
  out[o + 3] = alpha;
}

const blanco = await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

// Recorta al contenido real
const info2 = await sharp(blanco)
  .trim({ threshold: 8 })
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`ok ${output} (${info2.width}x${info2.height} tras recorte)`);
