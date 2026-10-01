// Arma index.html a partir de plantilla.html, inyectando los trazos de los
// iconos de canal (simple-icons) y el isotipo. Se corre una vez:
//   node fuente/construir.mjs   (desde la carpeta del proyecto)
import { readFileSync, writeFileSync } from "node:fs";

const icono = (n) => readFileSync(`assets/${n}.txt`, "utf8").trim();
const isotipo = readFileSync("assets/feniax-isotipo.svg", "utf8")
  .replace(/^<svg[^>]*>/, "")
  .replace(/<\/svg>$/, "")
  .replace(/fx-ia/g, "fx-ia-flujo");

let html = readFileSync("fuente/plantilla.html", "utf8");
html = html
  .replaceAll("{{WHATSAPP}}", icono("siWhatsapp"))
  .replaceAll("{{INSTAGRAM}}", icono("siInstagram"))
  .replaceAll("{{FACEBOOK}}", icono("siFacebook"))
  .replaceAll("{{ISOTIPO}}", isotipo);
writeFileSync("index.html", html);
console.log("index.html", html.length, "bytes");
