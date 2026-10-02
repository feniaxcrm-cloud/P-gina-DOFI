/**
 * Ajuste de un solo uso de la página FENIAX / ChatBots-CRM en Sanity
 * (pedido del 2026-10-01):
 *
 *  1. TODOS los botones de la página dicen «Quiero mejorar mis ventas»
 *     (portada, método y cierre; los enlaces a WhatsApp no cambian).
 *  2. Se borra el campo `chatPortada` ("Demo de WhatsApp de la portada"): la
 *     portada ya no lleva un teléfono con WhatsApp, lleva un motion de CRM
 *     hecho con HyperFrames, y ese campo ya no existe en el Studio.
 *
 * Solo toca el texto de los botones que YA existen (no agrega ninguno). Antes
 * de escribir guarda una copia del documento en
 * audit/backup-chatbotsCrmPage-antes-de-cta-y-portada-<fecha>.json.
 *
 * Sin --aplicar solo muestra lo que haría. Para --aplicar hace falta
 * SANITY_WRITE_TOKEN en .env.local, o una sesión de la CLI de Sanity
 * (`sanity exec --with-user-token`).
 *
 * Uso: npx tsx --env-file=.env.local scripts/ajustar-feniax.mts [--aplicar]
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { TEXTO_CTA as TEXTO_CTA_FENIAX } from "../src/lib/cta";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const aplicar = process.argv.includes("--aplicar");

if (!projectId || !dataset || (aplicar && !token)) {
  console.error("Faltan SANITY_PROJECT_ID, SANITY_DATASET o (para --aplicar) SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token: aplicar ? token : undefined, apiVersion: "2024-01-01", useCdn: false });

type Seccion = { _key: string; _type: string; titulo?: string; cta?: { texto?: string; enlace?: string } };

const doc = await client.getDocument("chatbotsCrmPage");
if (!doc) {
  console.log('No existe el documento "chatbotsCrmPage": nada que ajustar.');
  process.exit(0);
}

const secciones = (doc.sections as Seccion[] | undefined) ?? [];
const cambios: Record<string, string> = {};
for (const s of secciones) {
  if (s.cta?.texto && s.cta.texto !== TEXTO_CTA_FENIAX) {
    console.log(`  ${s._type} «${s.titulo ?? ""}»: «${s.cta.texto}» -> «${TEXTO_CTA_FENIAX}»`);
    cambios[`sections[_key=="${s._key}"].cta.texto`] = TEXTO_CTA_FENIAX;
  }
}
const sobra = "chatPortada" in doc;
console.log(`Botones a cambiar: ${Object.keys(cambios).length}`);
console.log(`Campo chatPortada: ${sobra ? "se borra" : "ya no está"}`);

if (Object.keys(cambios).length === 0 && !sobra) {
  console.log("\nNada que hacer.");
  process.exit(0);
}
if (!aplicar) {
  console.log("\nDry run: no se escribió nada. Vuelve a correrlo con --aplicar.");
  process.exit(0);
}

const fecha = new Date().toISOString().slice(0, 10);
const destino = path.join(process.cwd(), "audit", `backup-chatbotsCrmPage-antes-de-cta-y-portada-${fecha}.json`);
fs.writeFileSync(destino, JSON.stringify(doc, null, 2));
console.log(`Copia del documento anterior: ${path.relative(process.cwd(), destino)}`);

let parche = client.patch("chatbotsCrmPage");
if (Object.keys(cambios).length > 0) parche = parche.set(cambios);
if (sobra) parche = parche.unset(["chatPortada"]);
const res = await parche.commit();
console.log("Listo. rev:", res._rev);
