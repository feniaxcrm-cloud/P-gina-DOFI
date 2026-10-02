// Arma index.html a partir de fuente/plantilla.html:
//  - define el isotipo una sola vez (logo del encabezado y chips "En curso");
//  - genera las 5 filas de clientes y las barras de los indicadores;
//  - inyecta los trazos de los iconos de canal (simple-icons).
// Se corre desde la carpeta del proyecto:  node fuente/construir.mjs
import { readFileSync, writeFileSync } from "node:fs";

const leer = (n) => readFileSync(`assets/${n}.txt`, "utf8").trim();

// ------------------------------------------------------------ isotipo
const iso = readFileSync("assets/feniax-isotipo.svg", "utf8")
  .replace(/^<svg[^>]*>/, "")
  .replace(/<\/svg>$/, "");
const [gradiente, trazos] = iso.split("</defs>");
const ISOTIPO =
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${gradiente}</defs>` +
  `<defs><g id="isotipo-g">${trazos}</g></defs></svg>`;
const usarIsotipo = `<use href="#isotipo-g" />`;

// ------------------------------------------------------------ indicadores
const BARRAS_X = { m: 122, v: 410 };
const ALTOS = {
  m: [38, 60, 50, 82, 100],
  v: [26, 44, 62, 80, 104],
};
const FONDO_BARRA = {
  m: "linear-gradient(180deg, #c9b3d3 0%, #792883 100%)",
  v: "linear-gradient(180deg, #f38a3f 0%, #e5352a 100%)",
};
const BASE_Y = 950;
const BARRAS = ["m", "v"]
  .flatMap((k) =>
    ALTOS[k].map(
      (h, i) =>
        `<div class="barra" data-kpi="${k}" data-i="${i}" style="left:${BARRAS_X[k] + i * 44}px;top:${BASE_Y - h}px;height:${h}px;background:${FONDO_BARRA[k]}"></div>`
    )
  )
  .join("\n          ");

// ------------------------------------------------------------ clientes
const CANALES = [
  { fondo: "#25d366", svg: `<svg viewBox="0 0 24 24"><path d="${leer("siWhatsapp")}" /></svg>` },
  {
    fondo: "linear-gradient(45deg, #feda75, #fa7e1e 30%, #d62976 60%, #962fbf 80%, #4f5bd5)",
    svg: `<svg viewBox="0 0 24 24"><path d="${leer("siInstagram")}" /></svg>`,
  },
  { fondo: "#0866ff", svg: `<svg viewBox="0 0 24 24"><path d="${leer("siFacebook")}" /></svg>` },
  { fondo: "#25d366", svg: `<svg viewBox="0 0 24 24"><path d="${leer("siWhatsapp")}" /></svg>` },
  {
    fondo: "#792883",
    svg: `<svg viewBox="0 0 24 24" style="fill:none;stroke:#fff;stroke-width:2;"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" /></svg>`,
  },
];
const FILA_Y = 356;
const PASO = 118;
const FILAS = CANALES.map((c, i) => {
  const cerrada = i < 4; // estado final del bucle: 4 ventas cerradas y 1 cliente nuevo
  return `<div class="fila" id="f${i}" style="left:692px;top:${FILA_Y + i * PASO}px">
            ${cerrada ? '<div class="fila-fondo"></div>' : ""}
            <div class="avatar"><svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.2" /><path d="M3.8 21c0-4.6 3.7-7.4 8.2-7.4s8.2 2.8 8.2 7.4z" /></svg></div>
            <div class="canal" style="background:${c.fondo}">${c.svg}</div>
            <div class="nombre"></div>
            <div class="detalle"></div>
            <span class="chip chip-nuevo" data-layout-allow-overlap style="opacity:${cerrada ? 0 : 1}">Nuevo</span>
            <span class="chip chip-curso" data-layout-allow-overlap><svg viewBox="161.10 0.00 67.30 47.00">${usarIsotipo}</svg>En curso</span>
            <span class="chip chip-cerrado" data-layout-allow-overlap style="opacity:${cerrada ? 1 : 0}"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>Cerrado</span>
          </div>`;
}).join("\n          ");

// ------------------------------------------------------------ plantilla
let html = readFileSync("fuente/plantilla.html", "utf8");
html = html
  .replace("{{ISOTIPO}}", `<use href="#isotipo-g" />`)
  .replace("{{BARRAS}}", BARRAS)
  .replace("{{FILAS}}", FILAS)
  // El isotipo se define una sola vez, justo despues de abrir la escena.
  .replace('<div id="escena">', `<div id="escena">\n        ${ISOTIPO}`);
const faltan = html.match(/\{\{[A-Z0-9_]+\}\}/g);
if (faltan) throw new Error("Marcadores sin reemplazar: " + [...new Set(faltan)].join(", "));
writeFileSync("index.html", html);
console.log("index.html", html.length, "bytes");
