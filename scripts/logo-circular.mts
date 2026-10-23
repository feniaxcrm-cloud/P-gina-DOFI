/**
 * Convierte un logo en su VERSIÓN CIRCULAR (pedido del 2026-10-23: «los
 * propios logotipos deben tener una forma circular», no un logo cuadrado
 * metido en un círculo). Lo usa scripts/logos-circulares.mts.
 *
 * Tres casos, según el borde del archivo:
 *
 *  1. FONDO TRANSPARENTE (PNG/WebP con alfa): el círculo se rellena de blanco
 *     (o del morado de marca si el logo es blanco) y el logo se centra y se
 *     agranda hasta llenar el círculo, sin cortar nada.
 *  2. FONDO DE UN SOLO COLOR (la mayoría: logos cuadrados de perfil con fondo
 *     liso). Según dónde está el contenido:
 *     - si es chico (le sobra fondo), se agranda y se centra;
 *     - si ya entra en el círculo, recorte circular tal cual (se conserva el
 *       diseño exacto, como una foto de perfil);
 *     - si tocaría el borde del círculo, se achica lo justo para entrar
 *       entero. En los dos casos de ajuste, el círculo se rellena con el
 *       color del fondo y el fondo del archivo se vuelve transparente (no
 *       queda el borde del cuadrado).
 *  3. FONDO DE FOTO O TEXTURA: recorte circular centrado, como una foto de
 *     perfil (estas piezas ya están pensadas para verse así en redes).
 *
 * Salida: WebP de 512 x 512 con el exterior del círculo transparente.
 */
import sharp from "sharp";

export const DIAMETRO = 512;

/** Cuánto del radio puede ocupar el contenido (el resto es aire). */
const LLENADO = 0.86;
/** Un logo no se agranda más que esto respecto de su archivo (se vería borroso). */
const MAX_AMPLIACION = 2.6;

type Rgb = [number, number, number];
export type Caso = "transparente" | "liso" | "foto";

const dist = (a: Rgb, b: Rgb) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const mediana = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
};
const hex = (c: Rgb) => `#${c.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;

function mascaraCirculo(d: number) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2 - 0.5}" fill="#fff"/></svg>`);
}

