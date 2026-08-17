/**
 * Prepara el logo de DOFI para la web.
 *
 * Toma el PNG con el fondo ya removido y genera dos piezas:
 *
 *   public/logo-dofi.png          lockup completo (delfin + DOFi + AGENCIA CREATIVA)
 *                                 para el pie, donde hay espacio.
 *   public/logo-dofi-compact.png  sin la linea "AGENCIA CREATIVA", para la nav,
 *                                 donde el logo mide ~44px y esa linea seria
 *                                 ilegible.
 *
 * El recorte NO usa sharp.trim(): se calcula la caja real leyendo el canal
 * alfa, y la banda del claim se detecta buscando el hueco horizontal vacio
 * que la separa de "DOFi".
 *
 * Uso:
 *   node scripts/prepare-logo.mjs "C:/ruta/al/logo.png"
 */
import sharp from "sharp";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  console.error("Falta la ruta del logo. Ej: node scripts/prepare-logo.mjs ruta.png");
  process.exit(1);
}

const OUT = path.join(process.cwd(), "public");
const ALPHA_MIN = 8;

const meta = await sharp(input).metadata();
console.log(`origen: ${meta.width}x${meta.height}, alpha ${meta.hasAlpha}`);
if (!meta.hasAlpha) {
  console.warn("AVISO: sin canal alfa, el fondo NO es transparente.");
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];

// 1. Caja real del contenido
let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (alphaAt(x, y) > ALPHA_MIN) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX < 0) {
  console.error("Imagen completamente transparente.");
  process.exit(1);
}

const pad = 1;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);
const width = Math.min(info.width - left, maxX - minX + 1 + pad * 2);
const height = Math.min(info.height - top, maxY - minY + 1 + pad * 2);
console.log(`contenido: ${width}x${height} en (${left}, ${top})`);

// 2. Bandas horizontales de contenido, separadas por huecos vacios.
// En este lockup deberian salir tres: delfin, "DOFi" y el claim.
const filaTieneContenido = [];
for (let y = minY; y <= maxY; y++) {
  let hay = false;
  for (let x = minX; x <= maxX; x++) {
    if (alphaAt(x, y) > ALPHA_MIN) {
      hay = true;
      break;
    }
  }
  filaTieneContenido.push(hay);
}

const total = filaTieneContenido.length;
const bandas = [];
let inicio = null;
for (let i = 0; i < total; i++) {
  if (filaTieneContenido[i] && inicio === null) inicio = i;
  if ((!filaTieneContenido[i] || i === total - 1) && inicio !== null) {
    const fin = filaTieneContenido[i] ? i : i - 1;
    // Ignora bandas de 2px o menos: son ruido del recorte del fondo
    if (fin - inicio >= 2) bandas.push({ inicio, fin });
    inicio = null;
  }
}

console.log(
  `bandas detectadas: ${bandas.length} -> ` +
    bandas.map((b) => `${b.inicio}-${b.fin}`).join(", ")
);

// Alturas de cada version, medidas desde la primera fila con contenido
const alturaCompleta = height;
const alturaCompacta =
  bandas.length >= 3 ? bandas[bandas.length - 2].fin + pad * 2 : alturaCompleta;
const alturaMarca = bandas.length >= 2 ? bandas[0].fin + pad * 2 : alturaCompleta;

async function emitir(nombre, cropHeight, anchoSalida) {
  const buf = await sharp(input)
    .ensureAlpha()
    .extract({
      left,
      top,
      width,
      height: Math.min(cropHeight, height),
    })
    .toBuffer();

  // La marca sola se recorta ademas en horizontal: sin el texto debajo,
  // el delfin no ocupa todo el ancho del lockup.
  const salida =
    nombre === "logo-dofi-mark.png"
      ? sharp(await sharp(buf).trim({ threshold: 5 }).toBuffer())
      : sharp(buf);

  const info = await salida
    .resize({ width: anchoSalida, kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, nombre));
  console.log(`ok public/${nombre} (${info.width}x${info.height})`);
}

await emitir("logo-dofi.png", alturaCompleta, 640);
await emitir("logo-dofi-compact.png", alturaCompacta, 512);
await emitir("logo-dofi-mark.png", alturaMarca, 512);

if (width < 600) {
  console.warn(
    `\nAVISO DE CALIDAD: el contenido mide ${width}x${height} px de origen.` +
      `\nEscalado se vera algo suave en pantallas grandes.` +
      `\nPara nitidez total hace falta el vector (SVG/AI/EPS).`
  );
}
