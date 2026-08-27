// Genera la variante "sobre claro" del logo compacto, para el Navbar
// rediseñado en lienzo blanco (ver DOFI — REPLANTEO DEFINITIVO NAVBAR + HERO
// + SANITY, seccion 6-10).
//
// El PNG original (logo-dofi-compact.png) fue dibujado para fondo oscuro:
// el delfin + "DO" son blanco puro, "Fi" + el trazo son naranja DOFI. Sobre
// un nav claro el blanco desaparece por completo (verificado compositando
// el archivo real sobre #FDFBF8 antes de escribir este script).
//
// Este script NO redibuja el logo: reclasifica cada pixel por su matiz
// (blanco/neutro vs naranja) y solo recolorea los pixeles neutros al morado
// mas oscuro de la marca (--color-deep, #1A0F3D), preservando el canal
// alpha original (incluido el suavizado de bordes) y sin tocar un solo
// pixel naranja. Mismo trazo, mismo archivo fuente, variante de superficie.
//
// Uso: node scripts/make-logo-on-light.mjs
import sharp from "sharp";

const SRC = "public/logo-dofi-compact.png";
const OUT = "public/logo-dofi-compact-on-light.png";
const INK = [0x1a, 0x0f, 0x3d]; // --color-deep

const img = sharp(SRC).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  // Naranja DOFI (~#F47B20): azul muy bajo respecto al rojo. Blanco/gris:
  // azul y rojo casi iguales. b/r > 0.5 separa limpio ambos casos, estable
  // incluso en pixeles de borde con alpha parcial (el matiz no cambia,
  // solo la opacidad).
  const esNeutro = b > r * 0.5;
  if (esNeutro) {
    data[i] = INK[0];
    data[i + 1] = INK[1];
    data[i + 2] = INK[2];
  }
  // Si no es neutro (naranja), se deja tal cual — incluye el canal alpha.
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(OUT);

console.log(`Escrito ${OUT}`);