export async function logoCircular(
  entrada: Buffer,
  { soloRecorte = false }: { soloRecorte?: boolean } = {}
): Promise<{ salida: Buffer; caso: Caso; fondo: string | null }> {
  const meta = await sharp(entrada).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) throw new Error("Imagen sin medidas");

  // Análisis sobre una copia chica (rápido y suficiente).
  const k = Math.min(1, 600 / Math.max(W, H));
  const { data, info } = await sharp(entrada)
    .resize(Math.round(W * k), Math.round(H * k))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const px = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]] as const;
  };

  // El borde del archivo (un anillo del 3%).
  const b = Math.max(2, Math.round(Math.min(w, h) * 0.03));
  const borde: (readonly [number, number, number, number])[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x < b || y < b || x >= w - b || y >= h - b) borde.push(px(x, y));
    }
  }
  const transparente = borde.filter((p) => p[3] < 24).length / borde.length > 0.5;
  const medio: Rgb = [mediana(borde.map((p) => p[0])), mediana(borde.map((p) => p[1])), mediana(borde.map((p) => p[2]))];
  const liso = !transparente && borde.filter((p) => dist([p[0], p[1], p[2]], medio) < 30).length / borde.length > 0.8;

  const recorte = async () =>
    sharp(entrada)
      .resize(DIAMETRO, DIAMETRO, { fit: "cover", position: "centre" })
      .ensureAlpha()
      .composite([{ input: mascaraCirculo(DIAMETRO), blend: "dest-in" }])
      .webp({ quality: 90, alphaQuality: 100 })
      .toBuffer();

  // 3. Foto o textura (o logo marcado para recorte directo): recorte circular centrado.
  if (soloRecorte || (!transparente && !liso)) return { salida: await recorte(), caso: "foto", fondo: null };

  // 1 y 2: dónde está el contenido (lo que no es fondo).
  const esContenido = (x: number, y: number) => {
    const p = px(x, y);
    return transparente ? p[3] >= 24 : dist([p[0], p[1], p[2]], medio) > 40;
  };
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  let luz = 0, peso = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!esContenido(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      const p = px(x, y);
      luz += (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) * (p[3] / 255);
      peso += p[3] / 255;
    }
  }
  if (x1 < 0) throw new Error("Logo vacío");
  const cx = (x0 + x1 + 1) / 2;
  const cy = (y0 + y1 + 1) / 2;
  // Distancia del centro al contenido más lejano (percentil 99,5: ignora motas).
  const distancias: number[] = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) if (esContenido(x, y)) distancias.push(Math.hypot(x + 0.5 - cx, y + 0.5 - cy));
  }
  distancias.sort((a, c) => a - c);
  const lejos = distancias[Math.floor(distancias.length * 0.995)] ?? distancias[distancias.length - 1];

  // Fondo liso: ¿el recorte circular tal cual corta algo que importe? Se
  // miran solo los trazos FUERTES (no degradados ni texturas suaves del
  // fondo) que caen fuera del círculo inscrito.
  const lejosOriginal = lejos / k;
  const escalaAjuste = Math.min(MAX_AMPLIACION, (LLENADO * (DIAMETRO / 2)) / lejosOriginal);
  const escalaRecorte = DIAMETRO / Math.min(W, H);
  if (!transparente && escalaAjuste < escalaRecorte) {
    const r = (Math.min(w, h) / 2) * 0.96;
    let fuertes = 0, afuera = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = px(x, y);
        if (dist([p[0], p[1], p[2]], medio) <= 70) continue;
        fuertes++;
        if (Math.hypot(x + 0.5 - w / 2, y + 0.5 - h / 2) > r) afuera++;
      }
    }
    if (fuertes > 0 && afuera / fuertes < 0.015) return { salida: await recorte(), caso: "liso", fondo: hex(medio) };
  }

  // Fondo del círculo: el del logo; si era transparente, blanco (o morado si
  // el logo es claro y se perdería sobre blanco).
  const fondo: Rgb = transparente ? (peso > 0 && luz / peso > 215 ? [26, 15, 61] : [255, 255, 255]) : medio;

  // Escala: el contenido llena el LLENADO del radio (en px del original).
  const escala = escalaAjuste;
  const Ws = Math.max(1, Math.round(W * escala));
  const Hs = Math.max(1, Math.round(H * escala));

  // El logo escalado, con el fondo liso vuelto transparente (sin borde del cuadrado).
  let capa = sharp(entrada).resize(Ws, Hs).ensureAlpha();
  if (!transparente) {
    const { data: d2, info: i2 } = await capa.raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < d2.length; i += 4) {
      const dd = dist([d2[i], d2[i + 1], d2[i + 2]], medio);
      const a = Math.min(1, Math.max(0, (dd - 16) / 24));
      d2[i + 3] = Math.round(d2[i + 3] * a);
    }
    capa = sharp(d2, { raw: { width: i2.width, height: i2.height, channels: 4 } });
  }
  const logo = await capa.png().toBuffer();

  // Ubicarlo: el centro del contenido en el centro del círculo.
  const izq = Math.round(DIAMETRO / 2 - (cx / k) * escala);
  const arr = Math.round(DIAMETRO / 2 - (cy / k) * escala);
  const recorteIzq = Math.max(0, -izq);
  const recorteArr = Math.max(0, -arr);
  const visible = await sharp(logo)
    .extract({
      left: recorteIzq,
      top: recorteArr,
      width: Math.min(Ws - recorteIzq, DIAMETRO - Math.max(0, izq)),
      height: Math.min(Hs - recorteArr, DIAMETRO - Math.max(0, arr)),
    })
    .toBuffer();

  const salida = await sharp({
    create: { width: DIAMETRO, height: DIAMETRO, channels: 4, background: { r: fondo[0], g: fondo[1], b: fondo[2], alpha: 1 } },
  })
    .composite([
      { input: visible, left: Math.max(0, izq), top: Math.max(0, arr) },
      { input: mascaraCirculo(DIAMETRO), blend: "dest-in" },
    ])
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
  return { salida, caso: transparente ? "transparente" : "liso", fondo: hex(fondo) };
}
