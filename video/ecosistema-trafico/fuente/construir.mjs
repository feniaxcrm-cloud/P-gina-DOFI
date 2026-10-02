// Arma index.html a partir de fuente/plantilla.html:
//  - calcula la ruta (una curva suave que pasa por los 4 nodos) y la parte en
//    3 tramos, uno por viaje del velero;
//  - genera las olas del fondo (periodicas: el bucle no tiene costura);
//  - inyecta los iconos (simple-icons y Phosphor).
// Se corre desde la carpeta del proyecto:  node fuente/construir.mjs
import { readFileSync, writeFileSync } from "node:fs";

const leer = (n) => readFileSync(`assets/${n}.txt`, "utf8").trim();

// ------------------------------------------------------------ geometria
const R = 70; // radio de un nodo
const NODOS = [
  { x: 250, y: 800 }, // 1 Instagram
  { x: 820, y: 640 }, // 2 Google
  { x: 260, y: 470 }, // 3 Web
  { x: 820, y: 290 }, // 4 WhatsApp
];

/** Cuanto se "abomba" la ruta entre nodos: 6 es Catmull-Rom estandar (casi
 *  recto con estos nodos); 3,4 la deja con curvas de oleaje. */
const K = 3.4;

/** Catmull-Rom uniforme -> tramos de Bezier cubica que pasan por cada nodo y
 *  empalman con la misma tangente (la ruta no tiene esquinas). Los extremos
 *  repiten su punto vecino. */
function tramos(pts) {
  const p = (i) => pts[Math.min(pts.length - 1, Math.max(0, i))];
  return pts.slice(0, -1).map((_, i) => {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / K, y: p1.y + (p2.y - p0.y) / K };
    const c2 = { x: p2.x - (p3.x - p1.x) / K, y: p2.y - (p3.y - p1.y) / K };
    const f = (n) => n.toFixed(1);
    return `M${f(p1.x)} ${f(p1.y)} C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p2.x)} ${f(p2.y)}`;
  });
}
const SEG = tramos(NODOS);

// Olas: 4 curvas senoidales de periodo 1080 sobre 2160 de ancho.
const OLAS = [
  { y: 960, a: 26, fase: 0, color: "rgba(255,255,255,0.10)" },
  { y: 992, a: 24, fase: 180, color: "rgba(244,123,32,0.38)" },
  { y: 1024, a: 22, fase: 360, color: "rgba(255,255,255,0.07)" },
  { y: 1056, a: 20, fase: 540, color: "rgba(109,75,201,0.5)" },
]
  .map(({ y, a, fase, color }) => {
    let d = "";
    for (let x = 0; x <= 2160; x += 20) {
      const yy = y + a * Math.sin((2 * Math.PI * (x + fase)) / 1080) - 900;
      d += (x === 0 ? "M" : "L") + x + " " + yy.toFixed(1);
    }
    return `<path d="${d}" stroke="${color}" stroke-width="2" />`;
  })
  .join("\n          ");

// ------------------------------------------------------------ inyeccion
const sust = {
  SEG1: SEG[0],
  SEG2: SEG[1],
  SEG3: SEG[2],
  OLAS,
  IG: leer("siInstagram"),
  GOOGLE: leer("siGoogle"),
  WHATSAPP: leer("siWhatsapp"),
  VELERO: leer("velero"),
  DIAMETRO: String(2 * R),
};
NODOS.forEach((n, i) => {
  sust[`N${i + 1}_X`] = String(n.x);
  sust[`N${i + 1}_Y`] = String(n.y);
  sust[`N${i + 1}_L`] = String(n.x - R);
  sust[`N${i + 1}_T`] = String(n.y - R);
});
// Etiquetas: debajo de cada nodo, salvo la del ultimo (arriba, porque debajo
// pasa la ruta que llega desde el nodo 3). `x` es el centro de la etiqueta.
const ETIQUETAS = [
  { x: NODOS[0].x, t: NODOS[0].y + R + 24 },
  { x: NODOS[1].x, t: NODOS[1].y + R + 24 },
  { x: NODOS[2].x, t: NODOS[2].y + R + 24 },
  { x: 740, t: NODOS[3].y - R - 24 - 64 },
];
ETIQUETAS.forEach((e, i) => {
  sust[`E${i + 1}_L`] = String(e.x - 380); // contenedor de 760 de ancho, centrado en x
  sust[`E${i + 1}_T`] = String(e.t);
});

let html = readFileSync("fuente/plantilla.html", "utf8");
for (const [k, v] of Object.entries(sust)) html = html.replaceAll(`{{${k}}}`, v);
const faltan = html.match(/\{\{[A-Z0-9_]+\}\}/g);
if (faltan) throw new Error("Marcadores sin reemplazar: " + [...new Set(faltan)].join(", "));
writeFileSync("index.html", html);
console.log("index.html", html.length, "bytes");
